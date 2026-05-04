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
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ 
            objectFit: 'cover',
            opacity: 0.9
          } as React.CSSProperties}
        >
          <source src="/video/plaza-escort-valencia-centro-alojamiento.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          {/* Main name with better visual organization */}
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-8xl font-light tracking-wider leading-none mb-4">
              <span className="block bg-gradient-to-r from-[#f7e7ce] via-[#e8d4b0] via-[#d4af37] via-[#c2b2a3] to-[#f7e7ce] bg-clip-text text-transparent">
                Valeria Ferrer
              </span>
            </h1>
            
            {/* Visual separator */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
              <div className="w-2 h-2 rounded-full bg-[#c2b2a3]/50"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
            </div>
            
            {/* Subtitle with better positioning */}
            <div className="relative">
              <span className="text-2xl md:text-4xl tracking-[0.4em] font-light text-[#c2b2a3] block">
                Agencia Premium
              </span>
              
              {/* Subtle underline */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/40 to-transparent"></div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-200 mb-12 drop-shadow-xl"
        >
          Experiencias exclusivas y citas discretas en Valencia
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Link
              to="/models"
              className="block px-12 py-5 border border-[#c2b2a3] text-[#c2b2a3] uppercase tracking-[0.3em] text-xs backdrop-blur-md hover:bg-[#c2b2a3] hover:text-black transition-all duration-700 w-full sm:w-auto group"
            >
              <span className="relative z-10">Descubrir Escorts</span>
              <div className="absolute inset-0 bg-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Link
              to="/booking"
              className="block px-12 py-5 luxury-gradient text-black uppercase tracking-[0.3em] text-xs font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(194,178,163,0.3)] transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
            >
              <span className="relative z-10">Reservar Cita Exclusiva</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
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
