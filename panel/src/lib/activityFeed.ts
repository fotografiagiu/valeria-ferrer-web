import { and, desc, gte } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { auditLog } from '../db/schema.js';

/** Auth + seed noise — not shown in Actividad reciente. */
export const EXCLUDED_ACTIONS = new Set([
  'auth.login',
  'auth.logout',
  'auth.login_failed',
  'catalog.seed',
]);

/** UI window for Actividad reciente (audit_log rows older than this stay in DB). */
export const ACTIVITY_WINDOW_MS = 24 * 60 * 60 * 1000;

const ORDER_DETAIL_PREVIEW = 3;

export type ActivityItem = {
  /** Stable id for React keys. */
  id: string;
  at: string;
  slug: string | null;
  /** Short title: girl name, "Orden de fichas", or "Sistema". */
  subject: string;
  summary: string;
  /** Optional compact lines under the summary (order diffs). */
  details?: string[];
  automatic: boolean;
};

type AuditRow = {
  id: number;
  createdAt: Date;
  action: string;
  modelSlug: string | null;
  staffUserId: string | null;
  before: unknown;
  after: unknown;
};

type OrderEntry = { slug?: unknown; displayOrder?: unknown };

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function orderMap(value: unknown): Map<string, number> {
  const map = new Map<string, number>();
  if (!Array.isArray(value)) return map;
  for (const item of value as OrderEntry[]) {
    if (!item || typeof item.slug !== 'string') continue;
    const order = item.displayOrder;
    if (typeof order !== 'number' || !Number.isFinite(order)) continue;
    map.set(item.slug, order);
  }
  return map;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

function displayName(slug: string, names: Map<string, string>): string {
  return names.get(slug) || slug;
}

function formatOrderChangeLine(
  change: { slug: string; from: number | null; to: number | null },
  names: Map<string, string>
): string {
  const name = displayName(change.slug, names);
  if (change.from != null && change.to != null) return `${name} ${change.from} → ${change.to}`;
  if (change.to == null && change.from != null) return `${name} sacada del orden`;
  if (change.from == null && change.to != null) return `${name} añadida en ${change.to}`;
  return name;
}

/**
 * Expand raw audit_log rows into short human-readable activity cards.
 * Does not change how events are written — read-time formatting only.
 * One GUARDAR ORDEN → one card (not one line per girl).
 */
export function formatActivityItems(
  rows: AuditRow[],
  options?: {
    names?: Map<string, string>;
    limit?: number;
  }
): ActivityItem[] {
  const names = options?.names ?? new Map<string, string>();
  const limit = options?.limit ?? 40;
  const items: ActivityItem[] = [];

  for (const row of rows) {
    if (EXCLUDED_ACTIONS.has(row.action)) continue;
    const at = row.createdAt.toISOString();
    const automatic = row.staffUserId == null;
    const baseId = String(row.id);
    const push = (item: ActivityItem) => {
      if (items.length < limit) items.push(item);
    };

    if (row.action === 'cover.update') {
      const slug = row.modelSlug;
      if (!slug) continue;
      push({
        id: `${baseId}:cover`,
        at,
        slug,
        subject: displayName(slug, names),
        summary: 'portada actualizada',
        automatic,
      });
    } else if (row.action === 'order.replace') {
      const before = orderMap(row.before);
      const after = orderMap(row.after);
      const slugs = new Set([...before.keys(), ...after.keys()]);
      const changes: Array<{ slug: string; from: number | null; to: number | null }> = [];
      for (const slug of slugs) {
        const from = before.has(slug) ? (before.get(slug) as number) : null;
        const to = after.has(slug) ? (after.get(slug) as number) : null;
        if (from === to) continue;
        changes.push({ slug, from, to });
      }
      if (changes.length === 0) continue;
      changes.sort((a, b) => (a.to ?? 9999) - (b.to ?? 9999));

      const details: string[] = [];
      const preview = changes.slice(0, ORDER_DETAIL_PREVIEW);
      for (const change of preview) {
        details.push(formatOrderChangeLine(change, names));
      }
      const remaining = changes.length - preview.length;
      if (remaining > 0) {
        details.push(`+ ${remaining} cambio${remaining === 1 ? '' : 's'} más`);
      }

      push({
        id: `${baseId}:order`,
        at,
        slug: null,
        subject: 'Orden de fichas',
        summary:
          changes.length === 1
            ? details[0] ?? '1 posición modificada'
            : `${changes.length} posiciones modificadas`,
        details: changes.length > 1 ? details : undefined,
        automatic,
      });
    } else if (row.action === 'catalog.sync') {
      const after = asRecord(row.after);
      const added = stringList(after?.added);
      const reactivated = stringList(after?.reactivatedAtEnd);
      const coversReset = stringList(after?.coversReset);

      for (const slug of added) {
        push({
          id: `${baseId}:add:${slug}`,
          at,
          slug,
          subject: 'Sistema',
          summary: `${displayName(slug, names)} añadida desde la web`,
          automatic: true,
        });
      }
      for (const slug of reactivated) {
        push({
          id: `${baseId}:react:${slug}`,
          at,
          slug,
          subject: displayName(slug, names),
          summary: 'reactivada (al final del orden)',
          automatic: true,
        });
      }
      for (const slug of coversReset) {
        push({
          id: `${baseId}:cover-reset:${slug}`,
          at,
          slug,
          subject: displayName(slug, names),
          summary: 'portada restablecida (ya no válida)',
          automatic: true,
        });
      }
    }

    if (items.length >= limit) break;
  }

  return items;
}

export async function listRecentActivity(
  db: AppDb,
  options?: {
    limit?: number;
    names?: Map<string, string>;
    /** Inclusive lower bound; defaults to now − 24h. */
    since?: Date;
    now?: Date;
  }
): Promise<ActivityItem[]> {
  const limit = Math.min(Math.max(options?.limit ?? 40, 1), 100);
  const now = options?.now ?? new Date();
  const since = options?.since ?? new Date(now.getTime() - ACTIVITY_WINDOW_MS);
  // Enough raw rows for sync/auth noise within the window; formatting collapses order events.
  const rawLimit = Math.min(Math.max(limit * 2, 40), 120);

  const rows = await db
    .select({
      id: auditLog.id,
      createdAt: auditLog.createdAt,
      action: auditLog.action,
      modelSlug: auditLog.modelSlug,
      staffUserId: auditLog.staffUserId,
      before: auditLog.before,
      after: auditLog.after,
    })
    .from(auditLog)
    .where(and(gte(auditLog.createdAt, since)))
    .orderBy(desc(auditLog.createdAt), desc(auditLog.id))
    .limit(rawLimit);

  return formatActivityItems(rows, { names: options?.names, limit });
}
