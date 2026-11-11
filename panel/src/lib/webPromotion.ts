import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { auditLog, staffUsers, webPromotion } from '../db/schema.js';
import { appendAudit } from './audit.js';

export const PROMOTION_TYPES = ['none', 'copas', 'duples', 'salidas', 'cash5'] as const;
export type PromotionType = (typeof PROMOTION_TYPES)[number];
export type ActivatablePromotion = Exclude<PromotionType, 'none'>;

export const PROMOTION_DURATIONS = [1, 3, 4] as const;
export type PromotionDurationHours = (typeof PROMOTION_DURATIONS)[number];

export type StoredPromoSlot = {
  activePromotion: ActivatablePromotion;
  startsAt: string;
  endsAt: string;
  durationHours: number;
  promoId: string;
};

export type StoredPromotion = {
  activePromotion: PromotionType;
  startsAt: string | null;
  endsAt: string | null;
  durationHours: number | null;
  promoId: string | null;
  secondaryPromotion?: StoredPromoSlot | null;
  revision?: number;
  updatedAt: string;
  updatedBy: string | null;
};

export type EffectivePromotion = {
  /** Both live slots; legacy fields reflect the first live slot. */
  promotions: StoredPromoSlot[];
  activePromotion: PromotionType;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  durationHours: number | null;
  promoId: string | null;
  updatedAt: string;
};

export type PromotionHistoryItem = {
  at: string;
  actor: string | null;
  action: string;
  promotion: PromotionType | null;
  previousPromotion: PromotionType | null;
  durationHours: number | null;
  endsAt: string | null;
  summary: string;
};

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toISOString();
}

export function isActivatablePromotion(value: string): value is ActivatablePromotion {
  return value === 'copas' || value === 'duples' || value === 'salidas' || value === 'cash5';
}

export function isPromotionDurationHours(value: number): value is PromotionDurationHours {
  return (PROMOTION_DURATIONS as readonly number[]).includes(value);
}

/** Effective public state: two independent expiry windows; never mutates DB. */
export function toEffectivePromotion(stored: StoredPromotion, now = Date.now()): EffectivePromotion {
  const primary: StoredPromoSlot | null =
    stored.activePromotion !== 'none' && stored.startsAt && stored.endsAt &&
    stored.durationHours && stored.promoId
      ? { activePromotion: stored.activePromotion, startsAt: stored.startsAt,
          endsAt: stored.endsAt, durationHours: stored.durationHours, promoId: stored.promoId }
      : null;
  const isLive = (p: StoredPromoSlot | null): p is StoredPromoSlot => {
    if (!p || !isActivatablePromotion(p.activePromotion)) return false;
    const begins = Date.parse(p.startsAt), expires = Date.parse(p.endsAt);
    return Number.isFinite(begins) && Number.isFinite(expires) &&
      begins <= now && expires > now && expires > begins;
  };
  const promotions = [primary, stored.secondaryPromotion ?? null]
    .filter(isLive)
    .filter((p, index, all) => all.findIndex(x => x.activePromotion === p.activePromotion) === index)
    .slice(0, 2);
  const first = promotions[0];
  return {
    promotions,
    activePromotion: first?.activePromotion ?? 'none',
    active: Boolean(first),
    startsAt: first?.startsAt ?? null,
    endsAt: first?.endsAt ?? null,
    durationHours: first?.durationHours ?? null,
    promoId: first?.promoId ?? null,
    updatedAt: stored.updatedAt,
  };
}

export class PromotionSlotsFullError extends Error {
  constructor() {
    super('Ya hay dos publicidades activas. Desactiva una antes de activar otra.');
    this.name = 'PromotionSlotsFullError';
  }
}

export class PromotionConcurrentUpdateError extends Error {
  constructor() {
    super('Otro usuario ha actualizado la publicidad. Recarga e inténtalo de nuevo.');
    this.name = 'PromotionConcurrentUpdateError';
  }
}

export function buildPromoId(promotion: ActivatablePromotion, startsAt: Date): string {
  return `${promotion}-${startsAt.toISOString()}`;
}

async function ensureRow(db: AppDb): Promise<void> {
  await db
    .insert(webPromotion)
    .values({ id: 1, activePromotion: 'none' })
    .onConflictDoNothing({ target: webPromotion.id });
}

