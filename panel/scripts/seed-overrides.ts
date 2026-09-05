#!/usr/bin/env tsx
import { getDb } from '../src/db/client.js';
import { assertSnapshotFresh, writeSnapshot } from '../src/lib/catalogSnapshot.js';
import { seedOverridesFromEffectiveOrder } from '../src/lib/overridesService.js';

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

writeSnapshot();
const snap = assertSnapshotFresh();
const db = getDb();

try {
  const result = await seedOverridesFromEffectiveOrder({
    db,
    snapshotModels: snap.models,
    dryRun,
    force,
  });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
