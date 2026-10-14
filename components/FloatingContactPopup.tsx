
import React, { useState, useEffect } from 'react';
import { Send, Phone, Calendar, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOATING_SIDE_TABS } from '../lib/floatingSideTabs';
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  OFFICIAL_WHATSAPP_URL,
} from '../lib/officialContact';

const FloatingContactPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMinimized, setShowMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
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
      {/* Columna flotante: WhatsApp arriba · Atención Exclusiva debajo */}
      <div className="fixed bottom-24 right-6 z-[55] flex w-[min(300px,calc(100vw-1.75rem))] flex-col items-stretch gap-3">
        <a
          href={OFFICIAL_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-contact-placement="floating_whatsapp"
          className="floating-whatsapp-banner"
          aria-label={`WhatsApp Valeria Ferrer ${OFFICIAL_PHONE_LABEL}`}
        >
          <picture>
            <source srcSet="/contact/whatsapp-floating-banner.webp" type="image/webp" />
            <img
              src="/contact/whatsapp-floating-banner.jpg"
              alt=""
              width={1011}
              height={293}
              decoding="async"
              className="floating-whatsapp-banner__img"
            />
          </picture>
          <span className="sr-only">
            WhatsApp Valeria Ferrer · Habla ahora por WhatsApp · {OFFICIAL_PHONE_LABEL}
          </span>
        </a>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#c2b2a3]/20 bg-[#111111]/95 p-5 shadow-2xl backdrop-blur-md group">
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#c2b2a3]/5 blur-2xl transition-colors duration-500 group-hover:bg-[#c2b2a3]/10" />

                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1 text-gray-400 transition-colors hover:text-white"
                  aria-label="Cerrar ventana de contacto"
                >
                  <X size={16} aria-hidden="true" />
                </button>

                <div className="relative z-10">
                  <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c2b2a3]">
                    Atención Exclusiva
                  </h4>
                  <p className="mb-5 text-[11px] leading-relaxed tracking-wide text-gray-300">
                    Para garantizar su privacidad, atendemos vía{' '}
                    <span className="font-medium italic text-white">Telegram</span>,{' '}
                    <span className="font-medium italic text-[#25d366]">WhatsApp</span> o cita previa.
                  </p>

                  <div className="space-y-3">
                    <a
                      href={OFFICIAL_TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-contact-placement="floating"
                      className="group/btn flex w-full items-center justify-between rounded-xl bg-[#c2b2a3] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-white"
                    >
                      <div className="flex items-center">
                        <Send size={14} className="mr-3" />
                        <span>Telegram</span>
                      </div>
                      <span className="text-[8px] opacity-60">{OFFICIAL_TELEGRAM_HANDLE}</span>
                    </a>

                    <a
                      href={OFFICIAL_PHONE_TEL}
                      data-contact-placement="floating"
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/10"
                    >
                      <div className="flex items-center">
                        <Phone size={14} className="mr-3 text-[#c2b2a3]" />
                        <span>{OFFICIAL_PHONE_LABEL}</span>
                      </div>
                    </a>

                    <a
                      href="/booking"
                      className="flex w-full items-center justify-center py-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#c2b2a3] transition-colors hover:text-white"
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
      </div>

      <AnimatePresence>
        {showMinimized && !isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={handleOpen}
            className={`fixed ${FLOATING_SIDE_TABS.contactBottomClass} right-0 z-[55] flex flex-col items-center space-y-2 rounded-l-xl bg-[#c2b2a3] px-2 py-3 text-black shadow-2xl transition-colors duration-300 hover:bg-white group`}
            aria-label="Abrir contacto"
          >
            <MessageSquare size={18} className="transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="[writing-mode:vertical-rl] py-1 text-[9px] font-bold uppercase tracking-widest">
              Contacto
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingContactPopup;
