import { useEffect, useMemo, useState } from 'react';
import {
  applyCatalogOverrides,
  applyHomePinOrder,
  loadPublicOverrides,
  type PublicOverrideRow,
} from '../lib/catalogOverrides';

type CatalogLike = {
  slug: string;
  coverImageUrl?: string;
  image?: string;
};

/**
 * Starts with static models (SSR/first paint), then applies panel overrides once loaded.
 * On fetch failure keeps the static list unchanged.
 */
export function useCatalogWithOverrides<T extends CatalogLike>(
  staticModels: T[],
  options?: { homePinFallback?: boolean }
): T[] {
  const homePinFallback = options?.homePinFallback === true;
  const [overrideRows, setOverrideRows] = useState<PublicOverrideRow[] | null>(null);
  const [hiddenSlugs, setHiddenSlugs] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadPublicOverrides().then((payload) => {
      if (cancelled) return;
      setOverrideRows(payload?.models ?? null);
      setHiddenSlugs(payload?.hiddenSlugs ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (overrideRows?.length) {
      return applyCatalogOverrides(staticModels, overrideRows, hiddenSlugs);
    }
    // Sin overrides del panel: orden de models.json + pins de home.
    // Si ya hay hiddenSlugs (payload parcial), filtrarlos igual.
    const base = homePinFallback ? applyHomePinOrder(staticModels) : staticModels;
    if (!hiddenSlugs.length) return base;
    const hidden = new Set(hiddenSlugs);
    return base.filter((m) => !hidden.has(m.slug));
  }, [staticModels, overrideRows, hiddenSlugs, homePinFallback]);
}

/** True when the panel has staff-hidden this slug from the public site. */
export function useIsStaffHiddenSlug(slug: string | undefined): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!slug) {
      setHidden(false);
      return;
    }
    let cancelled = false;
    loadPublicOverrides().then((payload) => {
      if (cancelled) return;
      setHidden(Boolean(payload?.hiddenSlugs?.includes(slug)));
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return hidden;
}
