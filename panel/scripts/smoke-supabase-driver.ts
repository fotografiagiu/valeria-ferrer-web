#!/usr/bin/env tsx
/**
 * Smoke tests against live DATABASE_URL (Supabase copy during migration).
 * Write probes run inside a rolled-back transaction so the copy stays intact.
 * Never prints connection strings or secrets.
 */
import { createHash, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { loadLocalEnv } from './lib/loadLocalEnv.js';
import { createApp } from '../src/app.js';
import { getDb, getPool, resetDbSingleton } from '../src/db/client-impl.js';
import { catalogMeta, modelOverrides, staffSessions, staffUsers, webPromotion } from '../src/db/schema.js';
import { loadEnv } from '../src/lib/env.js';
import { verifyPassword } from '../src/lib/password.js';
import { hashSessionToken, resolveSession } from '../src/lib/session.js';
import overridesHandler from '../api/public/overrides.js';
import promotionHandler from '../api/public/promotion.js';

loadLocalEnv();
resetDbSingleton();

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function maskHost(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}:${u.port || ''}${u.pathname}`;
  } catch {
    return '(unparseable)';
  }
}

async function mockHandler(
  handler: (req: any, res: any) => Promise<void>,
  method = 'GET'
): Promise<{ status: number; body: any }> {
  let status = 200;
  let body: any = null;
  const req = { method, headers: { origin: 'https://www.valeriaferrer.com' } };
  const res = {
    setHeader() {},
    status(code: number) {
      status = code;
      return this;
    },
    json(payload: any) {
      body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  await handler(req, res);
  return { status, body };
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  assert(url, 'DATABASE_URL missing');
  console.log('DATABASE_URL host:', maskHost(url));
  assert(
    (url.includes('pooler.supabase.com') || url.includes('supabase.co')) &&
      !url.includes('neon.tech'),
    'DATABASE_URL must point at Supabase for this smoke (not Neon)'
  );

  const db = getDb();
  const pool = getPool();
  const env = loadEnv({
    ...process.env,
    NODE_ENV: 'test',
    PANEL_ORIGIN: process.env.PANEL_ORIGIN || 'http://localhost:8787',
  });

  // A/B staff user + bcrypt
  const users = await db.select().from(staffUsers).limit(5);
  assert(users.length === 1, `expected 1 staff_users, got ${users.length}`);
  const user = users[0]!;
  assert(user.username === 'valeria', 'unexpected staff username');
  assert(user.passwordHash.startsWith('$2'), 'password_hash does not look like bcrypt');
  console.log('A) staff_users OK (bcrypt hash present)');

  // B sessions: table readable + controlled create/resolve/cleanup (no fixed counts;
  // Preview may add legitimate sessions during migration).
  {
    const tableCheck = await pool.query<{ n: string }>(
      `SELECT count(*)::text AS n FROM staff_sessions`
    );
    assert(Number(tableCheck.rows[0]!.n) >= 0, 'staff_sessions not readable');
    console.log(`B) staff_sessions readable count=${tableCheck.rows[0]!.n}`);
  }
  // Prove resolveSession path works with a disposable session (rolled back)
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const token = randomBytes(32).toString('base64url');
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await client.query(
      `INSERT INTO staff_sessions (staff_user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt.toISOString()]
    );
    // Drizzle resolve uses the shared pool — use a nested check via hash only in-tx
    const found = await client.query(
      `SELECT id FROM staff_sessions WHERE token_hash = $1 AND expires_at > now()`,
      [tokenHash]
    );
    assert(found.rowCount === 1, 'temp session not visible in transaction');
    await client.query('ROLLBACK');
    console.log('B) session hash/resolve path OK (temp session rolled back)');
  } finally {
    client.release();
  }

  // Prove resolveSession against real DB with create+delete disposable session
  {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const inserted = await db
      .insert(staffSessions)
      .values({
        staffUserId: user.id,
        tokenHash,
        expiresAt,
        ip: '127.0.0.1',
        userAgent: 'migration-smoke',
      })
      .returning({ id: staffSessions.id });
    const identity = await resolveSession(db, token);
    assert(identity?.username === 'valeria', 'resolveSession failed for disposable token');
    await db.delete(staffSessions).where(eq(staffSessions.id, inserted[0]!.id));
    const gone = await resolveSession(db, token);
    assert(gone === null, 'disposable session still resolvable after delete');
    console.log('B) resolveSession create/delete OK (no leftover)');
  }

  // C overrides (structure, not a frozen historical count)
  const overrides = await db.select().from(modelOverrides);
  assert(overrides.length > 0, 'model_overrides empty');
  const meta = (await db.select().from(catalogMeta))[0];
  assert(meta, 'catalog_meta missing');
  assert(typeof meta.orderVersion === 'number', 'catalog_meta.order_version missing');
  console.log('C) model_overrides/catalog_meta OK', {
    overrides: overrides.length,
    orderVersion: meta.orderVersion,
  });

  // D promotion
  const promo = await db.select().from(webPromotion);
  assert(promo.length === 1, 'web_promotion missing');
  console.log('D) web_promotion read OK', { activePromotion: promo[0]!.activePromotion });

  // E public overrides handler — stable public invariants
  const ov = await mockHandler(overridesHandler);
  assert(ov.status === 200, `overrides status ${ov.status}`);
  assert(Array.isArray(ov.body.models), 'overrides.models missing');
  assert(typeof ov.body.orderVersion === 'number', 'orderVersion missing');
  assert(ov.body.orderVersion === meta.orderVersion, 'public orderVersion mismatch vs catalog_meta');
  assert(ov.body.orderVersion === 99, `expected orderVersion 99, got ${ov.body.orderVersion}`);
  assert(ov.body.models.length === 21, `expected 21 public models, got ${ov.body.models.length}`);
  console.log('E) public overrides OK', {
    orderVersion: ov.body.orderVersion,
    models: ov.body.models.length,
    hidden: (ov.body.hiddenSlugs || []).length,
  });

  // F public promotion handler
  const pr = await mockHandler(promotionHandler);
  assert(pr.status === 200, `promotion status ${pr.status}`);
  assert(pr.body.active === false || pr.body.active === true, 'promotion.active missing');
  console.log('F) public promotion OK', {
    active: pr.body.active,
    activePromotion: pr.body.activePromotion,
  });

  // G/H/I/J/K transactional write probe (rollback)
  const beforeOrder = (await db.select().from(catalogMeta))[0]!.orderVersion;
  const beforeAudit = Number(
    (await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM audit_log')).rows[0]!.n
  );
  const beforeBuckets = Number(
    (await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM rate_limit_buckets')).rows[0]!
      .n
  );

  const txClient = await pool.connect();
  try {
    await txClient.query('BEGIN');
    // G: update override cover_version (then rollback)
    const sample = overrides.find((o) => o.displayOrder != null);
    assert(sample, 'no active override for write probe');
    await txClient.query(
      `UPDATE model_overrides SET cover_version = cover_version + 1, updated_at = now() WHERE slug = $1`,
      [sample.slug]
    );
    // H: bump catalog order_version
    await txClient.query(`UPDATE catalog_meta SET order_version = order_version + 1 WHERE id = 1`);
    // I: insert audit row
    await txClient.query(
      `INSERT INTO audit_log (staff_user_id, action, model_slug, before, after)
       VALUES ($1, 'migration.smoke', $2, '{}'::jsonb, '{}'::jsonb)`,
      [user.id, sample.slug]
    );
    // J: upsert rate limit bucket
    await txClient.query(
      `INSERT INTO rate_limit_buckets (bucket_key, hit_count, window_start)
       VALUES ('migration-smoke', 1, now())
       ON CONFLICT (bucket_key) DO UPDATE SET hit_count = rate_limit_buckets.hit_count + 1`
    );
    // K: transaction visible inside
    const mid = await txClient.query<{ order_version: number }>(
      `SELECT order_version FROM catalog_meta WHERE id = 1`
    );
    assert(
      mid.rows[0]!.order_version === beforeOrder + 1,
      'order_version not bumped inside transaction'
    );
    await txClient.query('ROLLBACK');
    console.log('G–K) write probes OK and rolled back');
  } finally {
    txClient.release();
  }

  const afterOrder = (await db.select().from(catalogMeta))[0]!.orderVersion;
  const afterAudit = Number(
    (await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM audit_log')).rows[0]!.n
  );
  const afterBuckets = Number(
    (await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM rate_limit_buckets')).rows[0]!
      .n
  );
  assert(afterOrder === beforeOrder, 'catalog_meta polluted after rollback');
  assert(afterAudit === beforeAudit, 'audit_log polluted after rollback');
  assert(afterBuckets === beforeBuckets, 'rate_limit_buckets polluted after rollback');

  // Login path via Hono app (creates a real session — delete afterwards)
  const app = createApp({
    db,
    env,
    skipSnapshotFreshness: true,
    skipLiveCatalog: true,
  });
  // We do not know production password — verify bcrypt API against stored hash with wrong password
  const wrong = await verifyPassword('definitely-not-the-password', user.passwordHash);
  assert(wrong === false, 'bcrypt compare unexpectedly true');
  console.log('A/F) bcrypt verify path OK (negative check; production password not used)');

  // Optional: if MIGRATION_SMOKE_PASSWORD is set, do a real login then revoke session
  const smokePassword = process.env.MIGRATION_SMOKE_PASSWORD;
  if (smokePassword) {
    const login = await app.request('http://localhost/api/staff/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: env.panelOrigin,
      },
      body: JSON.stringify({ username: user.username, password: smokePassword }),
    });
    assert(login.status === 200, `login failed status=${login.status}`);
    const setCookie = login.headers.get('set-cookie') || '';
    assert(setCookie.includes(env.cookieName + '='), 'login cookie missing');
    const cookie = setCookie.split(';')[0]!;
    const me = await app.request('http://localhost/api/staff/catalog', {
      headers: { cookie, origin: env.panelOrigin },
    });
    assert(me.status === 200, `catalog after login status=${me.status}`);
    await app.request('http://localhost/api/staff/logout', {
      method: 'POST',
      headers: { cookie, origin: env.panelOrigin },
    });
    console.log('A) live login/logout OK (MIGRATION_SMOKE_PASSWORD)');
  } else {
    console.log('A) live login skipped (set MIGRATION_SMOKE_PASSWORD to exercise)');
  }

  console.log('SMOKE_OK');
  await pool.end();
  resetDbSingleton();
}

main().catch(async (err) => {
  console.error(err instanceof Error ? err.message : err);
  try {
    await getPool().end();
  } catch {
    /* ignore */
  }
  resetDbSingleton();
  process.exit(1);
});
