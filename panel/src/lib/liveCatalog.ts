import type { CatalogModelLite } from './effectiveOrder.js';

export const DEFAULT_WEB_CATALOG_URL = 'https://www.valeriaferrer.com/app-catalog.json';

export type LiveAppCatalog = {
  generatedAt: string;
  catalogVersion: string | null;
  source: string;
  method: string;
  models: CatalogModelLite[];
};

export function webCatalogUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.WEB_CATALOG_URL?.trim();
  return raw || DEFAULT_WEB_CATALOG_URL;
}

function asPublicPath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function parseModel(item: unknown): CatalogModelLite | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  const record = item as Record<string, unknown>;
  const slug = typeof record.slug === 'string' ? record.slug.trim() : '';
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  if (!slug || !name) return null;
  if (record.active != null && typeof record.active !== 'boolean') return null;

  const coverImageUrl = asPublicPath(record.coverImageUrl) ?? undefined;
  const images = Array.isArray(record.images)
    ? record.images.map(asPublicPath).filter((x): x is string => Boolean(x))
    : [];

  return {
    slug,
    name,
    active: record.active !== false,
    coverImageUrl,
    images,
  };
}

export function parseLiveAppCatalog(raw: unknown): LiveAppCatalog | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const body = raw as Record<string, unknown>;
  if (!Array.isArray(body.models)) return null;

  const models = body.models.map(parseModel).filter((m): m is CatalogModelLite => m != null);
  if (models.length === 0) return null;

  return {
    generatedAt:
      typeof body.generatedAt === 'string' && body.generatedAt
        ? body.generatedAt
        : new Date().toISOString(),
    catalogVersion:
      typeof body.catalogVersion === 'string' && body.catalogVersion
        ? body.catalogVersion
        : null,
    source:
      typeof body.source === 'string' && body.source ? body.source : 'valeria-ferrer-web',
    method:
      typeof body.method === 'string' && body.method ? body.method : 'live-web-catalog',
    models,
  };
}

export type FetchLiveCatalogResult =
  | { ok: true; catalog: LiveAppCatalog }
  | { ok: false; reason: string };

export async function fetchLiveAppCatalog(options?: {
  url?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  env?: NodeJS.ProcessEnv;
}): Promise<FetchLiveCatalogResult> {
  const url = options?.url ?? webCatalogUrl(options?.env);
  const fetchImpl = options?.fetchImpl ?? fetch;
  const timeoutMs = options?.timeoutMs ?? 4000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    if (!response.ok) {
      return { ok: false, reason: `live catalog HTTP ${response.status}` };
    }
    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      return { ok: false, reason: 'live catalog is not JSON' };
    }
    const catalog = parseLiveAppCatalog(raw);
    if (!catalog) {
      return { ok: false, reason: 'live catalog payload invalid' };
    }
    return { ok: true, catalog };
  } catch {
    return { ok: false, reason: 'live catalog unreachable' };
  } finally {
    clearTimeout(timer);
  }
}
