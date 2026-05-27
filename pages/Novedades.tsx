import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import PageSEOHead from '../components/PageSEOHead';
import LazyImage from '../components/LazyImage';
import { EXPLORE_NAV, ExploreNavKey, getExploreHref } from '../data/exploreNav';
import { getHubModels } from '../lib/hubs';
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

function getThumbnailPath(coverImageUrl: string): string {
  const pathParts = coverImageUrl.split('/');
  const optimizedIndex = pathParts.indexOf('chicas-optimized');
  const chicasIndex = pathParts.indexOf('chicas');

  let baseDirectory = '';
  if (optimizedIndex !== -1) {
    baseDirectory = pathParts[optimizedIndex + 1];
  } else if (chicasIndex !== -1) {
    baseDirectory = pathParts[chicasIndex + 1];
  }

  if (!baseDirectory) {
    if (pathParts.includes('gallery')) {
      const galleryIndex = pathParts.indexOf('gallery');
      const directory = pathParts[galleryIndex - 1];
      return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
    }
    const directory = pathParts[pathParts.length - 2];
    return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
  }

  return `/chicas-thumbnails/${baseDirectory}/cover-thumbnail.jpg`;
}

function modelCardImage(model: Model): string {
  return model.slug === 'mia' ? model.image : getThumbnailPath(model.image);
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
