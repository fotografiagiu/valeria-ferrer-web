import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Crown, Sparkles } from 'lucide-react';
import PageSEOHead from '../components/PageSEOHead';
import LazyImage from '../components/LazyImage';
import { MODELS } from '../constants';
import { EXPLORE_NAV, ExploreNavKey, getExploreHref } from '../data/exploreNav';
import { getHubModels } from '../lib/hubs';
import { getModelCoverImage, getModelCoverThumbnailPath } from '../lib/modelGridImage';
import type { Model } from '../types';

const SEO = {
  title: 'Novedades en Valeria Ferrer | Últimas incorporaciones y mejoras',
  description:
    'Descubre las últimas incorporaciones, perfiles VIP, nuevas formas de explorar y una experiencia más visual e intuitiva en Valeria Ferrer Valencia.',
  canonicalUrl: 'https://www.valeriaferrer.com/novedades',
};

const NAV_SHOWCASE_KEYS: ExploreNavKey[] = [
  'vip',
  'nuevas',
  'espanolas',
  'colombianas',
  'elegantes',
  'sociales',
];

/** Cards compactas del listado — thumbnail comprimido (UI pequeña). */
function modelCardImage(model: Model): string {
  return getModelCoverThumbnailPath(getModelCoverImage(model.image));
}

function modelMetaLine(model: Model): string {
  const place = model.city || model.nationality || 'Valencia';
  if (model.age) return `${model.age} años · ${place}`;
  return place;
}

const NOVEDADES_CARD_WIDTH_PX = 148;

