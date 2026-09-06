import { serve } from '@hono/node-server';
import { loadLocalEnv } from '../scripts/lib/loadLocalEnv.js';
import { createApp } from './app.js';
import { getDb } from './db/client.js';
import { writeSnapshot } from './lib/catalogSnapshot.js';
import { loadEnv } from './lib/env.js';

loadLocalEnv();
writeSnapshot();
const env = loadEnv();
const app = createApp({ db: getDb(), env });

const port = Number(process.env.PORT || 8787);
console.log(`Panel API listening on http://localhost:${port}`);
console.log(`PANEL_ORIGIN=${env.panelOrigin}`);

serve({ fetch: app.fetch, port });
