import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
export const MIGRATION_SQL_PATH = path.resolve(__dirname, '../../db/migrations/0001_init.sql');
export const MIGRATION_003_SQL_PATH = path.resolve(
  __dirname,
  '../../db/migrations/0003_staff_hidden.sql'
);

/**
 * Neon WebSocket Pool (supports transactions for order/cover writes).
 * On Vercel serverless, prefer HTTP for non-transaction queries to avoid WS hangs.
 */
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  neonConfig.poolQueryViaFetch = true;
}

try {
  neonConfig.webSocketConstructor = require('ws');
} catch {
  // Reads still work via poolQueryViaFetch on Vercel.
}

export type AppDb = ReturnType<typeof drizzleNeon<typeof schema>>;

let singleton: AppDb | null = null;

export function getMigrationSql(): string {
  const init = readFileSync(MIGRATION_SQL_PATH, 'utf8');
  const staffHidden = readFileSync(MIGRATION_003_SQL_PATH, 'utf8');
  return `${init}\n\n${staffHidden}`;
}

export function getStaffHiddenMigrationSql(): string {
  return readFileSync(MIGRATION_003_SQL_PATH, 'utf8');
}

export function createNeonDb(databaseUrl: string): AppDb {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzleNeon(pool, { schema });
}

/** Runtime DB: pooled DATABASE_URL only (never UNPOOLED / DDL URL). */
export function getDb(): AppDb {
  if (singleton) return singleton;
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_DEV;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Create Neon first, then set DATABASE_URL (see panel/README.md).'
    );
  }
  singleton = createNeonDb(url);
  return singleton;
}

export function setDbForTests(db: AppDb): void {
  singleton = db;
}

export function resetDbSingleton(): void {
  singleton = null;
}
