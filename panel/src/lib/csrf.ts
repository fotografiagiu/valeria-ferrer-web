import type { Context } from 'hono';
import type { PanelEnv } from './env.js';

/** Staff write endpoints: Origin must match PANEL_ORIGIN (same-origin panel ↔ API). */
export function assertStaffWriteOrigin(
  c: Context,
  env: PanelEnv
): { ok: true } | { ok: false; status: 403; error: string } {
  const origin = c.req.header('origin');
  const referer = c.req.header('referer');

  if (origin) {
    if (origin.replace(/\/$/, '') !== env.panelOrigin) {
      return { ok: false, status: 403, error: 'invalid origin' };
    }
    return { ok: true };
  }

  // Some clients omit Origin on same-site navigations; accept Referer as fallback.
  if (referer && referer.startsWith(`${env.panelOrigin}/`)) {
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
