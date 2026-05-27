export type TagFacet = 'origin' | 'level' | 'vibe' | 'context' | 'status';

export type TagId =
  | 'espanola'
  | 'colombiana'
  | 'latina'
  | 'normal'
  | 'vip'
  | 'nueva'
  | 'elegante'
  | 'sofisticada'
  | 'discreta'
  | 'cercana'
  | 'seductora'
  | 'apasionada'
  | 'divertida'
  | 'social'
  | 'serena'
  | 'cenas'
  | 'eventos'
  | 'viajes'
  | 'masajes';

export type TagDef = {
  id: TagId;
  facet: TagFacet;
  weight: number;
};

export const TAG_DEFS: Record<TagId, TagDef> = {
  // ORIGEN
  espanola: { id: 'espanola', facet: 'origin', weight: 4 },
  colombiana: { id: 'colombiana', facet: 'origin', weight: 4 },
  latina: { id: 'latina', facet: 'origin', weight: 3 },

  // NIVEL
  normal: { id: 'normal', facet: 'level', weight: 6 },
  vip: { id: 'vip', facet: 'level', weight: 6 },

  // ESTADO
  nueva: { id: 'nueva', facet: 'status', weight: 3 },

  // VIBE
  elegante: { id: 'elegante', facet: 'vibe', weight: 4 },
  sofisticada: { id: 'sofisticada', facet: 'vibe', weight: 4 },
  discreta: { id: 'discreta', facet: 'vibe', weight: 4 },
  cercana: { id: 'cercana', facet: 'vibe', weight: 4 },
  seductora: { id: 'seductora', facet: 'vibe', weight: 4 },
  apasionada: { id: 'apasionada', facet: 'vibe', weight: 4 },
  divertida: { id: 'divertida', facet: 'vibe', weight: 4 },
  social: { id: 'social', facet: 'vibe', weight: 4 },
  serena: { id: 'serena', facet: 'vibe', weight: 3 },

  // CONTEXTO
  cenas: { id: 'cenas', facet: 'context', weight: 6 },
  eventos: { id: 'eventos', facet: 'context', weight: 6 },
  viajes: { id: 'viajes', facet: 'context', weight: 6 },
  masajes: { id: 'masajes', facet: 'context', weight: 6 },
};

export const FACET_ORDER: TagFacet[] = ['level', 'context', 'vibe', 'origin', 'status'];

export function normalizeTags(input: unknown): TagId[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: TagId[] = [];
  for (const raw of input) {
    if (typeof raw !== 'string') continue;
    const id = raw.trim().toLowerCase();
    if (!id || seen.has(id)) continue;
    if (!(id in TAG_DEFS)) continue;
    seen.add(id);
    out.push(id as TagId);
  }
  return out;
}

export function hasFacet(tags: TagId[], facet: TagFacet): boolean {
  return tags.some((t) => TAG_DEFS[t].facet === facet);
}

