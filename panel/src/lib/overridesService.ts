import { asc, eq, isNotNull, sql } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { catalogMeta, modelOverrides } from '../db/schema.js';
import { appendAudit } from './audit.js';
import {
  allowedCoverPaths,
  computeEffectiveHomeOrder,
  type CatalogModelLite,
} from './effectiveOrder.js';
import { validateCoverChange, validateOrderedSlugs } from './validation.js';

type OverrideRow = Awaited<ReturnType<typeof listOverrides>>[number];

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

/** Read-only order version — never inserts catalog_meta. */
export async function readOrderVersion(db: AppDb): Promise<number> {
  const rows = await db.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
  if (!rows[0]) throw new BadRequestError('catalog_meta missing');
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
  /** True only when the ensure transaction performed data writes. */
  wrote: boolean;
  added: string[];
  /** Already active with a position — left untouched */
  keptActive: string[];
  /** Were inactive (NULL order) and are active again → appended at end */
  reactivatedAtEnd: string[];
  /** Now inactive / missing — display_order set to NULL, row kept */
  deactivated: string[];
  /** Staff cover left the allowlist → reset to catalog coverImageUrl */
  coversReset: string[];
  /** Planned active order after ensure (kept relative + appends); may contain gaps in display_order values */
  activeOrderAfter: string[];
  orderVersionBumped: boolean;
};

export type MembershipPlan = {
  added: string[];
  keptActive: string[];
  reactivatedAtEnd: string[];
  deactivated: string[];
  coversReset: string[];
  activeOrderAfter: string[];
  /** Any Neon write needed (structural membership or invalid cover). */
  hasDrift: boolean;
  /** Bumps orderVersion when true (add / reactivate / deactivate-with-order). */
  structuralChange: boolean;
};

