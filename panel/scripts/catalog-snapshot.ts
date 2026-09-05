#!/usr/bin/env tsx
import { writeSnapshot } from '../src/lib/catalogSnapshot.js';

const snap = writeSnapshot();
console.log('Catalog snapshot written.');
console.log(`  source: ${snap.sourcePath}`);
console.log(`  hash:   ${snap.sourceHash}`);
console.log(`  models: ${snap.modelCount} (active ${snap.activeCount})`);
console.log(`  at:     ${snap.generatedAt}`);
