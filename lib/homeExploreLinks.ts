import type { ExploreProfileLink } from './exploreProfiles';
import { ACTIVE_EXPLORE_HUB_KEYS, getExploreProfileLinks } from './exploreProfiles';

export function getHomeExploreLinks(): ExploreProfileLink[] {
  return [...getExploreProfileLinks(), { key: 'ver-todas', label: 'Ver todas', href: '/models' }];
}

export { ACTIVE_EXPLORE_HUB_KEYS };
