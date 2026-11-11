/**
 * Faithful, visitor-visible HTML shell for the most important landing pages.
 * These fragments are REPLACED by React's createRoot at startup; when JS is
 * unavailable the heading, context and real internal links remain usable.
 * Never inject keyword-stuffed text or content not present in React.
 */
import { MODELS_PATH, readJson } from './lib/seo-assets.mjs';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const activeModels = readJson(MODELS_PATH).filter(model =>
  model.active !== false && /^[a-z0-9_-]+$/i.test(model.slug)
);

const link = (href, label) =>
  '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';

const categories = [
  ['/vip','Perfiles VIP'],
  ['/nuevas','Nuevas incorporaciones'],
  ['/colombianas','Colombianas'],
  ['/espanolas','Españolas'],
  ['/jovenes','Jóvenes'],
  ['/maduras','Más maduras'],
];

const modelLinks = activeModels
  .slice(0, 12)
  .map(m => link('/models/' + m.slug, m.name))
  .join(' · ');

const sharedStyle = 'color:#f4e6d7;background:#160c10;font-family:Georgia,serif;padding:26px max(18px,8vw) 28px;min-height:280px';
const navStyle = 'display:flex;flex-wrap:wrap;gap:14px;margin:18px 0;line-height:1.7';
const titleStyle = 'font-weight:400;font-size:clamp(2.3rem,6vw,5rem);margin:12px 0;line-height:1.05';

export const STATIC_HOME_BODY = [
  '<div data-seo-initial-shell="home" style="' + sharedStyle + '">',
  '<header><p>VALERIA FERRER · AGENCIA PREMIUM EN VALENCIA</p></header>',
  '<main>',
  '<h1 style="' + titleStyle + '">Escorts en Valencia</h1>',
  '<p>Elegancia · Sensualidad · Exclusividad</p>',
  '<p>Descubre los perfiles disponibles de Valeria Ferrer. Fotografías reales, máxima discreción y atención personalizada en Valencia.</p>',
  '<nav aria-label="Navegación principal" style="' + navStyle + '">',
  link('/models','Descubrir perfiles'),
  link('/booking','Reservar ahora'),
  '</nav>',
  '<nav aria-label="Categorías de perfiles" style="' + navStyle + '">',
  ...categories.map(([path,name])=>link(path,name)),
  '</nav>',
  '<section><h2>Escorts en Valencia</h2><p>' + modelLinks + '</p></section>',
  '</main></div>',
].join('');

const hubBodies = {
  '/vip': [
    'Perfiles VIP',
    'Una selección editorial para quien busca discreción, presencia y un trato a la altura de planes exclusivos.',
  ],
  '/nuevas': [
    'Nuevas incorporaciones',
    'Perfiles recientes seleccionados para mantener el catálogo vivo, con el mismo criterio premium y editorial.',
  ],
  '/colombianas': [
    'Colombianas',
    'Carisma latino y presencia cuidada, en una selección editorial pensada para planes con personalidad.',
  ],
  '/espanolas': [
    'Españolas',
    'Elegancia natural, trato cercano y una presencia cuidada. Selección editorial de perfiles españolas.',
  ],
  '/jovenes': [
    'Jóvenes',
    'Una selección editorial con un aire más fresco, manteniendo siempre discreción, clase y presencia.',
  ],
  '/maduras': [
    'Más maduras',
    'Perfiles con una energía más madura, ideales para quien busca química serena, conversación y clase.',
  ],
};

function hubBody(path, heading, description) {
  return [
    '<div data-seo-initial-shell="' + escapeHtml(path) + '" style="' + sharedStyle + '">',
    '<main>',
    '<h1 style="' + titleStyle + '">' + escapeHtml(heading) + '</h1>',
    '<p>' + escapeHtml(description) + '</p>',
    '<nav aria-label="Explorar perfiles" style="' + navStyle + '">',
    link('/models','Ver todas las modelos'),
    link('/','Escorts en Valencia'),
    link('/escorts-de-lujo-valencia','Escorts de lujo'),
    '</nav>',
    '</main></div>',
  ].join('');
}

export const STATIC_BODY_BY_PATH = Object.fromEntries(
  Object.entries(hubBodies).map(([path, [heading,description]]) =>
    [path, hubBody(path,heading,description)])
);

export const STATIC_BODY_CHECKS = Object.fromEntries(
  Object.keys(hubBodies).map(path => [
    path,
    [
      {label:'unique H1',pattern:/<h1\b[^>]*>[^<]+<\/h1>/i},
      {label:'catalog link',pattern:/href="\/models"/i},
      {label:'real visible body',pattern:/data-seo-initial-shell=/i},
    ],
  ])
);