/** Pure plan from catalog + override rows. catalogVersion alone never creates drift. */
export function planCatalogMembership(
  snapshotModels: CatalogModelLite[],
  existing: OverrideRow[]
): MembershipPlan {
  const active = snapshotModels.filter((m) => m.active !== false);
  const activeSlugSet = new Set(active.map((m) => m.slug));
  const bySlug = new Map(snapshotModels.map((m) => [m.slug, m]));
  const existingBySlug = new Map(existing.map((r) => [r.slug, r]));

  const deactivated: string[] = [];
  const keptActive: string[] = [];
  const reactivatedAtEnd: string[] = [];
  const added: string[] = [];
  const coversReset: string[] = [];

  for (const row of existing) {
    if (!activeSlugSet.has(row.slug)) {
      if (row.displayOrder != null) deactivated.push(row.slug);
    } else if (row.displayOrder == null) {
      // Staff-removed fichas stay parked even if still active in models.json.
      if (!row.staffHidden) {
        reactivatedAtEnd.push(row.slug);
      }
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
    if (!allowedCoverPaths(model).includes(row.coverImagePath)) {
      coversReset.push(row.slug);
    }
  }

  const keptSorted = existing
    .filter((r) => keptActive.includes(r.slug))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((r) => r.slug);

  const activeOrderAfter = [...keptSorted, ...reactivatedAtEnd, ...added];
  const structuralChange =
    added.length > 0 || reactivatedAtEnd.length > 0 || deactivated.length > 0;
  const hasDrift = structuralChange || coversReset.length > 0;

  return {
    added,
    keptActive,
    reactivatedAtEnd,
    deactivated,
    coversReset,
    activeOrderAfter,
    hasDrift,
    structuralChange,
  };
}

function reportFromPlan(
  plan: MembershipPlan,
  dryRun: boolean,
  wrote: boolean
): SyncReport {
  return {
    dryRun,
    wrote,
    added: plan.added,
    keptActive: plan.keptActive,
    reactivatedAtEnd: plan.reactivatedAtEnd,
    deactivated: plan.deactivated,
    coversReset: plan.coversReset,
    activeOrderAfter: plan.activeOrderAfter,
    orderVersionBumped: wrote && plan.structuralChange,
  };
}

/**
 * Incremental catalog membership ensure (NOT a full order rewrite):
 * - new active → INSERT + display_order = MAX+1
 * - reactivated (NULL order) → MAX+1 (do not restore old position)
 * - deactivated with order → display_order NULL only on that row
 * - kept actives → NEVER touch display_order
 * - invalid cover → reset that row only
 * - no real drift → CERO writes (no transaction)
 * - catalogVersion alone is irrelevant here
 */
export async function ensureCatalogMembership(params: {
  db: AppDb;
  snapshotModels: CatalogModelLite[];
  dryRun?: boolean;
  staffUserId?: string | null;
}): Promise<SyncReport> {
  const dryRun = Boolean(params.dryRun);
  const existing = await listOverrides(params.db);
  const plan = planCatalogMembership(params.snapshotModels, existing);

  if (!plan.hasDrift) {
    return reportFromPlan(plan, dryRun, false);
  }

  if (dryRun) {
    return reportFromPlan(plan, true, false);
  }

  const bySlug = new Map(params.snapshotModels.map((m) => [m.slug, m]));

  let finalPlan = plan;
  let wrote = false;
  let bumped = false;

  await params.db.transaction(async (tx) => {
    // Serialize concurrent ensures so MAX+1 assignments cannot collide.
    await tx.execute(sql`select id from catalog_meta where id = 1 for update`);

    const fresh = await tx.select().from(modelOverrides);
    finalPlan = planCatalogMembership(params.snapshotModels, fresh);
    if (!finalPlan.hasDrift) {
      return;
    }

    wrote = true;
    const freshBySlug = new Map(fresh.map((r) => [r.slug, r]));

    // 1) Deactivate: NULL only those rows (do not renumber others).
    for (const slug of finalPlan.deactivated) {
      await tx
        .update(modelOverrides)
        .set({ displayOrder: null, updatedAt: new Date(), updatedBy: params.staffUserId ?? null })
        .where(eq(modelOverrides.slug, slug));
    }

    // 2) Insert brand-new actives (idempotent). Do not set order yet.
    for (const slug of finalPlan.added) {
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

    // 3) Reset invalid covers row-locally (never touch valid staff covers).
    for (const slug of finalPlan.coversReset) {
      const model = bySlug.get(slug)!;
      const cover = model.coverImageUrl;
      if (!cover) throw new BadRequestError(`active model ${slug} has no coverImageUrl`);
      const row = freshBySlug.get(slug);
      const coverVersion = row ? row.coverVersion + 1 : 1;
      await tx
        .update(modelOverrides)
        .set({
          coverImagePath: cover,
          coverVersion,
          updatedAt: new Date(),
          updatedBy: params.staffUserId ?? null,
        })
        .where(eq(modelOverrides.slug, slug));
    }

    // 4) Append reactivated + newly added at MAX(display_order)+1 without touching kept rows.
    const orderedNow = await tx
      .select()
      .from(modelOverrides)
      .where(isNotNull(modelOverrides.displayOrder));
    let nextOrder =
      orderedNow.reduce((max, r) => Math.max(max, r.displayOrder as number), 0) + 1;

    const toAppend = [...finalPlan.reactivatedAtEnd, ...finalPlan.added];
    for (const slug of toAppend) {
      // Skip if a concurrent ensure already assigned a position.
      const current = (
        await tx.select().from(modelOverrides).where(eq(modelOverrides.slug, slug)).limit(1)
      )[0];
      if (current?.displayOrder != null) continue;

      await tx
        .update(modelOverrides)
        .set({
          displayOrder: nextOrder,
          updatedAt: new Date(),
          updatedBy: params.staffUserId ?? null,
        })
        .where(eq(modelOverrides.slug, slug));
      nextOrder += 1;
    }

    if (finalPlan.structuralChange) {
      const metaRows = await tx.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
      const meta = metaRows[0];
      if (meta) {
        await tx
          .update(catalogMeta)
          .set({ orderVersion: meta.orderVersion + 1, updatedAt: new Date() })
          .where(eq(catalogMeta.id, 1));
        bumped = true;
      }
    }

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId ?? null,
      action: 'catalog.ensure',
      before: {
        keptActive: finalPlan.keptActive,
        deactivated: finalPlan.deactivated,
      },
      after: {
        added: finalPlan.added,
        reactivatedAtEnd: finalPlan.reactivatedAtEnd,
        coversReset: finalPlan.coversReset,
        activeOrderAfter: finalPlan.activeOrderAfter,
        orderVersionBumped: bumped,
      },
    });
  });

  // Recompute activeOrderAfter from DB when we wrote (gaps preserved).
  if (wrote) {
    const afterRows = await listActiveOrderedOverrides(params.db);
    return {
      dryRun: false,
      wrote: true,
      added: finalPlan.added,
      keptActive: finalPlan.keptActive,
      reactivatedAtEnd: finalPlan.reactivatedAtEnd,
      deactivated: finalPlan.deactivated,
      coversReset: finalPlan.coversReset,
      activeOrderAfter: afterRows.map((r) => r.slug),
      orderVersionBumped: bumped,
    };
  }

  return reportFromPlan(finalPlan, false, false);
}

