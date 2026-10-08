#!/usr/bin/env tsx
/**
 * Additive migration: allow web_promotion.active_promotion = 'salidas'.
 * Safe to re-run (drops/recreates the CHECK constraint).
 *
 *   npm run db:migrate:web-promotion-salidas
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { getWebPromotionSalidasMigrationSql } from '../src/db/client-impl.js';
import { loadLocalEnv } from './lib/loadLocalEnv.js';

const { Pool } = pg;

function forceLoadDatabaseEnv(): void {
  loadLocalEnv();
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, '.env.local');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key.startsWith('DATABASE_')) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value && !process.env[key]) process.env[key] = value;
  }
}

forceLoadDatabaseEnv();

const UNPOOLED_CANDIDATES = [
  'DATABASE_URL_UNPOOLED',
  'DATABASE_POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
] as const;

function maskHost(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}${u.pathname}`;
  } catch {
    return '(unparseable)';
  }
}

function resolveUrl(): string {
  for (const name of UNPOOLED_CANDIDATES) {
    const url = process.env[name]?.trim();
    if (url) {
      console.log(`Using ${name} host: ${maskHost(url)}`);
      return url;
    }
  }
  throw new Error(`No DATABASE_URL found. Set one of: ${UNPOOLED_CANDIDATES.join(', ')}`);
}

async function main(): Promise<void> {
  const url = resolveUrl();
  const pool = new Pool({ connectionString: url });
  try {
    const sql = getWebPromotionSalidasMigrationSql();
    if (!sql.includes('salidas') || sql.toLowerCase().includes('drop table')) {
      throw new Error('web_promotion salidas migration failed safety check');
    }
    await pool.query(sql);
    const check = await pool.query<{ ok: boolean }>(
      `SELECT pg_get_constraintdef(oid) ILIKE '%salidas%' AS ok
       FROM pg_constraint
       WHERE conrelid = 'public.web_promotion'::regclass
         AND contype = 'c'
         AND pg_get_constraintdef(oid) ILIKE '%active_promotion%'
         AND pg_get_constraintdef(oid) NOT ILIKE '%id = 1%'
       LIMIT 1`
    );
    if (!check.rows[0]?.ok) {
      throw new Error('web_promotion active_promotion CHECK does not include salidas');
    }
    console.log('web_promotion.active_promotion includes salidas: OK');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
