import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Model {
  id: string;
  name: string;
}

interface MobileNavigationButtonsProps {
  previousModel: Model | null;
  nextModel: Model | null;
  navigateToModel: (modelId: string) => void;
}

const MobileNavigationButtons: React.FC<MobileNavigationButtonsProps> = ({ 
  previousModel, 
  nextModel, 
  navigateToModel 
}) => {
  return (
    <div className="lg:hidden max-w-7xl mx-auto px-6 py-4">
      <div className="bg-[#111111] border border-white/5 rounded-lg p-4">
        <div className="space-y-3">
          <button 
            onClick={() => navigateToModel(previousModel?.id || '')}
            disabled={!previousModel}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              previousModel 
                ? 'bg-[#c2b2a3]/10 hover:bg-[#c2b2a3]/20 text-[#c2b2a3]' 
                : 'bg-black/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center">
              <ChevronLeft size={16} className="mr-2" />
              Anterior
            </span>
            {previousModel && <span className="text-sm">{previousModel.name}</span>}
          </button>
          
          <button 
            onClick={() => navigateToModel(nextModel?.id || '')}
            disabled={!nextModel}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              nextModel 
                ? 'bg-[#c2b2a3]/10 hover:bg-[#c2b2a3]/20 text-[#c2b2a3]' 
                : 'bg-black/30 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center">
              Siguiente
              <ChevronRight size={16} className="ml-2" />
            </span>
            {nextModel && <span className="text-sm">{nextModel.name}</span>}
          </button>
          
          <div className="pt-3 border-t border-white/10">
            <a 
              href="/models" 
              className="w-full flex items-center justify-center px-4 py-3 bg-black/30 hover:bg-black/50 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              Ver todas las modelos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationButtons;
