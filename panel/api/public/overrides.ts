import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

export const config = {
  maxDuration: 30,
  includeFiles: ['generated/**'],
};

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = String(req.headers.origin || '');
  const allowed = (process.env.PUBLIC_WEB_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=30');
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
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

  const url = process.env.DATABASE_URL;
  if (!url) {
    res.status(503).json({ error: 'DATABASE_URL missing' });
    return;
  }

  try {
    const sql = neon(url);
    const meta = await sql`
      SELECT order_version, updated_at FROM catalog_meta WHERE id = 1 LIMIT 1
    `;
    const rows = await sql`
      SELECT slug, display_order, cover_image_path
      FROM model_overrides
      WHERE display_order IS NOT NULL
      ORDER BY display_order ASC
    `;

    let active: Set<string> | null = null;
    try {
      const here = dirname(fileURLToPath(import.meta.url));
      const snapPath = join(here, '../../generated/catalog-snapshot.json');
      const snap = JSON.parse(readFileSync(snapPath, 'utf8')) as {
        models: Array<{ slug: string; active?: boolean }>;
      };
      active = new Set(snap.models.filter((m) => m.active !== false).map((m) => m.slug));
    } catch {
      active = null;
    }

    const models = (
      rows as Array<{ slug: string; display_order: number; cover_image_path: string }>
    )
      .filter((r) => (active ? active.has(r.slug) : true))
      .map((r) => ({
        slug: r.slug,
        displayOrder: Number(r.display_order),
        coverImagePath: r.cover_image_path,
      }));

    const m0 = meta[0] as { order_version?: number; updated_at?: Date | string } | undefined;
    res.status(200).json({
      orderVersion: Number(m0?.order_version ?? 0),
      updatedAt: m0?.updated_at ? new Date(m0.updated_at).toISOString() : new Date().toISOString(),
      models,
    });
  } catch (err) {
    console.error('public overrides failed', err);
    res.status(503).json({ error: 'overrides unavailable' });
  }
}
