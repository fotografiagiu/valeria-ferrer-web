const DEFAULT_ORIGIN = 'https://www.valeriaferrer.com';

/** Resolve catalog-relative paths against the public site origin. Paths stay unchanged. */
export function publicAssetUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (import.meta.env.VITE_PUBLIC_ASSET_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function formatOrderNumber(n: number): string {
  return String(n).padStart(2, '0');
}
