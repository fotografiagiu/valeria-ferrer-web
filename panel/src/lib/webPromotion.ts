import { desc, eq, inArray } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { auditLog, staffUsers, webPromotion } from '../db/schema.js';
import { appendAudit } from './audit.js';

export const PROMOTION_TYPES = ['none', 'copas', 'duples'] as const;
export type PromotionType = (typeof PROMOTION_TYPES)[number];
export type ActivatablePromotion = Exclude<PromotionType, 'none'>;

export const PROMOTION_DURATIONS = [1, 3, 4] as const;
export type PromotionDurationHours = (typeof PROMOTION_DURATIONS)[number];

export type StoredPromotion = {
  activePromotion: PromotionType;
  startsAt: string | null;
  endsAt: string | null;
  durationHours: number | null;
  promoId: string | null;
  updatedAt: string;
  updatedBy: string | null;
};

export type EffectivePromotion = {
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
  return value === 'copas' || value === 'duples';
}

export function isPromotionDurationHours(value: number): value is PromotionDurationHours {
  return (PROMOTION_DURATIONS as readonly number[]).includes(value);
}

/** Effective public state — expired rows read as inactive without writing. */
export function toEffectivePromotion(
  stored: StoredPromotion,
  now = Date.now()
): EffectivePromotion {
  const endsMs = stored.endsAt ? Date.parse(stored.endsAt) : NaN;
  const live =
    stored.activePromotion !== 'none' &&
    Number.isFinite(endsMs) &&
    now < endsMs;

  if (!live) {
    return {
      activePromotion: 'none',
      active: false,
      startsAt: null,
      endsAt: null,
      durationHours: null,
      promoId: null,
      updatedAt: stored.updatedAt,
    };
  }

  return {
    activePromotion: stored.activePromotion,
    active: true,
    startsAt: stored.startsAt,
    endsAt: stored.endsAt,
    durationHours: stored.durationHours,
    promoId: stored.promoId,
    updatedAt: stored.updatedAt,
  };
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
    p === 'copas' ? 'COPAS' : p === 'duples' ? 'DUPLEX' : 'ninguna';
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

export async function activatePromotion(params: {
  db: AppDb;
  promotion: ActivatablePromotion;
  durationHours: PromotionDurationHours;
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
  now?: Date;
}): Promise<{ stored: StoredPromotion; effective: EffectivePromotion }> {
  const now = params.now ?? new Date();
  const ends = new Date(now.getTime() + params.durationHours * 60 * 60 * 1000);
  const promoId = buildPromoId(params.promotion, now);

  const before = await readStoredPromotion(params.db);
  const beforeEffective = toEffectivePromotion(before, now.getTime());

  await params.db
    .update(webPromotion)
    .set({
      activePromotion: params.promotion,
      startsAt: now,
      endsAt: ends,
      durationHours: params.durationHours,
      promoId,
      updatedAt: now,
      updatedBy: params.staffUserId,
    })
    .where(eq(webPromotion.id, 1));

  const after: StoredPromotion = {
    activePromotion: params.promotion,
    startsAt: now.toISOString(),
    endsAt: ends.toISOString(),
    durationHours: params.durationHours,
    promoId,
    updatedAt: now.toISOString(),
    updatedBy: params.staffUserId,
  };

  const replacing =
    beforeEffective.active && beforeEffective.activePromotion !== params.promotion;

  await appendAudit(params.db, {
    staffUserId: params.staffUserId,
    action: replacing ? 'promotion.replace' : 'promotion.activate',
    before: {
      activePromotion: beforeEffective.active
        ? beforeEffective.activePromotion
        : before.activePromotion === 'none'
          ? 'none'
          : before.activePromotion,
      startsAt: before.startsAt,
      endsAt: before.endsAt,
      durationHours: before.durationHours,
      promoId: before.promoId,
    },
    after: {
      activePromotion: after.activePromotion,
      startsAt: after.startsAt,
      endsAt: after.endsAt,
      durationHours: after.durationHours,
      promoId: after.promoId,
    },
    ip: params.ip,
    userAgent: params.userAgent,
  });

  return {
    stored: after,
    effective: toEffectivePromotion(after, now.getTime()),
  };
}

export async function deactivatePromotion(params: {
  db: AppDb;
  staffUserId: string;
  ip?: string | null;
  userAgent?: string | null;
  now?: Date;
}): Promise<{ stored: StoredPromotion; effective: EffectivePromotion }> {
  const now = params.now ?? new Date();
  const before = await readStoredPromotion(params.db);
  const beforeEffective = toEffectivePromotion(before, now.getTime());

  await params.db
    .update(webPromotion)
    .set({
      activePromotion: 'none',
      startsAt: null,
      endsAt: null,
      durationHours: null,
      promoId: null,
      updatedAt: now,
      updatedBy: params.staffUserId,
    })
    .where(eq(webPromotion.id, 1));

  const after: StoredPromotion = {
    activePromotion: 'none',
    startsAt: null,
    endsAt: null,
    durationHours: null,
    promoId: null,
    updatedAt: now.toISOString(),
    updatedBy: params.staffUserId,
  };

  await appendAudit(params.db, {
    staffUserId: params.staffUserId,
    action: 'promotion.deactivate',
    before: {
      activePromotion: beforeEffective.active
        ? beforeEffective.activePromotion
        : before.activePromotion,
      startsAt: before.startsAt,
      endsAt: before.endsAt,
      durationHours: before.durationHours,
      promoId: before.promoId,
    },
    after: {
      activePromotion: 'none',
      startsAt: null,
      endsAt: null,
      durationHours: null,
      promoId: null,
    },
    ip: params.ip,
    userAgent: params.userAgent,
  });

  return {
    stored: after,
    effective: toEffectivePromotion(after, now.getTime()),
  };
}
