
import React from 'react';
import ModelsGrid from '../components/ModelsGrid';

const Models: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen">
      <div className="bg-[#111111] py-20 px-6 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">Nuestras <span className="italic luxury-text-gradient">Escorts</span></h1>
          <p className="text-gray-400 font-light uppercase tracking-[0.3em] text-xs">Selección de Acompañantes de Élite en todo el Mundo</p>
        </div>
      </div>
      
      {/* Filtering Bar */}
      <div className="bg-[#0d0d0d] py-6 px-6 sticky top-[80px] z-40 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase text-[#c2b2a3]">
          <button className="hover:text-white transition-colors border-b border-[#c2b2a3]">Todas</button>
          <button className="hover:text-white transition-colors">Madrid</button>
          <button className="hover:text-white transition-colors">Barcelona</button>
          <button className="hover:text-white transition-colors">Londres</button>
          <button className="hover:text-white transition-colors">Dubái</button>
        </div>
      </div>

      <ModelsGrid />
    </div>
  );
};

export default Models;
