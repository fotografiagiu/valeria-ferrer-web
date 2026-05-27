import { EXPLORE_NAV, ExploreNavKey, getExploreHref } from '../data/exploreNav';

export type ExploreProfileLink = {
  key: string;
  label: string;
  href: string;
};

/** Orden fijo en fichas: siempre los hubs activos, sin rotación. */
export const ACTIVE_EXPLORE_HUB_KEYS: ExploreNavKey[] = [
  'vip',
  'nuevas',
  'espanolas',
  'colombianas',
  'jovenes',
  'maduras',
];

function toExploreLinks(keys: ExploreNavKey[]): ExploreProfileLink[] {
  return keys
    .filter((key) => EXPLORE_NAV[key].enabled)
    .map((key) => ({
      key,
      label: EXPLORE_NAV[key].label,
      href: getExploreHref(key),
    }));
}

/** Mismos 6 hubs activos en todas las fichas (Explorar perfiles). */
export function getExploreProfileLinks(): ExploreProfileLink[] {
  return toExploreLinks(ACTIVE_EXPLORE_HUB_KEYS);
}
