#!/usr/bin/env tsx
import { getDb } from '../src/db/client.js';
import { resolveCatalogModels } from '../src/lib/catalogSource.js';
import { writeSnapshot } from '../src/lib/catalogSnapshot.js';
import { syncCatalogOverrides } from '../src/lib/overridesService.js';

const dryRun = process.argv.includes('--dry-run');
const preferSnapshot = process.argv.includes('--snapshot');

// Keep snapshot fresh as durable fallback (not required for daily ops).
writeSnapshot();

const resolved = preferSnapshot
  ? await resolveCatalogModels({ skipLiveCatalog: true })
  : await resolveCatalogModels();

console.log(
  `Catalog source: ${resolved.source} (version ${resolved.catalogVersion?.slice(0, 12) ?? 'n/a'})`
);

const db = getDb();
const report = await syncCatalogOverrides({
  db,
  snapshotModels: resolved.models,
  dryRun,
});

console.log(JSON.stringify(report, null, 2));
if (dryRun) {
  console.log('(dry-run: no DB writes)');
}
