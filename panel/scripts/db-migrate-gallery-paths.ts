#!/usr/bin/env tsx
/**
 * Additive migration: model_overrides.gallery_image_paths.
 * Safe to re-run (ADD COLUMN IF NOT EXISTS).
 *
 *   npm run db:migrate:gallery-paths
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { getGalleryImagePathsMigrationSql } from '../src/db/client-impl.js';
import { loadLocalEnv } from './lib/loadLocalEnv.js';

neonConfig.webSocketConstructor = ws;

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
    const sql = getGalleryImagePathsMigrationSql();
    if (!sql.includes('gallery_image_paths') || sql.toLowerCase().includes('drop table')) {
      throw new Error('gallery_image_paths migration failed safety check');
    }
    await pool.query(sql);
    const check = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'model_overrides'
           AND column_name = 'gallery_image_paths'
       ) AS exists`
    );
    if (!check.rows[0]?.exists) {
      throw new Error('gallery_image_paths column was not created');
    }
    console.log('model_overrides.gallery_image_paths: OK');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
