import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createTestDb, type AppDb } from '../src/db/client.js';
import { auditLog, staffUsers } from '../src/db/schema.js';
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import { computeEffectiveHomeOrder } from '../src/lib/effectiveOrder.js';
import { loadEnv } from '../src/lib/env.js';
import { hashPassword } from '../src/lib/password.js';
import { seedOverridesFromEffectiveOrder } from '../src/lib/overridesService.js';

let db: AppDb;
let close: () => Promise<void>;
let app: ReturnType<typeof createApp>;
let cookie = '';

async function json(res: Response) {
  return res.json() as Promise<any>;
}

beforeAll(async () => {
  writeSnapshot();
  const test = await createTestDb();
  db = test.db;
  close = test.close;

  const passwordHash = await hashPassword('test-password-ok');
  await db.insert(staffUsers).values({
    username: 'encargada1',
    passwordHash,
    displayName: 'Encargada 1',
  });

  await seedOverridesFromEffectiveOrder({
    db,
    snapshotModels: readSnapshot().models,
  });

  app = createApp({
    db,
    env: loadEnv({
      NODE_ENV: 'test',
      SESSION_SECRET: 'test-session-secret-at-least-32-chars',
      PANEL_ORIGIN: 'http://localhost:8787',
      PUBLIC_WEB_ORIGINS: 'http://localhost:5173',
      STAFF_COOKIE_NAME: 'vf_staff_session',
      STAFF_SESSION_TTL_HOURS: '12',
    }),
    skipSnapshotFreshness: false,
    skipLiveCatalog: true,
  });
});

afterAll(async () => {
  await close();
});

describe('auth + order + cover API', () => {
  it('rejects login with bad password', async () => {
    const res = await app.request('http://localhost/api/staff/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'encargada1', password: 'wrong' }),
    });
    expect(res.status).toBe(401);
  });

  it('logs in and sets httpOnly cookie', async () => {
    const res = await app.request('http://localhost/api/staff/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'encargada1', password: 'test-password-ok' }),
    });
    expect(res.status).toBe(200);
    const setCookie = res.headers.get('set-cookie') || '';
    expect(setCookie).toContain('vf_staff_session=');
    expect(setCookie.toLowerCase()).toContain('httponly');
    cookie = setCookie.split(';')[0];
  });

  it('accepts the username with any casing and surrounding spaces', async () => {
    const res = await app.request('http://localhost/api/staff/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: '  Encargada1 ', password: 'test-password-ok' }),
    });
    expect(res.status).toBe(200);
  });

  it('returns staff catalog with allowlists', async () => {
    const res = await app.request('http://localhost/api/staff/catalog', {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.orderVersion).toBe(1);
    // Seeded from computeEffectiveHomeOrder → HOME_PIN_ORDER (bea first).
    expect(body.models[0].slug).toBe('bea');
    expect(body.models[0].allowedCoverPaths.length).toBeGreaterThan(0);
  });

  it('rejects order with wrong version (409)', async () => {
    const order = computeEffectiveHomeOrder(readSnapshot().models);
    const res = await app.request('http://localhost/api/staff/order', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({ version: 999, orderedSlugs: order }),
    });
    expect(res.status).toBe(409);
  });

  it('rejects incomplete order (400)', async () => {
    const order = computeEffectiveHomeOrder(readSnapshot().models);
    const res = await app.request('http://localhost/api/staff/order', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({ version: 1, orderedSlugs: order.slice(1) }),
    });
    expect(res.status).toBe(400);
  });

  it('accepts full order replace atomically and bumps version', async () => {
    const order = computeEffectiveHomeOrder(readSnapshot().models);
    const swapped = [...order];
    // swap 2 and 3
    [swapped[1], swapped[2]] = [swapped[2], swapped[1]];

    const res = await app.request('http://localhost/api/staff/order', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({ version: 1, orderedSlugs: swapped }),
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.orderVersion).toBe(2);

    const pub = await app.request('http://localhost/api/public/overrides');
    const pubBody = await json(pub);
    // The public order must mirror exactly the order just saved.
    expect(pubBody.models.map((m: { slug: string }) => m.slug)).toEqual(swapped);
  });

  it('rejects foreign cover path', async () => {
    const catalog = await json(
      await app.request('http://localhost/api/staff/catalog', { headers: { cookie } })
    );
    const jazmin = catalog.models.find((m: any) => m.slug === 'jazmin');
    const res = await app.request('http://localhost/api/staff/cover', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({
        slug: 'jazmin',
        coverImagePath: '/chicas/veronica-valeria-ferrer-model-agency-valencia/portada.jpg',
        version: jazmin.coverVersion,
      }),
    });
    expect(res.status).toBe(400);
  });

  it('updates cover when path is in allowlist', async () => {
    const catalog = await json(
      await app.request('http://localhost/api/staff/catalog', { headers: { cookie } })
    );
    const jazmin = catalog.models.find((m: any) => m.slug === 'jazmin');
    const nextPath = jazmin.allowedCoverPaths.find(
      (p: string) => p !== jazmin.coverImagePath
    );
    expect(nextPath).toBeTruthy();

    const res = await app.request('http://localhost/api/staff/cover', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({
        slug: 'jazmin',
        coverImagePath: nextPath,
        version: jazmin.coverVersion,
      }),
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.coverImagePath).toBe(nextPath);
    expect(body.coverVersion).toBe(jazmin.coverVersion + 1);
  });

  it('writes append-only audit rows', async () => {
    const rows = await db.select().from(auditLog);
    const actions = rows.map((r) => r.action);
    expect(actions).toContain('auth.login');
    expect(actions).toContain('order.replace');
    expect(actions).toContain('cover.update');
    expect(actions).toContain('catalog.seed');
  });

  it('returns formatted recent activity without auth noise', async () => {
    const res = await app.request('http://localhost/api/staff/activity?limit=30', {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((item: { summary: string }) => !/login|logout/i.test(item.summary))).toBe(
      true
    );
    expect(
      body.items.some(
        (item: { subject: string; summary: string }) =>
          item.summary === 'portada actualizada' ||
          item.subject === 'Orden de fichas' ||
          item.summary.includes('posición')
      )
    ).toBe(true);
  });

  it('public overrides require no auth', async () => {
    const res = await app.request('http://localhost/api/public/overrides');
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.models[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        displayOrder: expect.any(Number),
        coverImagePath: expect.any(String),
      })
    );
  });
});

