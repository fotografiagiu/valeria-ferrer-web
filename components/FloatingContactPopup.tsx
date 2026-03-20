
import React, { useState, useEffect } from 'react';
import { Send, Phone, Calendar, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingContactPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMinimized, setShowMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000); // Show after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowMinimized(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowMinimized(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[55] max-w-[280px] w-full"
          >
            <div className="bg-[#111111]/95 backdrop-blur-md border border-[#c2b2a3]/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#c2b2a3]/5 rounded-full blur-2xl group-hover:bg-[#c2b2a3]/10 transition-colors duration-500"></div>
              
              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>

              <div className="relative z-10">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c2b2a3] mb-3">Atención Exclusiva</h4>
                <p className="text-[11px] text-gray-300 leading-relaxed mb-5 tracking-wide">
                  Para garantizar su privacidad, atendemos exclusivamente vía <span className="text-white font-medium italic">Telegram</span> o cita previa.
                </p>

                <div className="space-y-3">
                  <a 
                    href="https://t.me/Valeriaferreeer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-[#c2b2a3] text-black py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 group/btn"
                  >
                    <div className="flex items-center">
                      <Send size={14} className="mr-3" />
                      <span>Telegram</span>
                    </div>
                    <span className="text-[8px] opacity-60">@Valeriaferreeer</span>
                  </a>

                  <a 
                    href="tel:645872227"
                    className="flex items-center justify-between w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <Phone size={14} className="mr-3 text-[#c2b2a3]" />
                      <span>645 872 227</span>
                    </div>
                  </a>

                  <a 
                    href="#/booking"
                    className="flex items-center justify-center w-full text-[9px] font-medium uppercase tracking-[0.3em] text-[#c2b2a3] hover:text-white transition-colors py-1"
                  >
                    <Calendar size={12} className="mr-2" />
                    Agenda tu cita
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Tab */}
      <AnimatePresence>
        {(showMinimized && !isOpen) && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={handleOpen}
            className="fixed bottom-32 right-0 z-[55] bg-[#c2b2a3] text-black py-3 px-2 rounded-l-xl shadow-2xl flex flex-col items-center space-y-2 hover:bg-white transition-colors duration-300 group"
            aria-label="Abrir contacto"
          >
            <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
            <span className="[writing-mode:vertical-rl] text-[9px] font-bold uppercase tracking-widest py-1">Contacto</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingContactPopup;
