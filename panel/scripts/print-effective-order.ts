#!/usr/bin/env tsx
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import { computeEffectiveHomeOrder } from '../src/lib/effectiveOrder.js';

writeSnapshot();
const snap = readSnapshot();
const order = computeEffectiveHomeOrder(snap.models);
const bySlug = new Map(snap.models.map((m) => [m.slug, m]));

console.log('Effective Home order (seed source):\n');
order.forEach((slug, i) => {
  const m = bySlug.get(slug)!;
  console.log(`${String(i + 1).padStart(2, '0')}  ${slug.padEnd(28)}  ${m.coverImageUrl || ''}`);
});
console.log(`\nTotal: ${order.length}`);
