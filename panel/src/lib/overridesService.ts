import { asc, eq, isNotNull } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { catalogMeta, modelOverrides } from '../db/schema.js';
import { appendAudit } from './audit.js';
import {
  allowedCoverPaths,
  computeEffectiveHomeOrder,
  type CatalogModelLite,
} from './effectiveOrder.js';
import { validateCoverChange, validateOrderedSlugs } from './validation.js';

export class ConflictError extends Error {
  status = 409 as const;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends Error {
  status = 400 as const;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export async function getOrderVersion(db: AppDb): Promise<number> {
  const rows = await db.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
  if (!rows[0]) {
    await db.insert(catalogMeta).values({ id: 1, orderVersion: 1 });
    return 1;
  }
  return rows[0].orderVersion;
}

/** All override rows (including inactive with display_order NULL). */
export async function listOverrides(db: AppDb) {
  return db.select().from(modelOverrides);
}

/** Only models currently in the editable/public order (display_order NOT NULL). */
export async function listActiveOrderedOverrides(db: AppDb) {
  return db
    .select()
    .from(modelOverrides)
    .where(isNotNull(modelOverrides.displayOrder))
    .orderBy(asc(modelOverrides.displayOrder));
}

export async function replaceOrder(params: {
  db: AppDb;
  orderedSlugs: string[];
  version: number;
  activeModels: CatalogModelLite[];
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ orderVersion: number }> {
  const check = validateOrderedSlugs(params.orderedSlugs, params.activeModels);
  if (!check.ok) throw new BadRequestError(check.error);

  return params.db.transaction(async (tx) => {
    const metaRows = await tx.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
    const meta = metaRows[0];
    if (!meta) throw new BadRequestError('catalog_meta missing');
    if (meta.orderVersion !== params.version) {
      throw new ConflictError(
        `order version conflict: expected ${meta.orderVersion}, got ${params.version}`
      );
    }

    const beforeRows = await tx.select().from(modelOverrides);
    const before = beforeRows
      .filter((r) => r.displayOrder != null)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((r) => ({ slug: r.slug, displayOrder: r.displayOrder }));

    const activeSet = new Set(check.orderedSlugs);

    // Clear all positions first (NULLs are fine under partial unique index)
    for (const row of beforeRows) {
      await tx
        .update(modelOverrides)
        .set({ displayOrder: null })
        .where(eq(modelOverrides.slug, row.slug));
    }

    let order = 1;
    for (const slug of check.orderedSlugs) {
      const existing = beforeRows.find((r) => r.slug === slug);
      if (!existing) {
        throw new BadRequestError(
          `override missing for active slug ${slug}; run npm run catalog:sync`
        );
      }
      await tx
        .update(modelOverrides)
        .set({
          displayOrder: order,
          updatedAt: new Date(),
          updatedBy: params.staffUserId,
        })
        .where(eq(modelOverrides.slug, slug));
      order += 1;
    }

    // Rows not in orderedSlugs stay NULL (inactive / unknown to this save)
    void activeSet;

    const newVersion = meta.orderVersion + 1;
    await tx
      .update(catalogMeta)
      .set({ orderVersion: newVersion, updatedAt: new Date() })
      .where(eq(catalogMeta.id, 1));

    const after = check.orderedSlugs.map((slug, i) => ({
      slug,
      displayOrder: i + 1,
    }));

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId,
      action: 'order.replace',
      before,
      after,
      ip: params.ip,
      userAgent: params.userAgent,
    });

    return { orderVersion: newVersion };
  });
}

export async function updateCover(params: {
  db: AppDb;
  slug: string;
  coverImagePath: string;
  version: number;
  snapshotModels: CatalogModelLite[];
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ coverVersion: number; coverImagePath: string }> {
  const check = validateCoverChange(
    params.slug,
    params.coverImagePath,
    params.snapshotModels
  );
  if (!check.ok) throw new BadRequestError(check.error);

  return params.db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(modelOverrides)
      .where(eq(modelOverrides.slug, params.slug))
      .limit(1);
    const row = rows[0];
    if (!row) {
      throw new BadRequestError(
        `override missing for ${params.slug}; run npm run catalog:sync`
      );
    }
    // Inactive: display_order NULL → not editable from panel
    if (row.displayOrder == null) {
      throw new BadRequestError(`slug is not in active catalog: ${params.slug}`);
    }
    if (row.coverVersion !== params.version) {
      throw new ConflictError(
        `cover version conflict: expected ${row.coverVersion}, got ${params.version}`
      );
    }

    const newVersion = row.coverVersion + 1;
    await tx
      .update(modelOverrides)
      .set({
        coverImagePath: params.coverImagePath,
        coverVersion: newVersion,
        updatedAt: new Date(),
        updatedBy: params.staffUserId,
      })
      .where(eq(modelOverrides.slug, params.slug));

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId,
      action: 'cover.update',
      modelSlug: params.slug,
      before: { coverImagePath: row.coverImagePath, coverVersion: row.coverVersion },
      after: { coverImagePath: params.coverImagePath, coverVersion: newVersion },
      ip: params.ip,
      userAgent: params.userAgent,
    });

