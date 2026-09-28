#!/usr/bin/env tsx
/**
 * Local smoke API for web promotion (PGlite — no Neon secrets required).
 *
 *   npm run smoke:promotion:server
 *
 * Staff: promo / promo-pass-ok
 * API:   http://localhost:8787
 */
import { serve } from '@hono/node-server';
import { createApp } from '../src/app.js';
import { createTestDb } from '../src/db/client.js';
import { staffUsers } from '../src/db/schema.js';
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import { loadEnv } from '../src/lib/env.js';
import { hashPassword } from '../src/lib/password.js';
import { seedOverridesFromEffectiveOrder } from '../src/lib/overridesService.js';

const port = Number(process.env.PORT || 8787);

async function main() {
  writeSnapshot();
  const { db } = await createTestDb();
  const passwordHash = await hashPassword('promo-pass-ok');
  await db.insert(staffUsers).values({
    username: 'promo',
    passwordHash,
    displayName: 'Pedro Smoke',
  });
  await seedOverridesFromEffectiveOrder({
    db,
    snapshotModels: readSnapshot().models,
  });

  const env = loadEnv({
    NODE_ENV: 'development',
    SESSION_SECRET: 'local-smoke-session-secret-at-least-32-chars',
    PANEL_ORIGIN: 'http://localhost:5173',
    PUBLIC_WEB_ORIGINS: 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000',
    STAFF_COOKIE_NAME: 'vf_staff_session',
    STAFF_SESSION_TTL_HOURS: '12',
  });

  const app = createApp({
    db,
    env,
    skipSnapshotFreshness: true,
    skipLiveCatalog: true,
  });

  serve({ fetch: app.fetch, port });
  console.log(`SMOKE Panel API http://localhost:${port}`);
  console.log('Staff login: promo / promo-pass-ok');
  console.log('Public: GET /api/public/promotion');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
