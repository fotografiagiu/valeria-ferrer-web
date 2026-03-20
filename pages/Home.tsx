
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ModelsGrid from '../components/ModelsGrid';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import { ArrowRight, Plane, Shield, Heart, Globe, Diamond, ShieldCheck, Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />

      {/* Elite Experience Section */}
      <section className="py-12 md:py-24 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-2xl md:text-5xl font-light tracking-wider mb-2 md:mb-4">La Experiencia Elite</h2>
            <div className="w-16 md:w-24 h-[1px] md:h-[2px] bg-[#c2b2a3] mx-auto"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-8">
            {/* Exclusividad */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center"
            >
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <Diamond className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase">Exclusividad</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Un proceso de selección riguroso asegura que solo las mujeres más excepcionales formen parte de nuestra agencia.
              </p>
            </motion.div>

            {/* Discreción Absoluta */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center"
            >
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase text-nowrap">Discreción</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Su privacidad es nuestra máxima prioridad. Manejamos todas las reservas con el más alto nivel de confidencialidad.
              </p>
            </motion.div>

            {/* Calidad Premium */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center"
            >
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <Star className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase text-nowrap">Calidad</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Desde el primer contacto hasta el final de la cita, garantizamos un servicio impecable y personalizado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Telegram Reference */}
      <div className="bg-[#111111] py-4 border-b border-white/5 text-center">
        <a 
          href="https://t.me/Valeriaferreeer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.5em] text-[#c2b2a3] hover:text-white transition-colors uppercase font-bold flex items-center justify-center"
        >
          <Send size={14} className="mr-3" />
          Contactar por Telegram: @Valeriaferreeer
        </a>
      </div>

      {/* Models Selection */}
      <ModelsGrid />

      {/* Reviews */}
      <Reviews />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-32 relative flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img src="https://picsum.photos/seed/cta/1920/600?blur=10" className="w-full h-full object-cover opacity-20" alt="CTA BG" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-light mb-8 uppercase tracking-widest leading-tight">¿Listo para una <span className="italic luxury-text-gradient">experiencia</span> inolvidable?</h2>
          <Link 
            to="/booking" 
            className="inline-block px-12 py-5 bg-[#c2b2a3] text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
          >
            Realizar Reserva
          </Link>
          <p className="mt-8 text-[10px] text-gray-400 tracking-[0.4em] uppercase">Manejo 100% confidencial</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
