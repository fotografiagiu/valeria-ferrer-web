import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt } from 'drizzle-orm';
import type { AppDb } from '../db/client.js';
import { staffSessions, staffUsers } from '../db/schema.js';
import type { PanelEnv } from './env.js';

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export type StaffIdentity = {
  id: string;
  username: string;
  displayName: string;
  sessionId: string;
};

export async function createSession(
  db: AppDb,
  staffUserId: string,
  env: PanelEnv,
  meta: { ip?: string | null; userAgent?: string | null }
): Promise<{ token: string; expiresAt: Date }> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000);

  await db.insert(staffSessions).values({
    staffUserId,
    tokenHash,
    expiresAt,
    ip: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  });

  return { token, expiresAt };
}

export async function revokeSessionByToken(db: AppDb, token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await db.delete(staffSessions).where(eq(staffSessions.tokenHash, tokenHash));
}

export async function resolveSession(
  db: AppDb,
  token: string | undefined
): Promise<StaffIdentity | null> {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  const rows = await db
    .select({
      sessionId: staffSessions.id,
      staffUserId: staffSessions.staffUserId,
      username: staffUsers.username,
      displayName: staffUsers.displayName,
      isActive: staffUsers.isActive,
    })
    .from(staffSessions)
    .innerJoin(staffUsers, eq(staffSessions.staffUserId, staffUsers.id))
    .where(and(eq(staffSessions.tokenHash, tokenHash), gt(staffSessions.expiresAt, now)))
    .limit(1);

  const row = rows[0];
  if (!row || !row.isActive) return null;

  return {
    id: row.staffUserId,
    username: row.username,
    displayName: row.displayName,
    sessionId: row.sessionId,
  };
}

export function buildSessionCookie(
  env: PanelEnv,
  token: string,
  expiresAt: Date
): string {
  const parts = [
    `${env.cookieName}=${token}`,
    'Path=/',
    'HttpOnly',
    `SameSite=Lax`,
    `Expires=${expiresAt.toUTCString()}`,
  ];
  if (env.isProd) parts.push('Secure');
  return parts.join('; ');
}

export function buildClearSessionCookie(env: PanelEnv): string {
  const parts = [
    `${env.cookieName}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];
  if (env.isProd) parts.push('Secure');
  return parts.join('; ');
}

export function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}
