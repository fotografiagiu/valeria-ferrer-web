const DEFAULT_ORIGIN = 'https://www.valeriaferrer.com';

/** Resolve catalog-relative paths against the public site origin. Paths stay unchanged. */
export function publicAssetUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (import.meta.env.VITE_PUBLIC_ASSET_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}


/** Prefer chicas-thumbnails twin for panel UI (same crop as public mobile cards). */
export function publicThumbUrl(path: string): string {
  if (!path) return '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  let thumb = normalized;
  if (normalized.includes('/chicas/')) {
    thumb = normalized.replace('/chicas/', '/chicas-thumbnails/');
    if (/\/portada(-nueva)?\.jpg$/i.test(normalized) || /\/cover\.jpg$/i.test(normalized)) {
      thumb = thumb.replace(/\/(portada(-nueva)?|cover)\.jpg$/i, '/cover-thumbnail.jpg');
    }
  }
  return publicAssetUrl(thumb);
}

/** Cover first, then gallery override (or remaining allowlist). New catalog photos append. */
export function buildOrderedImagePaths(model: {
  coverImagePath: string;
  galleryImagePaths?: string[] | null;
  allowedCoverPaths: string[];
}): string[] {
  const allowed = model.allowedCoverPaths.filter(Boolean);
  const allowedSet = new Set(allowed);
  const cover = allowedSet.has(model.coverImagePath) ? model.coverImagePath : allowed[0] || '';
  if (!cover) return [];

  const ordered: string[] = [cover];
  const seen = new Set<string>([cover]);

  const gallery = model.galleryImagePaths?.length
    ? model.galleryImagePaths
    : allowed.filter((p) => p !== cover);

  for (const path of gallery) {
    if (!path || seen.has(path) || !allowedSet.has(path)) continue;
    ordered.push(path);
    seen.add(path);
  }
  for (const path of allowed) {
    if (seen.has(path)) continue;
    ordered.push(path);
    seen.add(path);
  }
  return ordered;
}

export function formatOrderNumber(n: number): string {
  return String(n).padStart(2, '0');
}
