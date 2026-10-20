import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Phone, Calendar, X, MessageCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOATING_SIDE_TABS } from '../lib/floatingSideTabs';
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact';

// Keep the contact destination in the site's single official contact source.
const WHATSAPP_HOME_URL = officialWhatsAppUrlWithText(
  'Hola, he visto vuestra página web y me gustaría recibir información y reservar una cita.',
);

const FloatingContactPopup: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // A navigation never leaves the old contact panel over a model profile.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Restore the original vertical Contacto tab on all routes, including profiles. */}
      <div
        ref={wrapperRef}
        className={`fixed right-0 ${FLOATING_SIDE_TABS.contactBottomClass} z-[55] flex items-end gap-2`}
      >
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="vf-floating-contact-panel"
              role="region"
              aria-label="Opciones de contacto de Valeria Ferrer"
              initial={{ opacity: 0, x: 12, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="relative w-[min(19rem,calc(100vw-4.5rem))] overflow-hidden rounded-2xl border border-[#c2b2a3]/30 bg-[#111111]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.65)] backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Cerrar opciones de contacto"
              >
                <X size={17} aria-hidden="true" />
              </button>
              <h4 className="mb-2 pr-8 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c2b2a3]">
                Atención Exclusiva
              </h4>
              <p className="mb-3 text-[11px] leading-relaxed text-gray-300">
                Contacta de forma privada por WhatsApp, Telegram o teléfono.
              </p>

              <a
                href={WHATSAPP_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="floating_whatsapp"
                className="floating-whatsapp-banner mb-3 block w-full"
                aria-label={`Abrir WhatsApp Valeria Ferrer ${OFFICIAL_PHONE_LABEL}`}
              >
                <picture>
                  <source srcSet="/contact/whatsapp-floating-banner.webp" type="image/webp" />
                  <img
                    src="/contact/whatsapp-floating-banner.jpg"
                    alt={`WhatsApp Valeria Ferrer · ${OFFICIAL_PHONE_LABEL}`}
                    width={1011}
                    height={293}
                    decoding="async"
                    className="floating-whatsapp-banner__img"
                  />
                </picture>
              </a>

              <div className="space-y-2">
                <a
                  href={OFFICIAL_TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-placement="floating"
                  className="flex w-full items-center justify-between rounded-xl bg-[#c2b2a3] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-white"
                >
                  <span className="flex items-center gap-2"><Send size={15} aria-hidden="true" />Telegram</span>
                  <span className="text-[9px] font-medium normal-case tracking-normal opacity-75">{OFFICIAL_TELEGRAM_HANDLE}</span>
                </a>
                <a
                  href={OFFICIAL_PHONE_TEL}
                  data-contact-placement="floating"
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
                >
                  <span className="flex items-center gap-2"><Phone size={15} className="text-[#c2b2a3]" aria-hidden="true" />Llamar</span>
                  <span className="text-[10px] normal-case tracking-normal text-gray-300">{OFFICIAL_PHONE_LABEL}</span>
                </a>
                <a
                  href="/booking"
                  className="flex items-center justify-center gap-2 py-1 text-[10px] font-medium uppercase tracking-[0.13em] text-[#c2b2a3] transition-colors hover:text-white"
                >
                  <Calendar size={13} aria-hidden="true" /> Agenda tu cita
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={triggerRef}
          type="button"
          aria-label={isOpen ? 'Cerrar contacto' : 'Abrir contacto'}
          aria-expanded={isOpen}
          aria-controls="vf-floating-contact-panel"
          onClick={() => setIsOpen((previous) => !previous)}
          className="group flex flex-col items-center gap-2 rounded-l-xl bg-[#c2b2a3] px-2 py-3 text-black shadow-2xl transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MessageSquare size={18} className="transition-transform group-hover:scale-110" aria-hidden="true" />
          <span className="[writing-mode:vertical-rl] py-1 text-[9px] font-bold uppercase tracking-widest">
            Contacto
          </span>
        </button>
      </div>

      {/* Direct WhatsApp only on Inicio. It never overlays the model profile. */}
      {isHome && (
        <a
          href={WHATSAPP_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-contact-placement="floating_whatsapp"
          aria-label={`Abrir WhatsApp de Valeria Ferrer al ${OFFICIAL_PHONE_LABEL} con mensaje preparado`}
          className="fixed bottom-5 right-4 z-[55] inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d6ab5e]/65 bg-[#116b3d] px-4 py-3 text-white shadow-[0_5px_24px_rgba(0,0,0,.55),0_0_12px_rgba(25,166,89,.18)] transition-all hover:bg-[#18864d] hover:shadow-[0_6px_28px_rgba(0,0,0,.6),0_0_18px_rgba(25,166,89,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-6 md:right-6"
        >
          <MessageCircle size={22} fill="none" strokeWidth={2} aria-hidden="true" />
          <span className="text-[12px] font-semibold tracking-[0.06em]">WhatsApp</span>
        </a>
      )}
    </>
  );
};

export default FloatingContactPopup;
