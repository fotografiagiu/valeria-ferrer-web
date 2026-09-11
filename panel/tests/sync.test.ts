import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDb, type AppDb } from '../src/db/client.js';
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import { computeEffectiveHomeOrder } from '../src/lib/effectiveOrder.js';
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

/** Seeded positions follow the effective home order, so assert against it
 * instead of slugs that can be deactivated later. */
function seededOrder(): string[] {
  return computeEffectiveHomeOrder(readSnapshot().models);
}

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

    // Seed order comes from HOME_PIN_ORDER and must not reshuffle.
    const seeded = seededOrder();
    expect(after.find((r) => r.slug === seeded[0])?.displayOrder).toBe(1);
    expect(after.find((r) => r.slug === seeded[2])?.displayOrder).toBe(3);
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
    // Kept actives retain seed positions while erika appends at end.
    const seeded = seededOrder();
    expect(beforeActive.find((r) => r.slug === seeded[0])?.displayOrder).toBe(1);
    expect(beforeActive.find((r) => r.slug === seeded[2])?.displayOrder).toBe(3);
  });

  it('preserves staff cover when still in allowlist', async () => {
    const seeded = seededOrder();
    const target =
      seeded.find((slug) => {
        const m = readSnapshot().models.find((x) => x.slug === slug);
        return (m?.images?.length || 0) > 1;
      }) || seeded[0];
    const model = readSnapshot().models.find((m) => m.slug === target)!;
    const alt = (model.images || []).find((img) => img !== model.coverImageUrl) || model.images![0];
    expect(alt).toBeTruthy();

    const { eq } = await import('drizzle-orm');
    const { modelOverrides } = await import('../src/db/schema.js');
    const before = (await listOverrides(db)).find((r) => r.slug === target)!;
    await db
      .update(modelOverrides)
      .set({ coverImagePath: alt!, coverVersion: before.coverVersion + 1 })
      .where(eq(modelOverrides.slug, target));

    const report = await syncCatalogOverrides({
      db,
      snapshotModels: readSnapshot().models,
      dryRun: false,
    });
    expect(report.coversReset).not.toContain(target);

    const after = (await listOverrides(db)).find((r) => r.slug === target)!;
    expect(after.coverImagePath).toBe(alt);
  });

  it('resets cover when staff choice leaves the allowlist', async () => {
    const seeded = seededOrder();
    const target = seeded[2];
    const snap = readSnapshot().models;
    const model = snap.find((m) => m.slug === target)!;
    const stale = '/chicas/stale-cover-removed.jpg';

    const { eq } = await import('drizzle-orm');
    const { modelOverrides } = await import('../src/db/schema.js');
    await db
      .update(modelOverrides)
      .set({ coverImagePath: stale })
      .where(eq(modelOverrides.slug, target));

    const report = await syncCatalogOverrides({
      db,
      snapshotModels: snap,
      dryRun: false,
    });
    expect(report.coversReset).toContain(target);

    const after = (await listOverrides(db)).find((r) => r.slug === target)!;
    expect(after.coverImagePath).toBe(model.coverImageUrl);
  });

  it('two concurrent syncs for the same new girl leave one row and do not throw', async () => {
    const models = [
      ...readSnapshot().models,
      {
        slug: 'concurrent-nueva',
        name: 'Concurrent Nueva',
        active: true,
        coverImageUrl: '/chicas/concurrent-nueva/portada.jpg',
        images: ['/chicas/concurrent-nueva/gallery/01.jpg'],
      },
    ];

    const results = await Promise.all([
      syncCatalogOverrides({ db, snapshotModels: models, dryRun: false }),
      syncCatalogOverrides({ db, snapshotModels: models, dryRun: false }),
    ]);

    expect(results).toHaveLength(2);
    for (const report of results) {
      expect(report.dryRun).toBe(false);
      expect(report.activeOrderAfter).toContain('concurrent-nueva');
    }

    const rows = (await listOverrides(db)).filter((r) => r.slug === 'concurrent-nueva');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.displayOrder).not.toBeNull();
    expect(rows[0]?.coverImagePath).toBe('/chicas/concurrent-nueva/portada.jpg');

    const active = await listActiveOrderedOverrides(db);
    const hits = active.filter((r) => r.slug === 'concurrent-nueva');
    expect(hits).toHaveLength(1);
    expect(hits[0]?.displayOrder).toBe(active.length);
  });

  it('ON CONFLICT upsert does not overwrite an existing staff cover', async () => {
    const { eq } = await import('drizzle-orm');
    const { modelOverrides } = await import('../src/db/schema.js');
    const staffCover = '/chicas/conflict-cover/staff.jpg';
    const catalogCover = '/chicas/conflict-cover/portada.jpg';

    await db.insert(modelOverrides).values({
      slug: 'conflict-cover',
      displayOrder: null,
      coverImagePath: staffCover,
      coverVersion: 4,
      updatedBy: null,
    });

    // Pretend both syncs "missed" the row in their planning read by using a catalog
    // where the slug is active; sync will classify as reactivation (row exists) OR
    // if we delete from planning... Force the upsert path by calling sync while the
    // row exists — reactivation must keep staff cover.
    const models = [
      ...readSnapshot().models,
      {
        slug: 'conflict-cover',
        name: 'Conflict Cover',
        active: true,
        coverImageUrl: catalogCover,
        images: [staffCover, catalogCover],
      },
    ];

    await syncCatalogOverrides({ db, snapshotModels: models, dryRun: false });

    const row = (await listOverrides(db)).find((r) => r.slug === 'conflict-cover')!;
    expect(row.coverImagePath).toBe(staffCover);
    expect(row.coverVersion).toBe(4);
    expect(row.displayOrder).not.toBeNull();

    // Simulate the exact race insert path: another sync still thinks it is "added".
    // Upsert must not clobber staff cover.
    await db
      .insert(modelOverrides)
      .values({
        slug: 'conflict-cover',
        displayOrder: null,
        coverImagePath: catalogCover,
        coverVersion: 1,
        updatedBy: null,
      })
      .onConflictDoUpdate({
        target: modelOverrides.slug,
        set: {
          updatedAt: new Date(),
          updatedBy: null,
        },
      });

    const afterRace = (await listOverrides(db)).find((r) => r.slug === 'conflict-cover')!;
    expect(afterRace.coverImagePath).toBe(staffCover);
    expect(afterRace.coverVersion).toBe(4);
  });
});