describe('inactive models', () => {
  it('does not expose inactive slugs on staff catalog or public overrides', async () => {
    const snap = readSnapshot();
    const inactive = snap.models.filter((m) => m.active === false).map((m) => m.slug);
    expect(inactive.length).toBeGreaterThan(0);

    const catalog = await json(
      await app.request('http://localhost/api/staff/catalog', { headers: { cookie } })
    );
    for (const slug of inactive) {
      expect(catalog.models.find((m: any) => m.slug === slug)).toBeUndefined();
    }

    const pub = await json(await app.request('http://localhost/api/public/overrides'));
    for (const slug of inactive) {
      expect(pub.models.find((m: any) => m.slug === slug)).toBeUndefined();
    }
  });
});

describe('GET catalog read-only + POST ensure', () => {
  it('GET /api/staff/catalog never writes (including after cold-start cache reset)', async () => {
    const { resetCatalogSourceCacheForTests } = await import('../src/lib/catalogSource.js');
    const { listOverrides } = await import('../src/lib/overridesService.js');
    const { auditLog, modelOverrides, catalogMeta } = await import('../src/db/schema.js');

    async function fingerprint() {
      const overrides = await listOverrides(db);
      const meta = await db.select().from(catalogMeta);
      const audits = await db.select().from(auditLog);
      return {
        orders: overrides
          .map((r) => `${r.slug}:${r.displayOrder}:${r.coverImagePath}:${r.coverVersion}`)
          .sort(),
        orderVersion: meta[0]?.orderVersion,
        auditCount: audits.length,
        overrideUpdated: overrides.map((r) => r.updatedAt?.toISOString?.() ?? '').sort(),
      };
    }

    const before = await fingerprint();
    resetCatalogSourceCacheForTests();

    for (let i = 0; i < 3; i++) {
      const res = await app.request('http://localhost/api/staff/catalog', { headers: { cookie } });
      expect(res.status).toBe(200);
      const body = await json(res);
      expect(body.needsEnsure).toBe(false);
      expect(body.missingOverrides).toEqual([]);
    }

    expect(await fingerprint()).toEqual(before);
    void modelOverrides;
  });

  it('POST ensure with no drift writes nothing', async () => {
    const { listOverrides } = await import('../src/lib/overridesService.js');
    const { auditLog, catalogMeta } = await import('../src/db/schema.js');
    const beforeOverrides = await listOverrides(db);
    const beforeAudit = (await db.select().from(auditLog)).length;
    const beforeVersion = (await db.select().from(catalogMeta))[0]!.orderVersion;

    const res = await app.request('http://localhost/api/staff/catalog/ensure', {
      method: 'POST',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: '{}',
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.wrote).toBe(false);
    expect(body.catalog.needsEnsure).toBe(false);

    expect((await listOverrides(db)).map((r) => `${r.slug}:${r.displayOrder}`).sort()).toEqual(
      beforeOverrides.map((r) => `${r.slug}:${r.displayOrder}`).sort()
    );
    expect((await db.select().from(auditLog)).length).toBe(beforeAudit);
    expect((await db.select().from(catalogMeta))[0]!.orderVersion).toBe(beforeVersion);
  });

  it('ensure → drag save via PUT /order → public overrides mirrors saved order', async () => {
    const snap = readSnapshot();
    const injected = [
      ...snap.models,
      {
        slug: 'ensure-api-nueva',
        name: 'Ensure API Nueva',
        active: true as const,
        coverImageUrl: '/chicas/ensure-api-nueva/portada.jpg',
        images: ['/chicas/ensure-api-nueva/gallery/01.jpg'],
      },
    ];

    const ensureApp = createApp({
      db,
      env: loadEnv({
        NODE_ENV: 'test',
        SESSION_SECRET: 'test-session-secret-at-least-32-chars',
        PANEL_ORIGIN: 'http://localhost:8787',
        PUBLIC_WEB_ORIGINS: 'http://localhost:5173',
        STAFF_COOKIE_NAME: 'vf_staff_session',
        STAFF_SESSION_TTL_HOURS: '12',
      }),
      skipSnapshotFreshness: true,
      skipLiveCatalog: true,
      catalogModels: injected,
    });

    const catalogBefore = await json(
      await ensureApp.request('http://localhost/api/staff/catalog', { headers: { cookie } })
    );
    expect(catalogBefore.needsEnsure).toBe(true);
    expect(catalogBefore.missingOverrides).toContain('ensure-api-nueva');
    expect(catalogBefore.models.find((m: any) => m.slug === 'ensure-api-nueva')).toBeUndefined();

    const ensured = await json(
      await ensureApp.request('http://localhost/api/staff/catalog/ensure', {
        method: 'POST',
        headers: {
          cookie,
          'content-type': 'application/json',
          origin: 'http://localhost:8787',
        },
        body: '{}',
      })
    );
    expect(ensured.wrote).toBe(true);
    expect(ensured.catalog.models.at(-1).slug).toBe('ensure-api-nueva');
    expect(ensured.catalog.needsEnsure).toBe(false);

    const orderedSlugs = ensured.catalog.models.map((m: any) => m.slug);
    // Move nueva to position 0 (encargada decision)
    const moved = [orderedSlugs[orderedSlugs.length - 1], ...orderedSlugs.slice(0, -1)];

    const save = await ensureApp.request('http://localhost/api/staff/order', {
      method: 'PUT',
      headers: {
        cookie,
        'content-type': 'application/json',
        origin: 'http://localhost:8787',
      },
      body: JSON.stringify({
        version: ensured.catalog.orderVersion,
        orderedSlugs: moved,
      }),
    });
    expect(save.status).toBe(200);

    const pub = await json(await ensureApp.request('http://localhost/api/public/overrides'));
    expect(pub.models.map((m: { slug: string }) => m.slug)).toEqual(moved);
    expect(pub.models[0].slug).toBe('ensure-api-nueva');
  });
});
