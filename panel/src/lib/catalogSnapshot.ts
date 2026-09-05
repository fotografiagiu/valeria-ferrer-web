import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CatalogModelLite } from './effectiveOrder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** panel/ */
export const PANEL_ROOT = path.resolve(__dirname, '../..');
/** Monorepo / web root (parent of panel/) */
export const WEB_ROOT = path.resolve(PANEL_ROOT, '..');
/** Canonical static catalog — NEVER duplicate manually */
export const CANONICAL_MODELS_PATH = path.join(WEB_ROOT, 'data', 'models.json');
/** Generated artifact — do not edit by hand */
export const SNAPSHOT_PATH = path.join(PANEL_ROOT, 'generated', 'catalog-snapshot.json');

export type CatalogSnapshot = {
  generatedAt: string;
  sourcePath: string;
  sourceHash: string;
  modelCount: number;
  activeCount: number;
  models: CatalogModelLite[];
};

type RawModel = {
  slug?: string;
  name?: string;
  active?: boolean;
  coverImageUrl?: string;
  images?: string[];
};

export function sha256OfFile(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

export function readCanonicalModels(): {
  models: CatalogModelLite[];
  sourceHash: string;
  sourcePath: string;
} {
  if (!existsSync(CANONICAL_MODELS_PATH)) {
    throw new Error(`Canonical catalog missing: ${CANONICAL_MODELS_PATH}`);
  }
  const sourceHash = sha256OfFile(CANONICAL_MODELS_PATH);
  const raw = JSON.parse(readFileSync(CANONICAL_MODELS_PATH, 'utf8')) as RawModel[];
  if (!Array.isArray(raw)) {
    throw new Error('models.json must be an array');
  }

  const models: CatalogModelLite[] = raw.map((item, index) => {
    if (!item?.slug || typeof item.slug !== 'string') {
      throw new Error(`models.json[${index}] missing slug`);
    }
    if (!item?.name || typeof item.name !== 'string') {
      throw new Error(`models.json[${index}] (${item.slug}) missing name`);
    }
    return {
      slug: item.slug,
      name: item.name,
      active: item.active,
      coverImageUrl: item.coverImageUrl,
      images: Array.isArray(item.images) ? item.images.filter((x) => typeof x === 'string') : [],
    };
  });

  return {
    models,
    sourceHash,
    sourcePath: path.relative(WEB_ROOT, CANONICAL_MODELS_PATH).replace(/\\/g, '/'),
  };
}

export function buildSnapshot(): CatalogSnapshot {
  const { models, sourceHash, sourcePath } = readCanonicalModels();
  const activeCount = models.filter((m) => m.active !== false).length;
  return {
    generatedAt: new Date().toISOString(),
    sourcePath,
    sourceHash,
    modelCount: models.length,
    activeCount,
    models,
  };
}

export function writeSnapshot(snapshot: CatalogSnapshot = buildSnapshot()): CatalogSnapshot {
  const dir = path.dirname(SNAPSHOT_PATH);
  mkdirSync(dir, { recursive: true });
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  return snapshot;
}

export function readSnapshot(): CatalogSnapshot {
  if (!existsSync(SNAPSHOT_PATH)) {
    throw new Error(
      `Catalog snapshot missing at ${SNAPSHOT_PATH}. Run: npm run catalog:snapshot`
    );
  }
  return JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as CatalogSnapshot;
}

/** Fail if snapshot is absent or (when canonical is readable) does not match hash. */
export function assertSnapshotFresh(): CatalogSnapshot {
  const snapshot = readSnapshot();
  if (!existsSync(CANONICAL_MODELS_PATH)) {
    // Vercel Root Directory = panel/ cannot see ../data — trust committed generated artifact
    if (!snapshot.models?.length) {
      throw new Error('Catalog snapshot is empty');
    }
    return snapshot;
  }
  const { sourceHash } = readCanonicalModels();
  if (snapshot.sourceHash !== sourceHash) {
    throw new Error(
      `Catalog snapshot is STALE.\n` +
        `  snapshot hash: ${snapshot.sourceHash}\n` +
        `  canonical hash: ${sourceHash}\n` +
        `Run: npm run catalog:snapshot`
    );
  }
  return snapshot;
}

export function getActiveModelsFromSnapshot(snapshot: CatalogSnapshot = readSnapshot()): CatalogModelLite[] {
  return snapshot.models.filter((m) => m.active !== false);
}

export function findSnapshotModel(
  slug: string,
  snapshot: CatalogSnapshot = readSnapshot()
): CatalogModelLite | undefined {
  return snapshot.models.find((m) => m.slug === slug);
}