/**
 * @deprecated Prefer ensureCatalogMembership. Kept as an alias for CLI/scripts;
 * no longer performs global null-all + renumber 1..N.
 */
export async function syncCatalogOverrides(params: {
  db: AppDb;
  snapshotModels: CatalogModelLite[];
  dryRun?: boolean;
  staffUserId?: string | null;
}): Promise<SyncReport> {
  return ensureCatalogMembership(params);
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
  const allRows = await listOverrides(db);
  const meta = await db.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
  const hiddenSlugs = allRows
    .filter((r) => r.staffHidden)
    .map((r) => r.slug)
    .sort();
  return {
    orderVersion: version,
    updatedAt: meta[0]?.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    models: rows.map((r) => ({
      slug: r.slug,
      displayOrder: r.displayOrder as number,
      coverImagePath: r.coverImagePath,
    })),
    hiddenSlugs,
  };
}

/**
 * Staff remove: park override (display_order NULL + staff_hidden) so the ficha
 * leaves the panel list and the public web (via hiddenSlugs). Row is kept.
 */
export async function removeModelFromCatalog(params: {
  db: AppDb;
  slug: string;
  version: number;
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ orderVersion: number }> {
  const slug = params.slug.trim();
  if (!slug) throw new BadRequestError('slug required');

  return params.db.transaction(async (tx) => {
    const metaRows = await tx.select().from(catalogMeta).where(eq(catalogMeta.id, 1)).limit(1);
    const meta = metaRows[0];
    if (!meta) throw new BadRequestError('catalog_meta missing');
    if (meta.orderVersion !== params.version) {
      throw new ConflictError(
        `order version conflict: expected ${meta.orderVersion}, got ${params.version}`
      );
    }

    const rows = await tx
      .select()
      .from(modelOverrides)
      .where(eq(modelOverrides.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row) {
      throw new BadRequestError(`override missing for ${slug}; run npm run catalog:sync`);
    }
    if (row.displayOrder == null && row.staffHidden) {
      throw new BadRequestError(`${slug} ya está eliminada del catálogo`);
    }
    if (row.displayOrder == null) {
      throw new BadRequestError(`${slug} no está activa en el catálogo del panel`);
    }

    const before = {
      slug: row.slug,
      displayOrder: row.displayOrder,
      staffHidden: row.staffHidden,
    };

    await tx
      .update(modelOverrides)
      .set({
        displayOrder: null,
        staffHidden: true,
        updatedAt: new Date(),
        updatedBy: params.staffUserId,
      })
      .where(eq(modelOverrides.slug, slug));

    const newVersion = meta.orderVersion + 1;
    await tx
      .update(catalogMeta)
      .set({ orderVersion: newVersion, updatedAt: new Date() })
      .where(eq(catalogMeta.id, 1));

    await appendAudit(tx as unknown as AppDb, {
      staffUserId: params.staffUserId,
      action: 'catalog.remove',
      modelSlug: slug,
      before,
      after: { slug, displayOrder: null, staffHidden: true },
      ip: params.ip,
      userAgent: params.userAgent,
    });

    return { orderVersion: newVersion };
  });
}
