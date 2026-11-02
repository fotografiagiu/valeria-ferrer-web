import skipData from '../data/firma-skip-stamped.json';

const SKIP = new Set(
  (skipData.skipFirmaUrls as string[]).map((u) => (u.startsWith('/') ? u : `/${u}`)),
);

/** Hide CSS firma when the photo still has a baked old stamp (no clean original). */
export function shouldShowFirma(photoUrl?: string | null): boolean {
  if (!photoUrl) return false;
  const path = photoUrl.split('?')[0].split('#')[0];
  const norm = path.startsWith('/') ? path : `/${path}`;
  if (SKIP.has(norm)) return false;
  // Also match when CDN/base path prefixes differ but the /chicas/... suffix is known-stamped.
  for (const skipped of SKIP) {
    if (norm.endsWith(skipped) || norm.includes(skipped)) return false;
  }
  return true;
}
