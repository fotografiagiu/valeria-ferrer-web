import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MODELS } from '../constants';
import { Grid3X3, LayoutGrid } from 'lucide-react';

const ModelCard: React.FC<{ model: any; index: number; isDoubleView?: boolean }> = ({
  model,
  index,
  isDoubleView = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const adaptedModel = {
    id: model.slug,
    name: model.name,
    image: model.coverImageUrl,
    hoverImage: model.images?.[1] || model.coverImageUrl,
    location: model.city || 'Valencia',
    featured: model.featured,
  };

  const generateAltText = (
    modelName: string,
    location: string,
    nationality?: string,
    age?: number
  ) => {
    const variations = [
      `${modelName} - Acompañante VIP en ${location}`,
      `${modelName} - Modelo de compañía en ${location}`,
      `${modelName} - Chica exclusiva ${location}`,
      `${modelName} - Compañera de lujo ${location}`,
      `${modelName} - Modelo VIP ${nationality ? nationality : ''} ${location}`.trim(),
      `${modelName} - Acompañamiento discreto ${location}`,
      `${modelName} - Modelo profesional ${location}`,
      `${modelName} - Chica de alta gama ${location}`,
    ];

    const variationIndex = (modelName.charCodeAt(0) + index) % variations.length;
    return variations[variationIndex];
  };

  const generateHoverAltText = (modelName: string, location: string) => {
    const variations = [
      `${modelName} - Galería fotográfica profesional`,
      `${modelName} - Sesión exclusiva ${location}`,
      `${modelName} - Fotos profesionales ${location}`,
      `${modelName} - Imágenes exclusivas`,
      `${modelName} - Galería de alta calidad`,
      `${modelName} - Sesión VIP ${location}`,
      `${modelName} - Fotografías profesionales`,
      `${modelName} - Colección exclusiva`,
    ];

    const variationIndex = (modelName.charCodeAt(1) + index) % variations.length;
    return variations[variationIndex];
  };

  const generateDescription = (modelName: string, location: string, nationality?: string) => {
    const variations = [
      `Modelo exclusiva ${location} • Compañía VIP`,
      `Acompañante de lujo ${location} • Alta gama`,
      `Chica profesional ${location} • Discreción`,
      `Modelo VIP ${location} • Experiencia única`,
      `Compañera exclusiva ${location} • Lujo`,
      `Modelo de alta clase ${location} • Elegancia`,
      `Acompañamiento premium ${location} • Sofisticación`,
      `Chica discreta ${location} • Profesionalismo`,
    ];

    const variationIndex = (modelName.charCodeAt(2) + index) % variations.length;
    return variations[variationIndex];
  };

  const altText = generateAltText(
    adaptedModel.name,
    adaptedModel.location,
    model.nationality,
    model.age
  );

  const hoverAltText = generateHoverAltText(adaptedModel.name, adaptedModel.location);

  const description = generateDescription(
    adaptedModel.name,
    adaptedModel.location,
    model.nationality
  );

  return (
    <div
      itemScope
      itemType="https://schema.org/Person"
      className="group relative overflow-hidden bg-[#1a1a1a] rounded-lg shadow-lg hover:shadow-[0_10px_40px_rgba(194,178,163,0.15)] transition-all duration-500 transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Link to={`/models/${adaptedModel.id}`} className="block" itemProp="url">
        <div className="aspect-[2/3] relative overflow-hidden transform-gpu">
          <img
            src={adaptedModel.image}
            alt={altText}
            title={altText}
            loading="lazy"
            width="400"
            height="600"
            itemProp="image"
            className={`w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          <img
            src={adaptedModel.hoverImage}
            alt={hoverAltText}
            title={hoverAltText}
            loading="lazy"
            width="400"
            height="600"
            className={`absolute inset-0 w-full h-full object-cover transform-gpu will-change-opacity transition-opacity duration-700 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {(adaptedModel.name === 'Teresa' ||
            adaptedModel.name === 'Emma' ||
            adaptedModel.name === 'Kimberly') && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30">
              <span className="px-2.5 py-1 md:px-3 md:py-1 bg-[#c2b2a3] text-black text-[10px] md:text-[9px] tracking-[0.2em] uppercase font-bold rounded-sm shadow-lg">
                Nueva
              </span>
            </div>
          )}

          {(adaptedModel.featured || adaptedModel.name.includes('VIP')) && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-30">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#c2b2a3]/20 to-[#c2b2a3]/10 blur-md" />
                <div className="relative flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#c2b2a3]/10 to-[#c2b2a3]/5 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full">
                  <div className="w-3 h-3 bg-[#c2b2a3] rounded-full" />
                  <span className="text-[#c2b2a3] text-[11px] md:text-[12px] tracking-[0.3em] uppercase font-light">
                    VIP
                  </span>
                </div>
              </div>
            </div>
          )}

          <div
            className={`absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-20 ${
              isHovered ? 'translate-y-0' : 'translate-y-12'
            } ${isDoubleView ? 'hidden md:block' : ''}`}
          >
            <span className="px-3 py-2 bg-white/10 backdrop-blur-md text-[10px] tracking-[0.3em] uppercase font-bold border border-white/20 hover:bg-white/20 transition-colors">
              Ver Perfil
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 relative z-10 text-center">
          <h3
            className="text-xl md:text-2xl tracking-widest uppercase mb-1 font-light"
            itemProp="name"
          >
            {adaptedModel.name}
          </h3>

          <p
            className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#c2b2a3]"
            itemProp="address"
          >
            {adaptedModel.location}
          </p>

          {model.age && model.height && (
            <p className="text-[9px] text-gray-500 mt-2 tracking-[0.1em] uppercase">
              {model.age} años • {model.height} • {model.nationality || 'Española'}
            </p>
          )}

          <p className="text-[8px] text-gray-600 mt-1 tracking-[0.1em] uppercase">
            {description}
          </p>

          <meta itemProp="jobTitle" content={description} />
          <meta itemProp="worksFor" content="Valeria Ferrer Agency Escorts Valencia" />
          <meta itemProp="addressLocality" content="Valencia" />
          <meta itemProp="addressRegion" content="Comunidad Valenciana" />
        </div>
      </Link>
    </div>
  );
};

