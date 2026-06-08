import { SITE_ORIGIN } from './lib/seo-assets.mjs';

/** Rutas prerenderizadas en Sub-fase 1C. */
export const PRERENDER_ROUTES = [
  {
    path: '/',
    canonical: SITE_ORIGIN,
    title: 'Valeria Ferrer | Escorts y Acompañantes en Valencia',
    timeoutMs: 25000,
  },
  {
    path: '/models',
    canonical: `${SITE_ORIGIN}/models`,
    title: 'Modelos y Acompañantes en Valencia | Valeria Ferrer',
    timeoutMs: 25000,
  },
  {
    path: '/escorts-valencia',
    canonical: `${SITE_ORIGIN}/escorts-valencia`,
    title: 'Escorts en Valencia | Agencia Premium Valeria Ferrer',
    timeoutMs: 25000,
  },
  {
    path: '/fees',
    canonical: `${SITE_ORIGIN}/fees`,
    title: 'Tarifas de escorts en Valencia | Valeria Ferrer',
    timeoutMs: 25000,
  },
  {
    path: '/blog',
    canonical: `${SITE_ORIGIN}/blog`,
    title: 'Blog Valeria Ferrer | Guías y Acompañantes VIP en Valencia',
    timeoutMs: 25000,
  },
  {
    path: '/blog/guia-escorts-valencia',
    canonical: `${SITE_ORIGIN}/blog/guia-escorts-valencia`,
    title: 'Guía Escorts Valencia 2026 | Las Mejores Acompañantes VIP',
    timeoutMs: 30000,
  },
  {
    path: '/models/luna',
    canonical: `${SITE_ORIGIN}/models/luna`,
    title: 'Luna | Escort Colombiana en Valencia | Valeria Ferrer',
    timeoutMs: 45000,
  },
  {
    path: '/models/naty',
    canonical: `${SITE_ORIGIN}/models/naty`,
    title: 'Naty | Escort Colombiana en Valencia | Valeria Ferrer',
    timeoutMs: 45000,
  },
  {
    path: '/models/flor',
    canonical: `${SITE_ORIGIN}/models/flor`,
    title: 'Flor | Acompañante Española en Valencia | Valeria Ferrer',
    timeoutMs: 45000,
  },
  {
    path: '/models/paula-vip',
    canonical: `${SITE_ORIGIN}/models/paula-vip`,
    title: 'Paula (VIP) VIP | Acompañante VIP en Valencia | Valeria Ferrer',
    timeoutMs: 45000,
  },
  {
    path: '/models/carla',
    canonical: `${SITE_ORIGIN}/models/carla`,
    title: 'Carla | Acompañante Española en Valencia | Valeria Ferrer',
    timeoutMs: 45000,
  },
];

export function routeToDistRelativePath(routePath) {
  if (routePath === '/') return 'index.html';
  const trimmed = routePath.replace(/^\/+|\/+$/g, '');
  return `${trimmed}/index.html`;
}
