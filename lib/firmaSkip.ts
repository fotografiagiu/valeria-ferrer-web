import skipData from '../data/firma-skip-stamped.json';

const SKIP = new Set(
  (skipData.skipFirmaUrls as string[]).map((u) => (u.startsWith('/') ? u : `/${u}`)),
);

/** Hide CSS firma when the photo still has a baked old stamp (no clean original). */
export function shouldShowFirma(photoUrl?: string | null): boolean {
  if (!photoUrl) return true;
  const path = photoUrl.split('?')[0];
  const norm = path.startsWith('/') ? path : `/${path}`;
  return !SKIP.has(norm);
}
