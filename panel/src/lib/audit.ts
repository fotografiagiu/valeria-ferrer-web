import type { AppDb } from '../db/client.js';
import { auditLog } from '../db/schema.js';

export type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'order.replace'
  | 'cover.update'
  | 'gallery.reorder'
  | 'catalog.sync'
  | 'catalog.ensure'
  | 'catalog.seed'
  | 'catalog.remove'
  | 'promotion.activate'
  | 'promotion.deactivate'
  | 'promotion.replace';

export async function appendAudit(
  db: AppDb,
  entry: {
    staffUserId?: string | null;
    action: AuditAction;
    modelSlug?: string | null;
    before?: unknown;
    after?: unknown;
    ip?: string | null;
    userAgent?: string | null;
  }
): Promise<void> {
  await db.insert(auditLog).values({
    staffUserId: entry.staffUserId ?? null,
    action: entry.action,
    modelSlug: entry.modelSlug ?? null,
    before: entry.before ?? null,
    after: entry.after ?? null,
    ip: entry.ip ?? null,
    userAgent: entry.userAgent ?? null,
  });
}
