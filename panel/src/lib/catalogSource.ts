import {
  assertSnapshotFresh,
  readSnapshot,
  type CatalogSnapshot,
} from './catalogSnapshot.js';
import type { CatalogModelLite } from './effectiveOrder.js';
import { fetchLiveAppCatalog, type LiveAppCatalog } from './liveCatalog.js';

export type CatalogSourceKind = 'live' | 'memory' | 'snapshot' | 'injected';

export type ResolvedCatalog = {
  models: CatalogModelLite[];
  source: CatalogSourceKind;
  catalogVersion: string | null;
  generatedAt: string | null;
};

/** Warm-instance cache so a brief outage after a successful fetch still works. */
let lastGood: ResolvedCatalog | null = null;
let lastSyncedVersion: string | null = null;

export function getLastGoodCatalog(): ResolvedCatalog | null {
  return lastGood;
}

export function getLastSyncedCatalogVersion(): string | null {
  return lastSyncedVersion;
}

export function markCatalogSynced(catalogVersion: string | null): void {
  lastSyncedVersion = catalogVersion;
}

export function resetCatalogSourceCacheForTests(): void {
  lastGood = null;
  lastSyncedVersion = null;
}

function fromLive(catalog: LiveAppCatalog): ResolvedCatalog {
  return {
    models: catalog.models,
    source: 'live',
    catalogVersion: catalog.catalogVersion,
    generatedAt: catalog.generatedAt,
  };
}

function fromSnapshot(snapshot: CatalogSnapshot): ResolvedCatalog {
  return {
    models: snapshot.models,
    source: 'snapshot',
    catalogVersion: snapshot.sourceHash,
    generatedAt: snapshot.generatedAt,
  };
}

/**
 * Resolve operational catalog models:
 * 1) injected (tests)
 * 2) live app-catalog.json
 * 3) in-memory last-good (warm lambda)
 * 4) committed snapshot fallback
 */
export async function resolveCatalogModels(options?: {
  injectedModels?: CatalogModelLite[];
  skipLiveCatalog?: boolean;
  skipSnapshotFreshness?: boolean;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  env?: NodeJS.ProcessEnv;
}): Promise<ResolvedCatalog> {
  if (options?.injectedModels) {
    const resolved: ResolvedCatalog = {
      models: options.injectedModels,
      source: 'injected',
      catalogVersion: 'injected',
      generatedAt: new Date().toISOString(),
    };
    lastGood = resolved;
    return resolved;
  }

  if (!options?.skipLiveCatalog) {
    const live = await fetchLiveAppCatalog({
      fetchImpl: options?.fetchImpl,
      timeoutMs: options?.timeoutMs,
      env: options?.env,
    });
    if (live.ok) {
      const resolved = fromLive(live.catalog);
      lastGood = resolved;
      return resolved;
    }
  }

  if (lastGood?.models.length) {
    return { ...lastGood, source: 'memory' };
  }

  const snapshot = options?.skipSnapshotFreshness
    ? readSnapshot()
    : assertSnapshotFresh();
  const resolved = fromSnapshot(snapshot);
  lastGood = resolved;
  return resolved;
}

export function activeSlugSet(models: CatalogModelLite[]): Set<string> {
  return new Set(models.filter((m) => m.active !== false).map((m) => m.slug));
}
