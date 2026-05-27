import type { Model } from '../types';
import { normalizeTags, type TagId } from './tags';

export type HubKey =
  | 'vip'
  | 'nuevas'
  | 'colombianas'
  | 'espanolas'
  | 'jovenes'
  | 'maduras'
  | 'elegantes'
  | 'sociales'
  | 'cenas'
  | 'viajes';

export type HubDef = {
  key: HubKey;
  /** Ruta futura (fase 2). No se expone si `enabled` es false. */
  path: `/${string}`;
  enabled: boolean;
  /** Evitar hubs vacíos / thin: mínimo de modelos antes de activar. */
  minModels: number;
  /** SEO/copy editorial (fase 2). */
  title: string;
  description: string;
  canonicalUrl: string;
  introTitle: string;
  introText: string;
  /** Regla única de filtrado. */
  filter: (m: Model, ctx: { tags: TagId[] }) => boolean;
};

function getTags(m: Model): TagId[] {
  return normalizeTags(m.tags);
}

function hasTag(tags: TagId[], tag: TagId): boolean {
  return tags.includes(tag);
}

function nationalityIncludes(m: Model, needle: string): boolean {
  return (m.nationality || '').toLowerCase().includes(needle);
}

function isVip(m: Model, tags: TagId[]): boolean {
  return !!m.vip || hasTag(tags, 'vip');
}

function isNew(m: Model, tags: TagId[]): boolean {
  return !!m.isNew || hasTag(tags, 'nueva');
}

function ageNumber(m: Model): number | null {
  return typeof m.age === 'number' ? m.age : null;
}

/** Umbrales de edad para hubs Jóvenes / Más maduras. */
export const HUB_AGE = {
  /** Menores de 25 años */
  youngExclusiveMax: 25,
  /** 25 años o más */
  matureMin: 25,
} as const;

