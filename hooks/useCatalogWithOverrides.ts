import { useEffect, useMemo, useState } from 'react';
import {
  HOME_PIN_ORDER,
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
    const update = (refresh = false) => {
      void loadPublicOverrides(refresh).then((payload) => {
        if (cancelled || !payload) return;
        setOverrideRows(payload.models);
        setHiddenSlugs(payload.hiddenSlugs ?? []);
      });
    };
    update();

    // Una portada editada desde el panel debe actualizarse al volver a la web,
    // sin obligar al cliente a cerrar la pestaña o vaciar la caché.
    const onFocus = () => update(true);
    const onVisible = () => {
      if (document.visibilityState === 'visible') update(true);
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') update(true);
    }, 60_000);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, []);

  return useMemo(() => {
    if (overrideRows?.length) {
      const applied = applyCatalogOverrides(staticModels, overrideRows, hiddenSlugs);
      // Fichas nuevas ya en HOME_PIN_ORDER pero aún no en el orden del panel:
      // sacarlas del final y ponerlas al frente, en orden de pin.
      const inOverrides = new Set(overrideRows.map((r) => r.slug));
      const pinLeading = HOME_PIN_ORDER.map((slug) =>
        applied.find((m) => m.slug === slug && !inOverrides.has(slug))
      ).filter((m): m is T => Boolean(m));
      if (!pinLeading.length) return applied;
      const lead = new Set(pinLeading.map((m) => m.slug));
      return [...pinLeading, ...applied.filter((m) => !lead.has(m.slug))];
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
