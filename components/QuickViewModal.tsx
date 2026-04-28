import React, { useState } from 'react';
import { X, Phone, MessageCircle, Calendar, MapPin, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, modelId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock model data - in real implementation, this would come from your models data
  const model = {
    id: modelId,
    name: modelId.charAt(0).toUpperCase() + modelId.slice(1),
    age: 22,
    nationality: 'Española',
    height: '170cm',
    weight: '52kg',
    image: `/chicas/${modelId}-valencia-ferrer-model-agency-valencia/cover.jpg`,
    gallery: [
      `/chicas/${modelId}-valencia-ferrer-model-agency-valencia/1.jpg`,
      `/chicas/${modelId}-valeria-ferrer-model-agency-valencia/2.jpg`,
      `/chicas/${modelId}-valencia-ferrer-model-agency-valencia/3.jpg`
    ],
    description: 'Modelo exclusiva de alta clase con experiencia en eventos sociales y acompañamiento de lujo.',
    services: ['Girlfriend Experience', 'Cenas de Negocios', 'Eventos Sociales', 'Acompañamiento Personal'],
    availability: '24h',
    languages: ['Español', 'Inglés']
  };

  const allImages = [model.image, ...model.gallery].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-2xl serif luxury-text-gradient">{model.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-white/5">
              <LazyImage
                src={allImages[currentImageIndex]}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Model Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Edad', value: model.age },
                { label: 'Estatura', value: model.height },
                { label: 'Peso', value: model.weight },
                { label: 'Nacionalidad', value: model.nationality }
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0a0a0a] p-4 border border-white/5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-1 font-bold">{stat.label}</p>
                  <p className="text-lg serif luxury-text-gradient">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.3em] mb-3">Sobre {model.name}</h3>
              <p className="text-gray-300 leading-relaxed">{model.description}</p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.3em] mb-3">Servicios</h3>
              <div className="flex flex-wrap gap-2">
                {model.services.map((service, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#c2b2a3]/10 border border-[#c2b2a3]/20 rounded-full text-xs text-[#c2b2a3]">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Disponibilidad</p>
                <p className="font-bold text-[#c2b2a3]">{model.availability}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Idiomas</p>
                <p className="font-bold text-[#c2b2a3]">{model.languages.join(', ')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={`https://api.whatsapp.com/send?phone=+34XXXXXXXXXX&text=Hola%2C+estoy+interesado+en+quedar+con+${encodeURIComponent(model.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#c2b2a3] text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                <MessageCircle size={18} />
                Contactar por WhatsApp
              </a>
              
              <button
                onClick={() => window.location.href = `/models/${modelId}`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#c2b2a3] text-[#c2b2a3] font-bold rounded-lg hover:bg-[#c2b2a3]/10 transition-colors"
              >
                <Calendar size={18} />
                Ver Perfil Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
