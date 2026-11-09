/**
 * Public catalog overrides from the staff panel (Neon via GET /api/public/overrides).
 * Web has no DATABASE_URL — read-only fetch + static fallback.
 */

export type PublicOverrideRow = {
  slug: string;
  displayOrder: number;
  coverImagePath: string;
  /** Ordered gallery after cover; omit/null = catalog default images order. */
  galleryImagePaths?: string[] | null;
};

export type PublicOverridesPayload = {
  orderVersion: number;
  updatedAt: string;
  models: PublicOverrideRow[];
  /** Slugs staff removed from panel — hide from public grids even if still in models.json. */
  hiddenSlugs?: string[];
};

type CatalogLike = {
  slug: string;
  coverImageUrl?: string;
  image?: string;
  hoverImage?: string;
  gallery?: string[];
  images?: string[];
};

/** Home pin fallback — must stay aligned with panel effectiveOrder until overrides load. */
export const HOME_PIN_ORDER: readonly string[] = [
  'camila',
  'sofia2',
  'daniela',
  'shantell',
  'thania',
  'pamela',
  'irene',
  'karol',
  'adara',
  'luna',
  'naty',
  'gaby',
  'paula-vip',
  'carla',
  'bea',
  'melody',
  'alicia',
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

/** Paths allowed for this ficha in the deployed catalog (models.json). */
function staticAllowedPaths(model: CatalogLike): Set<string> {
  const paths = [model.coverImageUrl, ...(model.images || []), ...(model.gallery || [])].filter(
    (p): p is string => typeof p === 'string' && p.length > 0
  );
  return new Set(paths);
}

/**
 * Panel overrides older than a photo replace still point at deleted JPGs.
 * Server cover/gallery writes are allowlisted against models.json — mirror that here
 * so stale Neon rows cannot resurrect old cuños on top of the new CSS firma.
 */
function overridePathsAllowed(
  model: CatalogLike,
  coverImagePath: string,
  galleryImagePaths: string[] | null | undefined
): boolean {
  const allowed = staticAllowedPaths(model);
  if (allowed.size === 0) return true;
  if (!allowed.has(coverImagePath)) return false;
  if (!galleryImagePaths?.length) return true;
  return galleryImagePaths.every((p) => allowed.has(p));
}

function withGalleryOverride<T extends CatalogLike>(
  model: T,
  coverImagePath: string,
  galleryImagePaths: string[] | null | undefined
): T {
  let next = withCoverOverride(model, coverImagePath);
  if (!galleryImagePaths?.length) return next;

  const gallery = galleryImagePaths.filter((p) => p && p !== coverImagePath);
  next = { ...next, gallery };
  // Inicio consume model.images y la ficha individual consume model.gallery.
  // Mantener ambos sincronizados con el orden seleccionado en el panel.
  if ('images' in model) {
    (next as CatalogLike).images = gallery;
  }
  if ('hoverImage' in next || model.hoverImage !== undefined) {
    (next as CatalogLike).hoverImage = gallery[0] || coverImagePath;
  }
  return next;
}

/**
 * Apply display_order + cover_image_path to active catalog models.
 * Models missing from overrides go at the end (same as panel catalog:sync).
 * Do not prepend HOME_PIN misses — that desynced the public grid from the panel
 * (e.g. a reactivated ficha briefly appeared first on the web).
 */
const OVERRIDE_SLUG_ALIASES: Record<string, string> = {
  // Renamed to bust immutable CDN cache on /chicas/sofia-… paths.
  sofia: 'sofia1',
};

export function applyCatalogOverrides<T extends CatalogLike>(
  models: T[],
  overrides: PublicOverrideRow[] | null | undefined,
  hiddenSlugs?: string[] | null
): T[] {
  if (!overrides?.length) return models;

  const hidden = new Set(hiddenSlugs ?? []);
  const visibleModels = hidden.size
    ? models.filter((m) => !hidden.has(m.slug))
    : models;

  const bySlug = new Map(visibleModels.map((m) => [m.slug, m]));
  const ordered: T[] = [];
  const seen = new Set<string>();

  const sorted = [...overrides].sort((a, b) => a.displayOrder - b.displayOrder);
  for (const row of sorted) {
    const resolvedSlug = OVERRIDE_SLUG_ALIASES[row.slug] ?? row.slug;
    if (hidden.has(resolvedSlug)) continue;
    const model = bySlug.get(resolvedSlug);
    if (!model) continue;
    seen.add(resolvedSlug);
    const cover = row.coverImagePath?.trim();
    // Reject non-local / legacy Sofia paths, and Neon rows still pointing at
    // photo paths removed from models.json (e.g. Alana JPG → webp replace).
    const coverIsStale =
      !!cover &&
      (cover.includes('/sofia-valeria-ferrer-model-agency-valencia/') ||
        (resolvedSlug === 'sofia1' && row.slug === 'sofia') ||
        !/^\/(?:chicas|chicas-optimized)\/[^?#]+$/i.test(cover) ||
        cover.includes('..') ||
        !overridePathsAllowed(model, cover, row.galleryImagePaths));
    // Alana's September JPG gallery paths in the panel are stale/404.
    // Her newly uploaded WebP set in models.json is the canonical gallery.
    // Keep the panel's ordering and cover, but never replace her current
    // seven WebP photos with the obsolete JPG links.
    const galleryPaths =
      resolvedSlug === 'alana' && model.gallery?.some((path) => path.includes('alana-escorts-valencia-'))
        ? model.gallery.filter((path) => path !== cover)
        : row.galleryImagePaths;
    ordered.push(
      cover && !coverIsStale
        ? withGalleryOverride(model, cover, galleryPaths)
        : model
    );
  }

  const trailing = visibleModels.filter((m) => !seen.has(m.slug));
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
let overridesFetchedAt = 0;
const OVERRIDE_REFRESH_MIN_INTERVAL_MS = 25_000;

function isValidOverridesPayload(data: unknown): data is PublicOverridesPayload {
  if (!data || typeof data !== 'object') return false;
  const payload = data as PublicOverridesPayload;
  const models = payload.models;
  if (!Array.isArray(models) || models.length === 0) return false;
  const modelsOk = models.every(
    (m) =>
      m &&
      typeof m.slug === 'string' &&
      m.slug.length > 0 &&
      typeof m.displayOrder === 'number' &&
      Number.isFinite(m.displayOrder) &&
      typeof m.coverImagePath === 'string' &&
      m.coverImagePath.length > 0 &&
      (m.galleryImagePaths == null ||
        (Array.isArray(m.galleryImagePaths) &&
          m.galleryImagePaths.every((p) => typeof p === 'string' && p.length > 0)))
  );
  if (!modelsOk) return false;
  if (payload.hiddenSlugs != null) {
    if (!Array.isArray(payload.hiddenSlugs)) return false;
    if (!payload.hiddenSlugs.every((s) => typeof s === 'string' && s.length > 0)) return false;
  }
  return true;
}

async function fetchPublicOverridesOnce(refresh = false): Promise<PublicOverridesPayload | null> {
  const url = resolvePublicOverridesUrl();
  // La web debe ver cambios de portada incluso sin recargar toda la página.
  // Una URL distinta impide reutilizar en el navegador el JSON anterior.
  const requestUrl = refresh
    ? `${url}${url.includes('?') ? '&' : '?'}_refresh=${Date.now()}`
    : url;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    // Do not set cache:'no-store' — browsers add Cache-Control and the panel
    // CORS Allow-Headers only lists Content-Type, so the preflight fails and
    // the public site falls back to models.json / home pins forever.
    const res = await fetch(requestUrl, {
      method: 'GET',
      signal: controller.signal,
      credentials: 'omit',
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
export function loadPublicOverrides(refresh = false): Promise<PublicOverridesPayload | null> {
  if (
    !overridesPromise ||
    (refresh && Date.now() - overridesFetchedAt >= OVERRIDE_REFRESH_MIN_INTERVAL_MS)
  ) {
    overridesFetchedAt = Date.now();
    overridesPromise = fetchPublicOverridesOnce(refresh);
  }
  return overridesPromise;
}

/** Test helper — do not use in production UI. */
export function resetPublicOverridesCacheForTests(): void {
  overridesPromise = null;
  overridesFetchedAt = 0;
}
