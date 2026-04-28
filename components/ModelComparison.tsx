import React, { useState } from 'react';
import { X, Plus, Trash2, Heart, Star, Phone, MessageCircle } from 'lucide-react';
import LazyImage from './LazyImage';

interface ModelComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  modelIds: string[];
}

const ModelComparison: React.FC<ModelComparisonProps> = ({ isOpen, onClose, modelIds }) => {
  const [selectedModels, setSelectedModels] = useState<string[]>(modelIds);

  // Mock model data - in real implementation, this would come from your models data
  const getModelData = (id: string) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    age: 22,
    nationality: 'Española',
    height: '170cm',
    weight: '52kg',
    image: `/chicas/${id}-valencia-ferrer-model-agency-valencia/cover.jpg`,
    services: ['Girlfriend Experience', 'Cenas de Negocios', 'Eventos Sociales'],
    availability: '24h',
    languages: ['Español', 'Inglés'],
    rating: 4.8,
    experience: 2
  });

  const models = selectedModels.map(getModelData);

  const addModel = (modelId: string) => {
    if (selectedModels.length < 4 && !selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const removeModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };

  const clearAll = () => {
    setSelectedModels([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-2xl serif luxury-text-gradient">Comparar Modelos</h2>
            <p className="text-sm text-gray-400 mt-1">Comparando {selectedModels.length} modelo{selectedModels.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-4">
            {selectedModels.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
                title="Limpiar todo"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {selectedModels.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#c2b2a3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-[#c2b2a3]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No hay modelos seleccionados</h3>
            <p className="text-gray-400 mb-6">Añade modelos desde la galería para compararlos</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.2em]">Característica</th>
                    {models.map((model) => (
                      <th key={model.id} className="text-center p-4 min-w-[200px]">
                        <div className="space-y-2">
                          <LazyImage
                            src={model.image}
                            alt={model.name}
                            className="w-20 h-24 object-cover rounded-lg mx-auto"
                          />
                          <div>
                            <h4 className="font-bold text-white">{model.name}</h4>
                            <button
                              onClick={() => removeModel(model.id)}
                              className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Empty columns for max 4 models */}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <th key={idx} className="text-center p-4 min-w-[200px]">
                        <div className="w-20 h-24 bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-lg mx-auto flex items-center justify-center">
                          <Plus size={24} className="text-gray-600" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Edad</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white">{model.age} años</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Nacionalidad</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white">{model.nationality}</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Estatura</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white">{model.height}</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Peso</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white">{model.weight}</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Disponibilidad</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white">{model.availability}</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Idiomas</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center text-white text-sm">{model.languages.join(', ')}</td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 text-sm font-bold text-[#c2b2a3]">Servicios</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-4 text-center">
                        <div className="space-y-1">
                          {model.services.slice(0, 2).map((service, idx) => (
                            <span key={idx} className="block text-xs px-2 py-1 bg-[#c2b2a3]/10 rounded-full text-[#c2b2a3]">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 4 - models.length }).map((_, idx) => (
                      <td key={idx} className="p-4 text-center text-gray-600">-</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {models.map((model) => (
                <div key={model.id} className="flex-1 space-y-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=+34XXXXXXXXXX&text=Hola%2C+estoy+interesado+en+quedar+con+${encodeURIComponent(model.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#c2b2a3] text-black font-bold rounded-lg hover:bg-white transition-colors"
                  >
                    <MessageCircle size={16} />
                    Contactar {model.name}
                  </a>
                  <button
                    onClick={() => window.location.href = `/models/${model.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[#c2b2a3] text-[#c2b2a3] font-bold rounded-lg hover:bg-[#c2b2a3]/10 transition-colors"
                  >
                    Ver Perfil
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 p-4 bg-[#1a1a1a] rounded-lg border border-white/5">
              <h4 className="text-sm font-bold text-[#c2b2a3] uppercase tracking-[0.2em] mb-2">Resumen de Comparación</h4>
              <p className="text-sm text-gray-400">
                Comparando {selectedModels.length} modelo{selectedModels.length !== 1 ? 's' : ''} con diferentes características.
                {selectedModels.length > 1 && ' Todas están disponibles 24h y hablan español.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelComparison;
