import type { Context } from 'hono';
import type { PanelEnv } from './env.js';

function originAllowed(origin: string, allowed: readonly string[]): boolean {
  const normalized = origin.replace(/\/$/, '');
  return allowed.includes(normalized);
}

function refererAllowed(referer: string, allowed: readonly string[]): boolean {
  return allowed.some((origin) => referer.startsWith(`${origin}/`) || referer === origin);
}

/**
 * Staff write endpoints: Origin/Referer must match an allowed staff origin.
 * Allowed = PANEL_ORIGIN ∪ https://$VERCEL_URL ∪ https://$VERCEL_BRANCH_URL (when set).
 * No wildcard *.vercel.app — Preview stays same-deployment only.
 */
export function assertStaffWriteOrigin(
  c: Context,
  env: PanelEnv
): { ok: true } | { ok: false; status: 403; error: string } {
  const origin = c.req.header('origin');
  const referer = c.req.header('referer');
  const allowed = env.staffWriteOrigins;

  if (origin) {
    if (!originAllowed(origin, allowed)) {
      return { ok: false, status: 403, error: 'invalid origin' };
    }
    return { ok: true };
  }

  if (referer && refererAllowed(referer, allowed)) {
    return { ok: true };
  }

  // Local curl/tests: allow missing Origin when not in production.
  if (!env.isProd) {
    return { ok: true };
  }

  return { ok: false, status: 403, error: 'missing origin' };
}

export function corsHeadersForPublicOverrides(
  requestOrigin: string | undefined,
  env: PanelEnv
): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=30',
  };
  if (requestOrigin && env.publicWebOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}
