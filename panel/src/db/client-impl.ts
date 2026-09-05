import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MIGRATION_SQL_PATH = path.resolve(__dirname, '../../db/migrations/0001_init.sql');

export type AppDb =
  | ReturnType<typeof drizzleNeon<typeof schema>>
  | ReturnType<typeof drizzlePglite<typeof schema>>;

let singleton: AppDb | null = null;

export function getMigrationSql(): string {
  return readFileSync(MIGRATION_SQL_PATH, 'utf8');
}

export function createNeonDb(databaseUrl: string): AppDb {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzleNeon(pool, { schema });
}

export async function createTestDb(): Promise<{ db: AppDb; close: () => Promise<void> }> {
  const client = new PGlite();
  await client.exec(getMigrationSql());
  const db = drizzlePglite(client, { schema });
  return {
    db,
    close: async () => {
      await client.close();
    },
  };
}

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
