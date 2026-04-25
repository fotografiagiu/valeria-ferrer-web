
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODELS } from '../constants';
import { ArrowLeft, Check, Calendar, Phone, MapPin, Ruler, User, Heart, Star, Sparkles } from 'lucide-react';
import GalleryModal from '../components/GalleryModal';

const ModelDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const model = MODELS.find(m => m.id === id);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0a]">
        <h1 className="text-4xl serif mb-4 luxury-text-gradient uppercase tracking-widest">Modelo no encontrada</h1>
        <Link to="/models" className="text-[#c2b2a3] uppercase tracking-[0.3em] text-xs underline underline-offset-8 decoration-[#c2b2a3]/30">Volver a todas las modelos</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000 bg-[#0a0a0a] selection:bg-[#c2b2a3]/30">
      {/* Header Spacer */}
      <div className="h-20 lg:h-32"></div>

      {/* Breadcrumbs / Back Link */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-[#c2b2a3] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold"
        >
          <ArrowLeft size={14} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
          Volver a la selección
        </button>
      </div>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pb-32 pt-10">
        
        {/* Left Column: Image */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-40">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-[#c2b2a3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div 
                className="aspect-[3/4.2] overflow-hidden border border-white/5 bg-[#111111] cursor-pointer active:scale-[0.98] transition-transform duration-150"
                onClick={() => openGallery(0)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openGallery(0);
                }}
              >
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
              </div>
              {/* Badge for exclusivity */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-[#c2b2a3]/30 text-[9px] tracking-[0.4em] uppercase font-bold text-[#c2b2a3]">
                Elección Élite
              </div>
            </div>
            
            {/* Quick Stats Overlay (Mobile Only) */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mt-8">
              {[
                { label: 'Edad', val: model.age },
                { label: 'Estatura', val: `${model.height} cm` },
                { label: 'Peso', val: `${model.weight} kg` },
                { label: 'Nacionalidad', val: model.nationality || 'Española' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#111111] p-5 border border-white/5 text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mb-2 font-bold">{stat.label}</p>
                  <p className="text-xl serif luxury-text-gradient">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 space-y-16">
          {/* Header */}
          <div className="border-b border-white/5 pb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 text-[#c2b2a3]">
                <Star size={14} className="fill-[#c2b2a3]" />
                <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Acompañante Premier</span>
              </div>
              {model.featured && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c2b2a3]/20 to-[#c2b2a3]/10 blur-md"></div>
                  <div className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#c2b2a3]/10 to-[#c2b2a3]/5 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full">
                    <div className="w-3 h-3 bg-[#c2b2a3] rounded-full animate-pulse"></div>
                    <span className="text-[#c2b2a3] text-[11px] tracking-[0.3em] uppercase font-light">
                      VIP
                    </span>
                  </div>
                </div>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl serif luxury-text-gradient uppercase mb-6 leading-[0.9] tracking-tighter">
              {model.name}
              {model.featured && (
                <span className="text-4xl md:text-6xl ml-3 text-[#c2b2a3] font-light">(VIP)</span>
              )}
            </h1>
            <div className="flex items-center space-x-6">
              <p className="text-lg font-light text-gray-400 tracking-[0.2em] uppercase italic flex items-center">
                <MapPin size={16} className="mr-2 text-[#c2b2a3]" />
                {model.location}
              </p>
            </div>
          </div>

          {/* Intro / Bio */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl serif text-white uppercase tracking-widest leading-none">La Esencia de {model.name}</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            <p className="text-gray-400 font-light leading-[1.8] text-xl first-letter:text-5xl first-letter:mr-3 first-letter:float-left first-letter:luxury-text-gradient first-letter:serif">
              {model.bio || model.description}
            </p>
          </div>

          

        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section className="bg-[#080808] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">Portafolio <span className="italic luxury-text-gradient">Oficial</span></h2>
              <p className="text-gray-500 text-sm font-light leading-relaxed uppercase tracking-widest">
                Una selección de capturas de alta calidad que muestran la elegancia auténtica de {model.name}. Todas las imágenes son recientes y verificadas.
              </p>
            </div>
            <div className="hidden md:block w-32 h-[1px] bg-[#c2b2a3]/50"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(model.gallery || []).map((img, idx) => (
              <div 
                key={idx} 
                className={`relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 ${idx % 3 === 0 ? 'md:row-span-2' : ''}`}
                onClick={() => openGallery(idx + 1)}
              >
                <img 
                  src={img} 
                  alt={`${model.name} Portfolio ${idx + 1}`} 
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
      </section>

      {/* Request Meeting Button */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link 
            to="/booking" 
            className="inline-flex items-center justify-center px-16 py-6 luxury-gradient text-black font-bold uppercase tracking-[0.4em] text-[10px] hover:scale-[1.02] transition-all duration-500 shadow-xl"
          >
            Solicitar Encuentro
          </Link>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-32 bg-[#080808] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">Tarifas <span className="italic luxury-text-gradient">Premium</span></h2>
            <p className="text-gray-500 text-sm font-light leading-relaxed uppercase tracking-widest max-w-2xl mx-auto">
              Experiencias exclusivas adaptadas a tus necesidades. Todas nuestras tarifas incluyen discreción absoluta y servicio de primera clase.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#111111] border border-[#c2b2a3]/20 overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-[#c2b2a3]/10">
                {model.name === 'Gaby' ? (
                  // VIP Tariffs for Gaby
                  <>
                    <div className="p-6 space-y-1">
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">1 hora</span>
                        <span className="text-lg font-light luxury-text-gradient">180 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">45 minutos</span>
                        <span className="text-lg font-light luxury-text-gradient">150 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">30 minutos</span>
                        <span className="text-lg font-light luxury-text-gradient">120 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">2 horas</span>
                        <span className="text-lg font-light luxury-text-gradient">350 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">3 horas</span>
                        <span className="text-lg font-light luxury-text-gradient">520 €</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-1">
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Salida hotel</span>
                        <span className="text-lg font-light luxury-text-gradient">250 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Noche (10 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">2.000 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Todo el día (24 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">3.000 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Dos días (48 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">4.000 €</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Standard Tariffs for other models
                  <>
                    <div className="p-6 space-y-1">
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">1 hora</span>
                        <span className="text-lg font-light luxury-text-gradient">150 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">45 minutos</span>
                        <span className="text-lg font-light luxury-text-gradient">120 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">30 minutos</span>
                        <span className="text-lg font-light luxury-text-gradient">80 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">1,5 horas</span>
                        <span className="text-lg font-light luxury-text-gradient">240 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">2 horas</span>
                        <span className="text-lg font-light luxury-text-gradient">300 €</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-1">
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">3 horas</span>
                        <span className="text-lg font-light luxury-text-gradient">430 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Salida</span>
                        <span className="text-lg font-light luxury-text-gradient">200 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Noche (10 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">1.200 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Noche (24 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">2.800 €</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-sm text-gray-400 tracking-[0.1em]">Dos días (48 horas)</span>
                        <span className="text-lg font-light luxury-text-gradient">3.700 €</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-[10px] text-gray-600 tracking-[0.5em] uppercase mb-8">
                * Todas las tarifas son en euros • Servicios adicionales disponibles • Consultar condiciones
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <Link 
                  to="/booking" 
                  className="inline-flex items-center justify-center px-12 py-5 luxury-gradient text-black font-bold uppercase tracking-[0.4em] text-[10px] hover:scale-[1.02] transition-all duration-500"
                >
                  Reservar Ahora
                </Link>
                <a 
                  href="tel:645872227" 
                  className="inline-flex items-center justify-center px-12 py-5 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-700"
                >
                  <Phone size={14} className="mr-3" /> 
                  <span>Llamada Directa</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discretion Notice */}
      <section className="py-24 text-center bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[10px] text-gray-600 tracking-[0.6em] uppercase leading-[2.5] italic font-light">
            Anonimato absoluto • Profesionalismo puro • Fotografías 100% verificadas
          </p>
        </div>
      </section>

      {/* Gallery Modal */}
      <GalleryModal
        images={[model.image, ...(model.gallery || [])].filter(Boolean)}
        initialIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        modelName={model.name}
      />
    </div>
  );
};

export default ModelDetail;
