import { SITE_ORIGIN, MODELS_PATH, readJson } from './lib/seo-assets.mjs';

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
    path: '/escorts-de-lujo-valencia',
    title: 'Escorts de lujo en Valencia | Selección premium',
    description:
      'Acompañantes premium en Valencia con perfiles cuidados, fotos reales y atención discreta. Consulta disponibilidad y reserva de forma privada.',
    canonical: `${SITE_ORIGIN}/escorts-de-lujo-valencia`,
  },
  {
    path: '/fees',
    title: 'Tarifas de escorts en Valencia | Valeria Ferrer',
    description:
      'Consulta tarifas orientativas de escorts y acompañantes en Valencia desde 80 €. Precios según duración, modelo, disponibilidad y desplazamiento.',
    canonical: `${SITE_ORIGIN}/fees`,
  },
  {
    path: '/booking',
    title: 'Reservas | Valeria Ferrer Valencia',
    description:
      'Reserva tu experiencia con Valeria Ferrer. Formulario confidencial para solicitar cita con nuestras modelos exclusivas en Valencia.',
    canonical: `${SITE_ORIGIN}/booking`,
  },
  {
    path: '/contact',
    title: 'Contacto | Valeria Ferrer Valencia',
    description:
      'Contacta con Valeria Ferrer en Valencia. Atención exclusiva y discreta por Telegram, teléfono o email para reservas y consultas.',
    canonical: `${SITE_ORIGIN}/contact`,
  },
  {
    path: '/about',
    title: 'Sobre Valeria Ferrer | Agencia de Modelos de Lujo en Valencia',
    description:
      'Conoce Valeria Ferrer: agencia de modelos de lujo en Valencia. Perfiles verificados, discreción absoluta y acompañamiento exclusivo de alto standing.',
    canonical: `${SITE_ORIGIN}/about`,
  },
  {
    path: '/blog',
    title: 'Blog Valeria Ferrer | Guías y Acompañantes VIP en Valencia',
    description:
      'Guías exclusivas sobre escorts y acompañantes VIP en Valencia: zonas, hoteles de lujo, servicios premium y consejos para reservas discretas.',
    canonical: `${SITE_ORIGIN}/blog`,
  },
  {
    path: '/novedades',
    title: 'Novedades en Valeria Ferrer | Últimas incorporaciones y mejoras',
    description:
      'Descubre las últimas incorporaciones, perfiles VIP, nuevas formas de explorar y una experiencia más visual e intuitiva en Valeria Ferrer Valencia.',
    canonical: `${SITE_ORIGIN}/novedades`,
  },
  {
    path: '/colombianas',
    title: 'Colombianas | Valeria Ferrer',
    description:
      'Explora perfiles colombianas en Valencia: presencia, carisma y estilo en una selección premium.',
    canonical: `${SITE_ORIGIN}/colombianas`,
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
  title: 'Valeria Ferrer | Escorts en Valencia',
  description:
    'Descubre nuestras escorts y acompañantes exclusivas en Valencia. Modelos sofisticadas para eventos, cenas y momentos especiales. Atención discreta y reserva privada.',
  canonical: SITE_ORIGIN,
};

export function routeToDistRelativePath(routePath) {
  if (routePath === '/') return 'index.html';
  const trimmed = routePath.replace(/^\/+|\/+$/g, '');
  return `${trimmed}/index.html`;
}

/**
 * Profile pages are included in the sitemap but React's SEOHead runs only
 * after JavaScript. Render the same per-model metadata into initial HTML.
 * No body markup is injected, so React remains the only UI owner.
 */
export function seoRouteForActiveModel(model) {
  if (!model?.slug || !/^[a-z0-9_-]+$/i.test(model.slug)) {
    throw new Error('Invalid model slug for SEO route: ' + String(model?.slug));
  }
  const city = model.city || 'Valencia';
  const nationality = model.nationality || 'Española';
  const isVIP = Boolean(model.vip);
  const category = nationality === 'Colombiana' ? 'Escort' : 'Acompañante';
  const title = model.seoTitle?.trim() ||
    (isVIP
      ? `${model.name} VIP | Acompañante VIP en ${city} | Valeria Ferrer`
      : `${model.name} | ${category} ${nationality} en ${city} | Valeria Ferrer`);
  const age = model.age;
  const description = model.seoDescription?.trim() ||
    (isVIP
      ? `${model.name}, acompañante VIP exclusiva de ${age} años en ${city}. Experiencias de lujo, sofisticación refinada y atención discreta. Reserva VIP privada.`
      : typeof age === 'number' && !Number.isNaN(age)
        ? `${model.name}, ${category.toLowerCase()} ${nationality} de ${age} años en ${city}. Perfil exclusivo, atención discreta y reserva privada para momentos especiales.`
        : model.description?.trim()
          ? model.description.trim().replace(/\\s+/g, ' ').slice(0, 160)
          : `${model.name}, ${category.toLowerCase()} ${nationality} en ${city}. Perfil exclusivo, atención discreta y reserva privada para momentos especiales.`);
  return {
    path: `/models/${model.slug}`,
    title,
    description,
    canonical: `${SITE_ORIGIN}/models/${model.slug}`,
  };
}

export const MODEL_SEO_ROUTES = readJson(MODELS_PATH)
  .filter((model) => model.active !== false)
  .map(seoRouteForActiveModel);
