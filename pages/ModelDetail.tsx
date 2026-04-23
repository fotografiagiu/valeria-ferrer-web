
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
              <div className="aspect-[3/4.2] overflow-hidden border border-white/5 bg-[#111111]">
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
            <div className="lg:hidden grid grid-cols-3 gap-3 mt-8">
              {[
                { label: 'Edad', val: model.age },
                { label: 'Estatura', val: `${model.height}cm` },
                { label: 'Peso', val: `${model.weight}kg` }
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
            <div className="flex items-center space-x-3 mb-4 text-[#c2b2a3]">
              <Star size={14} className="fill-[#c2b2a3]" />
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Acompañante Premier</span>
            </div>
            <h1 className="text-6xl md:text-8xl serif luxury-text-gradient uppercase mb-6 leading-[0.9] tracking-tighter">{model.name}</h1>
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

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 p-10 bg-white/[0.02] border border-white/5">
            <div className="space-y-3">
              <div className="flex items-center text-[#c2b2a3] opacity-60">
                <User size={14} className="mr-2" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Origen</span>
              </div>
              <p className="text-lg font-light tracking-wide">{model.nationality || 'Española'}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-[#c2b2a3] opacity-60">
                <Ruler size={14} className="mr-2" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Estadísticas</span>
              </div>
              <p className="text-lg font-light tracking-wide">{model.height}cm / {model.weight}kg</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-[#c2b2a3] opacity-60">
                <Heart size={14} className="mr-2" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Ojos / Cabello</span>
              </div>
              <p className="text-lg font-light tracking-wide">Miel / Oscuro</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-[#c2b2a3] opacity-60">
                <Sparkles size={14} className="mr-2" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Idiomas</span>
              </div>
              <p className="text-lg font-light tracking-wide">ES, EN, DE</p>
            </div>
          </div>

          {/* Services Offered */}
          <div className="space-y-8">
            <h3 className="text-2xl serif text-white uppercase tracking-widest flex items-center">
              Servicios <span className="ml-4 h-[1px] w-20 bg-[#c2b2a3]/30"></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {(model.services || ['Girlfriend Experience', 'Acompañamiento en Viajes', 'Cenas de Negocios']).map((service, idx) => (
                <div key={idx} className="group flex items-center space-x-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c2b2a3] transition-all group-hover:scale-150"></div>
                  <span className="text-sm tracking-[0.1em] text-gray-400 group-hover:text-white transition-colors">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact / CTA */}
          <div className="flex flex-col md:flex-row gap-6 pt-10">
            <Link 
              to="/booking" 
              className="flex-[1.5] text-center py-6 luxury-gradient text-black font-bold uppercase tracking-[0.4em] text-[10px] hover:scale-[1.02] transition-all duration-500 shadow-xl"
            >
              Solicitar Encuentro
            </Link>
            <a 
              href="tel:645872227" 
              className="flex-1 flex items-center justify-center space-x-3 text-center py-6 border border-[#c2b2a3]/30 text-[#c2b2a3] uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#c2b2a3] hover:text-black transition-all duration-700"
            >
              <Phone size={14} /> 
              <span>Llamada Directa</span>
            </a>
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
                onClick={() => openGallery(idx)}
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

      {/* Availability Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#111111] p-12 md:p-20 border border-[#c2b2a3]/20 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#c2b2a3]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center mb-16">
              <Calendar size={48} className="mx-auto text-[#c2b2a3] mb-6 opacity-30" />
              <h3 className="text-3xl serif text-white uppercase tracking-[0.2em]">Disponibilidad</h3>
              <div className="w-12 h-[2px] bg-[#c2b2a3] mx-auto mt-4"></div>
            </div>

            <div className="relative z-10 space-y-6 max-w-md mx-auto">
              {Object.entries(model.availability || {}).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center group">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-gray-500 group-hover:text-[#c2b2a3] transition-colors font-bold">{day}</span>
                  <div className="h-[1px] flex-1 mx-6 bg-white/5 group-hover:bg-[#c2b2a3]/20 transition-colors"></div>
                  <span className="text-sm font-medium tracking-widest text-gray-300">{hours}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center relative z-10">
              <p className="text-[10px] text-gray-600 tracking-[0.5em] uppercase mb-10">Disponibilidad limitada en Barcelona / Madrid</p>
              <Link 
                to="/booking" 
                className="inline-block px-14 py-5 bg-white text-black text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#c2b2a3] transition-all duration-500"
              >
                Consultar Estado
              </Link>
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
        images={model.gallery || []}
        initialIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        modelName={model.name}
      />
    </div>
  );
};

export default ModelDetail;