    return { coverVersion: newVersion, coverImagePath: params.coverImagePath };
  });
}

export type SyncReport = {
  dryRun: boolean;
  added: string[];
  /** Already active with a position — left in place until renumber pass */
  keptActive: string[];
  /** Were inactive (NULL order) and are active again → appended at end */
  reactivatedAtEnd: string[];
  /** Now inactive / missing — display_order set to NULL, row kept */
  deactivated: string[];
  /** Staff cover left the allowlist → reset to catalog coverImageUrl */
  coversReset: string[];
  activeOrderAfter: string[];
  orderVersionBumped: boolean;
};

/**
 * Sync Neon overrides against live/snapshot catalog:
 * - new active → upsert at END (cover = catalog coverImageUrl on insert only)
 * - concurrent syncs for the same new slug are idempotent (ON CONFLICT, no 500)
 * - reactivated (had override, order NULL) → END (do not restore old position)
 * - deactivated → display_order NULL, keep cover/history (do not delete)
 * - remaining actives → renumber 1..N preserving relative order + staff covers
 * - if staff cover is no longer in allowlist → reset to coverImageUrl
 * - bumps order_version when the active set/order skeleton changes
 */
export async function syncCatalogOverrides(params: {
  db: AppDb;
  snapshotModels: CatalogModelLite[];
  dryRun?: boolean;
  staffUserId?: string | null;
}): Promise<SyncReport> {
  const dryRun = Boolean(params.dryRun);
  const active = params.snapshotModels.filter((m) => m.active !== false);
  const activeSlugSet = new Set(active.map((m) => m.slug));
  const bySlug = new Map(params.snapshotModels.map((m) => [m.slug, m]));
  const existing = await listOverrides(params.db);
  const existingBySlug = new Map(existing.map((r) => [r.slug, r]));

  const deactivated: string[] = [];
  const keptActive: string[] = [];
  const reactivatedAtEnd: string[] = [];
  const added: string[] = [];
  const coversReset: string[] = [];

  for (const row of existing) {
    if (!activeSlugSet.has(row.slug)) {
      deactivated.push(row.slug);
    } else if (row.displayOrder == null) {
      reactivatedAtEnd.push(row.slug);
    } else {
      keptActive.push(row.slug);
    }
  }

  for (const model of active) {
    if (!existingBySlug.has(model.slug)) {
      added.push(model.slug);
    }
  }

  for (const row of existing) {
    if (!activeSlugSet.has(row.slug)) continue;
    const model = bySlug.get(row.slug);
    if (!model) continue;
    const allowed = allowedCoverPaths(model);
    if (!allowed.includes(row.coverImagePath)) {
      coversReset.push(row.slug);
    }
  }

  // Preserve relative order of currently positioned actives, then append reactivated + new
  const keptSorted = existing
    .filter((r) => keptActive.includes(r.slug))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((r) => r.slug);

  const activeOrderAfter = [...keptSorted, ...reactivatedAtEnd, ...added];

  const structuralChange =
    added.length > 0 ||
    reactivatedAtEnd.length > 0 ||
    deactivated.some((slug) => {
      const row = existingBySlug.get(slug);
      return row && row.displayOrder != null;
    });

  if (dryRun) {
    return {
      dryRun: true,
      added,
      keptActive,
      reactivatedAtEnd,
      deactivated,
      coversReset,
      activeOrderAfter,
      orderVersionBumped: structuralChange,
    };
  }

  await params.db.transaction(async (tx) => {
    // 1) Null out everyone first
    for (const row of existing) {
      await tx
        .update(modelOverrides)
        .set({ displayOrder: null, updatedAt: new Date() })
        .where(eq(modelOverrides.slug, row.slug));
    }

    // 2) Ensure brand-new actives exist (idempotent under concurrent syncs).
    // ON CONFLICT: never overwrite staff cover/order — only refresh metadata.
    for (const slug of added) {
      const model = bySlug.get(slug)!;
      const cover = model.coverImageUrl;
      if (!cover) throw new BadRequestError(`active model ${slug} has no coverImageUrl`);
      if (!allowedCoverPaths(model).includes(cover)) {
        throw new BadRequestError(`invalid cover for ${slug}`);
      }
      await tx
        .insert(modelOverrides)
        .values({
          slug,
          displayOrder: null,
          coverImagePath: cover,
          coverVersion: 1,
          updatedBy: params.staffUserId ?? null,
        })
        .onConflictDoUpdate({
          target: modelOverrides.slug,
          set: {
            updatedAt: new Date(),
            updatedBy: params.staffUserId ?? null,
          },
        });
    }

    // 3) Reset covers that left the allowlist (preserve valid staff choices)
    for (const slug of coversReset) {
      const model = bySlug.get(slug)!;
      const cover = model.coverImageUrl;
      if (!cover) throw new BadRequestError(`active model ${slug} has no coverImageUrl`);
      const row = existingBySlug.get(slug)!;
      await tx
        .update(modelOverrides)
        .set({
          coverImagePath: cover,
          coverVersion: row.coverVersion + 1,
          updatedAt: new Date(),
          updatedBy: params.staffUserId ?? null,
        })
        .where(eq(modelOverrides.slug, slug));
    }

    // 4) Assign 1..N to final active order
    let order = 1;
    for (const slug of activeOrderAfter) {
      await tx
        .update(modelOverrides)
        .set({
          displayOrder: order,
          updatedAt: new Date(),
          updatedBy: params.staffUserId ?? null,
        })
        .where(eq(modelOverrides.slug, slug));
      order += 1;
    }

    // deactivated remain NULL (already nulled in step 1)

    if (structuralChange) {
      const metaRows = await tx.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
      const meta = metaRows[0];
      if (meta) {
        await tx
          .update(catalogMeta)
          .set({ orderVersion: meta.orderVersion + 1, updatedAt: new Date() })
          .where(eq(catalogMeta.id, 1));
      }
    }

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId ?? null,
      action: 'catalog.sync',
      before: {
        keptActive,
        deactivated,
      },
      after: {
        added,
        reactivatedAtEnd,
        coversReset,
        activeOrderAfter,
        orderVersionBumped: structuralChange,
      },
    });
  });

  return {
    dryRun: false,
    added,
    keptActive,
    reactivatedAtEnd,
    deactivated,
    coversReset,
    activeOrderAfter,
    orderVersionBumped: structuralChange,
  };
}

