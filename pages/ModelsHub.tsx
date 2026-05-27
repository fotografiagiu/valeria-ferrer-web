import React, { useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
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

      <div className="bg-[#111111] py-20 px-6 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">
            {hub.introTitle}
          </h1>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <AnimatedCounter
                end={hubModels.length}
                duration={2000}
                className="text-5xl md:text-7xl font-light text-[#c2b2a3]"
              />
              <span className="text-2xl md:text-3xl font-light text-gray-400">Modelos</span>
            </div>
          </div>

          <p className="text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {hub.introText}
          </p>

          <p className="mt-8">
            <Link
              to="/models"
              className="text-[#c2b2a3] text-xs uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Ver todas las modelos
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        <ModelsGrid models={gridModels} />
      </div>
    </div>
  );
};

export default ModelsHub;
