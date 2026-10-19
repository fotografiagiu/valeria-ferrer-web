import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withPgClient } from '../../src/db/client-impl.js';

const CACHE_MS = 15_000;
let cached: { at: number; body: Record<string, unknown> } | null = null;

export const config = {
  maxDuration: 15,
};

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = String(req.headers.origin || '');
  const allowed = (process.env.PUBLIC_WEB_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=15');
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
}

function iso(value: unknown): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (!Number.isFinite(d.getTime())) return null;
  return d.toISOString();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(503).json({ error: 'DATABASE_URL missing' });
    return;
  }

  if (cached && Date.now() - cached.at < CACHE_MS) {
    res.status(200).json(cached.body);
    return;
  }

  try {
    const result = await withPgClient((client) =>
      client.query<{
        active_promotion: string;
        starts_at: Date | string | null;
        ends_at: Date | string | null;
        duration_hours: number | null;
        promo_id: string | null;
        updated_at: Date | string;
      }>(
        `SELECT active_promotion, starts_at, ends_at, duration_hours, promo_id, updated_at
         FROM web_promotion
         WHERE id = 1
         LIMIT 1`
      )
    );
    const row = result.rows[0];

    const activePromotion =
      row?.active_promotion === 'copas' ||
      row?.active_promotion === 'duples' ||
      row?.active_promotion === 'salidas'
        ? row.active_promotion
        : 'none';
    const endsAt = iso(row?.ends_at);
    const endsMs = endsAt ? Date.parse(endsAt) : NaN;
    const live =
      activePromotion !== 'none' && Number.isFinite(endsMs) && Date.now() < endsMs;

    const body = !live
      ? {
          activePromotion: 'none' as const,
          active: false,
          startsAt: null,
          endsAt: null,
          durationHours: null,
          promoId: null,
          updatedAt: iso(row?.updated_at) ?? new Date().toISOString(),
        }
      : {
          activePromotion,
          active: true,
          startsAt: iso(row?.starts_at),
          endsAt,
          durationHours: typeof row?.duration_hours === 'number' ? row.duration_hours : null,
          promoId: row?.promo_id ?? null,
          updatedAt: iso(row?.updated_at) ?? new Date().toISOString(),
        };
    cached = { at: Date.now(), body };
    res.status(200).json(body);
  } catch (err) {
    console.error('public promotion failed', err);
    res.status(503).json({ error: 'promotion unavailable' });
  }
}
