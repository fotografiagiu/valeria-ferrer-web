
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODELS } from '../constants';
import { ArrowLeft, Check, Calendar, Phone, MapPin, Ruler, User, Heart, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Encontrar modelo anterior y siguiente
  const currentIndex = MODELS.findIndex(m => m.id === id);
  const previousModel = currentIndex > 0 ? MODELS[currentIndex - 1] : null;
  const nextModel = currentIndex < MODELS.length - 1 ? MODELS[currentIndex + 1] : null;

  const navigateToModel = (modelId: string) => {
    navigate(`/models/${modelId}`);
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

      {/* Floating Navigation Arrows */}
      <div className="fixed left-2 lg:left-4 top-1/2 -translate-y-1/2 z-50">
        {previousModel && (
          <button
            onClick={() => navigateToModel(previousModel.id)}
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
            onClick={() => navigateToModel(nextModel.id)}
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
                  src={model.image} 
                  alt={model.name} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="space-y-6">
              <h2 className="text-3xl serif text-white uppercase tracking-widest">{model.name}</h2>
              <p className="text-gray-400 font-light leading-[1.8] text-lg">
                {model.description}
              </p>
              {model.essence && (
                <div className="bg-[#111111] border border-white/5 p-6">
                  <h3 className="text-sm text-[#c2b2a3] uppercase tracking-[0.4em] mb-3 font-bold">La Esencia</h3>
                  <p className="text-gray-400 font-light leading-[1.6]">
                    {model.essence}
                  </p>
                </div>
              )}
            </div>
            
            {/* Photo Gallery */}
            <div className="space-y-8">
              <h3 className="text-2xl serif text-white uppercase tracking-widest">Galería</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(model.gallery || []).map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 ${idx % 3 === 0 ? 'md:row-span-2' : ''}`}
                    onClick={() => openGallery(idx + 1)}
                  >
                    <img 
                      src={img} 
                      alt={`${model.name} Gallery ${idx + 1}`} 
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
            
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Personal Details */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Detalles Personales</h4>
              <div className="space-y-3">
                {[
                  { label: 'Edad', value: model.age },
                  { label: 'Estatura', value: model.height },
                  { label: 'Peso', value: model.weight },
                  { label: 'Nacionalidad', value: model.nationality || 'Española' },
                  { label: 'Ciudad', value: model.city || 'Valencia' },
                  { label: 'Disponibilidad', value: model.availability || '24h' },
                  { label: 'Idiomas', value: (model.languages || ['Español']).join(', ') }
                ].map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-400 uppercase tracking-[0.2em]">{detail.label}</span>
                    <span className="text-white font-light">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prices */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Tarifas</h4>
              <div className="space-y-2">
                {model.vip ? (
                  // VIP Tariffs
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">1 hora</span>
                      <span className="text-white font-light">{model.vipRates?.["1h"] || "180 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">45 minutos</span>
                      <span className="text-white font-light">{model.vipRates?.["45min"] || "150 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">30 minutos</span>
                      <span className="text-white font-light">{model.vipRates?.["30min"] || "120 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">2 horas</span>
                      <span className="text-white font-light">{model.vipRates?.["2h"] || "350 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">3 horas</span>
                      <span className="text-white font-light">{model.vipRates?.["3h"] || "520 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Salida hotel</span>
                      <span className="text-white font-light">{model.vipRates?.["salidaHotel"] || "250 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Noche (10h)</span>
                      <span className="text-white font-light">{model.vipRates?.["noche"] || "2.000 €"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Todo el día (24h)</span>
                      <span className="text-white font-light">{model.vipRates?.["dia"] || "3.000 €"}</span>
                    </div>
                  </>
                ) : (
                  // Standard Tariffs
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">1 hora</span>
                      <span className="text-white font-light">150 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">45 minutos</span>
                      <span className="text-white font-light">120 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">30 minutos</span>
                      <span className="text-white font-light">80 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">1,5 horas</span>
                      <span className="text-white font-light">240 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">2 horas</span>
                      <span className="text-white font-light">300 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">3 horas</span>
                      <span className="text-white font-light">430 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Salida</span>
                      <span className="text-white font-light">200 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Noche (10h)</span>
                      <span className="text-white font-light">1.200 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Noche (24h)</span>
                      <span className="text-white font-light">2.800 €</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Meetings in Valencia */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Encuentros en Valencia</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Disponible para encuentros en Valencia y alrededores. Servicio discreto y profesional en hotel, domicilio o lugar de tu elección.
              </p>
            </div>
            
            {/* International Meetings */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Encuentros Internacionales</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Disponible para viajes internacionales. Consultar disponibilidad y condiciones para acompañamiento en otras ciudades y países.
              </p>
            </div>
            
            {/* Contacts */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Contacto</h4>
              <div className="space-y-3">
                <a 
                  href="tel:645872227" 
                  className="flex items-center text-[#c2b2a3] hover:text-white transition-colors"
                >
                  <Phone size={16} className="mr-3" /> 
                  +34 645 872 227
                </a>
                <a 
                  href="https://t.me/Valeriaferreeer" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#c2b2a3] hover:text-white transition-colors"
                >
                  <Phone size={16} className="mr-3" /> 
                  @Valeriaferreeer
                </a>
              </div>
            </div>
            
            {/* Valeria's Note */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Nota de Valeria</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {model.name} es una acompañante excepcional que combina elegancia, sofisticación y carisma natural. Su presencia garantiza experiencias inolvidables con el más alto nivel de discreción y profesionalismo.
              </p>
            </div>
            
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
