
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODELS } from '../constants';
import { ArrowLeft, Check, Calendar, Phone, MapPin, Ruler, User, Heart, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import GalleryModal from '../components/GalleryModal';
import LazyImage from '../components/LazyImage';
import SEOHead from '../components/SEOHead';

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

  // Find previous and next models
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
      <SEOHead model={model} />
      {/* Header Spacer */}
      <div className="h-32 lg:h-32"></div>

      {/* Breadcrumbs / Back Link */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-[#c2b2a3] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold"
        >
          <ArrowLeft size={14} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
          Volver a la selección
        </button>
      </div>

      {/* Mobile Layout - Old Style */}
      <div className="lg:hidden max-w-7xl mx-auto px-6 pb-32 pt-10">
        {/* Model Navigation - Modern Minimalist Design */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-[#111111]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
            {/* Previous Model */}
            <button
              onClick={() => previousModel && navigateToModel(previousModel.id)}
              disabled={!previousModel}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                previousModel 
                  ? 'text-[#c2b2a3] hover:text-white hover:translate-x-1' 
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft size={20} className="flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">Anterior</p>
                <p className="text-sm font-light truncate max-w-[120px]">
                  {previousModel?.name || 'No disponible'}
                </p>
              </div>
            </button>

            {/* Center Divider */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

            {/* Next Model */}
            <button
              onClick={() => nextModel && navigateToModel(nextModel.id)}
              disabled={!nextModel}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                nextModel 
                  ? 'text-[#c2b2a3] hover:text-white hover:-translate-x-1' 
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">Siguiente</p>
                <p className="text-sm font-light truncate max-w-[120px]">
                  {nextModel?.name || 'No disponible'}
                </p>
              </div>
              <ChevronRight size={20} className="flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative group mb-8">
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
              <LazyImage
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
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { label: 'Edad', val: model.age },
              { label: 'Estatura', val: model.height },
              { label: 'Peso', val: model.weight },
              { label: 'Nacionalidad', val: model.nationality || 'Española' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#111111] p-5 border border-white/5 text-center">
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mb-2 font-bold">{stat.label}</p>
                <p className="text-xl serif luxury-text-gradient">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="border-b border-white/5 pb-12 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 text-[#c2b2a3]">
              <Star size={14} className="fill-[#c2b2a3]" />
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Acompañante Premier</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl serif luxury-text-gradient uppercase mb-6 leading-[0.9] tracking-tighter">
            {model.name}
          </h1>
          <div className="flex items-center space-x-6">
            <p className="text-lg font-light text-gray-400 tracking-[0.2em] uppercase italic flex items-center">
              <MapPin size={16} className="mr-2 text-[#c2b2a3]" />
              {model.location}
            </p>
          </div>
        </div>

        {/* Mobile Bio */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl serif text-white uppercase tracking-widest leading-none">La Esencia de {model.name}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          <p className="text-gray-400 font-light leading-[1.8] text-xl first-letter:text-5xl first-letter:mr-3 first-letter:float-left first-letter:luxury-text-gradient first-letter:serif">
            {model.bio || model.description}
          </p>
        </div>

        {/* Mobile Photo Gallery */}
        <div className="space-y-8 mt-12">
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

        {/* Mobile Pricing Table */}
        <div className="lg:hidden py-16 bg-[#080808] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">Tarifas <span className="italic luxury-text-gradient">Premium</span></h2>
              <p className="text-gray-500 text-xs font-light leading-relaxed uppercase tracking-widest max-w-2xl mx-auto">
                Experiencias exclusivas adaptadas a tus necesidades. Todas nuestras tarifas incluyen discreción absoluta y servicio de primera clase.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#111111] border border-[#c2b2a3]/20 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#c2b2a3]/10">
                  {model.vip ? (
                    // VIP Tariffs for VIP models
                    <>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">1 hora</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["1h"] || "180 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">45 minutos</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["45min"] || "150 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">30 minutos</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["30min"] || "120 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">2 horas</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["2h"] || "350 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">3 horas</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["3h"] || "520 €"}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Salida hotel</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["salidaHotel"] || "250 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Noche (10 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["noche"] || "2.000 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Todo el día (24 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["dia"] || "3.000 €"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Dos días (48 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">{model.vipRates?.["dosDias"] || "4.000 €"}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Standard Tariffs for regular models
                    <>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">1 hora</span>
                          <span className="text-sm font-light luxury-text-gradient">150 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">45 minutos</span>
                          <span className="text-sm font-light luxury-text-gradient">120 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">30 minutos</span>
                          <span className="text-sm font-light luxury-text-gradient">80 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">1,5 horas</span>
                          <span className="text-sm font-light luxury-text-gradient">240 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">2 horas</span>
                          <span className="text-sm font-light luxury-text-gradient">300 €</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">3 horas</span>
                          <span className="text-sm font-light luxury-text-gradient">430 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Salida</span>
                          <span className="text-sm font-light luxury-text-gradient">200 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Noche (10 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">1.200 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Noche (24 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">2.800 €</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs text-gray-400 tracking-[0.1em]">Dos días (48 horas)</span>
                          <span className="text-sm font-light luxury-text-gradient">3.700 €</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-[8px] text-gray-600 tracking-[0.5em] uppercase mb-6">
                  * Todas las tarifas son en euros • Servicios adicionales disponibles • Consultar condiciones
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link 
                    to="/booking" 
                    className="inline-flex items-center justify-center px-8 py-4 luxury-gradient text-black font-bold uppercase tracking-[0.4em] text-[8px] hover:scale-[1.02] transition-all duration-500"
                  >
                    Reservar Ahora
                  </Link>
                  <a 
                    href="tel:645872227" 
                    className="inline-flex items-center justify-center px-8 py-4 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[8px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-700"
                  >
                    <Phone size={12} className="mr-2" /> 
                    <span>Llamada Directa</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Anna Claire Style */}
      <section className="hidden lg:block max-w-7xl mx-auto px-6 pb-32 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content Area - 2 columns */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Model Navigation - Modern Minimalist Design */}
            <div className="mb-8">
              <div className="flex items-center justify-between bg-[#111111]/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                {/* Previous Model */}
                <button
                  onClick={() => previousModel && navigateToModel(previousModel.id)}
                  disabled={!previousModel}
                  className={`flex items-center space-x-4 transition-all duration-300 ${
                    previousModel 
                      ? 'text-[#c2b2a3] hover:text-white hover:translate-x-2' 
                      : 'text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ChevronLeft size={24} className="flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.3em] opacity-70">Anterior</p>
                    <p className="text-base font-light truncate max-w-[150px]">
                      {previousModel?.name || 'No disponible'}
                    </p>
                  </div>
                </button>

                {/* Center Divider */}
                <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                {/* Next Model */}
                <button
                  onClick={() => nextModel && navigateToModel(nextModel.id)}
                  disabled={!nextModel}
                  className={`flex items-center space-x-4 transition-all duration-300 ${
                    nextModel 
                      ? 'text-[#c2b2a3] hover:text-white hover:-translate-x-2' 
                      : 'text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.3em] opacity-70">Siguiente</p>
                    <p className="text-base font-light truncate max-w-[150px]">
                      {nextModel?.name || 'No disponible'}
                    </p>
                  </div>
                  <ChevronRight size={24} className="flex-shrink-0" />
                </button>
              </div>
            </div>
            
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
                      <span className="text-white font-light">{model.vipRates?.["1h"] || "180"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">45 minutos</span>
                      <span className="text-white font-light">{model.vipRates?.["45min"] || "150"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">30 minutos</span>
                      <span className="text-white font-light">{model.vipRates?.["30min"] || "120"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">2 horas</span>
                      <span className="text-white font-light">{model.vipRates?.["2h"] || "350"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">3 horas</span>
                      <span className="text-white font-light">{model.vipRates?.["3h"] || "520"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Salida hotel</span>
                      <span className="text-white font-light">{model.vipRates?.["salidaHotel"] || "250"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">Noche (10h)</span>
                      <span className="text-white font-light">{model.vipRates?.["noche"] || "2.000"} €</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Todo el día (24h)</span>
                      <span className="text-white font-light">{model.vipRates?.["dia"] || "3.000"} €</span>
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