export const HUBS: Record<HubKey, HubDef> = {
  vip: {
    key: 'vip',
    path: '/vip',
    enabled: true,
    minModels: 6,
    title: 'Perfiles VIP | Valeria Ferrer',
    description:
      'Explora perfiles VIP con presencia, discreción y una estética cuidada. Selección editorial en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/vip',
    introTitle: 'Perfiles VIP',
    introText:
      'Una selección editorial para quien busca discreción, presencia y un trato a la altura de planes exclusivos.',
    filter: (m, ctx) => isVip(m, ctx.tags),
  },

  nuevas: {
    key: 'nuevas',
    path: '/nuevas',
    enabled: true,
    minModels: 6,
    title: 'Nuevas incorporaciones | Valeria Ferrer',
    description:
      'Descubre nuevas incorporaciones: perfiles recientes con estilo, presencia y un enfoque premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/nuevas',
    introTitle: 'Nuevas incorporaciones',
    introText:
      'Perfiles recientes seleccionados para mantener el catálogo vivo, con el mismo criterio premium y editorial.',
    filter: (m, ctx) => isNew(m, ctx.tags),
  },

  colombianas: {
    key: 'colombianas',
    path: '/colombianas',
    enabled: true,
    minModels: 6,
    title: 'Colombianas | Valeria Ferrer',
    description:
      'Explora perfiles colombianas en Valencia: presencia, carisma y estilo en una selección premium.',
    canonicalUrl: 'https://www.valeriaferrer.com/colombianas',
    introTitle: 'Colombianas',
    introText:
      'Carisma latino y presencia cuidada, en una selección editorial pensada para planes con personalidad.',
    filter: (m, ctx) => hasTag(ctx.tags, 'colombiana') || nationalityIncludes(m, 'colomb'),
  },

  espanolas: {
    key: 'espanolas',
    path: '/espanolas',
    enabled: true,
    minModels: 6,
    title: 'Españolas | Valeria Ferrer',
    description: 'Explora perfiles españolas en Valencia: elegancia natural y una estética premium.',
    canonicalUrl: 'https://www.valeriaferrer.com/espanolas',
    introTitle: 'Españolas',
    introText:
      'Elegancia natural, trato cercano y una presencia cuidada. Selección editorial de perfiles españolas.',
    filter: (m, ctx) =>
      hasTag(ctx.tags, 'espanola') ||
      nationalityIncludes(m, 'español') ||
      nationalityIncludes(m, 'espan'),
  },

  jovenes: {
    key: 'jovenes',
    path: '/jovenes',
    enabled: true,
    minModels: 6,
    title: 'Jóvenes | Valeria Ferrer',
    description:
      'Perfiles jóvenes en Valencia, con una selección cuidada y una estética premium — sin sensación de marketplace.',
    canonicalUrl: 'https://www.valeriaferrer.com/jovenes',
    introTitle: 'Jóvenes',
    introText:
      'Una selección editorial con un aire más fresco, manteniendo siempre discreción, clase y presencia.',
    filter: (m) => {
      const age = ageNumber(m);
      return age !== null && age < HUB_AGE.youngExclusiveMax;
    },
  },

  maduras: {
    key: 'maduras',
    path: '/maduras',
    enabled: true,
    minModels: 6,
    title: 'Más maduras | Valeria Ferrer',
    description: 'Perfiles con una energía más madura y una selección editorial premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/maduras',
    introTitle: 'Más maduras',
    introText:
      'Perfiles con una energía más madura, ideales para quien busca química serena, conversación y clase.',
    filter: (m) => {
      const age = ageNumber(m);
      return age !== null && age >= HUB_AGE.matureMin;
    },
  },

  elegantes: {
    key: 'elegantes',
    path: '/elegantes',
    enabled: false,
    minModels: 6,
    title: 'Elegantes | Valeria Ferrer',
    description:
      'Perfiles elegantes: estilo cuidado, presencia y una selección editorial premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/elegantes',
    introTitle: 'Elegantes',
    introText:
      'Estilo cuidado y presencia impecable, pensadas para cenas, eventos y planes donde el detalle importa.',
    filter: (_m, ctx) => hasTag(ctx.tags, 'elegante'),
  },

  sociales: {
    key: 'sociales',
    path: '/sociales',
    enabled: false,
    minModels: 6,
    title: 'Sociales | Valeria Ferrer',
    description:
      'Perfiles sociales: energía abierta y planes con ambiente, en una selección premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/sociales',
    introTitle: 'Sociales',
    introText:
      'Una energía más social para planes con ambiente, manteniendo siempre discreción y una estética premium.',
    filter: (_m, ctx) => hasTag(ctx.tags, 'social') || hasTag(ctx.tags, 'divertida'),
  },

  cenas: {
    key: 'cenas',
    path: '/cenas',
    enabled: false,
    minModels: 6,
    title: 'Cenas | Valeria Ferrer',
    description:
      'Perfiles ideales para cenas: compañía cuidada, presencia y una selección editorial premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/cenas',
    introTitle: 'Cenas',
    introText:
      'Perfiles pensados para cenas: conversación, presencia y un trato que acompaña planes con estilo.',
    filter: (_m, ctx) => hasTag(ctx.tags, 'cenas'),
  },

  viajes: {
    key: 'viajes',
    path: '/viajes',
    enabled: false,
    minModels: 6,
    title: 'Viajes | Valeria Ferrer',
    description:
      'Perfiles para viajes y escapadas: discreción, presencia y una selección premium en Valencia.',
    canonicalUrl: 'https://www.valeriaferrer.com/viajes',
    introTitle: 'Viajes',
    introText:
      'Perfiles con disponibilidad y actitud para escapadas, manteniendo siempre un enfoque discreto y premium.',
    filter: (_m, ctx) => hasTag(ctx.tags, 'viajes'),
  },
};

export function getHubDef(key: HubKey): HubDef {
  return HUBS[key];
}

export function getHubModelsFrom(key: HubKey, models: Model[]): Model[] {
  const hub = getHubDef(key);
  return models.filter((m) => hub.filter(m, { tags: getTags(m) }));
}