export async function readStoredPromotion(db: AppDb): Promise<StoredPromotion> {
  await ensureRow(db);
  const rows = await db.select().from(webPromotion).where(eq(webPromotion.id, 1)).limit(1);
  const row = rows[0];
  if (!row) {
    return {
      activePromotion: 'none',
      startsAt: null,
      endsAt: null,
      durationHours: null,
      promoId: null,
      secondaryPromotion: null,
      revision: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: null,
    };
  }
  return {
    activePromotion: row.activePromotion as PromotionType,
    startsAt: iso(row.startsAt),
    endsAt: iso(row.endsAt),
    durationHours: row.durationHours,
    promoId: row.promoId,
    secondaryPromotion: row.secondaryPromotion ?? null,
    revision: row.revision,
    updatedAt: iso(row.updatedAt) ?? new Date().toISOString(),
    updatedBy: row.updatedBy,
  };
}

export async function getPublicPromotion(
  db: AppDb,
  now = Date.now()
): Promise<EffectivePromotion> {
  const stored = await readStoredPromotion(db);
  return toEffectivePromotion(stored, now);
}

export async function getStaffPromotionState(db: AppDb, now = Date.now()) {
  const stored = await readStoredPromotion(db);
  const effective = toEffectivePromotion(stored, now);
  const history = await listPromotionHistory(db, 20);
  return { stored, effective, history };
}

function historySummary(params: {
  action: string;
  promotion: PromotionType | null;
  previous: PromotionType | null;
  durationHours: number | null;
  endsAt: string | null;
}): string {
  const label = (p: PromotionType | null) =>
    p === 'copas' ? 'COPAS' : p === 'duples' ? 'DUPLEX' : p === 'salidas' ? 'SALIDAS VIP' : p === 'cash5' ? '−5 € EFECTIVO' : 'ninguna';
  const ends =
    params.endsAt != null
      ? new Date(params.endsAt).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : null;

  if (params.action === 'promotion.deactivate') {
    return `Desactivó ${label(params.previous)}`;
  }
  if (
    params.action === 'promotion.replace' &&
    params.previous &&
    params.previous !== 'none' &&
    params.promotion
  ) {
    return `${label(params.previous)} → ${label(params.promotion)}${
      params.durationHours ? ` · ${params.durationHours}h` : ''
    }${ends ? ` · Finaliza ${ends}` : ''}`;
  }
  if (params.action === 'promotion.activate' && params.promotion) {
    return `Activó ${label(params.promotion)}${
      params.durationHours ? ` · ${params.durationHours}h` : ''
    }${ends ? ` · Finaliza ${ends}` : ''}`;
  }
  return params.action;
}

export async function listPromotionHistory(
  db: AppDb,
  limit = 20
): Promise<PromotionHistoryItem[]> {
  const rows = await db
    .select({
      id: auditLog.id,
      createdAt: auditLog.createdAt,
      action: auditLog.action,
      before: auditLog.before,
      after: auditLog.after,
      staffUserId: auditLog.staffUserId,
      displayName: staffUsers.displayName,
    })
    .from(auditLog)
    .leftJoin(staffUsers, eq(auditLog.staffUserId, staffUsers.id))
    .where(
      inArray(auditLog.action, [
        'promotion.activate',
        'promotion.deactivate',
        'promotion.replace',
      ])
    )
    .orderBy(desc(auditLog.createdAt))
    .limit(Math.min(Math.max(limit, 1), 50));

  return rows.map((row) => {
    const before = (row.before ?? {}) as Record<string, unknown>;
    const after = (row.after ?? {}) as Record<string, unknown>;
    const promotion =
      typeof after.activePromotion === 'string'
        ? (after.activePromotion as PromotionType)
        : null;
    const previous =
      typeof before.activePromotion === 'string'
        ? (before.activePromotion as PromotionType)
        : null;
    const durationHours =
      typeof after.durationHours === 'number' ? after.durationHours : null;
    const endsAt = typeof after.endsAt === 'string' ? after.endsAt : null;
    return {
      at: iso(row.createdAt) ?? new Date().toISOString(),
      actor: row.displayName ?? null,
      action: row.action,
      promotion,
      previousPromotion: previous,
      durationHours,
      endsAt,
      summary: historySummary({
        action: row.action,
        promotion,
        previous,
        durationHours,
        endsAt,
      }),
    };
  });
}

