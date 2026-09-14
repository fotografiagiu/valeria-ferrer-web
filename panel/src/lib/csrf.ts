import type { Context } from 'hono';
import type { PanelEnv } from './env.js';

function originAllowed(origin: string, allowed: readonly string[]): boolean {
  const normalized = origin.replace(/\/$/, '');
  return allowed.includes(normalized);
}

function refererAllowed(referer: string, allowed: readonly string[]): boolean {
  return allowed.some((origin) => referer.startsWith(`${origin}/`) || referer === origin);
}

function requestDeploymentOrigin(c: Context): string | null {
  const host = (c.req.header('x-forwarded-host') || c.req.header('host') || '')
    .split(',')[0]
    .trim();
  if (!host) return null;
  const proto = (c.req.header('x-forwarded-proto') || 'https').split(',')[0].trim() || 'https';
  return `${proto}://${host}`;
}

/**
 * Staff write endpoints: Origin/Referer must match an allowed staff origin.
 * Allowed = PANEL_ORIGIN ∪ https://$VERCEL_URL ∪ https://$VERCEL_BRANCH_URL
 * ∪ this deployment's own Host (so preview/custom aliases keep working).
 * No wildcard *.vercel.app.
 */
export function assertStaffWriteOrigin(
  c: Context,
  env: PanelEnv
): { ok: true } | { ok: false; status: 403; error: string } {
  const origin = c.req.header('origin');
  const referer = c.req.header('referer');
  const allowed = [...env.staffWriteOrigins];
  const deploymentOrigin = requestDeploymentOrigin(c);
  if (deploymentOrigin) allowed.push(deploymentOrigin);

  // Opaque "null" Origin (some installed WebViews) is not a real site origin.
  if (origin && origin !== 'null') {
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

  // Some mobile WebViews omit Origin on same-site PUT. If this request is aimed
  // at our own Host and carries a session cookie, treat it as same-site.
  if (deploymentOrigin && c.req.header('cookie')) {
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
