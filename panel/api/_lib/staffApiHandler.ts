import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../../src/app.js';
import { getDb } from '../../src/db/client.js';
import { loadEnv } from '../../src/lib/env.js';

/** Never let a stalled request reach the platform gateway timeout. */
const HANDLER_TIMEOUT_MS = 20_000;

const UNAUTH_FAST_PATHS = new Set([
  '/api/staff/me',
  '/api/staff/catalog',
  '/api/staff/activity',
]);

let cachedApp: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!cachedApp) {
    cachedApp = createApp({ db: getDb(), env: loadEnv() });
  }
  return cachedApp;
}

function cookieName(): string {
  return process.env.STAFF_COOKIE_NAME || 'vf_staff_session';
}

/** True when a non-empty staff session cookie is present (no DB). */
function hasStaffSessionCookie(cookieHeader: string | string[] | undefined): boolean {
  const joined = cookieHeaderFrom(cookieHeader);
  if (!joined) return false;
  const name = cookieName();
  for (const part of joined.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === name && rest.join('=').length > 0) return true;
  }
  return false;
}

/**
 * Vercel's Node runtime reads the request body before the handler runs, so
 * adapters that re-stream `req` (hono/vercel, @hono/node-server) wait forever
 * for an "end" event that never arrives and every POST/PUT hangs. Rebuild the
 * body from the value Vercel already parsed instead.
 */
function bodyFrom(req: VercelRequest): string | Buffer | undefined {
  const method = (req.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD') return undefined;

  const parsed: unknown = req.body;
  if (parsed === undefined || parsed === null) return undefined;
  if (typeof parsed === 'string') return parsed;
  if (Buffer.isBuffer(parsed)) return parsed;
  return JSON.stringify(parsed);
}

function cookieHeaderFrom(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value) && value.length > 0) {
    return value.filter((v) => typeof v === 'string' && v.trim()).join('; ');
  }
  return undefined;
}

function toWebRequest(req: VercelRequest): Request {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost');
  const url = new URL(req.url || '/', `${proto}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    // Length/encoding describe the original stream, not the rebuilt body.
    if (lower === 'content-length' || lower === 'transfer-encoding') continue;
    if (lower === 'cookie') {
      const joined = cookieHeaderFrom(value as string | string[] | undefined);
      if (joined) headers.set('cookie', joined);
      continue;
    }
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const body = bodyFrom(req);
  return new Request(url, {
    method: (req.method || 'GET').toUpperCase(),
    headers,
    ...(body === undefined ? {} : { body }),
  });
}

async function sendWebResponse(res: VercelResponse, webRes: Response): Promise<void> {
  const setCookies =
    typeof (webRes.headers as { getSetCookie?: () => string[] }).getSetCookie === 'function'
      ? (webRes.headers as { getSetCookie: () => string[] }).getSetCookie()
      : [];

  webRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return;
    res.setHeader(key, value);
  });

  if (setCookies.length > 0) {
    res.setHeader('Set-Cookie', setCookies);
  } else {
    // Fallback when getSetCookie() is empty but Set-Cookie exists as a single header.
    const single = webRes.headers.get('set-cookie');
    if (single) res.setHeader('Set-Cookie', single);
  }

  res.status(webRes.status);
  const buffer = Buffer.from(await webRes.arrayBuffer());
  res.end(buffer);
}

export default async function staffApiHandler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const method = (req.method || 'GET').toUpperCase();
    const pathOnly = (req.url || '/').split('?')[0];
    // Unauthenticated GETs must not pay Neon/Hono cold-init just to return 401.
    if (
      method === 'GET' &&
      UNAUTH_FAST_PATHS.has(pathOnly) &&
      !hasStaffSessionCookie(req.headers.cookie as string | string[] | undefined)
    ) {
      res.setHeader('Cache-Control', 'no-store');
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const app = getApp();
    const webRes = await Promise.race([
      app.fetch(toWebRequest(req)),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('panel handler timeout')), HANDLER_TIMEOUT_MS)
      ),
    ]);
    await sendWebResponse(res, webRes);
  } catch (err) {
    console.error('staff api handler error', err);
    if (!res.headersSent) {
      res.status(503).json({ error: 'panel unavailable' });
    } else {
      res.end();
    }
  }
}
