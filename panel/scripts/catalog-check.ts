#!/usr/bin/env tsx
import { assertSnapshotFresh, SNAPSHOT_PATH } from '../src/lib/catalogSnapshot.js';

try {
  const snap = assertSnapshotFresh();
  console.log('Catalog snapshot OK (matches canonical models.json).');
  console.log(`  ${SNAPSHOT_PATH}`);
  console.log(`  hash ${snap.sourceHash}`);
  process.exit(0);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
