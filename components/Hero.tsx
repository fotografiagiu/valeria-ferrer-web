import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Media - Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <video
          src="/video/plaza-escort-valencia-centro-alojamiento.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={(e) => {
            e.currentTarget.play().catch(() => {});
          }}
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        >
          <source src="/video/plaza-escort-valencia-centro-alojamiento.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-5xl md:text-8xl font-light mb-6 tracking-wider leading-tight"
        >
          Valeria <span className="luxury-text-gradient font-bold italic uppercase">Ferrer</span>
          <br />
          <span className="text-2xl md:text-4xl tracking-[0.4em] font-light">
          Agencia Premium
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-200 mb-12 drop-shadow-xl"
        >
          Escorts de lujo y acompañantes VIP en Valencia
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8"
        >
          <Link
            to="/models"
            className="px-12 py-5 border border-[#c2b2a3] text-[#c2b2a3] uppercase tracking-[0.3em] text-xs backdrop-blur-md hover:bg-[#c2b2a3] hover:text-black transition-all duration-700 w-full sm:w-auto"
          >
            Ver Escorts de Lujo
          </Link>

          <Link
            to="/booking"
            className="px-12 py-5 luxury-gradient text-black uppercase tracking-[0.3em] text-xs font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(194,178,163,0.3)] transition-all duration-300 w-full sm:w-auto"
          >
            Reservar una Escort de Lujo
          </Link>
        </motion.div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-60">
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#c2b2a3] to-transparent"></div>
        <span className="text-[9px] tracking-[0.6em] uppercase text-[#c2b2a3] font-bold">
          Descubrir más
        </span>
      </div>
    </section>
  );
};

export default Hero;
