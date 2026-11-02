import allowData from '../data/firma-allow-clean.json';
import skipData from '../data/firma-skip-stamped.json';

const ALLOW = new Set(
  ((allowData as { allowFirmaUrls?: string[] }).allowFirmaUrls || []).map((u) =>
    u.startsWith('/') ? u : `/${u}`,
  ),
);

const SKIP = new Set(
  ((skipData as { skipFirmaUrls?: string[] }).skipFirmaUrls || []).map((u) =>
    u.startsWith('/') ? u : `/${u}`,
  ),
);

function normalizePhotoPath(photoUrl?: string | null): string | null {
  if (!photoUrl) return null;
  const path = photoUrl.split('?')[0].split('#')[0];
  return path.startsWith('/') ? path : `/${path}`;
}

function pathMatches(set: Set<string>, norm: string): boolean {
  if (set.has(norm)) return true;
  for (const entry of set) {
    if (norm.endsWith(entry) || norm.includes(entry)) return true;
  }
  return false;
}

/**
 * Show the new CSS firma only on photos confirmed clean (no baked old cuño).
 * Fail closed: unknown / stamped photos keep the old cuño only — never both.
 */
export function shouldShowFirma(photoUrl?: string | null): boolean {
  const norm = normalizePhotoPath(photoUrl);
  if (!norm) return false;
  if (pathMatches(SKIP, norm)) return false;
  if (ALLOW.size === 0) return false;
  return pathMatches(ALLOW, norm);
}
