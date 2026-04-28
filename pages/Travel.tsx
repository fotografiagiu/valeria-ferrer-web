
import React, { useEffect } from 'react';
import { DOCUMENTATION } from '../constants';
import { Plane, Globe, Shield, Hotel } from 'lucide-react';
import { motion } from 'framer-motion';

const Travel: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Plane size={48} className="mx-auto text-[#c2b2a3] mb-6 opacity-40" />
          <h1 className="text-4xl md:text-6xl serif luxury-text-gradient uppercase mb-6">Acompañamiento de Viajes</h1>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs leading-relaxed max-w-2xl mx-auto">
            Acompañamiento de lujo sin fronteras. Nuestras modelos de lujo están preparadas para viajar a cualquier destino global con la elegancia y discreción que nos caracteriza.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl serif text-white uppercase tracking-widest mb-8">Logística y Exclusividad</h2>
            <p className="text-gray-400 font-light leading-[2] text-lg mb-8">
              {DOCUMENTATION.travel.content}
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#c2b2a3]/20 flex items-center justify-center text-[#c2b2a3]">
                  <Globe size={18} />
                </div>
                <span className="text-xs tracking-widest uppercase text-gray-300">Destinos Globales: Dubái, Londres, Nueva York, etc.</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#c2b2a3]/20 flex items-center justify-center text-[#c2b2a3]">
                  <Shield size={18} />
                </div>
                <span className="text-xs tracking-widest uppercase text-gray-300">Discreción absoluta en trámites y traslados.</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#c2b2a3]/20 flex items-center justify-center text-[#c2b2a3]">
                  <Hotel size={18} />
                </div>
                <span className="text-xs tracking-widest uppercase text-gray-300">Estándar de alojamiento: 5 Estrellas / Lujo.</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-video bg-[#111111] border border-white/5 relative overflow-hidden"
          >
            <img src="https://picsum.photos/seed/travel/1200/800" className="w-full h-full object-cover grayscale opacity-50" alt="Travel" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl serif italic text-white mb-2">"El mundo es su escenario"</p>
                <div className="w-12 h-[1px] bg-[#c2b2a3] mx-auto"></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-[#111111] p-12 md:p-20 border border-white/5 text-center">
          <h3 className="text-2xl serif text-[#c2b2a3] uppercase tracking-widest mb-8">¿Planeando su próximo viaje?</h3>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs mb-12 max-w-xl mx-auto">
            Contacte con nuestra central de reservas para coordinar la logística de su acompañamiento.
          </p>
          <a href="/booking" className="inline-block px-14 py-5 bg-white text-black text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#c2b2a3] transition-all duration-500">
            Solicitar Presupuesto de Viaje
          </a>
        </div>
      </div>
    </div>
  );
};

export default Travel;
