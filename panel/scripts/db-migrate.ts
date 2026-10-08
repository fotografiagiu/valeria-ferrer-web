#!/usr/bin/env tsx
/**
 * Postgres migration helper for panel schema only.
 *
 * Usage:
 *   npm run db:preflight   # connect + safety checks, no DDL
 *   npm run db:migrate     # preflight then apply migrations 0001–0005
 *
 * Prefers DATABASE_URL_UNPOOLED, falls back to DATABASE_POSTGRES_URL_NON_POOLING,
 * then DATABASE_URL.
 * Never DROPs. Never prints connection strings.
 */
import pg from 'pg';
import { getMigrationSql, MIGRATION_SQL_PATH } from '../src/db/client-impl.js';
import { loadLocalEnv } from './lib/loadLocalEnv.js';

const { Pool } = pg;
loadLocalEnv();

const TARGET_TABLES = [
  'staff_users',
  'staff_sessions',
  'catalog_meta',
  'model_overrides',
  'audit_log',
  'rate_limit_buckets',
  'web_promotion',
] as const;

const URL_CANDIDATES = [
  'DATABASE_URL_UNPOOLED',
  'DATABASE_POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
] as const;

const apply = process.argv.includes('--apply');
const preflightOnly = process.argv.includes('--preflight') || !apply;

function maskHost(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}${u.pathname}`;
  } catch {
    return '(unparseable)';
  }
}

function assertPostgresUrl(url: string, name: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${name} is not a valid URL`);
  }
  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    throw new Error(`${name} must be a postgres(ql) URL`);
  }
}

function resolveUrl(): { name: string; url: string } {
  for (const name of URL_CANDIDATES) {
    const url = process.env[name]?.trim();
    if (url) return { name, url };
  }
  throw new Error(`No Postgres URL found. Set one of: ${URL_CANDIDATES.join(', ')}`);
}

async function withPool<T>(fn: (pool: pg.Pool) => Promise<T>): Promise<T> {
  const { name, url } = resolveUrl();
  assertPostgresUrl(url, name);
  console.log(`Using ${name} host: ${maskHost(url)}`);

  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    return await fn(pool);
  } finally {
    await pool.end();
  }
}

async function runPreflight(pool: pg.Pool): Promise<void> {
  const ping = await pool.query<{ ok: number }>('SELECT 1::int AS ok');
  if (ping.rows[0]?.ok !== 1) {
    throw new Error('Connection probe failed');
  }
  console.log('Connection: OK');

  const existing = await pool.query<{ tablename: string }>(
    `SELECT tablename
     FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename = ANY($1::text[])
     ORDER BY tablename`,
    [TARGET_TABLES as unknown as string[]]
  );

  if (existing.rows.length > 0) {
    const names = existing.rows.map((r) => r.tablename).join(', ');
    throw new Error(
      `Target tables already exist (${names}). Refusing to migrate. No DROP performed.`
    );
  }

  const anyPublic = await pool.query<{ n: string }>(
    `SELECT count(*)::text AS n FROM pg_tables WHERE schemaname = 'public'`
  );
  console.log(`Public tables present: ${anyPublic.rows[0]?.n ?? '?'}`);
  console.log(`Target panel tables (${TARGET_TABLES.join(', ')}): none — OK to migrate`);
  console.log(`Migration file: ${MIGRATION_SQL_PATH} (+ 0002/0003/0004)`);
}

async function runApply(pool: pg.Pool): Promise<void> {
  const sql = getMigrationSql();
  if (!sql.includes('CREATE TABLE') || sql.toLowerCase().includes('drop table')) {
    throw new Error('Migration file failed safety check (expected CREATE-only, no DROP TABLE)');
  }
  console.log('Applying migrations 0001–0005 …');
  await pool.query(sql);
  console.log('Migration applied.');

  const after = await pool.query<{ tablename: string }>(
    `SELECT tablename
     FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename = ANY($1::text[])
       ORDER BY tablename`,
    [TARGET_TABLES as unknown as string[]]
  );
  console.log(`Tables now present: ${after.rows.map((r) => r.tablename).join(', ')}`);
}

async function main(): Promise<void> {
  await withPool(async (pool) => {
    await runPreflight(pool);
    if (preflightOnly) {
      console.log('Preflight OK — no DDL executed.');
      return;
    }
    await runApply(pool);
  });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
