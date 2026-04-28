
import React, { useState, useEffect } from 'react';
import ModelsGrid from '../components/ModelsGrid';
import ModelFilter from '../components/ModelFilter';
import AnimatedCounter from '../components/AnimatedCounter';
import QuickViewModal from '../components/QuickViewModal';
import ModelComparison from '../components/ModelComparison';
import modelsData from '../data/models.json';

const Models: React.FC = () => {
  const [filteredModels, setFilteredModels] = useState<any[]>(modelsData);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonModels, setComparisonModels] = useState<string[]>([]);

  const openQuickView = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsQuickViewOpen(true);
  };

  const addToComparison = (modelId: string) => {
    if (!comparisonModels.includes(modelId) && comparisonModels.length < 4) {
      setComparisonModels([...comparisonModels, modelId]);
    }
  };

  const removeFromComparison = (modelId: string) => {
    setComparisonModels(comparisonModels.filter(id => id !== modelId));
  };

  return (
    <div className="pt-24 min-h-screen">
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

      {/* Models Grid with filtered data */}
      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        <ModelsGrid models={filteredModels} onQuickView={openQuickView} />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        modelId={selectedModelId}
      />

      {/* Comparison Modal */}
      <ModelComparison
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        modelIds={comparisonModels}
      />

      {/* Floating Comparison Button */}
      {comparisonModels.length > 0 && (
        <button
          onClick={() => setIsComparisonOpen(true)}
          className="fixed bottom-6 right-6 bg-[#c2b2a3] text-black p-4 rounded-full shadow-2xl hover:bg-white transition-all duration-300 z-40"
        >
          <span className="flex items-center space-x-2">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
              {comparisonModels.length}
            </span>
            <span className="text-sm font-medium">Comparar</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Models;
