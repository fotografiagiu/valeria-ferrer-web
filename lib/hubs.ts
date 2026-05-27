import type { Model } from '../types';
import { MODELS } from '../constants';
import type { HubKey } from '../data/hubs';
import { getHubDef, getHubModelsFrom } from '../data/hubs';

export function getHubModels(key: HubKey, models: Model[] = MODELS): Model[] {
  return getHubModelsFrom(key, models);
}

export function isHubReady(key: HubKey, models: Model[] = MODELS): boolean {
  const hub = getHubDef(key);
  if (!hub.enabled) return false;
  const list = getHubModelsFrom(key, models);
  return list.length >= hub.minModels;
}

