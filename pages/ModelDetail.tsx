import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODELS } from '../constants';
import { ArrowLeft, Check, Calendar, Phone, MapPin, Ruler, User, Star, Sparkles, ChevronLeft, ChevronRight, MessageCircle, Shield, Crown, Clock, Heart } from 'lucide-react';
import GalleryModal from '../components/GalleryModal';
import LazyImage from '../components/LazyImage';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import AnalyticsEvents from '../components/AnalyticsEvents';

const ModelDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const model = MODELS.find(m => m.id === id);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showContactBar, setShowContactBar] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowContactBar(window.scrollY < 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const getRelatedModels = () => {
    const currentIndex = MODELS.findIndex(m => m.id === id);
    const related = MODELS.filter((_, index) => index !== currentIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return related;
  };

  const whatsappNumber = '+34645872227'; // Número de WhatsApp configurable
  const phoneNumber = '+34645872227'; // Número de teléfono configurable

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
      <AnalyticsEvents modelName={model.name} />
      {/* Header Spacer */}
      <div className="h-32 lg:h-32"></div>

      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-b from-[#111111] to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 lg:py-6">
          {/* Centered Model Name */}
          <div className="text-center mb-2 lg:mb-2">
            
            <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-center gap-2 lg:gap-4">
              <h1 className="text-4xl lg:text-6xl serif luxury-text-gradient uppercase leading-[0.9] tracking-tighter">
                {model.name}
              </h1>
              
              <div className="flex items-center space-x-2 text-[#c2b2a3]">
                <MapPin size={16} />
                <span className="text-lg font-light">{model.city || 'Valencia'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Contact Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 z-50 transition-transform duration-300 ${
        showContactBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <a
              href={`https://t.me/Valeriaferreeer?text=Hola%20${model.name},%20vi%20tu%20perfil%20y%20me%20gustaría%20conocer%20más`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              <MessageCircle size={20} />
              <span className="font-medium">Telegram</span>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center space-x-2 px-6 py-3 bg-[#c2b2a3] text-black rounded-full hover:bg-[#d4c4b3] transition-colors duration-300"
            >
              <Phone size={20} />
              <span className="font-medium">Llamar</span>
            </a>
            <Link
              to="/booking"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#c2b2a3] to-[#d4c4b3] text-black rounded-full hover:from-[#d4c4b3] hover:to-[#e6d6c3] transition-all duration-300"
            >
              <Calendar size={20} />
              <span className="font-medium">Reservar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs modelName={model?.name} />

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
              onTouchStart={(e) => {
                const touch = e.touches[0];
                touchStartRef.current = { x: touch.clientX, y: touch.clientY };
              }}
              onTouchEnd={(e) => {
                if (!touchStartRef.current) return;

                const touch = e.changedTouches[0];
                const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                const isTap = deltaX < 10 && deltaY < 10;

                if (isTap) {
                  openGallery(0);
                }

                touchStartRef.current = null;
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
            
            {/* Image Counter and Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6">
              <div className="text-white/80 text-xs font-light">
                1 / {(model.gallery?.length || 0) + 1}
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: (model.gallery?.length || 0) + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => openGallery(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === 0 ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
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
          <h1 className="text-6xl md:text-8xl serif luxury-text-gradient uppercase mb-4 leading-[0.9] tracking-tighter">
            {model.name}
          </h1>
          <div className="text-lg font-light text-[#c2b2a3] tracking-[0.3em] uppercase mb-6">
            ESCORT EN VALENCIA
          </div>
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
          <div className="text-gray-300 font-light leading-[1.6] text-lg max-w-7xl mx-auto px-2 space-y-2">
            {(model.bio || model.description).split('. ').reduce((acc, sentence, idx) => {
              if (sentence.trim()) {
                const paragraphIndex = Math.floor(idx / 3);
                if (!acc[paragraphIndex]) acc[paragraphIndex] = [];
                acc[paragraphIndex].push(sentence.trim());
              }
              return acc;
            }, []).slice(0, 2).map((paragraph, pIdx) => (
              <div key={pIdx} className="bg-[#111111]/30 backdrop-blur-sm border-l-2 border-[#c2b2a3]/30 p-6 rounded-r-lg">
                <p className="text-left first-letter:text-4xl first-letter:mr-2 first-letter:float-left first-letter:text-[#c2b2a3] first-letter:font-bold">
                  {paragraph.join('. ')}.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8"></div>

        {/* Lo que me hace única y Experiencias - Columnas en paralelo - Mobile - Todas las modelos */}
        {model.name && (
          <div className="grid grid-cols-2 gap-3 mt-12 px-1">
            {/* Lo que me hace única */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg serif text-white uppercase tracking-widest leading-none">Lo que me hace <span className="italic luxury-text-gradient">única</span></h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              <div className="bg-[#111111] border border-white/5 p-3 flex-1">
                <ul className="text-gray-400 font-light leading-[1.6] space-y-2 text-sm">
                  {model.name === "Kimberly" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Cuerpo escultural que desafía la gravedad</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Mirada penetrante que promete noches inolvidables</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Piel suave como seda y labios hechos para pecar</span>
                      </li>
                    </>
                  )}
                  {model.name === "Alicia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Frescura juvenil con energía vibrante natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Aventuras inéditas descubriendo horizontes nuevos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Conexiones auténticas espontáneas y genuinas</span>
                      </li>
                    </>
                  )}
                  {model.name === "Mia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Energía juvenil con figura esculpida perfecta</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sonrisa contagiosa que ilumina cualquier ambiente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vitalidad tropical con frescura natural</span>
                      </li>
                    </>
                  )}
                  {model.name === "Silvia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Misterio enigmático con profundidad natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Elegancia sofisticada con toque exótico único</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sensibilidad artística con carisma magnético</span>
                      </li>
                    </>
                  )}
                  {model.name === "Yaiza" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sensualidad mediterránea con pasión brasileña</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Movimientos fluidos hipnóticos y naturales</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Carisma tropical que cautiva instantáneamente</span>
                      </li>
                    </>
                  )}
                  {model.name === "Paula (VIP)" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Elegancia VIP exclusiva de clase internacional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación élite con distinción natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Presencia magnética inolvidable y única</span>
                      </li>
                    </>
                  )}
                  {model.name === "Naty" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Energía tropical brasileña contagiosa y vibrante</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Alegría espontánea que ilumina cualquier ambiente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vitalidad natural con carisma cálido tropical</span>
                      </li>
                    </>
                  )}
                  {model.name === "Erika" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación mediterránea con clase europea</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Elegancia cultural refinada e internacional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Figura armoniosa con estilo cosmopolita</span>
                      </li>
                    </>
                  )}
                  {model.name === "Teresa" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Energía vibrante con carisma natural español</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Espontaneidad mediterránea fresca y auténtica</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Modernidad tradicional con alegría genuina</span>
                      </li>
                    </>
                  )}
                  {model.name === "Elena" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación paraguaya con distinción única</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Figura armoniosa con refinamiento natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Magnetismo personal con carisma internacional</span>
                      </li>
                    </>
                  )}
                  {model.name === "Lana" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Energía tropical venezolana vibrante y magnética</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Autenticidad caribeña con elegancia natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación latina con sensualidad única</span>
                      </li>
                    </>
                  )}
                  {model.name === "Luna" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Misterio nocturno colombiano enigmático profundo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sensualidad auténtica con atmósferas mágicas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Carisma lunar con pasión tropical intensa</span>
                      </li>
                    </>
                  )}
                  {model.name === "Carla" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Estilo mediterráneo con elegancia natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Figura esbelta con autenticidad española</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sensualidad mediterránea con pasión vibrante</span>
                      </li>
                    </>
                  )}
                  {model.name === "Estefany" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Intensidad latina con dulzura natural colombiana</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Curvas voluptuosas con temperamento ardiente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Carisma auténtico con energía vibrante apasionada</span>
                      </li>
                    </>
                  )}
                  {model.name === "Maria" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación española con experiencia madura</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Figura equilibrada con estilo refinado elegante</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Perspectiva única con elegancia natural auténtica</span>
                      </li>
                    </>
                  )}
                  {model.name === "Claudia (VIP)" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Sofisticación VIP española con elegancia exclusiva</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Figura equilibrada con presencia refinada distinguida</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Estilo VIP con clase internacional experiencias únicas</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Experiencias que ofrezco */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg serif text-white uppercase tracking-widest leading-none">Experiencias que <span className="italic luxury-text-gradient">ofrezco</span></h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              <div className="bg-[#111111] border border-white/5 p-3 flex-1">
                <ul className="text-gray-400 font-light leading-[1.6] space-y-2 text-sm">
                  {model.name === "Kimberly" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Noches de pasión sin límites ni tabúes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Juegos sensuales que despertarán tus sentidos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Secretos íntimos que solo compartirás conmigo</span>
                      </li>
                    </>
                  )}
                  {model.name === "Alicia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Aventuras inéditas descubrimientos emocionantes únicos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Exploración cultural perspectiva juvenil fresca moderna</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Conexiones auténticas espontáneas memorables duraderas</span>
                      </li>
                    </>
                  )}
                  {model.name === "Mia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias juveniles llenas de energía y alegría</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Momentos espontáneos con autenticidad tropical</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias vibrantes con frescura natural</span>
                      </li>
                    </>
                  )}
                  {model.name === "Silvia" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Noches misteriosas revelaciones inesperadas profundas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Exploración sensaciones enigma misterio seducción</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Conexiones profundas toque juvenil magia encanto</span>
                      </li>
                    </>
                  )}
                  {model.name === "Yaiza" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Baile sensual movimientos hipnóticos brasileños</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Masajes tropicales técnica experta relajación</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Noches pasión inolvidable intensidad deseo</span>
                      </li>
                    </>
                  )}
                  {model.name === "Paula (VIP)" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias VIP exclusivas personalizadas lujosas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Acompañamiento lujo eventos élite sofisticación</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Servicios discreción garantizada privacidad absoluta</span>
                      </li>
                    </>
                  )}
                  {model.name === "Naty" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Fiestas tropicales energía brasileña contagiosa</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Cenas apasionadas sabor latino cariño pasión</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Momentos íntimos autenticidad tropical calidez</span>
                      </li>
                    </>
                  )}
                  {model.name === "Erika" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Acompañamiento lujo mediterráneo cultura refinada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Cenas elegantes sofisticación clase internacional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias culturales refinadas arte conocimiento</span>
                      </li>
                    </>
                  )}
                  {model.name === "Teresa" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Eventos sociales energía carisma alegría vital</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Encuentros auténticos espontaneidad frescura natural</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias tradición española modernidad refrescante</span>
                      </li>
                    </>
                  )}
                  {model.name === "Elena" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Cenas negocios sofisticación distinción elegancia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Ocasiones especiales magnetismo internacional carisma</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Eventos memorables estilo refinado paraguayo único</span>
                      </li>
                    </>
                  )}
                  {model.name === "Lana" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Eventos exclusivos energía venezolana tropical</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias apasionadas autenticidad carisma cálido</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias sofisticadas toque caribeño latino</span>
                      </li>
                    </>
                  )}
                  {model.name === "Luna" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Encuentros íntimos memorables sensualidad auténtica</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Atmósferas mágicas misterio nocturno enigmático</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias extraordinarias influencia lunar tropical</span>
                      </li>
                    </>
                  )}
                  {model.name === "Carla" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Eventos exclusivos estilo mediterráneo elegante</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Ocasiones únicas sofisticación pasión vibrante</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias inolvidables autenticidad española sensual</span>
                      </li>
                    </>
                  )}
                  {model.name === "Estefany" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Encuentros apasionados intensidad latina cariño</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias voluptuosas ternura fuego pasión</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias auténticas energía colombiana vibrante</span>
                      </li>
                    </>
                  )}
                  {model.name === "Maria" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Cenas negocios sofisticación experiencia madura</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Eventos corporativos elegancia perspectiva única</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Experiencias refinadas autenticidad española</span>
                      </li>
                    </>
                  )}
                  {model.name === "Claudia (VIP)" && (
                    <>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Acompañamiento lujo Valencia sofisticación exclusiva</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Encuentros distinguidos experiencias únicas VIP</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#c2b2a3] mr-2">•</span>
                        <span>Vivencias extraordinarias clase internacional refinada</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="py-8"></div>

        {/* Mobile Editorial Gallery */}
        <div className="lg:hidden space-y-8 mt-12">
          <div className="text-center">
            <h3 className="text-2xl serif text-white uppercase tracking-widest mb-2">Galería Editorial</h3>
            <p className="text-sm text-gray-400 italic">Explora su mundo visual</p>
          </div>
          
          {/* Mobile Gallery Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Main Image - Full Width */}
            {(model.gallery || [])[0] && (
              <div 
                className="col-span-2 relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 rounded-2xl aspect-[3/4]"
                onClick={() => openGallery(1)}
              >
                <img 
                  src={(model.gallery || [])[0]} 
                  alt={`${model.name} - Portada`} 
                  className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-light mb-1">Portada editorial</p>
                    <p className="text-white/70 text-[10px]">Click para ver en alta resolución</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Side Images */}
            {(model.gallery || []).slice(1, 5).map((img, idx) => (
              <div 
                key={idx}
                className="relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 rounded-2xl aspect-[3/4]"
                onClick={() => openGallery(idx + 2)}
              >
                <img 
                  src={img} 
                  alt={`${model.name} - Galería ${idx + 2}`} 
                  className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-white text-[10px] font-light">Ver imagen</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Gallery Stats */}
          <div className="text-center text-sm text-gray-400">
            <p>{(model.gallery || []).length + 1} imágenes en alta resolución</p>
            <p className="text-xs italic mt-1">Click en cualquier imagen para ver en pantalla completa</p>
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
                    <span>Click para Llamar</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Related Models */}
        <div className="lg:hidden space-y-8 mt-16">
          <div className="text-center">
            <h3 className="text-2xl serif text-white uppercase tracking-widest mb-4">También te puede gustar</h3>
            <p className="text-gray-400 text-sm font-light max-w-xs mx-auto">
              Descubre otras modelos que podrían complementar tu experiencia perfecta
            </p>
          </div>
          
          <div className="space-y-4">
            {getRelatedModels().slice(0, 3).map((relatedModel, idx) => (
              <Link
                key={relatedModel.id}
                to={`/models/${relatedModel.id}`}
                className="group block bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c2b2a3]/30 transition-all duration-300"
              >
                <div className="flex">
                  <div className="w-24 h-32 flex-shrink-0 overflow-hidden">
                    <img 
                      src={relatedModel.image} 
                      alt={relatedModel.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="text-lg serif text-white uppercase tracking-wider mb-1">{relatedModel.name}</h4>
                    <p className="text-gray-400 text-xs mb-3">{relatedModel.age} años • {relatedModel.city || 'Valencia'}</p>
                    <div className="flex items-center">
                      <span className="text-[#c2b2a3] text-xs font-light">Ver perfil</span>
                      <ChevronRight size={14} className="text-[#c2b2a3] ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
                
                {/* Badge for exclusivity */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-[#c2b2a3]/30 text-[9px] tracking-[0.4em] uppercase font-bold text-[#c2b2a3]">
                  Elección Élite
                </div>
                
                {/* Image Counter and Navigation Dots - Desktop */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6">
                  <div className="text-white/80 text-xs font-light">
                    1 / {(model.gallery?.length || 0) + 1}
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: (model.gallery?.length || 0) + 1 }, (_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          openGallery(i);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === 0 ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="space-y-6">
              <h2 className="text-3xl serif text-white uppercase tracking-widest">{model.name}</h2>
              <div className="text-lg font-light text-[#c2b2a3] tracking-[0.3em] uppercase mb-4">
                ESCORT EN VALENCIA
              </div>
              <div className="text-gray-400 font-light leading-[1.8] text-lg max-w-4xl px-6 space-y-6">
                {model.description.split('. ').reduce((acc, sentence, idx) => {
                  if (sentence.trim()) {
                    const paragraphIndex = Math.floor(idx / 5);
                    if (!acc[paragraphIndex]) acc[paragraphIndex] = [];
                    acc[paragraphIndex].push(sentence.trim());
                  }
                  return acc;
                }, []).map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-justify">
                    {paragraph.join('. ')}.
                  </p>
                ))}
              </div>
              {model.essence && (
                <div className="bg-[#111111] border border-white/5 p-4 flex-1">
                  <h3 className="text-sm text-[#c2b2a3] uppercase tracking-[0.4em] mb-3 font-bold">La Esencia</h3>
                  <p className="text-gray-400 font-light leading-[1.6]">
                    {model.essence}
                  </p>
                </div>
              )}
            </div>

            {/* Lo que me hace única y Experiencias - Columnas en paralelo - Desktop - Todas las modelos */}
            {model.name && (
              <div className="grid grid-cols-2 gap-6 mt-16">
                {/* Lo que me hace única */}
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl serif text-white uppercase tracking-widest leading-none">Lo que me hace <span className="italic luxury-text-gradient">única</span></h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </div>
                  <div className="bg-[#111111] border border-white/5 p-4 flex-1">
                    <ul className="text-gray-400 font-light leading-[1.7] space-y-2">
                      {model.name === "Kimberly" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación europea con calidez latina natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Inteligencia conversacional y curiosidad cultural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Estilo único que combina moda colombiana con diseño europeo</span>
                          </li>
                        </>
                      )}
                      {model.name === "Alicia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Frescura juvenil con energía vibrante natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Aventuras inéditas descubriendo horizontes nuevos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Conexiones auténticas espontáneas y genuinas</span>
                          </li>
                        </>
                      )}
                      {model.name === "Mia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Energía juvenil con figura esculpida perfecta</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sonrisa contagiosa que ilumina cualquier ambiente</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vitalidad tropical con frescura natural</span>
                          </li>
                        </>
                      )}
                      {model.name === "Silvia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Misterio enigmático con profundidad natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Elegancia sofisticada con toque exótico único</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sensibilidad artística con carisma magnético</span>
                          </li>
                        </>
                      )}
                      {model.name === "Yaiza" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sensualidad mediterránea con pasión brasileña</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Movimientos fluidos hipnóticos y naturales</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Carisma tropical que cautiva instantáneamente</span>
                          </li>
                        </>
                      )}
                      {model.name === "Paula (VIP)" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Elegancia VIP exclusiva de clase internacional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación élite con distinción natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Presencia magnética inolvidable y única</span>
                          </li>
                        </>
                      )}
                      {model.name === "Naty" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Energía tropical brasileña contagiosa y vibrante</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Alegría espontánea que ilumina cualquier ambiente</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vitalidad natural con carisma cálido tropical</span>
                          </li>
                        </>
                      )}
                      {model.name === "Erika" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación mediterránea con clase europea</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Elegancia cultural refinada e internacional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Figura armoniosa con estilo cosmopolita</span>
                          </li>
                        </>
                      )}
                      {model.name === "Teresa" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Energía vibrante con carisma natural español</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Espontaneidad mediterránea fresca y auténtica</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Modernidad tradicional con alegría genuina</span>
                          </li>
                        </>
                      )}
                      {model.name === "Elena" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación paraguaya con distinción única</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Figura armoniosa con refinamiento natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Magnetismo personal con carisma internacional</span>
                          </li>
                        </>
                      )}
                      {model.name === "Lana" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Energía tropical venezolana vibrante y magnética</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Autenticidad caribeña con elegancia natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación latina con sensualidad única</span>
                          </li>
                        </>
                      )}
                      {model.name === "Luna" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Misterio nocturno colombiano enigmático profundo</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sensualidad auténtica con atmósferas mágicas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Carisma lunar con pasión tropical intensa</span>
                          </li>
                        </>
                      )}
                      {model.name === "Carla" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Estilo mediterráneo con elegancia natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Figura esbelta con autenticidad española</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sensualidad mediterránea con pasión vibrante</span>
                          </li>
                        </>
                      )}
                      {model.name === "Estefany" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Intensidad latina con dulzura natural colombiana</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Curvas voluptuosas con temperamento ardiente</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Carisma auténtico con energía vibrante apasionada</span>
                          </li>
                        </>
                      )}
                      {model.name === "Maria" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación española con experiencia madura</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Figura equilibrada con estilo refinado elegante</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Perspectiva única con elegancia natural auténtica</span>
                          </li>
                        </>
                      )}
                      {model.name === "Claudia (VIP)" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Sofisticación VIP española con elegancia exclusiva</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Figura equilibrada con presencia refinada distinguida</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Estilo VIP con clase internacional experiencias únicas</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Experiencias que ofrezco */}
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl serif text-white uppercase tracking-widest leading-none">Experiencias que <span className="italic luxury-text-gradient">ofrezco</span></h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </div>
                  <div className="bg-[#111111] border border-white/5 p-4 flex-1">
                    <ul className="text-gray-400 font-light leading-[1.7] space-y-2">
                      {model.name === "Kimberly" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Cenas de negocios con conversaciones profundas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos sociales con elegancia internacional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Conexiones intelectuales y emocionales genuinas</span>
                          </li>
                        </>
                      )}
                      {model.name === "Alicia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Aventuras inéditas descubrimientos emocionantes únicos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Exploración cultural perspectiva juvenil fresca moderna</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Conexiones auténticas espontáneas memorables duraderas</span>
                          </li>
                        </>
                      )}
                      {model.name === "Mia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias juveniles llenas de energía y alegría</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Momentos espontáneos con autenticidad tropical</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias vibrantes con frescura natural</span>
                          </li>
                        </>
                      )}
                      {model.name === "Silvia" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Noches misteriosas revelaciones inesperadas profundas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Exploración sensaciones enigma misterio seducción</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Conexiones profundas toque juvenil magia encanto</span>
                          </li>
                        </>
                      )}
                      {model.name === "Yaiza" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Baile sensual movimientos hipnóticos brasileños</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Masajes tropicales técnica experta relajación</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Noches pasión inolvidable intensidad deseo</span>
                          </li>
                        </>
                      )}
                      {model.name === "Paula (VIP)" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias VIP exclusivas personalizadas lujosas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Acompañamiento lujo eventos élite sofisticación</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Servicios discreción garantizada privacidad absoluta</span>
                          </li>
                        </>
                      )}
                      {model.name === "Naty" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Fiestas tropicales energía brasileña contagiosa</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Cenas apasionadas sabor latino cariño pasión</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Momentos íntimos autenticidad tropical calidez</span>
                          </li>
                        </>
                      )}
                      {model.name === "Erika" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Acompañamiento lujo mediterráneo cultura refinada</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Cenas elegantes sofisticación clase internacional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias culturales refinadas arte conocimiento</span>
                          </li>
                        </>
                      )}
                      {model.name === "Teresa" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos sociales energía carisma alegría vital</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Encuentros auténticos espontaneidad frescura natural</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias tradición española modernidad refrescante</span>
                          </li>
                        </>
                      )}
                      {model.name === "Elena" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Cenas negocios sofisticación distinción elegancia</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Ocasiones especiales magnetismo internacional carisma</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos memorables estilo refinado paraguayo único</span>
                          </li>
                        </>
                      )}
                      {model.name === "Lana" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos exclusivos energía venezolana tropical</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias apasionadas autenticidad carisma cálido</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias sofisticadas toque caribeño latino</span>
                          </li>
                        </>
                      )}
                      {model.name === "Luna" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Encuentros íntimos memorables sensualidad auténtica</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Atmósferas mágicas misterio nocturno enigmático</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias extraordinarias influencia lunar tropical</span>
                          </li>
                        </>
                      )}
                      {model.name === "Carla" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos exclusivos estilo mediterráneo elegante</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Ocasiones únicas sofisticación pasión vibrante</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias inolvidables autenticidad española sensual</span>
                          </li>
                        </>
                      )}
                      {model.name === "Estefany" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Encuentros apasionados intensidad latina cariño</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias voluptuosas ternura fuego pasión</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias auténticas energía colombiana vibrante</span>
                          </li>
                        </>
                      )}
                      {model.name === "Maria" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Cenas negocios sofisticación experiencia madura</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Eventos corporativos elegancia perspectiva única</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Experiencias refinadas autenticidad española</span>
                          </li>
                        </>
                      )}
                      {model.name === "Claudia (VIP)" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Acompañamiento lujo Valencia sofisticación exclusiva</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Encuentros distinguidos experiencias únicas VIP</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#c2b2a3] mr-2">•</span>
                            <span>Vivencias extraordinarias clase internacional refinada</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Editorial Gallery - Desktop */}
            <div className="space-y-8 mt-12">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl serif text-white uppercase tracking-widest">Galería Editorial</h3>
                <p className="text-sm text-gray-400 italic">Explora su mundo visual</p>
              </div>
              
              {/* Magazine-style Gallery Layout */}
              <div className="grid grid-cols-12 gap-4">
                {/* Main Feature Image */}
                {(model.gallery || [])[0] && (
                  <div 
                    className="col-span-12 lg:col-span-8 row-span-2 relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 rounded-2xl"
                    onClick={() => openGallery(1)}
                  >
                    <img 
                      src={(model.gallery || [])[0]} 
                      alt={`${model.name} - Portada`} 
                      className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white text-sm font-light mb-2">Portada editorial</p>
                        <p className="text-white/70 text-xs">Click para ver en alta resolución</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Side Images */}
                <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
                  {(model.gallery || []).slice(1, 3).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 rounded-2xl aspect-[4/5] lg:aspect-auto"
                      onClick={() => openGallery(idx + 2)}
                    >
                      <img 
                        src={img} 
                        alt={`${model.name} - Galería ${idx + 2}`} 
                        className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="text-white text-xs font-light">Ver imagen</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Bottom Gallery Strip */}
                <div className="col-span-12">
                  <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                    {(model.gallery || []).slice(3).map((img, idx) => (
                      <div 
                        key={idx}
                        className="relative overflow-hidden bg-[#111111] group cursor-pointer border border-white/5 rounded-xl flex-shrink-0 w-24 h-32 lg:w-32 lg:h-40"
                        onClick={() => openGallery(idx + 4)}
                      >
                        <img 
                          src={img} 
                          alt={`${model.name} - Galería ${idx + 4}`} 
                          className="w-full h-full object-cover transition-all duration-[1s] group-hover:scale-110"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Sparkles size={14} className="text-white/80" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Gallery Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <p>{(model.gallery || []).length + 1} imágenes en alta resolución</p>
                <p className="italic">Click en cualquier imagen para ver en pantalla completa</p>
              </div>
            </div>

            {/* Related Models Section */}
            <div className="space-y-8 mt-16">
              <div className="text-center">
                <h3 className="text-2xl serif text-white uppercase tracking-widest mb-4">También te puede gustar</h3>
                <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
                  Descubre otras modelos que podrían complementar tu experiencia perfecta
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getRelatedModels().map((relatedModel, idx) => (
                  <Link
                    key={relatedModel.id}
                    to={`/models/${relatedModel.id}`}
                    className="group block bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c2b2a3]/30 transition-all duration-300"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={relatedModel.image} 
                        alt={relatedModel.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl serif text-white uppercase tracking-wider mb-2">{relatedModel.name}</h4>
                      <p className="text-gray-400 text-sm mb-4">{relatedModel.age} años • {relatedModel.city || 'Valencia'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#c2b2a3] text-sm font-light">Ver perfil</span>
                        <ChevronRight size={16} className="text-[#c2b2a3] group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
                        
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Personal Details */}
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
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
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
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
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Encuentros en Valencia</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Disponible para encuentros en Valencia y alrededores. Servicio discreto y profesional en hotel, domicilio o lugar de tu elección.
              </p>
            </div>
            
            {/* International Meetings */}
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Encuentros Internacionales</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Disponible para viajes internacionales. Consultar disponibilidad y condiciones para acompañamiento en otras ciudades y países.
              </p>
            </div>
            
            {/* Contacts */}
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
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
            <div className="bg-[#111111] border border-white/5 p-4 flex-1">
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
