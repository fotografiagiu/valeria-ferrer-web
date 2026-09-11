import { desc } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { auditLog } from '../db/schema.js';

/** Auth + seed noise — not shown in Actividad reciente. */
const EXCLUDED_ACTIONS = new Set([
  'auth.login',
  'auth.logout',
  'auth.login_failed',
  'catalog.seed',
]);

export type ActivityItem = {
  /** Stable id for React keys (`auditId:line`). */
  id: string;
  at: string;
  slug: string | null;
  /** Girl display name, or "Sistema" for automatic bulk events. */
  subject: string;
  summary: string;
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

/**
 * Expand raw audit_log rows into short human-readable activity lines.
 * Does not change how events are written — read-time formatting only.
 */
export function formatActivityItems(
  rows: AuditRow[],
  options?: {
    names?: Map<string, string>;
    limit?: number;
  }
): ActivityItem[] {
  const names = options?.names ?? new Map<string, string>();
  const limit = options?.limit ?? 30;
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
        summary: 'portada cambiada',
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
      changes.sort((a, b) => (a.to ?? 9999) - (b.to ?? 9999));
      for (const change of changes) {
        if (items.length >= limit) break;
        if (change.from != null && change.to != null) {
          push({
            id: `${baseId}:order:${change.slug}`,
            at,
            slug: change.slug,
            subject: displayName(change.slug, names),
            summary: `posición ${change.from} → ${change.to}`,
            automatic,
          });
        } else if (change.to == null && change.from != null) {
          push({
            id: `${baseId}:order-out:${change.slug}`,
            at,
            slug: change.slug,
            subject: displayName(change.slug, names),
            summary: 'sacada del orden',
            automatic,
          });
        } else if (change.from == null && change.to != null) {
          push({
            id: `${baseId}:order-in:${change.slug}`,
            at,
            slug: change.slug,
            subject: displayName(change.slug, names),
            summary: `añadida en posición ${change.to}`,
            automatic,
          });
        }
      }
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
      // `before.deactivated` lists every inactive slug on each sync — too noisy for this feed.
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
  }
): Promise<ActivityItem[]> {
  const limit = Math.min(Math.max(options?.limit ?? 30, 1), 100);
  const rawLimit = Math.min(Math.max(limit * 3, 40), 200);

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
    .orderBy(desc(auditLog.createdAt), desc(auditLog.id))
    .limit(rawLimit);

  return formatActivityItems(rows, { names: options?.names, limit });
}

export { EXCLUDED_ACTIONS };
