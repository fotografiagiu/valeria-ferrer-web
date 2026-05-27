import { normalizeTags, TagId } from '../data/tags';
import { EXPLORE_NAV, ExploreNavKey, getExploreHref } from '../data/exploreNav';

export type ExploreProfileLink = {
  key: ExploreNavKey;
  label: string;
  href: string;
};

const TAG_TO_NAV: Partial<Record<TagId, ExploreNavKey>> = {
  espanola: 'espanolas',
  colombiana: 'colombianas',
  latina: 'latinas',
  vip: 'vip',
  nueva: 'nuevas',
  elegante: 'elegantes',
  sofisticada: 'sofisticadas',
  discreta: 'discretas',
  social: 'sociales',
  seductora: 'seductoras',
  divertida: 'divertidas',
  cenas: 'cenas',
  eventos: 'eventos',
  viajes: 'viajes',
};

/** Orden editorial en ficha (origen → estado → nivel → vibe → contexto → edad). */
const NAV_PRIORITY: Record<ExploreNavKey, number> = {
  espanolas: 10,
  colombianas: 10,
  latinas: 11,
  nuevas: 20,
  vip: 25,
  elegantes: 30,
  sofisticadas: 31,
  discretas: 32,
  sociales: 33,
  seductoras: 34,
  divertidas: 35,
  cenas: 40,
  eventos: 41,
  viajes: 42,
  jovenes: 50,
  maduras: 51,
};

const MAX_LINKS = 6;

/** Fallback editorial cuando la ficha no tiene tags internos. */
const GENERIC_EXPLORE_KEYS: ExploreNavKey[] = [
  'vip',
  'nuevas',
  'espanolas',
  'colombianas',
  'elegantes',
  'sociales',
];

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function nationalityToNav(nationality?: string): ExploreNavKey | null {
  if (!nationality) return null;
  const n = nationality.toLowerCase();
  if (n.includes('español') || n.includes('espan')) return 'espanolas';
  if (n.includes('colomb')) return 'colombianas';
  if (
    n.includes('venez') ||
    n.includes('mexic') ||
    n.includes('argentin') ||
    n.includes('bras') ||
    n.includes('latin')
  ) {
    return 'latinas';
  }
  return null;
}

function ageNavKey(age: number): ExploreNavKey | null {
  if (age <= 24) return 'jovenes';
  if (age >= 26) return 'maduras';
  return null;
}

function isVipProfile(model: ModelLike): boolean {
  return !!model.vip || model.slug.includes('vip');
}

/** En fichas no VIP: mostrar “Perfiles VIP” ~50% (estable por slug). */
function shouldShowAspirationalVip(model: ModelLike, seed: string): boolean {
  if (isVipProfile(model)) return true;
  return hashSeed(`${seed}:aspirational-vip`) % 2 === 0;
}

function selectContextualKeys(
  ranked: ExploreNavKey[],
  seed: string,
  pinVip: boolean
): ExploreNavKey[] {
  const today = new Date().toISOString().slice(0, 10);
  const rotateOffset = hashSeed(`${seed}:${today}`) % Math.max(ranked.length, 1);
  const withoutVip = ranked.filter((k) => k !== 'vip');
  const rotated =
    withoutVip.length <= (pinVip ? MAX_LINKS - 1 : MAX_LINKS)
      ? withoutVip
      : [...withoutVip.slice(rotateOffset), ...withoutVip.slice(0, rotateOffset)].slice(
          0,
          pinVip ? MAX_LINKS - 1 : MAX_LINKS
        );

  if (pinVip) {
    return ['vip', ...rotated].slice(0, MAX_LINKS);
  }
  return rotated;
}

type ModelLike = {
  slug: string;
  tags?: string[];
  age?: number;
  vip?: boolean;
  isNew?: boolean;
  nationality?: string;
};

function toExploreLinks(keys: ExploreNavKey[]): ExploreProfileLink[] {
  return keys.map((key) => ({
    key,
    label: EXPLORE_NAV[key].label,
    href: getExploreHref(key),
  }));
}

export function getExploreProfileLinks(
  model: ModelLike,
  options?: { seedKey?: string }
): ExploreProfileLink[] {
  const tags = normalizeTags(model.tags);
  const seed = options?.seedKey ?? model.slug;
  const pinVip = isVipProfile(model);
  const showVip = shouldShowAspirationalVip(model, seed);

  if (tags.length === 0) {
    const keys = [...GENERIC_EXPLORE_KEYS];
    if (pinVip) {
      return toExploreLinks(['vip', ...keys.filter((k) => k !== 'vip')].slice(0, MAX_LINKS));
    }
    return toExploreLinks(keys);
  }

  const keys = new Set<ExploreNavKey>();

  for (const tag of tags) {
    const key = TAG_TO_NAV[tag];
    if (key) keys.add(key);
  }

  if (showVip) keys.add('vip');
  if (model.isNew) keys.add('nuevas');

  const fromNationality = nationalityToNav(model.nationality);
  if (fromNationality) keys.add(fromNationality);

  const ageKey = typeof model.age === 'number' ? ageNavKey(model.age) : null;
  if (ageKey) keys.add(ageKey);

  // No mezclar cohortes de edad en la misma ficha.
  if (keys.has('jovenes') && keys.has('maduras')) {
    if (typeof model.age === 'number' && model.age <= 24) keys.delete('maduras');
    else keys.delete('jovenes');
  }

  const ranked = [...keys].sort((a, b) => {
    const pa = NAV_PRIORITY[a];
    const pb = NAV_PRIORITY[b];
    if (pa !== pb) return pa - pb;
    return (hashSeed(`${seed}:${a}`) % 97) - (hashSeed(`${seed}:${b}`) % 97);
  });

  const selected =
    ranked.length <= MAX_LINKS && !pinVip
      ? ranked
      : selectContextualKeys(ranked, seed, pinVip);

  return toExploreLinks(selected);
}
