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

  useEffect(() => {
    let cancelled = false;
    loadPublicOverrides().then((payload) => {
      if (cancelled) return;
      setOverrideRows(payload?.models ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (overrideRows?.length) {
      return applyCatalogOverrides(staticModels, overrideRows);
    }
    return homePinFallback ? applyHomePinOrder(staticModels) : staticModels;
  }, [staticModels, overrideRows, homePinFallback]);
}
