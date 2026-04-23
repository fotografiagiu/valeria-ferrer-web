
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24 overflow-x-hidden">
      {/* Intro Section (Moved from Home) */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight tracking-wide">
              Bienvenidos a <span className="italic">Valeria Ferrer</span>
              <br />
              Modelos de Lujo en Valencia
            </h2>
            <p className="text-gray-400 font-light leading-relaxed mb-8">
              En Valeria Ferrer, bajo nuestro sello <strong>www.valeriaferrer.com</strong>, seleccionamos a las modelos de lujo más exclusivas para ofrecer un acompañamiento sin precedentes. No somos solo una agencia; somos un estándar de vida.
            </p>
            <p className="text-gray-400 font-light leading-relaxed mb-10">
              Cada perfil es verificado y cada encuentro es planeado bajo los más estrictos controles de calidad y discreción. Nuestra misión es superar la elegancia y ofrecer una experiencia intelectual y pasional única.
            </p>
            <div className="flex items-center space-x-2 text-[#c2b2a3] font-medium tracking-widest uppercase text-xs group cursor-pointer">
              <span>Nuestra Filosofía</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] border border-[#c2b2a3]/20 p-4">
              <img 
                src="https://picsum.photos/seed/luxury/800/1000" 
                alt="Luxury Lifestyle" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-10 -left-10 bg-[#111111] p-10 border border-[#c2b2a3]/20 hidden md:block"
            >
              <p className="text-3xl serif italic text-[#c2b2a3]">"La elegancia es la única belleza que nunca se desvanece."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy & Travel Section */}
      <section className="py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl serif text-[#c2b2a3] uppercase tracking-widest mb-8">Acompañamiento de Viajes</h3>
              <p className="text-gray-400 font-light leading-[2] text-lg">
                Las modelos de Valeria Ferrer están disponibles para acompañarle en viajes de negocios o placer. Entendemos las necesidades del viajero exigente y ofrecemos una compañía que se adapta a cualquier entorno, desde reuniones corporativas hasta escapadas privadas en destinos exóticos.
              </p>
              <div className="mt-8 p-6 border-l-2 border-[#c2b2a3] bg-white/[0.02]">
                <p className="text-xs tracking-widest uppercase text-gray-500 leading-relaxed">
                  * El cliente gestiona los gastos de transporte (Business Class), alojamiento en hoteles de 5 estrellas y dietas.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl serif text-[#c2b2a3] uppercase tracking-widest mb-8">Etiqueta y Discreción</h3>
              <p className="text-gray-400 font-light leading-[2] text-lg">
                Mantenemos un estándar de conducta impecable. Esperamos de nuestros clientes el mismo nivel de respeto y cortesía que nuestras modelos ofrecen. La discreción es el pilar de nuestra agencia: protegemos su identidad con el máximo celo profesional.
              </p>
              <div className="mt-8 p-6 border-l-2 border-[#c2b2a3] bg-white/[0.02]">
                <p className="text-xs tracking-widest uppercase text-gray-500 leading-relaxed">
                  * No se permiten grabaciones. Los datos de contacto son eliminados permanentemente tras cada encuentro.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
