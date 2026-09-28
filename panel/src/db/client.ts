export {
  createNeonDb,
  getDb,
  getMigrationSql,
  getPromotionMigrationSql,
  getStaffHiddenMigrationSql,
  getGalleryImagePathsMigrationSql,
  MIGRATION_SQL_PATH,
  MIGRATION_002_SQL_PATH,
  resetDbSingleton,
  setDbForTests,
} from './client-impl.js';
export type { AppDb } from './client-impl.js';

/** Test-only PGlite helper — dynamic import so Production serverless never loads WASM. */
export async function createTestDb(): Promise<{
  db: import('./client-impl.js').AppDb;
  close: () => Promise<void>;
}> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const schema = await import('./schema.js');
  const { getMigrationSql } = await import('./client-impl.js');

  const client = new PGlite();
  await client.exec(getMigrationSql());
  const db = drizzle(client, { schema }) as unknown as import('./client-impl.js').AppDb;
  return {
    db,
    close: async () => {
      await client.close();
    },
  };
}
