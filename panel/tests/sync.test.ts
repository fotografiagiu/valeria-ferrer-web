import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDb, type AppDb } from '../src/db/client.js';
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import {
  seedOverridesFromEffectiveOrder,
  syncCatalogOverrides,
  listOverrides,
  listActiveOrderedOverrides,
} from '../src/lib/overridesService.js';

let db: AppDb;
let close: () => Promise<void>;

beforeAll(async () => {
  writeSnapshot();
  const test = await createTestDb();
  db = test.db;
  close = test.close;
  await seedOverridesFromEffectiveOrder({
    db,
    snapshotModels: readSnapshot().models,
  });
});

afterAll(async () => {
  await close();
});

describe('catalog:sync', () => {
  it('dry-run reports no additions on current catalog', async () => {
    const report = await syncCatalogOverrides({
      db,
      snapshotModels: readSnapshot().models,
      dryRun: true,
    });
    expect(report.added).toEqual([]);
    expect(report.keptActive.length).toBe(readSnapshot().activeCount);
    expect(report.orderVersionBumped).toBe(false);
  });

  it('adds a brand-new active model at the end without reshuffling kept actives', async () => {
    const before = await listActiveOrderedOverrides(db);
    const maxBefore = Math.max(...before.map((r) => r.displayOrder as number));

    const models = [
      ...readSnapshot().models,
      {
        slug: 'nueva-test',
        name: 'Nueva Test',
        active: true,
        coverImageUrl: '/chicas/nueva-test/portada.jpg',
        images: ['/chicas/nueva-test/gallery/01.jpg'],
      },
    ];

    const report = await syncCatalogOverrides({
      db,
      snapshotModels: models,
      dryRun: false,
    });

    expect(report.added).toEqual(['nueva-test']);
    expect(report.activeOrderAfter.at(-1)).toBe('nueva-test');
    expect(report.orderVersionBumped).toBe(true);

    const after = await listActiveOrderedOverrides(db);
    const row = after.find((r) => r.slug === 'nueva-test');
    expect(row?.displayOrder).toBe(maxBefore + 1);
    expect(row?.coverImagePath).toBe('/chicas/nueva-test/portada.jpg');

    // Seed order is HOME_PIN_ORDER: sara=1, danna=2, veronica=3 — must not reshuffle.
    expect(after.find((r) => r.slug === 'sara')?.displayOrder).toBe(1);
    expect(after.find((r) => r.slug === 'veronica')?.displayOrder).toBe(3);
  });

  it('sets display_order NULL when deactivated and renumbers actives 1..N', async () => {
    const models = readSnapshot().models.map((m) =>
      m.slug === 'erika' ? { ...m, active: false } : m
    );
    models.push({
      slug: 'nueva-test',
      name: 'Nueva Test',
      active: true,
      coverImageUrl: '/chicas/nueva-test/portada.jpg',
      images: [],
    });

    const report = await syncCatalogOverrides({
      db,
      snapshotModels: models,
      dryRun: false,
    });

    expect(report.deactivated).toContain('erika');
    expect(report.activeOrderAfter).not.toContain('erika');

    const erika = (await listOverrides(db)).find((r) => r.slug === 'erika');
    expect(erika).toBeTruthy();
    expect(erika!.displayOrder).toBeNull();

    const active = await listActiveOrderedOverrides(db);
    expect(active.map((r) => r.slug)).not.toContain('erika');
    active.forEach((r, i) => {
      expect(r.displayOrder).toBe(i + 1);
    });
  });

  it('reactivates at END without restoring old position', async () => {
    // erika currently inactive (NULL). Activate again — must append at end.
    const models = readSnapshot().models.map((m) =>
      m.slug === 'erika' ? { ...m, active: true } : m
    );
    models.push({
      slug: 'nueva-test',
      name: 'Nueva Test',
      active: true,
      coverImageUrl: '/chicas/nueva-test/portada.jpg',
      images: [],
    });

    const beforeActive = await listActiveOrderedOverrides(db);
    const report = await syncCatalogOverrides({
      db,
      snapshotModels: models,
      dryRun: false,
    });

    expect(report.reactivatedAtEnd).toContain('erika');
    expect(report.activeOrderAfter.at(-1)).toBe('erika');

    const after = await listActiveOrderedOverrides(db);
    expect(after.at(-1)?.slug).toBe('erika');
    expect(after.at(-1)?.displayOrder).toBe(after.length);
    // Previous last active (nueva-test) should still be before erika
    expect(after.find((r) => r.slug === 'nueva-test')?.displayOrder).toBeLessThan(
      after.find((r) => r.slug === 'erika')!.displayOrder as number
    );
    // Kept actives retain seed positions (sara still #1) while erika appends at end.
    expect(beforeActive.find((r) => r.slug === 'sara')?.displayOrder).toBe(1);
    expect(beforeActive.find((r) => r.slug === 'veronica')?.displayOrder).toBe(3);
  });
});
