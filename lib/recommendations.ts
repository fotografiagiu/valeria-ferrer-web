import type { Model } from '../types';
import { FACET_ORDER, TAG_DEFS, normalizeTags, type TagFacet, type TagId } from '../data/tags';

export type Recommendation = {
  model: Model;
  score: number;
  shared: TagId[];
  pickedFor: 'reinforce' | 'contrast' | 'explore' | 'fallback';
  notes: string[];
};

function getFacet(tags: TagId[], facet: TagFacet): TagId[] {
  return tags.filter((t) => TAG_DEFS[t].facet === facet);
}

function scoreShared(shared: TagId[]): number {
  return shared.reduce((acc, t) => acc + (TAG_DEFS[t]?.weight ?? 0), 0);
}

function stableSeed(str: string): number {
  // tiny deterministic hash
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stableTiebreak(a: string, b: string, seed: number): number {
  const ha = stableSeed(`${seed}:${a}`);
  const hb = stableSeed(`${seed}:${b}`);
  return ha - hb;
}

function stablePickFromTop<T>(items: T[], topK: number, seed: number, key: (x: T) => string): T[] {
  const sliced = items.slice(0, Math.max(0, Math.min(items.length, topK)));
  return sliced
    .slice()
    .sort((a, b) => stableTiebreak(key(a), key(b), seed));
}

function sharesAtLeastTwoStrongFacets(a: TagId[], b: TagId[]): boolean {
  const strong: TagFacet[] = ['level', 'context'];
  let count = 0;
  for (const facet of strong) {
    const aFacet = new Set(getFacet(a, facet));
    const bFacet = getFacet(b, facet);
    if (bFacet.some((t) => aFacet.has(t))) count++;
  }
  return count >= 2;
}

function shareLevel(a: TagId[], b: TagId[]): boolean {
  const aL = new Set(getFacet(a, 'level'));
  return getFacet(b, 'level').some((t) => aL.has(t));
}

function primaryContext(tags: TagId[]): TagId | null {
  const contexts = getFacet(tags, 'context');
  return contexts[0] ?? null;
}

function vibeOverlapCount(a: TagId[], b: TagId[]): number {
  const av = new Set(getFacet(a, 'vibe'));
  return getFacet(b, 'vibe').filter((t) => av.has(t)).length;
}

function pickReinforce(
  current: Model,
  currentTags: TagId[],
  candidates: Array<{ model: Model; tags: TagId[]; shared: TagId[]; score: number }>,
  count: number,
  seed: number
): Recommendation[] {
  const ctx = primaryContext(currentTags);

  const ranked = candidates
    .filter((c) => shareLevel(currentTags, c.tags))
    .filter((c) => (ctx ? c.tags.includes(ctx) : true))
    .filter((c) => vibeOverlapCount(currentTags, c.tags) >= 2)
    .sort((a, b) => (b.score - a.score) || stableTiebreak(a.model.slug, b.model.slug, seed));

  // pick from a wider pool to avoid the same "universal winners"
  const picked = stablePickFromTop(ranked, Math.max(6, count * 3), seed, (x) => x.model.slug).slice(0, count);

  return picked.map((c) => ({
    model: c.model,
    score: c.score,
    shared: c.shared,
    pickedFor: 'reinforce',
    notes: [
      'Mismo nivel',
      ctx ? `Mismo contexto (${ctx})` : 'Contexto compatible',
      'Vibe similar',
    ],
  }));
}

function pickContrast(
  current: Model,
  currentTags: TagId[],
  candidates: Array<{ model: Model; tags: TagId[]; shared: TagId[]; score: number }>,
  alreadyPicked: Set<string>,
  seed: number
): Recommendation | null {
  const ctx = primaryContext(currentTags);
  const currentVibes = new Set(getFacet(currentTags, 'vibe'));

  const ranked = candidates
    .filter((c) => !alreadyPicked.has(c.model.slug))
    .filter((c) => shareLevel(currentTags, c.tags))
    .filter((c) => (ctx ? c.tags.includes(ctx) || c.shared.includes(ctx) : true))
    // contrast: not too many vibes in common
    .filter((c) => vibeOverlapCount(currentTags, c.tags) <= 1)
    // but still meaningful: share at least 2 strong facets or strong score
    .filter((c) => sharesAtLeastTwoStrongFacets(currentTags, c.tags) || c.score >= 10)
    .sort((a, b) => (b.score - a.score) || stableTiebreak(a.model.slug, b.model.slug, seed));

  // pick from top-K with a stable rotation to avoid a fixed "contrast" everywhere
  const best = stablePickFromTop(ranked, 6, seed, (x) => x.model.slug)[0];
  if (!best) return null;

  const pickedVibes = getFacet(best.tags, 'vibe').filter((t) => !currentVibes.has(t)).slice(0, 2);
  return {
    model: best.model,
    score: best.score,
    shared: best.shared,
    pickedFor: 'contrast',
    notes: [
      'Mismo nivel',
      ctx ? `Contexto relacionado (${ctx})` : 'Contexto relacionado',
      pickedVibes.length ? `Contraste: ${pickedVibes.join(', ')}` : 'Contraste suave',
    ],
  };
}

function pickExplore(
  current: Model,
  all: Model[],
  alreadyPicked: Set<string>,
  seed: number
): Recommendation | null {
  // Explore slot: rotate through the whole catalog in a stable way.
  // Keeps "catalog feels alive" even when only a few models are tagged in the pilot.
  const pool = all
    .filter((m) => m.slug !== current.slug)
    .filter((m) => !alreadyPicked.has(m.slug))
    .filter((m) => {
      // keep level consistent in pilot: avoid mixing VIP into normal pages unless current is VIP
      const currentVip = current.vip === true || current.slug?.includes('vip');
      const isVip = m.vip === true || m.slug?.includes('vip') || m.name?.toLowerCase()?.includes('vip');
      return currentVip ? true : !isVip;
    });

  if (!pool.length) return null;

  const rotated = pool.slice().sort((a, b) => stableTiebreak(a.slug, b.slug, seed));
  const picked = rotated[0];
  return {
    model: picked,
    score: 0,
    shared: [],
    pickedFor: 'explore',
    notes: ['Sugerencia para descubrir más perfiles'],
  };
}

function fillFallback(
  currentTags: TagId[],
  candidates: Array<{ model: Model; tags: TagId[]; shared: TagId[]; score: number }>,
  alreadyPicked: Set<string>,
  needed: number,
  seed: number
): Recommendation[] {
  const filtered = candidates
    .filter((c) => !alreadyPicked.has(c.model.slug))
    .filter((c) => shareLevel(currentTags, c.tags))
    .sort((a, b) => (b.score - a.score) || stableTiebreak(a.model.slug, b.model.slug, seed));

  return filtered.slice(0, needed).map((c) => ({
    model: c.model,
    score: c.score,
    shared: c.shared,
    pickedFor: 'fallback',
    notes: ['Mismo nivel', 'Selección complementaria'],
  }));
}

export function getRecommendedModels(
  current: Model,
  all: Model[],
  options?: { mobile?: boolean; seedKey?: string }
): Recommendation[] {
  const mobile = options?.mobile ?? false;
  const max = mobile ? 3 : 3; // keep 3 for pilot to avoid any layout risk

  const currentTags = normalizeTags(current.tags);
  const taggedModels = all
    .filter((m) => m.slug !== current.slug)
    .map((m) => ({ model: m, tags: normalizeTags(m.tags) }))
    .filter((x) => x.tags.length > 0);

  // Pilot gating: only use semantic recs if current model has tags and there are enough tagged peers
  if (currentTags.length === 0 || taggedModels.length < 3) {
    return [];
  }

  const seed = stableSeed(options?.seedKey ?? `${current.slug}:pilot`);

  const scored = taggedModels
    .map((c) => {
      const shared = c.tags.filter((t) => currentTags.includes(t));
      // must share level, and at least one context OR at least two vibes
      const hasLevel = shareLevel(currentTags, c.tags);
      const hasContext = getFacet(currentTags, 'context').some((t) => c.tags.includes(t));
      const vibes = vibeOverlapCount(currentTags, c.tags);
      if (!hasLevel) return null;
      if (!hasContext && vibes < 2) return null;
      const score = scoreShared(shared);
      return { ...c, shared, score };
    })
    .filter(Boolean) as Array<{ model: Model; tags: TagId[]; shared: TagId[]; score: number }>;

  // Ensure we weight facets in the intended order by slightly boosting the most important facets
  const boosted = scored.map((c) => {
    const sharedByFacet = new Map<TagFacet, TagId[]>();
    for (const facet of FACET_ORDER) {
      sharedByFacet.set(facet, c.shared.filter((t) => TAG_DEFS[t].facet === facet));
    }
    const boost =
      (sharedByFacet.get('level')?.length ?? 0) * 3 +
      (sharedByFacet.get('context')?.length ?? 0) * 3 +
      (sharedByFacet.get('vibe')?.length ?? 0) * 1;
    return { ...c, score: c.score + boost };
  });

  const picked: Recommendation[] = [];
  const pickedSlugs = new Set<string>();

  // 1 reinforce (pilot: avoid repetition when tagged set is small)
  for (const r of pickReinforce(current, currentTags, boosted, Math.min(1, max), seed)) {
    picked.push(r);
    pickedSlugs.add(r.model.slug);
  }

  // 1 contrast if room
  if (picked.length < max) {
    const contrast = pickContrast(current, currentTags, boosted, pickedSlugs, seed);
    if (contrast) {
      picked.push(contrast);
      pickedSlugs.add(contrast.model.slug);
    }
  }

  // 1 explore slot if room (variety across profiles)
  if (picked.length < max) {
    const explore = pickExplore(current, all, pickedSlugs, stableSeed(`${seed}:explore`));
    if (explore) {
      picked.push(explore);
      pickedSlugs.add(explore.model.slug);
    }
  }

  // fill fallback
  if (picked.length < max) {
    const fallbacks = fillFallback(currentTags, boosted, pickedSlugs, max - picked.length, seed);
    for (const f of fallbacks) {
      picked.push(f);
      pickedSlugs.add(f.model.slug);
    }
  }

  return picked.slice(0, max);
}

