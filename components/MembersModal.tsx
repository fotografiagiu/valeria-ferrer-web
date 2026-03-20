
import React from 'react';
import { X, Lock } from 'lucide-react';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="relative bg-[#111111] border border-[#c2b2a3]/20 w-full max-w-2xl p-10 md:p-16 text-center animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#c2b2a3]/30">
          <Lock size={24} className="text-[#c2b2a3]" />
        </div>

        <h2 className="text-2xl md:text-4xl serif uppercase mb-4 tracking-wider">Lounge de Miembros e Invitados</h2>
        <p className="text-gray-400 text-sm font-light tracking-wide mb-10 max-w-md mx-auto">
          Bienvenido al área VIP de Valeria Ferrer. Este espacio incluirá fotos sin censura, videos privados y noticias exclusivas de nuestras modelos.
        </p>

        <div className="py-12 border border-white/5 bg-[#1a1a1a]/50 rounded-xl mb-8">
          <p className="text-[#c2b2a3] text-xs font-bold tracking-[0.4em] uppercase">Próximamente</p>
          <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest">Estamos preparando un espacio exclusivo para nuestros clientes más selectos.</p>
        </div>

        <div className="mt-12 pt-10 border-t border-white/5">
          <p className="text-[10px] text-gray-500 tracking-[0.2em] leading-relaxed uppercase">
            El acceso de invitado de un solo uso se otorga a clientes verificados existentes.
            Por favor, maneje sus credenciales con cuidado para proteger la privacidad de nuestras damas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
