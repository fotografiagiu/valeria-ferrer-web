import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { sql } from 'drizzle-orm';
import type { AppDb } from './db/client.js';
import { staffUsers } from './db/schema.js';
import { appendAudit } from './lib/audit.js';
import { resolveCatalogModels } from './lib/catalogSource.js';
import { corsHeadersForPublicOverrides, assertStaffWriteOrigin } from './lib/csrf.js';
import {
  allowedCoverPaths,
  type CatalogModelLite,
} from './lib/effectiveOrder.js';
import { loadEnv, type PanelEnv } from './lib/env.js';
import {
  BadRequestError,
  ConflictError,
  ensureCatalogMembership,
  getPublicOverrides,
  listOverrides,
  planCatalogMembership,
  readOrderVersion,
  removeModelFromCatalog,
  replaceOrder,
  updateCover,
} from './lib/overridesService.js';
import { verifyPassword } from './lib/password.js';
import { hitRateLimit } from './lib/rateLimit.js';
import {
  buildClearSessionCookie,
  buildSessionCookie,
  createSession,
  readCookie,
  resolveSession,
  revokeSessionByToken,
  type StaffIdentity,
} from './lib/session.js';
import {
  coverBodySchema,
  loginBodySchema,
  orderBodySchema,
  removeModelBodySchema,
} from './lib/validation.js';
import { listRecentActivity } from './lib/activityFeed.js';
import { readSnapshot } from './lib/catalogSnapshot.js';

export type AppVariables = {
  staff: StaffIdentity;
};

export type CreateAppOptions = {
  db: AppDb;
  env?: PanelEnv;
  /** When true, skip snapshot freshness for snapshot fallback. */
  skipSnapshotFreshness?: boolean;
  /** Skip live app-catalog fetch (tests / offline). */
  skipLiveCatalog?: boolean;
  /** Inject catalog models (tests). */
  catalogModels?: CatalogModelLite[];
  fetchImpl?: typeof fetch;
};

function clientMeta(c: { req: { header: (n: string) => string | undefined } }) {
  return {
    ip: c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || null,
    userAgent: c.req.header('user-agent') || null,
  };
}

