
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MODELS } from '../constants';
import { Model } from '../types';
import { motion } from 'framer-motion';

const ModelCard: React.FC<{ model: Model; index: number }> = ({ model, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-[#1a1a1a]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Link to={`/models/${model.id}`} className="block">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img 
            src={model.image} 
            alt={model.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {/* Hover Reveal Image */}
          <img 
            src={model.hoverImage} 
            alt={`${model.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {/* New Badge */}
          {(model.name === 'Ariel' || model.name === 'Carlota') && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30">
              <span className="px-2.5 py-1 md:px-3 md:py-1 bg-[#c2b2a3] text-black text-[10px] md:text-[9px] tracking-[0.2em] uppercase font-bold rounded-sm shadow-lg">
                Nueva
              </span>
            </div>
          )}
          
          {/* VIP Badge for Gaby */}
          {model.name === 'Gaby' && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-30">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#c2b2a3]/20 to-[#c2b2a3]/10 blur-md"></div>
                <div className="relative flex items-center space-x-1 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[#c2b2a3]/10 to-[#c2b2a3]/5 backdrop-blur-sm border border-[#c2b2a3]/30 rounded-full">
                  <div className="w-2 h-2 bg-[#c2b2a3] rounded-full animate-pulse"></div>
                  <span className="text-[#c2b2a3] text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-light">
                    VIP
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick view badge */}
          <div className={`absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-20 ${isHovered ? 'translate-y-0' : 'translate-y-12'}`}>
            <span className="px-3.5 py-2 md:px-4 md:py-2 bg-white/10 backdrop-blur-md text-[10px] md:text-[10px] tracking-[0.3em] uppercase font-bold border border-white/20">
              Ver Perfil
            </span>
          </div>
        </div>
        
        <div className="p-4 md:p-6 relative z-10 text-center">
          <h3 className="text-xl md:text-2xl tracking-widest uppercase mb-1 font-light">{model.name}</h3>
          <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#c2b2a3]">{model.location}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const ModelsGrid: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-0 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4 md:px-0"
        >
          <h2 className="text-3xl md:text-5xl font-light mb-4">Escorts VIP <span className="italic">de Lujo</span></h2>
          <div className="w-20 h-[1px] bg-[#c2b2a3] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {MODELS.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center px-4 md:px-0">
          <Link 
            to="/models" 
            className="inline-block px-12 py-5 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#c2b2a3] transition-colors"
          >
            Ver Todas las Escorts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModelsGrid;