/**
 * The panel's database predates cash5. Upgrade the allowlist only on the first
 * authenticated cash5 activation; PostgreSQL DDL is idempotent and does not
 * alter any live promotion or audit records.
 * The dedicated 0006 migration should also be run by normal DB deployments.
 */
async function ensureCash5Allowed(db: AppDb): Promise<void> {
  await db.execute(sql.raw(`DO $upgrade$
DECLARE cname text;
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint
   WHERE conrelid = 'public.web_promotion'::regclass AND contype = 'c'
     AND pg_get_constraintdef(oid) ILIKE '%active_promotion%'
     AND pg_get_constraintdef(oid) ILIKE '%cash5%'
 ) THEN
   FOR cname IN
     SELECT conname FROM pg_constraint
     WHERE conrelid = 'public.web_promotion'::regclass AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%active_promotion%'
       AND pg_get_constraintdef(oid) NOT ILIKE '%id = 1%'
   LOOP
     EXECUTE format('ALTER TABLE public.web_promotion DROP CONSTRAINT %I', cname);
   END LOOP;
   ALTER TABLE public.web_promotion
     ADD CONSTRAINT web_promotion_active_promotion_check
     CHECK (active_promotion IN ('none','copas','duples','salidas','cash5'));
 END IF;
END $upgrade$;`))
}

/** Add or renew a campaign. Never replace a different live campaign automatically. */
export async function activatePromotion(params: {
  db: AppDb;
  promotion: ActivatablePromotion;
  durationHours: PromotionDurationHours;
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
  now?: Date;
}): Promise<{ stored: StoredPromotion; effective: EffectivePromotion }> {
  if (params.promotion === 'cash5') await ensureCash5Allowed(params.db);
  const now = params.now ?? new Date();
  const ends = new Date(now.getTime() + params.durationHours * 60 * 60 * 1000);
  const nextSlot: StoredPromoSlot = {
    activePromotion: params.promotion,
    startsAt: now.toISOString(),
    endsAt: ends.toISOString(),
    durationHours: params.durationHours,
    promoId: buildPromoId(params.promotion, now),
  };
  const before = await readStoredPromotion(params.db);
  const effective = toEffectivePromotion(before, now.getTime());
  const current = effective.promotions;
  const isPrimaryLive = current.some(p => p.activePromotion === before.activePromotion &&
    p.promoId === before.promoId);
  const isSecondaryLive = current.some(p => p.promoId === before.secondaryPromotion?.promoId);
  const isRenewPrimary = isPrimaryLive && before.activePromotion === params.promotion;
  const isRenewSecond = isSecondaryLive &&
    before.secondaryPromotion?.activePromotion === params.promotion;
  if (!isRenewPrimary && !isRenewSecond && current.length >= 2) {
    throw new PromotionSlotsFullError();
  }
  const usePrimary = isRenewPrimary || (!isRenewSecond && !isPrimaryLive);
  const primary = usePrimary ? nextSlot : (
    before.activePromotion !== 'none' && before.startsAt && before.endsAt &&
    before.durationHours && before.promoId
      ? {
          activePromotion: before.activePromotion,
          startsAt: before.startsAt,
          endsAt: before.endsAt,
          durationHours: before.durationHours,
          promoId: before.promoId,
        } satisfies StoredPromoSlot
      : null
  );
  const secondary = usePrimary ? before.secondaryPromotion ?? null : nextSlot;
  const [updated] = await params.db.update(webPromotion).set({
    activePromotion: primary?.activePromotion ?? 'none',
    startsAt: primary ? new Date(primary.startsAt) : null,
    endsAt: primary ? new Date(primary.endsAt) : null,
    durationHours: primary?.durationHours ?? null,
    promoId: primary?.promoId ?? null,
    secondaryPromotion: secondary,
    revision: sql`${webPromotion.revision} + 1`,
    updatedAt: now,
    updatedBy: params.staffUserId,
  }).where(and(eq(webPromotion.id, 1),
    eq(webPromotion.revision, before.revision ?? 1))).returning({ revision: webPromotion.revision });
  if (!updated) throw new PromotionConcurrentUpdateError();
  const after: StoredPromotion = {
    activePromotion: primary?.activePromotion ?? 'none',
    startsAt: primary?.startsAt ?? null,
    endsAt: primary?.endsAt ?? null,
    durationHours: primary?.durationHours ?? null,
    promoId: primary?.promoId ?? null,
    secondaryPromotion: secondary,
    revision: updated.revision,
    updatedAt: now.toISOString(),
    updatedBy: params.staffUserId,
  };
  const previous = current.find(p => p.activePromotion === params.promotion);
  await appendAudit(params.db, {
    staffUserId: params.staffUserId,
    action: previous ? 'promotion.replace' : 'promotion.activate',
    before: {
      activePromotion: previous?.activePromotion ?? 'none',
      startsAt: previous?.startsAt ?? null,
      endsAt: previous?.endsAt ?? null,
      durationHours: previous?.durationHours ?? null,
      promoId: previous?.promoId ?? null,
    },
    after: {
      activePromotion: params.promotion,
      startsAt: nextSlot.startsAt,
      endsAt: nextSlot.endsAt,
      durationHours: nextSlot.durationHours,
      promoId: nextSlot.promoId,
    },
    ip: params.ip,
    userAgent: params.userAgent,
  });
  return { stored: after, effective: toEffectivePromotion(after, now.getTime()) };
}

