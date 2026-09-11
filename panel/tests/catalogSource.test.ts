import { afterEach, describe, expect, it } from 'vitest';
import {
  resetCatalogSourceCacheForTests,
  resolveCatalogModels,
} from '../src/lib/catalogSource.js';
import { writeSnapshot } from '../src/lib/catalogSnapshot.js';

afterEach(() => {
  resetCatalogSourceCacheForTests();
});

describe('resolveCatalogModels', () => {
  it('uses live catalog when fetch succeeds', async () => {
    writeSnapshot();
    const liveModels = [
      {
        slug: 'live-one',
        name: 'Live One',
        active: true,
        coverImageUrl: '/chicas/live-one/a.jpg',
        images: ['/chicas/live-one/a.jpg'],
      },
    ];
    const resolved = await resolveCatalogModels({
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            generatedAt: '2026-09-11T12:00:00.000Z',
            catalogVersion: 'live-v1',
            source: 'test',
            method: 'test',
            models: liveModels,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        ),
    });
    expect(resolved.source).toBe('live');
    expect(resolved.catalogVersion).toBe('live-v1');
    expect(resolved.models).toEqual(liveModels);
  });

  it('falls back to memory last-good when live fails', async () => {
    writeSnapshot();
    await resolveCatalogModels({
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            generatedAt: '2026-09-11T12:00:00.000Z',
            catalogVersion: 'live-v1',
            models: [
              {
                slug: 'live-one',
                name: 'Live One',
                active: true,
                coverImageUrl: '/chicas/live-one/a.jpg',
                images: [],
              },
            ],
          }),
          { status: 200 }
        ),
    });

    const resolved = await resolveCatalogModels({
      fetchImpl: async () => {
        throw new Error('offline');
      },
    });
    expect(resolved.source).toBe('memory');
    expect(resolved.models[0]?.slug).toBe('live-one');
  });

  it('falls back to snapshot when live fails and memory is empty', async () => {
    writeSnapshot();
    const resolved = await resolveCatalogModels({
      skipLiveCatalog: true,
      skipSnapshotFreshness: true,
    });
    expect(resolved.source).toBe('snapshot');
    expect(resolved.models.length).toBeGreaterThan(10);
  });
});
