
import React, { useState, useEffect } from 'react';
import CatalogPremiumPreview from '../components/CatalogPremiumPreview';
import ModelFilter from '../components/ModelFilter';
import AnimatedCounter from '../components/AnimatedCounter';
import PageSEOHead from '../components/PageSEOHead';
import modelsData from '../data/models.json';

const Models: React.FC = () => {
  const [filteredModels, setFilteredModels] = useState<any[]>(modelsData);

  useEffect(() => {
    const scrollToFirstSelection = () => {
      const firstCard =
        document.getElementById('models-catalog-selection') ??
        document.getElementById('catalog-horizontal-preview-root');
      if (!firstCard) return;
      const navOffset = 96; // pt-24 — barra fija
      const top = firstCard.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0 });
    };
    requestAnimationFrame(() => requestAnimationFrame(scrollToFirstSelection));
  }, []);

  const modelsSEOData = {
    title: "Modelos y Acompañantes en Valencia | Valeria Ferrer",
    description: "Explora nuestras modelos exclusivas en Valencia. Perfiles únicos de acompañantes sofisticadas para cenas, eventos y momentos especiales. Reserva privada.",
    canonicalUrl: "https://www.valeriaferrer.com/models"
  };

  return (
    <div className="pt-24 min-h-screen">
      <PageSEOHead 
        title={modelsSEOData.title}
        description={modelsSEOData.description}
        canonicalUrl={modelsSEOData.canonicalUrl}
      />
      <div className="bg-[#111111] py-20 px-6 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">Escorts de Lujo <span className="italic luxury-text-gradient">en Valencia</span></h1>
          
          {/* Animated Counter */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <AnimatedCounter 
                end={filteredModels.length} 
                duration={2000}
                className="text-5xl md:text-7xl font-light text-[#c2b2a3]"
              />
              <span className="text-2xl md:text-3xl font-light text-gray-400">Modelos</span>
            </div>
            <p className="text-gray-500 font-light uppercase tracking-[0.2em] text-xs mt-2">Disponibles ahora mismo</p>
          </div>
          
          <p className="text-gray-400 font-light uppercase tracking-[0.3em] text-xs">Las mejores acompañantes VIP y modelos de alto standing. Escorts españolas, rusas y latinas. Discreción garantizada.</p>
        </div>
      </div>
      
      {/* Interactive Filter */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <ModelFilter 
          models={modelsData} 
          onFilter={setFilteredModels} 
        />
      </div>

      {/* PREVIEW: CatalogPremiumPreview (no ModelsGrid) — rama preview/catalog-premium */}
      <CatalogPremiumPreview models={filteredModels} />


          </div>
  );
};

export default Models;