function NovedadesCompactCard({
  model,
  index,
  layout,
}: {
  model: Model;
  index: number;
  layout: 'row' | 'grid';
}) {
  const imageSrc = modelCardImage(model);
  const isRow = layout === 'row';

  return (
    <Link
      to={`/models/${model.slug}`}
      data-model-name={model.name}
      style={isRow ? { width: NOVEDADES_CARD_WIDTH_PX, minWidth: NOVEDADES_CARD_WIDTH_PX } : undefined}
      className={`
        group flex-none overflow-hidden rounded-xl border border-white/5 bg-[#141414]
        shadow-lg transition-all duration-500
        hover:border-[#c2b2a3]/30 hover:shadow-[0_8px_32px_-8px_rgba(194,178,163,0.2)]
        ${isRow ? 'snap-start' : 'min-w-0'}
      `}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <LazyImage
          src={imageSrc}
          alt={`${model.name} — nueva incorporación`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={isRow ? `${NOVEDADES_CARD_WIDTH_PX}px` : '(max-width: 768px) 50vw, 25vw'}
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#c2b2a3]/90 text-black text-[8px] uppercase tracking-[0.2em] font-bold rounded-sm">
          Nueva
        </span>
      </div>
      <div className={`text-center ${isRow ? 'p-3' : 'p-4 md:p-5'}`}>
        <h3
          className={`serif uppercase tracking-wider text-white font-light ${
            isRow ? 'text-sm mb-1' : 'text-lg md:text-xl mb-1.5'
          }`}
        >
          {model.name}
        </h3>
        <p
          className={`uppercase tracking-[0.18em] text-[#c2b2a3]/90 ${
            isRow ? 'text-[9px] leading-snug' : 'text-[10px] md:text-xs'
          }`}
        >
          {modelMetaLine(model)}
        </p>
        <div
          className={`flex items-center justify-center gap-1 text-[#c2b2a3] transition-colors group-hover:text-white uppercase ${
            isRow ? 'mt-2.5 text-[9px] tracking-[0.22em]' : 'mt-3 text-[10px] tracking-[0.28em]'
          }`}
        >
          <span>Ver perfil</span>
          <ChevronRight
            className={`transition-transform group-hover:translate-x-0.5 ${isRow ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
}

/** Solo sección “Nuevas incorporaciones” en /novedades — no usa ModelsGrid. */
function NuevasIncorporacionesShowcase({ models }: { models: Model[] }) {
  if (!models.length) return null;

  return (
    <div className="mb-8">
      {/* Móvil: misma mini-card que desktop, en fila con scroll horizontal */}
      <div className="md:hidden -mx-5 sm:-mx-4">
        <div
          className="
            flex flex-nowrap items-stretch gap-3 overflow-x-auto overflow-y-hidden
            scroll-smooth snap-x snap-proximity
            px-5 sm:px-4 pb-2
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            touch-pan-x overscroll-x-contain
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="Nuevas incorporaciones"
        >
          {models.map((model, index) => (
            <NovedadesCompactCard key={model.slug} model={model} index={index} layout="row" />
          ))}
        </div>
        <p className="text-center text-[9px] uppercase tracking-[0.3em] text-gray-600 mt-3 font-light">
          Desliza para ver más
        </p>
      </div>

      {/* Desktop: fila/grid compacto (sin cambios) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
        {models.map((model, index) => (
          <NovedadesCompactCard key={model.slug} model={model} index={index} layout="grid" />
        ))}
      </div>
    </div>
  );
}

function ExplorePill({ navKey }: { navKey: ExploreNavKey }) {
  const item = EXPLORE_NAV[navKey];
  const href = getExploreHref(navKey);

  return (
    <Link
      to={href}
      className="group rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gray-400 transition-all duration-300 hover:border-[#c2b2a3]/45 hover:text-[#c2b2a3]"
    >
      {navKey === 'vip' ? (
        <>
          <span className="text-gray-400 group-hover:text-gray-300">Perfiles </span>
          <span className="luxury-text-gradient font-light tracking-[0.35em] drop-shadow-[0_0_10px_rgba(194,178,163,0.28)]">
            VIP
          </span>
        </>
      ) : (
        item.label
      )}
    </Link>
  );
}

function EditorialCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-10">
      {eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#c2b2a3]/80 mb-3">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4 serif">{title}</h2>
      {children}
    </article>
  );
}

const CATALOGO_EXPERIENCE_BULLETS = [
  'Diseño editorial premium',
  'Navegación más cómoda en móvil',
  'Fichas más visuales e inmersivas',
  'Acceso rápido a cada perfil',
] as const;

/** Slugs para la captura de pantalla del catálogo (fotos reales). */
const CATALOG_SCREENSHOT_SLUGS = ['key', 'flor', 'monica'] as const;

const SCREENSHOT_PHOTO_MASK =
  'linear-gradient(to right, #000 0%, #000 30%, rgba(0,0,0,0.97) 42%, rgba(0,0,0,0.88) 54%, rgba(0,0,0,0.72) 66%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.26) 88%, rgba(0,0,0,0.1) 96%, transparent 100%)';

const screenshotPhotoMaskStyle: React.CSSProperties = {
  WebkitMaskImage: SCREENSHOT_PHOTO_MASK,
  maskImage: SCREENSHOT_PHOTO_MASK,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
};

function catalogCoverUrl(model: Model): string {
  const raw = model as Model & { coverImageUrl?: string };
  return getModelCoverImage(raw.coverImageUrl || model.image || '');
}

function catalogMetaLine(model: Model): string {
  const parts: string[] = [];
  if (model.age) parts.push(`${model.age} años`);
  if (model.nationality) parts.push(model.nationality);
  return parts.join(' · ');
}

/** Fila miniatura dentro de la captura (no es un enlace suelto). */
function ScreenshotCatalogRow({ model, tall }: { model: Model; tall?: boolean }) {
  const cover = catalogCoverUrl(model);
  const meta = catalogMetaLine(model);

  return (
    <div
      className={`relative flex overflow-hidden rounded-lg border border-[#c2b2a3]/22 bg-[#0a0a0a] ${
        tall ? 'min-h-[72px]' : 'min-h-[58px]'
      }`}
    >
      <div className="pointer-events-none absolute inset-y-3 left-[58%] z-[3] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c2b2a3]/36 to-transparent" />
      <div className="relative min-h-full w-[58%] shrink-0 self-stretch overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt=""
            decoding="async"
            style={screenshotPhotoMaskStyle}
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center px-1.5 py-2 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[65%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_50%_40%,rgba(194,178,163,0.07),transparent_70%)]" />
        <p
          className={`relative serif font-light uppercase leading-none tracking-[0.08em] text-[#ebe3da] ${
            tall ? 'text-[10px]' : 'text-[9px]'
          }`}
        >
          {model.name}
        </p>
        <div className="relative my-0.5 flex w-14 items-center gap-1">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c2b2a3]/45" />
          <Crown className="h-1.5 w-1.5 shrink-0 text-[#c2b2a3]/60" strokeWidth={1.15} />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c2b2a3]/45" />
        </div>
        {meta && (
          <p className="relative max-w-full truncate text-[5.5px] uppercase tracking-[0.1em] text-[#c2b2a3]/75">
            {meta}
          </p>
        )}
        <span className="relative mt-1 rounded-full border border-[#c2b2a3]/40 bg-[#c2b2a3]/[0.05] px-1.5 py-px text-[5px] uppercase tracking-[0.14em] text-[#e8ddd2]/90">
          Ver perfil
        </span>
      </div>
    </div>
  );
}

/** Captura de pantalla del listado en móvil — 3 fichas con portadas reales. */
function CatalogMobileScreenshot() {
  const previewModels = useMemo(
    () =>
      CATALOG_SCREENSHOT_SLUGS.map((slug) => MODELS.find((m) => m.slug === slug)).filter(
        (m): m is Model => Boolean(m)
      ),
    []
  );

  if (!previewModels.length) return null;

  return (
    <figure
      className="mx-auto w-full max-w-[300px]"
      aria-label="Vista previa del catálogo horizontal en móvil"
    >
      <div className="overflow-hidden rounded-[1.35rem] border border-[#c2b2a3]/24 bg-[#060606] p-2 shadow-[0_18px_48px_-16px_rgba(0,0,0,0.92),0_0_32px_-18px_rgba(194,178,163,0.08)]">
        <div className="mb-2 flex items-center justify-center gap-1.5 py-0.5" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-[#c2b2a3]/35" />
          <span className="h-0.5 w-10 rounded-full bg-white/10" />
          <span className="h-1 w-1 rounded-full bg-[#c2b2a3]/35" />
        </div>
        <div className="rounded-xl bg-[#030303] px-2.5 pb-2.5 pt-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c2b2a3]/25" />
            <span className="text-[6px] uppercase tracking-[0.38em] text-[#c2b2a3]/55">Catálogo</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c2b2a3]/25" />
          </div>
          <div className="pointer-events-none select-none space-y-1.5">
            {previewModels.map((model, index) => (
              <ScreenshotCatalogRow key={model.slug} model={model} tall={index === 0} />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[8px] uppercase tracking-[0.3em] text-gray-600">
        Vista previa en móvil
      </figcaption>
    </figure>
  );
}

function NuevaExperienciaCatalogoBlock() {
  return (
    <article className="rounded-2xl border border-[#c2b2a3]/22 bg-[#0c0c0c] p-6 md:p-8">
      <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#c2b2a3]/75">
        Catálogo renovado
      </p>
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_min(320px,38%)] md:items-start md:gap-8 lg:gap-10">
        <div>
          <h2 className="serif mb-4 text-2xl font-light tracking-wide md:text-[1.65rem]">
            Nueva experiencia de catálogo
          </h2>
          <p className="mb-5 max-w-2xl text-sm font-light leading-relaxed text-gray-400 md:text-base">
            Hemos renovado la forma de explorar los perfiles para ofrecer una navegación más visual,
            elegante y fluida. Ahora cada ficha destaca mejor la imagen, los datos clave y el acceso
            directo al perfil.
          </p>
          <ul className="mb-6 space-y-2">
            {CATALOGO_EXPERIENCE_BULLETS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[11px] font-light uppercase tracking-[0.14em] text-gray-500 md:text-xs md:tracking-[0.16em]"
              >
                <span className="mt-[0.35rem] h-1 w-1 shrink-0 rotate-45 bg-[#c2b2a3]/55" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/models"
            className="inline-flex items-center gap-2 border border-[#c2b2a3]/35 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#c2b2a3] transition-colors duration-300 hover:border-[#c2b2a3]/55 hover:bg-[#c2b2a3]/[0.06] hover:text-[#ebe3da]"
          >
            Ver catálogo
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
          </Link>
        </div>
        <CatalogMobileScreenshot />
      </div>
    </article>
  );
}

const Novedades: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const newModels = useMemo(() => getHubModels('nuevas'), []);

  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0a]">
      <PageSEOHead
        title={SEO.title}
        description={SEO.description}
        canonicalUrl={SEO.canonicalUrl}
      />

      {/* Hero */}
      <header className="bg-[#111111] px-6 py-14 md:py-20 border-b border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c2b2a3] mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.25} />
            Actualizado
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-3">
            Novedades en <span className="italic luxury-text-gradient">Valeria Ferrer</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.32em] text-gray-500 text-[#c2b2a3]/55 font-light mb-6">
            Última actualización · Mayo 2026
          </p>
          <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
            Descubre las últimas incorporaciones, mejoras y formas de explorar perfiles dentro de
            Valeria Ferrer. Hemos preparado una experiencia más visual, rápida e intuitiva para que
            encuentres el perfil que mejor encaja contigo.
          </p>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 space-y-10 md:space-y-12">
        {/* 1. Nueva navegación */}
        <EditorialCard title="Nueva navegación por perfiles" eyebrow="Explorar con un toque">
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            En cada ficha encontrarás accesos rápidos para descubrir perfiles por estilo, origen y
            experiencia. Una forma más natural de explorar sin perder la estética premium del sitio.
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
            {NAV_SHOWCASE_KEYS.map((key) => (
              <ExplorePill key={key} navKey={key} />
            ))}
          </div>
          <p className="text-[11px] text-gray-500 font-light">
            VIP y Nuevas incorporaciones ya tienen su propia selección. El resto de accesos te llevan
            al catálogo mientras ampliamos las secciones dedicadas.
          </p>
        </EditorialCard>

        <NuevaExperienciaCatalogoBlock />

        {/* 2. Nuevas incorporaciones */}
        <EditorialCard title="Nuevas incorporaciones" eyebrow="Recién llegadas">
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            Perfiles recientes con el mismo criterio editorial: presencia, discreción y una imagen
            cuidada al detalle.
          </p>
          {newModels.length > 0 ? (
            <NuevasIncorporacionesShowcase models={newModels} />
          ) : (
            <p className="text-gray-500 text-sm mb-6">Próximamente nuevas incorporaciones.</p>
          )}
          <Link
            to="/nuevas"
            className="inline-flex items-center gap-2 text-[#c2b2a3] text-xs uppercase tracking-[0.3em] hover:text-white transition-colors"
          >
            Ver todas las nuevas incorporaciones
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </EditorialCard>

        {/* 3. Perfiles VIP */}
        <EditorialCard title="Perfiles VIP" eyebrow="Exclusividad y presencia">
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            Una selección dedicada para quien busca discreción, clase y un trato a la altura de
            planes exclusivos. Perfiles VIP con su propio espacio en la web.
          </p>
          <Link
            to="/vip"
            className="inline-flex items-center justify-center px-8 py-4 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-500"
          >
            Explorar perfiles{' '}
            <span className="luxury-text-gradient ml-1 tracking-[0.35em]">VIP</span>
          </Link>
        </EditorialCard>

        {/* 4. Móvil */}
        <EditorialCard title="Experiencia más intuitiva en móvil" eyebrow="Descubrir al deslizar">
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
            El bloque <span className="text-[#c2b2a3]">Explorar perfiles</span> en cada ficha se
            desplaza suavemente y puedes tomar el control con el dedo en cualquier momento. Ideal
            para descubrir categorías sin salir del perfil que estás viendo.
          </p>
          <p className="text-gray-500 text-sm font-light">
            Desliza, explora y vuelve al catálogo cuando quieras — todo con la misma sensación
            premium de siempre.
          </p>
        </EditorialCard>

        {/* CTA final */}
        <div className="text-center pt-4 pb-8">
          <Link
            to="/models"
            className="inline-block px-12 py-5 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#c2b2a3] transition-colors"
          >
            Ver todas las modelos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Novedades;
