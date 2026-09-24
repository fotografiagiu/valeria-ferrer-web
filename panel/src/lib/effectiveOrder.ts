/**
 * Must stay identical to lib/catalogOverrides.ts HOME_PIN_ORDER (static Home fallback).
 * Seed / display_order use this + remaining active models in models.json order.
 */
export const HOME_PIN_ORDER: readonly string[] = [
  'lola',
  'sofia1',
  'cristal2',
  'carolina2',
  'lia',
  'ana',
  'bea',
  'sara',
  'danna',
  'veronica',
  'jazmin',
  'marta',
  'luna',
  'silvia',
  'adara',
  'vero',
  'zoe',
  'alicia',
  'andrea',
  'carla',
  'rihanna',
  'julieta',
  'paula-vip',
  'teresa',
  'mia',
  'naty',
] as const;

export type CatalogModelLite = {
  slug: string;
  name: string;
  active?: boolean;
  coverImageUrl?: string;
  images?: string[];
};

export function isModelActive(model: { active?: boolean } | null | undefined): boolean {
  return model != null && model.active !== false;
}

/** Effective Home order: pinOrder (active hits) + remaining actives in catalog array order. */
export function computeEffectiveHomeOrder(models: CatalogModelLite[]): string[] {
  const active = models.filter(isModelActive);
  const bySlug = new Map(active.map((m) => [m.slug, m]));
  const pinned: string[] = [];
  for (const slug of HOME_PIN_ORDER) {
    if (bySlug.has(slug)) pinned.push(slug);
  }
  const pinnedSet = new Set(pinned);
  const rest = active.map((m) => m.slug).filter((slug) => !pinnedSet.has(slug));
  return [...pinned, ...rest];
}

export function allowedCoverPaths(model: CatalogModelLite): string[] {
  const set = new Set<string>();
  if (model.coverImageUrl) set.add(model.coverImageUrl);
  for (const img of model.images || []) {
    if (img) set.add(img);
  }
  return [...set];
}
