import type { Model } from '../types';
import { MODELS } from '../constants';
import type { HubKey } from '../data/hubs';
import { getHubDef, getHubModelsFrom } from '../data/hubs';

/** Respeta el orden de `models.json`: las fichas nuevas arriba del JSON salen primero. */
export function sortByCatalogOrder(models: Model[], catalog: Model[] = MODELS): Model[] {
  const order = new Map(catalog.map((m, index) => [m.slug, index]));
  return [...models].sort(
    (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999)
  );
}

export function getHubModels(key: HubKey, models: Model[] = MODELS): Model[] {
  const filtered = getHubModelsFrom(key, models);
  if (key === 'nuevas' || key === 'vip') return sortByCatalogOrder(filtered, models);
  return filtered;
}

export function isHubReady(key: HubKey, models: Model[] = MODELS): boolean {
  const hub = getHubDef(key);
  if (!hub.enabled) return false;
  const list = getHubModelsFrom(key, models);
  return list.length >= hub.minModels;
}