/** Turn off one selected campaign or all (legacy action with no promotion). */
export async function deactivatePromotion(params: {
  db: AppDb;
  promotion?: ActivatablePromotion;
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
  now?: Date;
}): Promise<{ stored: StoredPromotion; effective: EffectivePromotion }> {
  const now = params.now ?? new Date();
  const before = await readStoredPromotion(params.db);
  const current = toEffectivePromotion(before, now.getTime()).promotions;
  const removed = params.promotion
    ? current.find(p => p.activePromotion === params.promotion)
    : current[0];
  const keepPrimary = params.promotion != null &&
    before.activePromotion !== params.promotion;
  const keepSecondary = params.promotion != null &&
    before.secondaryPromotion?.activePromotion !== params.promotion;
  const primary = keepPrimary && before.activePromotion !== 'none' &&
    before.startsAt && before.endsAt && before.durationHours && before.promoId
      ? {
          activePromotion: before.activePromotion, startsAt: before.startsAt,
          endsAt: before.endsAt, durationHours: before.durationHours,
          promoId: before.promoId,
        } satisfies StoredPromoSlot
      : null;
  const secondary = keepSecondary ? before.secondaryPromotion ?? null : null;
  const [updated] = await params.db.update(webPromotion).set({
    activePromotion: primary?.activePromotion ?? 'none',
    startsAt: primary ? new Date(primary.startsAt) : null,
    endsAt: primary ? new Date(primary.endsAt) : null,
    durationHours: primary?.durationHours ?? null,
    promoId: primary?.promoId ?? null,
    secondaryPromotion: secondary,
    revision: sql`${webPromotion.revision} + 1`,
    updatedAt: now,
    updatedBy: params.staffUserId,
  }).where(and(eq(webPromotion.id, 1),
    eq(webPromotion.revision, before.revision ?? 1))).returning({ revision: webPromotion.revision });
  if (!updated) throw new PromotionConcurrentUpdateError();
  const after: StoredPromotion = {
    activePromotion: primary?.activePromotion ?? 'none',
    startsAt: primary?.startsAt ?? null,
    endsAt: primary?.endsAt ?? null,
    durationHours: primary?.durationHours ?? null,
    promoId: primary?.promoId ?? null,
    secondaryPromotion: secondary,
    revision: updated.revision,
    updatedAt: now.toISOString(),
    updatedBy: params.staffUserId,
  };
  await appendAudit(params.db, {
    staffUserId: params.staffUserId,
    action: 'promotion.deactivate',
    before: {
      activePromotion: removed?.activePromotion ?? 'none',
      startsAt: removed?.startsAt ?? null,
      endsAt: removed?.endsAt ?? null,
      durationHours: removed?.durationHours ?? null,
      promoId: removed?.promoId ?? null,
    },
    after: { activePromotion: 'none', startsAt: null, endsAt: null,
      durationHours: null, promoId: null },
    ip: params.ip,
    userAgent: params.userAgent,
  });
  return { stored: after, effective: toEffectivePromotion(after, now.getTime()) };
}
