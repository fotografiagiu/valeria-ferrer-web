import { SITE_ORIGIN } from './lib/seo-assets.mjs';

/** Rutas con inyección SEO estática en build (v1). Alineado con runtime PageSEOHead. */
export const SEO_INJECT_ROUTES = [
  {
    path: '/models',
    title: 'Chicas disponibles en Valencia | Valeria Ferrer',
    description:
      'Consulta chicas disponibles en Valencia con fotos reales, perfiles actualizados y contacto discreto. Accede a cada ficha y revisa disponibilidad.',
    canonical: `${SITE_ORIGIN}/models`,
  },
  {
    path: '/escorts-valencia',
    title: 'Escorts Valencia | Fotos reales y perfiles actualizados',
    description:
      'Consulta escorts en Valencia con fotos reales, perfiles actualizados y contacto discreto. Revisa disponibilidad y accede a cada ficha.',
    canonical: `${SITE_ORIGIN}/escorts-valencia`,
  },
  {
    path: '/escorts-de-lujo-valencia',
    title: 'Escorts de lujo en Valencia | Perfiles VIP',
    description:
      'Acompañantes premium en Valencia con perfiles cuidados, fotos reales y atención discreta. Consulta disponibilidad y reserva de forma privada.',
    canonical: `${SITE_ORIGIN}/escorts-de-lujo-valencia`,
  },
  {
    path: '/casting',
    title: 'Casting en Valencia | Valeria Ferrer',
    description:
      'Información para nuevas candidatas interesadas en formar parte de Valeria Ferrer en Valencia. Contacto privado y proceso discreto.',
    canonical: `${SITE_ORIGIN}/casting`,
  },
  {
    path: '/vip',
    title: 'Perfiles VIP | Valeria Ferrer',
    description:
      'Explora perfiles VIP con presencia, discreción y una estética cuidada. Selección editorial en Valencia.',
    canonical: `${SITE_ORIGIN}/vip`,
  },
  {
    path: '/espanolas',
    title: 'Españolas | Valeria Ferrer',
    description: 'Explora perfiles españolas en Valencia: elegancia natural y una estética premium.',
    canonical: `${SITE_ORIGIN}/espanolas`,
  },
  {
    path: '/jovenes',
    title: 'Jóvenes | Valeria Ferrer',
    description:
      'Perfiles jóvenes en Valencia, con una selección cuidada y una estética premium — sin sensación de marketplace.',
    canonical: `${SITE_ORIGIN}/jovenes`,
  },
  {
    path: '/nuevas',
    title: 'Nuevas incorporaciones | Valeria Ferrer',
    description:
      'Descubre nuevas incorporaciones: perfiles recientes con estilo, presencia y un enfoque premium en Valencia.',
    canonical: `${SITE_ORIGIN}/nuevas`,
  },
  {
    path: '/maduras',
    title: 'Más maduras | Valeria Ferrer',
    description: 'Perfiles con una energía más madura y una selección editorial premium en Valencia.',
    canonical: `${SITE_ORIGIN}/maduras`,
  },
];

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

/** Valores esperados de la home en dist/index.html (no se reescribe). */
export const HOME_SEO_EXPECTED = {
  title: 'Valeria Ferrer | Escorts y Acompañantes en Valencia',
  description:
    'Descubre nuestras escorts y acompañantes exclusivas en Valencia. Modelos sofisticadas para eventos, cenas y momentos especiales. Atención discreta y reserva privada.',
  canonical: SITE_ORIGIN,
};

export function routeToDistRelativePath(routePath) {
  if (routePath === '/') return 'index.html';
  const trimmed = routePath.replace(/^\/+|\/+$/g, '');
  return `${trimmed}/index.html`;
}
