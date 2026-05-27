/**
 * Navegación editorial “Explorar perfiles”.
 * Las claves internas no se muestran en UI; solo `label`.
 * Rutas hub preparadas para fase 2 (enabled: false → enlace seguro a /models).
 */

export type ExploreNavKey =
  | 'vip'
  | 'nuevas'
  | 'espanolas'
  | 'colombianas'
  | 'latinas'
  | 'jovenes'
  | 'maduras'
  | 'elegantes'
  | 'sofisticadas'
  | 'discretas'
  | 'sociales'
  | 'seductoras'
  | 'divertidas'
  | 'cenas'
  | 'eventos'
  | 'viajes';

export type ExploreNavItem = {
  key: ExploreNavKey;
  /** Texto visible — tono editorial / luxury */
  label: string;
  /** Ruta pública cuando el hub exista */
  hubPath: string;
  enabled: boolean;
};

/** Etiquetas visibles (español editorial; sin “menores/mayores de 25”). */
export const EXPLORE_NAV: Record<ExploreNavKey, ExploreNavItem> = {
  vip: {
    key: 'vip',
    label: 'Perfiles VIP',
    hubPath: '/vip',
    enabled: true,
  },
  nuevas: {
    key: 'nuevas',
    label: 'Nuevas incorporaciones',
    hubPath: '/nuevas',
    enabled: true,
  },
  espanolas: {
    key: 'espanolas',
    label: 'Españolas',
    hubPath: '/espanolas',
    enabled: false,
  },
  colombianas: {
    key: 'colombianas',
    label: 'Colombianas',
    hubPath: '/colombianas',
    enabled: false,
  },
  latinas: {
    key: 'latinas',
    label: 'Latinas',
    hubPath: '/colombianas',
    enabled: false,
  },
  jovenes: {
    key: 'jovenes',
    label: 'Jóvenes',
    hubPath: '/menores-25',
    enabled: false,
  },
  maduras: {
    key: 'maduras',
    label: 'Más maduras',
    hubPath: '/mayores-25',
    enabled: false,
  },
  elegantes: {
    key: 'elegantes',
    label: 'Elegantes',
    hubPath: '/elegantes',
    enabled: false,
  },
  sofisticadas: {
    key: 'sofisticadas',
    label: 'Sofisticadas',
    hubPath: '/sofisticadas',
    enabled: false,
  },
  discretas: {
    key: 'discretas',
    label: 'Discretas',
    hubPath: '/discretas',
    enabled: false,
  },
  sociales: {
    key: 'sociales',
    label: 'Sociales',
    hubPath: '/sociales',
    enabled: false,
  },
  seductoras: {
    key: 'seductoras',
    label: 'Seductoras',
    hubPath: '/seductoras',
    enabled: false,
  },
  divertidas: {
    key: 'divertidas',
    label: 'Divertidas',
    hubPath: '/divertidas',
    enabled: false,
  },
  cenas: {
    key: 'cenas',
    label: 'Cenas',
    hubPath: '/cenas',
    enabled: false,
  },
  eventos: {
    key: 'eventos',
    label: 'Eventos',
    hubPath: '/eventos',
    enabled: false,
  },
  viajes: {
    key: 'viajes',
    label: 'Viajes',
    hubPath: '/viajes',
    enabled: false,
  },
};

/** Hubs de ciudad / marca (fase 2). */
export const BRAND_HUBS = {
  escortLujoValencia: {
    label: 'Escort de lujo en Valencia',
    hubPath: '/escort-lujo-valencia',
    enabled: false,
  },
} as const;

export function getExploreHref(key: ExploreNavKey): string {
  const item = EXPLORE_NAV[key];
  return item.enabled ? item.hubPath : '/models';
}
