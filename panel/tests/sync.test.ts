import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { createTestDb, type AppDb } from '../src/db/client.js';
import { auditLog, catalogMeta, modelOverrides } from '../src/db/schema.js';
import { writeSnapshot, readSnapshot } from '../src/lib/catalogSnapshot.js';
import { computeEffectiveHomeOrder } from '../src/lib/effectiveOrder.js';
import {
  seedOverridesFromEffectiveOrder,
  ensureCatalogMembership,
  listOverrides,
  listActiveOrderedOverrides,
  getOrderVersion,
  planCatalogMembership,
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

async function snapshotOrders(): Promise<Map<string, number | null>> {
  const rows = await listOverrides(db);
  return new Map(rows.map((r) => [r.slug, r.displayOrder]));
}

/** Keep extras from prior tests active so cover-only checks do not deactivate them. */
async function catalogWithCurrentExtras() {
  const snap = readSnapshot().models;
  const bySlug = new Map(snap.map((m) => [m.slug, m]));
  const models = [...snap];
  for (const row of await listOverrides(db)) {
    if (row.displayOrder == null || bySlug.has(row.slug)) continue;
    models.push({
      slug: row.slug,
      name: row.slug,
      active: true,
      coverImageUrl: row.coverImagePath,
      images: [row.coverImagePath],
    });
  }
  return models;
}

describe('catalog:ensure (incremental)', () => {
  it('dry-run / no-drift reports zero writes on current catalog', async () => {
    const beforeOrders = await snapshotOrders();
    const beforeVersion = await getOrderVersion(db);
    const beforeAudit = (await db.select().from(auditLog)).length;

    const dry = await ensureCatalogMembership({
      db,
      snapshotModels: readSnapshot().models,
      dryRun: true,
    });
    expect(dry.added).toEqual([]);
    expect(dry.wrote).toBe(false);
    expect(dry.orderVersionBumped).toBe(false);

    const live = await ensureCatalogMembership({
      db,
      snapshotModels: readSnapshot().models,
      dryRun: false,
    });
    expect(live.wrote).toBe(false);
    expect(live.orderVersionBumped).toBe(false);

    expect(await snapshotOrders()).toEqual(beforeOrders);
    expect(await getOrderVersion(db)).toBe(beforeVersion);
    expect((await db.select().from(auditLog)).length).toBe(beforeAudit);
  });

  it('adds a brand-new active model at the end without moving kept actives', async () => {
    const before = await listActiveOrderedOverrides(db);
    const ordersBefore = new Map(before.map((r) => [r.slug, r.displayOrder as number]));
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

    const report = await ensureCatalogMembership({
      db,
      snapshotModels: models,
      dryRun: false,
    });

    expect(report.wrote).toBe(true);
    expect(report.added).toEqual(['nueva-test']);
    expect(report.activeOrderAfter.at(-1)).toBe('nueva-test');
    expect(report.orderVersionBumped).toBe(true);

    const after = await listActiveOrderedOverrides(db);
    const row = after.find((r) => r.slug === 'nueva-test');
    expect(row?.displayOrder).toBe(maxBefore + 1);
    expect(row?.coverImagePath).toBe('/chicas/nueva-test/portada.jpg');

    for (const [slug, order] of ordersBefore) {
      expect(after.find((r) => r.slug === slug)?.displayOrder).toBe(order);
    }
  });

  it('sets display_order NULL when deactivated without renumbering others', async () => {
    const before = await listActiveOrderedOverrides(db);
    const erikaBefore = before.find((r) => r.slug === 'erika');
    expect(erikaBefore?.displayOrder).not.toBeNull();
    const othersBefore = new Map(
      before.filter((r) => r.slug !== 'erika').map((r) => [r.slug, r.displayOrder as number])
    );

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

    const report = await ensureCatalogMembership({
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
    for (const [slug, order] of othersBefore) {
      expect(active.find((r) => r.slug === slug)?.displayOrder).toBe(order);
    }
    // Gaps are allowed (no global 1..N renumber).
    const orders = active.map((r) => r.displayOrder as number);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('reactivates at END without restoring old position or moving others', async () => {
    const beforeActive = await listActiveOrderedOverrides(db);
    const ordersBefore = new Map(beforeActive.map((r) => [r.slug, r.displayOrder as number]));
    const maxBefore = Math.max(...beforeActive.map((r) => r.displayOrder as number));

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

    const report = await ensureCatalogMembership({
      db,
      snapshotModels: models,
      dryRun: false,
    });

    expect(report.reactivatedAtEnd).toContain('erika');
    expect(report.activeOrderAfter.at(-1)).toBe('erika');

    const after = await listActiveOrderedOverrides(db);
    expect(after.at(-1)?.slug).toBe('erika');
    expect(after.at(-1)?.displayOrder).toBe(maxBefore + 1);

    for (const [slug, order] of ordersBefore) {
      expect(after.find((r) => r.slug === slug)?.displayOrder).toBe(order);
    }
  });

  it('does not auto-reactivate staff-hidden fichas', async () => {
    await db
      .update(modelOverrides)
      .set({ displayOrder: null, staffHidden: true })
      .where(eq(modelOverrides.slug, 'sofia1'));

    const existing = await listOverrides(db);
    const plan = planCatalogMembership(readSnapshot().models, existing);
    expect(plan.reactivatedAtEnd).not.toContain('sofia1');
    expect(plan.activeOrderAfter).not.toContain('sofia1');

    const dry = await ensureCatalogMembership({
      db,
      snapshotModels: readSnapshot().models,
      dryRun: true,
    });
    expect(dry.reactivatedAtEnd).not.toContain('sofia1');

    // Restore for later tests
    const max =
      Math.max(
        0,
        ...(await listActiveOrderedOverrides(db)).map((r) => r.displayOrder as number)
      ) + 1;
    await db
      .update(modelOverrides)
      .set({ displayOrder: max, staffHidden: false })
      .where(eq(modelOverrides.slug, 'sofia1'));
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

    const before = (await listOverrides(db)).find((r) => r.slug === target)!;
    await db
      .update(modelOverrides)
      .set({ coverImagePath: alt!, coverVersion: before.coverVersion + 1 })
      .where(eq(modelOverrides.slug, target));

    const report = await ensureCatalogMembership({
      db,
      snapshotModels: await catalogWithCurrentExtras(),
      dryRun: false,
    });
    expect(report.wrote).toBe(false);
    expect(report.coversReset).not.toContain(target);

    const after = (await listOverrides(db)).find((r) => r.slug === target)!;
    expect(after.coverImagePath).toBe(alt);
  });

  it('resets cover when staff choice leaves the allowlist without moving order', async () => {
    const seeded = seededOrder();
    const target = seeded[2];
    const snap = await catalogWithCurrentExtras();
    const model = snap.find((m) => m.slug === target)!;
    const stale = '/chicas/stale-cover-removed.jpg';
    const orderBefore = (await listOverrides(db)).find((r) => r.slug === target)!.displayOrder;

    await db
      .update(modelOverrides)
      .set({ coverImagePath: stale })
      .where(eq(modelOverrides.slug, target));

    const report = await ensureCatalogMembership({
      db,
      snapshotModels: snap,
      dryRun: false,
    });
    expect(report.wrote).toBe(true);
    expect(report.coversReset).toContain(target);
    expect(report.orderVersionBumped).toBe(false);

    const after = (await listOverrides(db)).find((r) => r.slug === target)!;
    expect(after.coverImagePath).toBe(model.coverImageUrl);
    expect(after.displayOrder).toBe(orderBefore);
  });

  it('two concurrent ensures for the same new girl leave one row and unique order', async () => {
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
      ensureCatalogMembership({ db, snapshotModels: models, dryRun: false }),
      ensureCatalogMembership({ db, snapshotModels: models, dryRun: false }),
    ]);

    expect(results).toHaveLength(2);

    const rows = (await listOverrides(db)).filter((r) => r.slug === 'concurrent-nueva');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.displayOrder).not.toBeNull();

    const active = await listActiveOrderedOverrides(db);
    const orders = active.map((r) => r.displayOrder as number);
    expect(new Set(orders).size).toBe(orders.length);
    const hits = active.filter((r) => r.slug === 'concurrent-nueva');
    expect(hits).toHaveLength(1);
  });

  it('ON CONFLICT upsert does not overwrite an existing staff cover', async () => {
    const staffCover = '/chicas/conflict-cover/staff.jpg';
    const catalogCover = '/chicas/conflict-cover/portada.jpg';

    await db.insert(modelOverrides).values({
      slug: 'conflict-cover',
      displayOrder: null,
      coverImagePath: staffCover,
      coverVersion: 4,
      updatedBy: null,
    });

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

    await ensureCatalogMembership({ db, snapshotModels: models, dryRun: false });

    const row = (await listOverrides(db)).find((r) => r.slug === 'conflict-cover')!;
    expect(row.coverImagePath).toBe(staffCover);
    expect(row.coverVersion).toBe(4);
    expect(row.displayOrder).not.toBeNull();
  });
});
