import { handle } from 'hono/vercel';
import { createApp } from '../src/app.js';
import { getDb } from '../src/db/client.js';
import { loadEnv } from '../src/lib/env.js';
import { writeSnapshot } from '../src/lib/catalogSnapshot.js';

// Node.js runtime required (Neon Pool / ws). Not Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Prefer committed/build snapshot. Refresh from canonical when available (monorepo/local).
try {
  writeSnapshot();
} catch {
  // Deploy with Root Directory=panel: canonical may be absent; use generated/catalog-snapshot.json
}

const app = createApp({ db: getDb(), env: loadEnv() });

export default handle(app);
