#!/usr/bin/env tsx
import { getDb } from '../src/db/client.js';
import { assertSnapshotFresh, writeSnapshot } from '../src/lib/catalogSnapshot.js';
import { syncCatalogOverrides } from '../src/lib/overridesService.js';

const dryRun = process.argv.includes('--dry-run');

writeSnapshot();
const snap = assertSnapshotFresh();
const db = getDb();

const report = await syncCatalogOverrides({
  db,
  snapshotModels: snap.models,
  dryRun,
});

console.log(JSON.stringify(report, null, 2));
if (dryRun) {
  console.log('(dry-run: no DB writes)');
}
