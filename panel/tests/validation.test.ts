import { describe, expect, it } from 'vitest';
import {
  computeEffectiveHomeOrder,
  allowedCoverPaths,
  HOME_PIN_ORDER,
} from '../src/lib/effectiveOrder.js';
import { writeSnapshot, readSnapshot, assertSnapshotFresh } from '../src/lib/catalogSnapshot.js';
import {
  validateCoverChange,
  validateOrderedSlugs,
  orderBodySchema,
  coverBodySchema,
} from '../src/lib/validation.js';

describe('catalog snapshot', () => {
  it('builds from canonical models.json and stays fresh', () => {
    const snap = writeSnapshot();
    expect(snap.sourceHash).toMatch(/^[a-f0-9]{64}$/);
    expect(snap.activeCount).toBeGreaterThan(0);
    expect(assertSnapshotFresh().sourceHash).toBe(snap.sourceHash);
    expect(readSnapshot().models[0]).toHaveProperty('slug');
    expect(readSnapshot().models[0]).not.toHaveProperty('description');
  });
});

describe('effective Home order', () => {
  it('matches HOME_PIN_ORDER + rest (canonical Home pin, currently karen first)', () => {
    writeSnapshot();
    const order = computeEffectiveHomeOrder(readSnapshot().models);
    const activePins = HOME_PIN_ORDER.filter((slug) => order.includes(slug));
    // Seed/effective order must track Home pinOrder (Sara + Danna were pinned intentionally).
    expect(order.slice(0, activePins.length)).toEqual(activePins);
    expect(order[0]).toBe('sara');
    expect(order[1]).toBe('danna');
    expect(order.indexOf('alicia')).toBe(activePins.indexOf('alicia'));
    expect(order).toHaveLength(readSnapshot().activeCount);
  });
});

describe('validateOrderedSlugs', () => {
  it('rejects duplicates, missing, extras', () => {
    writeSnapshot();
    const active = readSnapshot().models.filter((m) => m.active !== false);
    const good = computeEffectiveHomeOrder(readSnapshot().models);
    expect(validateOrderedSlugs(good, active).ok).toBe(true);

    const dup = [...good];
    dup[1] = dup[0];
    expect(validateOrderedSlugs(dup, active).ok).toBe(false);

    expect(validateOrderedSlugs(good.slice(0, -1), active).ok).toBe(false);
    expect(validateOrderedSlugs([...good, 'nope'], active).ok).toBe(false);
  });
});

describe('validateCoverChange', () => {
  it('allows only paths in cover ∪ images for that slug', () => {
    writeSnapshot();
    const models = readSnapshot().models;
    const jazmin = models.find((m) => m.slug === 'jazmin')!;
    const allowed = allowedCoverPaths(jazmin);
    expect(allowed.length).toBeGreaterThan(1);

    expect(
      validateCoverChange('jazmin', allowed[1], models).ok
    ).toBe(true);

    expect(
      validateCoverChange('jazmin', '/chicas/other/nope.jpg', models).ok
    ).toBe(false);

    expect(
      validateCoverChange('inactive-fake', allowed[0], models).ok
    ).toBe(false);
  });
});

describe('strict schemas', () => {
  it('rejects unknown keys', () => {
    expect(
      orderBodySchema.safeParse({
        version: 1,
        orderedSlugs: ['a'],
        extra: true,
      }).success
    ).toBe(false);

    expect(
      coverBodySchema.safeParse({
        slug: 'a',
        coverImagePath: '/x.jpg',
        version: 1,
        name: 'hack',
      }).success
    ).toBe(false);
  });
});