function buildStaffCatalogPayload(
  models: CatalogModelLite[],
  overrides: Awaited<ReturnType<typeof listOverrides>>,
  orderVersion: number,
  catalogSource: string,
  catalogVersion: string | null
) {
  const activeModels = models.filter((m) => m.active !== false);
  const overrideBySlug = new Map(overrides.map((o) => [o.slug, o]));
  const plan = planCatalogMembership(models, overrides);

  const missingOverrides = activeModels
    .map((m) => m.slug)
    .filter((slug) => {
      const o = overrideBySlug.get(slug);
      if (!o) return true;
      // Staff-hidden is intentional — do not treat as "needs ensure".
      if (o.staffHidden) return false;
      return o.displayOrder == null;
    });

  const items = activeModels
    .map((m) => {
      const o = overrideBySlug.get(m.slug);
      if (!o || o.displayOrder == null) return null;
      return {
        slug: m.slug,
        name: m.name,
        displayOrder: o.displayOrder as number,
        coverImagePath: o.coverImagePath,
        coverVersion: o.coverVersion,
        allowedCoverPaths: allowedCoverPaths(m),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    orderVersion,
    catalogSource,
    catalogVersion,
    missingOverrides,
    needsEnsure: plan.hasDrift,
    models: items,
  };
}

export function createApp(options: CreateAppOptions) {
  const env = options.env ?? loadEnv();
  const { db } = options;
  const app = new Hono<{ Variables: AppVariables }>();

  async function getCatalogModels(): Promise<CatalogModelLite[]> {
    const resolved = await resolveCatalogModels({
      injectedModels: options.catalogModels,
      skipLiveCatalog: options.skipLiveCatalog,
      skipSnapshotFreshness: options.skipSnapshotFreshness,
      fetchImpl: options.fetchImpl,
    });
    return resolved.models;
  }

  async function requireStaff(c: {
    req: { header: (n: string) => string | undefined };
  }): Promise<StaffIdentity | null> {
    // Prefer Hono helper; fall back to raw Cookie header (Vercel/Node adapters
    // sometimes expose cookies in a shape getCookie misses).
    const token =
      getCookie(c as any, env.cookieName) ||
      readCookie(c.req.header('cookie'), env.cookieName);
    return resolveSession(db, token);
  }

  app.get('/api/health', (c) => c.json({ ok: true, service: 'valeria-ferrer-panel' }));

  // --- Public read-only overrides ---
  app.options('/api/public/overrides', (c) => {
    const headers = corsHeadersForPublicOverrides(c.req.header('origin'), env);
    return new Response(null, { status: 204, headers });
  });

  app.get('/api/public/overrides', async (c) => {
    const headers = corsHeadersForPublicOverrides(c.req.header('origin'), env);
    try {
      const payload = await getPublicOverrides(db);
      const catalog = await resolveCatalogModels({
        injectedModels: options.catalogModels,
        skipLiveCatalog: options.skipLiveCatalog,
        skipSnapshotFreshness: options.skipSnapshotFreshness,
        fetchImpl: options.fetchImpl,
      });
      const activeSlugs = new Set(
        catalog.models.filter((m) => m.active !== false).map((m) => m.slug)
      );
      // Public = intersection of ordered overrides + currently active in catalog
      const models = payload.models
        .filter((m) => activeSlugs.has(m.slug) && m.displayOrder != null)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((m) => ({
          slug: m.slug,
          displayOrder: m.displayOrder,
          coverImagePath: m.coverImagePath,
        }));

      return c.json(
        {
          orderVersion: payload.orderVersion,
          updatedAt: payload.updatedAt,
          models,
          hiddenSlugs: payload.hiddenSlugs.filter((slug) => activeSlugs.has(slug)),
        },
        200,
        headers
      );
    } catch (err) {
      console.error(err);
      return c.json({ error: 'overrides unavailable' }, 503, headers);
    }
  });

  // --- Auth ---
  app.post('/api/staff/login', async (c) => {
    const meta = clientMeta(c);
    const rl = await hitRateLimit(db, `login:${meta.ip || 'unknown'}`, 20, 15 * 60 * 1000);
    if (!rl.allowed) {
      return c.json({ error: 'too many login attempts' }, 429);
    }

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'invalid json' }, 400);
    }
    const parsed = loginBodySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'invalid body' }, 400);

    // Phone keyboards capitalise the first letter, so the username must match
    // regardless of case.
    const users = await db
      .select()
      .from(staffUsers)
      .where(sql`lower(${staffUsers.username}) = lower(${parsed.data.username})`)
      .limit(1);
    const user = users[0];
    const ok =
      user &&
      user.isActive &&
      (await verifyPassword(parsed.data.password, user.passwordHash));

    if (!ok) {
      await appendAudit(db, {
        action: 'auth.login_failed',
        before: { username: parsed.data.username },
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
      return c.json({ error: 'invalid credentials' }, 401);
    }

    const session = await createSession(db, user.id, env, meta);
    await appendAudit(db, {
      staffUserId: user.id,
      action: 'auth.login',
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    c.header('Set-Cookie', buildSessionCookie(env, session.token, session.expiresAt));
    return c.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    });
  });

  app.post('/api/staff/logout', async (c) => {
    const meta = clientMeta(c);
    const token = getCookie(c, env.cookieName);
    const staff = await resolveSession(db, token);
    if (token) await revokeSessionByToken(db, token);
    if (staff) {
      await appendAudit(db, {
        staffUserId: staff.id,
        action: 'auth.logout',
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
    }
    c.header('Set-Cookie', buildClearSessionCookie(env));
    return c.json({ ok: true });
  });

  app.get('/api/staff/me', async (c) => {
    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);
    return c.json({
      id: staff.id,
      username: staff.username,
      displayName: staff.displayName,
    });
  });

  app.get('/api/staff/activity', async (c) => {
    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const rawLimit = Number(c.req.query('limit') || 40);
    const limit = Number.isFinite(rawLimit) ? rawLimit : 40;

    // Snapshot names only — avoid a live app-catalog fetch on every activity poll.
    const snap = options.catalogModels
      ? { models: options.catalogModels }
      : readSnapshot();
    const names = new Map(snap.models.map((m) => [m.slug, m.name]));
    const items = await listRecentActivity(db, { limit, names });
    return c.json({ items });
  });

  // --- Staff catalog (READ ONLY — never writes Neon) ---
  app.get('/api/staff/catalog', async (c) => {
    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const resolved = await resolveCatalogModels({
      injectedModels: options.catalogModels,
      skipLiveCatalog: options.skipLiveCatalog,
      skipSnapshotFreshness: options.skipSnapshotFreshness,
      fetchImpl: options.fetchImpl,
    });
    const overrides = await listOverrides(db);
    const orderVersion = await readOrderVersion(db);

    return c.json(
      buildStaffCatalogPayload(
        resolved.models,
        overrides,
        orderVersion,
        resolved.source,
        resolved.catalogVersion
      )
    );
  });

  // --- Incremental membership ensure (explicit write) ---
  app.post('/api/staff/catalog/ensure', async (c) => {
    const originCheck = assertStaffWriteOrigin(c, env);
    if (!originCheck.ok) return c.json({ error: originCheck.error }, originCheck.status);

    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const rl = await hitRateLimit(db, `write:${staff.id}`, 60, 60 * 1000);
    if (!rl.allowed) return c.json({ error: 'rate limit' }, 429);

    const resolved = await resolveCatalogModels({
      injectedModels: options.catalogModels,
      skipLiveCatalog: options.skipLiveCatalog,
      skipSnapshotFreshness: options.skipSnapshotFreshness,
      fetchImpl: options.fetchImpl,
    });

    try {
      const report = await ensureCatalogMembership({
        db,
        snapshotModels: resolved.models,
        staffUserId: staff.id,
      });
      const overrides = await listOverrides(db);
      const orderVersion = await readOrderVersion(db);
      return c.json({
        ok: true,
        wrote: report.wrote,
        report,
        catalog: buildStaffCatalogPayload(
          resolved.models,
          overrides,
          orderVersion,
          resolved.source,
          resolved.catalogVersion
        ),
      });
    } catch (err) {
      if (err instanceof BadRequestError) return c.json({ error: err.message }, 400);
      console.error(err);
      return c.json({ error: 'internal error' }, 500);
    }
  });

  // --- Staff writes ---
  app.put('/api/staff/order', async (c) => {
    const originCheck = assertStaffWriteOrigin(c, env);
    if (!originCheck.ok) return c.json({ error: originCheck.error }, originCheck.status);

    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const rl = await hitRateLimit(db, `write:${staff.id}`, 60, 60 * 1000);
    if (!rl.allowed) return c.json({ error: 'rate limit' }, 429);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'invalid json' }, 400);
    }
    const parsed = orderBodySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'invalid body', details: parsed.error.flatten() }, 400);

    const meta = clientMeta(c);
    const activeModels = (await getCatalogModels()).filter((m) => m.active !== false);

    try {
      const result = await replaceOrder({
        db,
        orderedSlugs: parsed.data.orderedSlugs,
        version: parsed.data.version,
        activeModels,
        staffUserId: staff.id,
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
      return c.json({ ok: true, orderVersion: result.orderVersion });
    } catch (err) {
      if (err instanceof ConflictError) return c.json({ error: err.message }, 409);
      if (err instanceof BadRequestError) return c.json({ error: err.message }, 400);
      console.error(err);
      return c.json({ error: 'internal error' }, 500);
    }
  });

  app.put('/api/staff/cover', async (c) => {
    const originCheck = assertStaffWriteOrigin(c, env);
    if (!originCheck.ok) return c.json({ error: originCheck.error }, originCheck.status);

    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const rl = await hitRateLimit(db, `write:${staff.id}`, 60, 60 * 1000);
    if (!rl.allowed) return c.json({ error: 'rate limit' }, 429);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'invalid json' }, 400);
    }
    const parsed = coverBodySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'invalid body', details: parsed.error.flatten() }, 400);

    const meta = clientMeta(c);

    try {
      const result = await updateCover({
        db,
        slug: parsed.data.slug,
        coverImagePath: parsed.data.coverImagePath,
        version: parsed.data.version,
        snapshotModels: await getCatalogModels(),
        staffUserId: staff.id,
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
      return c.json({ ok: true, ...result });
    } catch (err) {
      if (err instanceof ConflictError) return c.json({ error: err.message }, 409);
      if (err instanceof BadRequestError) return c.json({ error: err.message }, 400);
      console.error(err);
      return c.json({ error: 'internal error' }, 500);
    }
  });


  app.post('/api/staff/catalog/remove', async (c) => {
    const originCheck = assertStaffWriteOrigin(c, env);
    if (!originCheck.ok) return c.json({ error: originCheck.error }, originCheck.status);

    const staff = await requireStaff(c);
    if (!staff) return c.json({ error: 'unauthorized' }, 401);

    const rl = await hitRateLimit(db, `write:${staff.id}`, 60, 60 * 1000);
    if (!rl.allowed) return c.json({ error: 'rate limit' }, 429);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'invalid json' }, 400);
    }
    const parsed = removeModelBodySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'invalid body', details: parsed.error.flatten() }, 400);

    const meta = clientMeta(c);

    try {
      const result = await removeModelFromCatalog({
        db,
        slug: parsed.data.slug,
        version: parsed.data.version,
        staffUserId: staff.id,
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
      return c.json({ ok: true, orderVersion: result.orderVersion });
    } catch (err) {
      if (err instanceof ConflictError) return c.json({ error: err.message }, 409);
      if (err instanceof BadRequestError) return c.json({ error: err.message }, 400);
      console.error(err);
      return c.json({ error: 'internal error' }, 500);
    }
  });


  return app;
}
