/**
 * Public catalog overrides from the staff panel (Neon via GET /api/public/overrides).
 * Web has no DATABASE_URL — read-only fetch + static fallback.
 */

export type PublicOverrideRow = {
  slug: string;
  displayOrder: number;
  coverImagePath: string;
};

export type PublicOverridesPayload = {
  orderVersion: number;
  updatedAt: string;
  models: PublicOverrideRow[];
};

type CatalogLike = {
  slug: string;
  coverImageUrl?: string;
  image?: string;
  hoverImage?: string;
};

/** Home pin fallback — must stay aligned with panel effectiveOrder until overrides load. */
export const HOME_PIN_ORDER: readonly string[] = [
  'lola',
  'sofia',
  'ana',
  'bea',
  'sara',
  'danna',
  'veronica',
  'jazmin',
  'marta',
  'luna',
  'silvia',
  'adara',
  'vero',
  'zoe',
  'alicia',
  'andrea',
  'carla',
  'rihanna',
  'julieta',
  'paula-vip',
  'teresa',
  'mia',
  'naty',
] as const;

/** Static Home order when overrides are unavailable. */
export function applyHomePinOrder<T extends { slug: string }>(activeModels: T[]): T[] {
  const pinned = HOME_PIN_ORDER.map((slug) => activeModels.find((m) => m.slug === slug)).filter(
    (m): m is T => Boolean(m)
  );
  if (pinned.length === 0) return activeModels;
  const pinnedSlugs = new Set(pinned.map((m) => m.slug));
  const rest = activeModels.filter((m) => !pinnedSlugs.has(m.slug));
  return [...pinned, ...rest];
}

function withCoverOverride<T extends CatalogLike>(model: T, coverImagePath: string): T {
  const next: T = { ...model, coverImageUrl: coverImagePath };
  if ('image' in model || model.image !== undefined) {
    (next as CatalogLike).image = coverImagePath;
  }
  return next;
}

/**
 * Apply display_order + cover_image_path to active catalog models.
 * Models missing from overrides go at the end (same as panel catalog:sync).
 * Do not prepend HOME_PIN misses — that desynced the public grid from the panel
 * (e.g. a reactivated ficha briefly appeared first on the web).
 */
export function applyCatalogOverrides<T extends CatalogLike>(
  models: T[],
  overrides: PublicOverrideRow[] | null | undefined
): T[] {
  if (!overrides?.length) return models;

  const bySlug = new Map(models.map((m) => [m.slug, m]));
  const ordered: T[] = [];
  const seen = new Set<string>();

  const sorted = [...overrides].sort((a, b) => a.displayOrder - b.displayOrder);
  for (const row of sorted) {
    const model = bySlug.get(row.slug);
    if (!model) continue;
    seen.add(row.slug);
    const cover = row.coverImagePath?.trim();
    ordered.push(cover ? withCoverOverride(model, cover) : model);
  }

  const trailing = models.filter((m) => !seen.has(m.slug));
  return [...ordered, ...trailing];
}

export const PRODUCTION_OVERRIDES_URL =
  'https://valeria-ferrer-panel.vercel.app/api/public/overrides';

/**
 * Resolve overrides endpoint.
 * - Production builds: absolute panel URL (static site has no /api/public).
 * - Dev: same-origin `/api/public/overrides` (Vite proxy → panel; set
 *   VITE_OVERRIDES_PROXY_TARGET to Production to consume live Neon data).
 * - Override anytime with VITE_PUBLIC_OVERRIDES_URL.
 */
export function resolvePublicOverridesUrl(): string {
  const fromEnv =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUBLIC_OVERRIDES_URL
      ? String(import.meta.env.VITE_PUBLIC_OVERRIDES_URL).trim()
      : '';
  if (fromEnv) return fromEnv;
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return PRODUCTION_OVERRIDES_URL;
  }
  if (typeof window !== 'undefined') return '/api/public/overrides';
  return PRODUCTION_OVERRIDES_URL;
}

let overridesPromise: Promise<PublicOverridesPayload | null> | null = null;

function isValidOverridesPayload(data: unknown): data is PublicOverridesPayload {
  if (!data || typeof data !== 'object') return false;
  const models = (data as PublicOverridesPayload).models;
  if (!Array.isArray(models) || models.length === 0) return false;
  return models.every(
    (m) =>
      m &&
      typeof m.slug === 'string' &&
      m.slug.length > 0 &&
      typeof m.displayOrder === 'number' &&
      Number.isFinite(m.displayOrder) &&
      typeof m.coverImagePath === 'string' &&
      m.coverImagePath.length > 0
  );
}

async function fetchPublicOverridesOnce(): Promise<PublicOverridesPayload | null> {
  const url = resolvePublicOverridesUrl();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isValidOverridesPayload(data)) return null;
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Single shared fetch for the SPA session; failures resolve to null (static fallback). */
export function loadPublicOverrides(): Promise<PublicOverridesPayload | null> {
  if (!overridesPromise) {
    overridesPromise = fetchPublicOverridesOnce();
  }
  return overridesPromise;
}

/** Test helper — do not use in production UI. */
export function resetPublicOverridesCacheForTests(): void {
  overridesPromise = null;
}