/** Initial seed from effective Home order. */
export async function seedOverridesFromEffectiveOrder(params: {
  db: AppDb;
  snapshotModels: CatalogModelLite[];
  dryRun?: boolean;
  force?: boolean;
  staffUserId?: string | null;
}): Promise<{ dryRun: boolean; wrote: number; order: string[] }> {
  const dryRun = Boolean(params.dryRun);
  const order = computeEffectiveHomeOrder(params.snapshotModels);
  const bySlug = new Map(params.snapshotModels.map((m) => [m.slug, m]));
  const existing = await listOverrides(params.db);

  if (existing.length > 0 && !params.force) {
    throw new BadRequestError(
      `model_overrides already has ${existing.length} rows. Use catalog:sync for new models, or --force to re-seed (destructive to display_order).`
    );
  }

  if (dryRun) {
    return { dryRun: true, wrote: order.length, order };
  }

  await params.db.transaction(async (tx) => {
    if (params.force && existing.length > 0) {
      await tx.delete(modelOverrides);
    }

    let i = 1;
    for (const slug of order) {
      const model = bySlug.get(slug)!;
      const cover = model.coverImageUrl;
      if (!cover) throw new BadRequestError(`missing coverImageUrl for ${slug}`);
      await tx.insert(modelOverrides).values({
        slug,
        displayOrder: i,
        coverImagePath: cover,
        coverVersion: 1,
        updatedBy: params.staffUserId ?? null,
      });
      i += 1;
    }

    await tx
      .update(catalogMeta)
      .set({ orderVersion: 1, updatedAt: new Date() })
      .where(eq(catalogMeta.id, 1));

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId ?? null,
      action: 'catalog.seed',
      after: { order },
    });
  });

  return { dryRun: false, wrote: order.length, order };
}

export async function getPublicOverrides(db: AppDb) {
  const version = await getOrderVersion(db);
  const rows = await listActiveOrderedOverrides(db);
  const meta = await db.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
  return {
    orderVersion: version,
    updatedAt: meta[0]?.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    models: rows.map((r) => ({
      slug: r.slug,
      displayOrder: r.displayOrder as number,
      coverImagePath: r.coverImagePath,
    })),
  };
}
