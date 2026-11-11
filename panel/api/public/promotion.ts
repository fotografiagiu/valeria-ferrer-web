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
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Cache-Control');
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
        secondary_promotion: {
          activePromotion?: string; startsAt?: string; endsAt?: string;
          durationHours?: number; promoId?: string;
        } | null;
        updated_at: Date | string;
      }>(
        `SELECT active_promotion, starts_at, ends_at, duration_hours, promo_id, secondary_promotion, updated_at
         FROM web_promotion
         WHERE id = 1
         LIMIT 1`
      )
    );
    const row = result.rows[0];

    const allowed = new Set(['copas', 'duples', 'salidas', 'cash5']);
    const source = [
      { activePromotion: row?.active_promotion, startsAt: iso(row?.starts_at),
        endsAt: iso(row?.ends_at), durationHours: row?.duration_hours,
        promoId: row?.promo_id },
      row?.secondary_promotion ?? null,
    ];
    const now = Date.now();
    const unique = new Set<string>();
    const promotions = source.flatMap((entry) => {
      if (!entry || typeof entry.activePromotion !== 'string' ||
          !allowed.has(entry.activePromotion) || unique.has(entry.activePromotion)) return [];
      const begins = entry.startsAt ? Date.parse(entry.startsAt) : NaN;
      const expires = entry.endsAt ? Date.parse(entry.endsAt) : NaN;
      if (!Number.isFinite(begins) || !Number.isFinite(expires) ||
          begins > now || expires <= now || expires <= begins) return [];
      unique.add(entry.activePromotion);
      return [{
        activePromotion: entry.activePromotion,
        startsAt: entry.startsAt,
        endsAt: entry.endsAt,
        durationHours: entry.durationHours ?? null,
        promoId: entry.promoId ?? null,
      }];
    }).slice(0, 2);
    const first = promotions[0];
    // Backward compatibility: previous website versions still understand
    // the first active promotion; new versions read promotions[].
    const body = {
      activePromotion: first?.activePromotion ?? 'none',
      active: Boolean(first),
      startsAt: first?.startsAt ?? null,
      endsAt: first?.endsAt ?? null,
      durationHours: first?.durationHours ?? null,
      promoId: first?.promoId ?? null,
      promotions,
      updatedAt: iso(row?.updated_at) ?? new Date().toISOString(),
    };
    cached = { at: Date.now(), body };
    res.status(200).json(body);
  } catch (err) {
    console.error('public promotion failed', err);
    res.status(503).json({ error: 'promotion unavailable' });
  }
}
