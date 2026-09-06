import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for neon-serverless Pool transactions in Node.js
neonConfig.webSocketConstructor = ws;

export {
  createNeonDb,
  createTestDb,
  getDb,
  getMigrationSql,
  MIGRATION_SQL_PATH,
  resetDbSingleton,
  setDbForTests,
} from './client-impl.js';
export type { AppDb } from './client-impl.js';
