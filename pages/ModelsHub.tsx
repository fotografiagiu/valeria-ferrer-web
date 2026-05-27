import React, { useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ModelsGrid from '../components/ModelsGrid';
import AnimatedCounter from '../components/AnimatedCounter';
import PageSEOHead from '../components/PageSEOHead';
import type { HubKey } from '../data/hubs';
import { getHubDef } from '../data/hubs';
import { getHubModels } from '../lib/hubs';
import type { Model } from '../types';

type Props = {
  hubKey: HubKey;
};

/** Formato esperado por ModelsGrid / ModelCard (coverImageUrl, slug, etc.). */
function toGridModel(m: Model) {
  return {
    slug: m.slug,
    id: m.slug,
    name: m.name,
    coverImageUrl: m.image,
    featured: m.featured,
    nationality: m.nationality,
    age: m.age,
    height: m.height,
  };
}

const ModelsHub: React.FC<Props> = ({ hubKey }) => {
  const hub = getHubDef(hubKey);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hubKey]);

  const hubModels = useMemo(() => getHubModels(hubKey), [hubKey]);
  const gridModels = useMemo(() => hubModels.map(toGridModel), [hubModels]);

  if (!hub.enabled) {
    return <Navigate to="/models" replace />;
  }

  return (
    <div className="pt-24 min-h-screen">
      <PageSEOHead
        title={hub.title}
        description={hub.description}
        canonicalUrl={hub.canonicalUrl}
      />

      {/* Header compacto: las cards deben asomar en el primer viewport (móvil). */}
      <div className="bg-[#111111] px-6 pt-8 pb-6 md:pt-10 md:pb-8 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-light mb-3 md:mb-4 tracking-wider">
            {hub.introTitle}
          </h1>

          <div className="mb-3 md:mb-4">
            <div className="flex items-center justify-center space-x-3 md:space-x-4">
              <AnimatedCounter
                end={hubModels.length}
                duration={2000}
                className="text-4xl md:text-6xl font-light text-[#c2b2a3]"
              />
              <span className="text-lg md:text-2xl font-light text-gray-400">Modelos</span>
            </div>
          </div>

          <p className="text-gray-400 font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {hub.introText}
          </p>

          <div
            className="mt-4 flex flex-col items-center gap-1.5 text-gray-500"
            aria-hidden="true"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
              Desliza para ver los perfiles
            </p>
            <ChevronDown
              className="h-4 w-4 text-[#c2b2a3]/50"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>

          <p className="mt-4 md:mt-5">
            <Link
              to="/models"
              className="text-[#c2b2a3] text-[10px] md:text-xs uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Ver todas las modelos
            </Link>
          </p>
        </div>
      </div>

      {/*
        Acercamos el grid y ocultamos el bloque SEO duplicado de ModelsGrid
        (solo en hubs, sin tocar el componente global).
      */}
      <div
        className="
          max-w-[1600px] mx-auto px-6 pb-12 -mt-1
          [&_section]:!pt-6 [&_section]:md:!pt-10 [&_section]:!pb-16
          [&_section>div>div.text-center]:!hidden
        "
      >
        <ModelsGrid models={gridModels} />
      </div>
    </div>
  );
};

export default ModelsHub;
