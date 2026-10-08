import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MIGRATION_SQL_PATH = path.resolve(__dirname, '../../db/migrations/0001_init.sql');
export const MIGRATION_002_SQL_PATH = path.resolve(
  __dirname,
  '../../db/migrations/0002_web_promotion.sql'
);
export const MIGRATION_003_SQL_PATH = path.resolve(
  __dirname,
  '../../db/migrations/0003_staff_hidden.sql'
);
export const MIGRATION_004_SQL_PATH = path.resolve(
  __dirname,
  '../../db/migrations/0004_gallery_image_paths.sql'
);
export const MIGRATION_005_SQL_PATH = path.resolve(
  __dirname,
  '../../db/migrations/0005_web_promotion_salidas.sql'
);

export type AppDb = ReturnType<typeof drizzle<typeof schema>>;

let poolSingleton: pg.Pool | null = null;
let singleton: AppDb | null = null;

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_DEV;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Set DATABASE_URL to the Postgres connection string (see panel/README.md).'
    );
  }
  return url;
}

/** Pool options for Vercel serverless + Supabase Session Pooler (:5432). */
export function createPool(databaseUrl: string): pg.Pool {
  const onVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
  return new Pool({
    connectionString: databaseUrl,
    // Keep the pool tiny on serverless to avoid exhausting Supabase/Neon slots.
    max: onVercel ? 1 : 5,
    idleTimeoutMillis: onVercel ? 5_000 : 30_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: onVercel,
  });
}

/** Shared Pool reused across warm invocations when the runtime allows it. */
export function getPool(): pg.Pool {
  if (poolSingleton) return poolSingleton;
  poolSingleton = createPool(resolveDatabaseUrl());
  return poolSingleton;
}

export function getMigrationSql(): string {
  const init = readFileSync(MIGRATION_SQL_PATH, 'utf8');
  const promo = readFileSync(MIGRATION_002_SQL_PATH, 'utf8');
  const staffHidden = readFileSync(MIGRATION_003_SQL_PATH, 'utf8');
  const gallery = readFileSync(MIGRATION_004_SQL_PATH, 'utf8');
  const salidas = readFileSync(MIGRATION_005_SQL_PATH, 'utf8');
  return `${init}\n\n${promo}\n\n${staffHidden}\n\n${gallery}\n\n${salidas}`;
}

export function getPromotionMigrationSql(): string {
  return readFileSync(MIGRATION_002_SQL_PATH, 'utf8');
}

export function getStaffHiddenMigrationSql(): string {
  return readFileSync(MIGRATION_003_SQL_PATH, 'utf8');
}

export function getGalleryImagePathsMigrationSql(): string {
  return readFileSync(MIGRATION_004_SQL_PATH, 'utf8');
}

export function getWebPromotionSalidasMigrationSql(): string {
  return readFileSync(MIGRATION_005_SQL_PATH, 'utf8');
}

/** Create a Drizzle DB bound to a fresh Pool (scripts / one-off). Caller owns lifecycle. */
export function createDb(databaseUrl: string): { db: AppDb; pool: pg.Pool } {
  const pool = createPool(databaseUrl);
  const db = drizzle(pool, { schema });
  return { db, pool };
}

/** Runtime DB: pooled DATABASE_URL only (never UNPOOLED / DDL URL). */
export function getDb(): AppDb {
  if (singleton) return singleton;
  singleton = drizzle(getPool(), { schema });
  return singleton;
}

export function setDbForTests(db: AppDb): void {
  singleton = db;
}

export function resetDbSingleton(): void {
  singleton = null;
  poolSingleton = null;
}
