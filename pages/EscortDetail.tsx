import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check, Phone, MapPin, Star, Sparkles, ChevronLeft, ChevronRight, Globe, Heart, Calendar } from 'lucide-react';
import GalleryModal from '../components/GalleryModal';
import MODELS_SEO from '../data/models-seo.json';

interface ModelSEO {
  name: string;
  slug: string;
  nationality: string;
  age: number;
  hair: string;
  height: string;
  weight: string;
  measurements: string;
  languages: string[];
  breast: string;
  shortHeadline: string;
  seoTitle: string;
  seoDescription: string;
  services: string[];
  images: string[];
  altImages: string[];
  longDescription: string;
  availability: string;
  location: string;
  whatsapp: string;
  vip?: boolean;
}

const EscortDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const model = MODELS_SEO.find(m => m.slug === slug) as ModelSEO | undefined;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  // Find previous and next models
  const currentIndex = MODELS_SEO.findIndex(m => m.slug === slug);
  const previousModel = currentIndex > 0 ? MODELS_SEO[currentIndex - 1] : null;
  const nextModel = currentIndex < MODELS_SEO.length - 1 ? MODELS_SEO[currentIndex + 1] : null;

  const navigateToModel = (modelSlug: string) => {
    navigate(`/escorts-valencia/${modelSlug}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!model) {
    return (
      <>
        <Helmet>
          <title>Escort no encontrada | Valeria Ferrer</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0a]">
          <h1 className="text-4xl serif mb-4 luxury-text-gradient uppercase tracking-widest">Escort no encontrada</h1>
          <p className="text-gray-400 mb-8">La escort que buscas no está disponible o ha sido eliminada.</p>
          <Link to="/escorts-valencia" className="text-[#c2b2a3] uppercase tracking-[0.3em] text-xs underline underline-offset-8 decoration-[#c2b2a3]/30">
            Ver todas las escorts
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{model.seoTitle}</title>
        <meta name="description" content={model.seoDescription} />
        <meta name="keywords" content={`${model.name}, escort ${model.nationality.toLowerCase()}, escorts valencia, ${model.services.join(', ')}`} />
        <link rel="canonical" href={`https://www.valeriaferrer.com/escorts-valencia/${model.slug}`} />
        <meta property="og:title" content={model.seoTitle} />
        <meta property="og:description" content={model.seoDescription} />
        <meta property="og:image" content={`https://www.valeriaferrer.com${model.images[0]}`} />
        <meta property="og:url" content={`https://www.valeriaferrer.com/escorts-valencia/${model.slug}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header Spacer */}
        <div className="h-20 lg:h-32"></div>

        {/* Floating Navigation Arrows */}
        <div className="fixed left-2 lg:left-4 top-1/2 -translate-y-1/2 z-50">
          {previousModel && (
            <button
              onClick={() => navigateToModel(previousModel.slug)}
              className="group flex flex-col items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-black/80 backdrop-blur-md border border-[#c2b2a3]/30 rounded-full hover:bg-[#c2b2a3]/20 hover:border-[#c2b2a3]/50 transition-all duration-300"
            >
              <ChevronLeft 
                size={16} 
                className="text-[#c2b2a3] group-hover:text-white transition-colors duration-300" 
              />
              <span className="text-[6px] lg:text-[8px] text-[#c2b2a3]/70 group-hover:text-[#c2b2a3] mt-1 uppercase tracking-widest">
                Anterior
              </span>
            </button>
          )}
        </div>

        <div className="fixed right-2 lg:right-4 top-1/2 -translate-y-1/2 z-50">
          {nextModel && (
            <button
              onClick={() => navigateToModel(nextModel.slug)}
              className="group flex flex-col items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-black/80 backdrop-blur-md border border-[#c2b2a3]/30 rounded-full hover:bg-[#c2b2a3]/20 hover:border-[#c2b2a3]/50 transition-all duration-300"
            >
              <ChevronRight 
                size={16} 
                className="text-[#c2b2a3] group-hover:text-white transition-colors duration-300" 
              />
              <span className="text-[6px] lg:text-[8px] text-[#c2b2a3]/70 group-hover:text-[#c2b2a3] mt-1 uppercase tracking-widest">
                Siguiente
              </span>
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/escorts-valencia" className="hover:text-white transition-colors">Escorts Valencia</Link>
            <span>/</span>
            <span className="text-white">{model.name}</span>
          </nav>
        </div>

        {/* Main Content Grid - Anna Claire Style */}
        <section className="max-w-7xl mx-auto px-6 pb-32 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Main Content Area - 2 columns */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Main Image */}
              <div className="relative group">
                <div 
                  className="relative overflow-hidden rounded-2xl cursor-pointer" 
                  onClick={() => openGallery(0)}
                >
                  <img 
                    src={model.images[0]} 
                    alt={model.altImages[0]} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                </div>
                
                {/* Availability Badge */}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-green-600/20 backdrop-blur-md border border-green-600/50 rounded-full">
                    <span className="text-green-400 text-[10px] tracking-[0.4em] uppercase font-bold">
                      {model.availability}
                    </span>
                  </div>
                </div>

                {/* VIP Badge */}
                {model.vip && (
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-red-600/20 backdrop-blur-md border border-red-600/50 rounded-full">
                      <span className="text-red-400 text-[10px] tracking-[0.4em] uppercase font-bold">
                        VIP
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bio Section */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl serif text-white uppercase tracking-widest">{model.name}</h1>
                <p className="text-xl text-[#c2b2a3] font-light tracking-[0.2em] italic">
                  {model.shortHeadline}
                </p>
                <div className="text-gray-400 font-light leading-[1.8] text-lg">
                  {model.longDescription}
                </div>
              </div>
              
              {/* Photo Gallery */}
              <div className="space-y-8">
                <h2 className="text-2xl serif text-white uppercase tracking-widest">Galería de Fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {model.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 ${idx % 3 === 0 ? 'md:row-span-2' : ''}`}
                      onClick={() => openGallery(idx)}
                    >
                      <img 
                        src={img} 
                        alt={model.altImages[idx]} 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center">
                          <Sparkles size={16} className="text-white/70" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-8">
                <h2 className="text-2xl serif text-white uppercase tracking-widest">Servicios</h2>
                <div className="flex flex-wrap gap-3">
                  {model.services.map((service, idx) => (
                    <Link
                      key={idx}
                      to={`/escorts-valencia?service=${encodeURIComponent(service)}`}
                      className="px-4 py-2 bg-[#111111] border border-[#c2b2a3]/20 text-[#c2b2a3] hover:bg-[#c2b2a3]/10 hover:border-[#c2b2a3]/40 transition-all rounded-full text-sm"
                    >
                      {service}
                    </Link>
                  ))}
                </div>
              </div>
              
            </div>
            
            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Personal Details */}
              <div className="bg-[#111111] border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Características</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Edad', value: `${model.age} años` },
                    { label: 'Nacionalidad', value: model.nationality },
                    { label: 'Altura', value: model.height },
                    { label: 'Peso', value: model.weight },
                    { label: 'Medidas', value: model.measurements },
                    { label: 'Pelo', value: model.hair },
                    { label: 'Pecho', value: model.breast },
                    { label: 'Idiomas', value: model.languages.join(', ') }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-gray-400 uppercase tracking-[0.2em]">{detail.label}</span>
                      <span className="text-white font-light">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact CTA */}
              <div className="bg-[#111111] border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Contactar</h3>
                <div className="space-y-4">
                  <a 
                    href={`tel:${model.whatsapp.replace(/[^\d+]/g, '')}`}
                    className="w-full flex items-center justify-center px-6 py-4 luxury-gradient text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] transition-all duration-500"
                  >
                    <Phone size={16} className="mr-2" />
                    Llamar Ahora
                  </a>
                  <a 
                    href={`https://wa.me/${model.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-6 py-4 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-700"
                  >
                    WhatsApp
                  </a>
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  {model.location} • Disponible 24/7
                </p>
              </div>

              {/* Location */}
              <div className="bg-[#111111] border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Ubicación</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin size={16} className="text-[#c2b2a3]" />
                    <span>{model.location}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Disponible para encuentros en {model.location} y alrededores. 
                    Servicio discreto y profesional en hotel, domicilio o lugar de tu elección.
                  </p>
                </div>
              </div>

              {/* Related Models */}
              <div className="bg-[#111111] border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Escorts Relacionadas</h3>
                <div className="space-y-4">
                  {MODELS_SEO
                    .filter(m => m.nationality === model.nationality && m.slug !== model.slug)
                    .slice(0, 3)
                    .map((relatedModel) => (
                      <Link
                        key={relatedModel.slug}
                        to={`/escorts-valencia/${relatedModel.slug}`}
                        className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                      >
                        <img
                          src={relatedModel.images[0]}
                          alt={relatedModel.altImages[0]}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{relatedModel.name}</p>
                          <p className="text-gray-400 text-sm">{relatedModel.age} años • {relatedModel.nationality}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
              
            </div>
            
          </div>
        </section>

        {/* Gallery Modal */}
        <GalleryModal
          images={model.images}
          initialIndex={currentImageIndex}
          isOpen={isGalleryOpen}
          onClose={closeGallery}
          modelName={model.name}
        />
      </div>
    </>
  );
};

export default EscortDetail;