interface ModelsGridProps {
  models?: any[];
}

const ModelsGrid: React.FC<ModelsGridProps> = ({ models = MODELS }) => {
  const [viewMode, setViewMode] = useState<'normal' | 'double'>('normal');

  const handleViewChange = (mode: 'normal' | 'double') => {
    setViewMode(mode);
  };

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-0 md:px-6">
        <div className="text-center mb-16 px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            Modelos Exclusivas <span className="italic">Compañía VIP Valencia</span>
          </h2>

          <p className="text-sm text-gray-400 mb-6 max-w-2xl mx-auto">
            💋 Modelos Exclusivas Valencia • Acompañantes VIP • Compañía de Lujo •
            Discreción Absoluta • Servicios Premium
          </p>

          <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto mb-8" />

          <div className="flex flex-col justify-center items-center space-y-4 mb-8 md:hidden">
            <div className="flex items-center space-x-4">
              <span className="text-[10px] text-[#c2b2a3] uppercase tracking-[0.3em]">
                Vista:
              </span>

              <div className="flex bg-[#1a1a1a] border border-[#c2b2a3]/20 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => handleViewChange('normal')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    viewMode === 'normal'
                      ? 'bg-[#c2b2a3] text-black'
                      : 'text-[#c2b2a3] hover:text-white'
                  }`}
                >
                  <Grid3X3 size={16} />
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
                    Normal
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleViewChange('double')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    viewMode === 'double'
                      ? 'bg-[#c2b2a3] text-black'
                      : 'text-[#c2b2a3] hover:text-white'
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
                    2x2
                  </span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-light max-w-xs">
                {viewMode === 'normal'
                  ? 'Visualiza las fichas en grande - Navegación vertical en móvil'
                  : 'Visualiza las fichas en formato 2x2 - Más modelos visibles'}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-8 md:gap-6 lg:gap-8 ${
            viewMode === 'normal'
              ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {models.map((model, index) => (
            <ModelCard
              key={model.slug || model.id}
              model={model}
              index={index}
              isDoubleView={viewMode === 'double'}
            />
          ))}
        </div>

        <div className="mt-16 text-center px-4 md:px-0">
          <Link
            to="/models"
            className="inline-block px-12 py-5 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#c2b2a3] transition-colors"
          >
            Ver Todas las Modelos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModelsGrid;
