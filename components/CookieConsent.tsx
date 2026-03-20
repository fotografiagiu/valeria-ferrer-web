
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8"
        >
          <div className="max-w-7xl mx-auto bg-[#111111]/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4 md:max-w-2xl">
              <div className="mt-1 text-[#c2b2a3]">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white">Privacidad y Cookies</h4>
                <p className="text-[10px] md:text-xs font-light text-gray-400 leading-relaxed uppercase tracking-wider">
                  Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación. Al continuar navegando, consideramos que acepta su uso. Puede obtener más información en nuestra <a href="#" className="text-[#c2b2a3] underline underline-offset-4">Política de Cookies</a>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button 
                onClick={handleDecline}
                className="text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:text-white transition-colors px-6 py-3"
              >
                Configurar
              </button>
              <button 
                onClick={handleAccept}
                className="w-full sm:w-auto px-12 py-4 bg-[#c2b2a3] text-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
              >
                Aceptar y Continuar
              </button>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
