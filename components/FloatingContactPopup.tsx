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
  // Inicio abre Contacto al cargar. Al cerrar, permanece minimizado hasta volver a Inicio.
  const [isOpen, setIsOpen] = useState(() => isHome);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // En las fichas y demás rutas comienza minimizado; al regresar a Inicio vuelve a desplegarse.
  useEffect(() => {
    setIsOpen(isHome);
  }, [pathname, isHome]);

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
                className="absolute right-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-gray-300 shadow-sm transition-all hover:border-[#c2b2a3]/50 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Cerrar opciones de contacto"
              >
                <X size={21} strokeWidth={1.8} aria-hidden="true" />
              </button>
              <h4 className="mb-2 pr-12 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c2b2a3]">
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
          className="vf-whatsapp-glass fixed bottom-5 right-4 z-[55] inline-flex min-h-[58px] items-center gap-3 overflow-hidden rounded-full px-4 py-2.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-6 md:right-6 md:min-h-[62px] md:px-5"
        >
          <span className="vf-whatsapp-glass__icon grid h-9 w-9 shrink-0 place-items-center rounded-full" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.965-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.48s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.307 1.263.49 1.695.627.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.174-1.413-.075-.124-.273-.198-.57-.347m-5.423 7.403h-.004a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.741.98.998-3.647-.235-.374a9.86 9.86 0 01-1.51-5.26C2.166 6.443 6.601 2.01 12.054 2.01a9.79 9.79 0 016.966 2.886 9.793 9.793 0 012.883 6.972c-.003 5.453-4.438 9.886-9.854 9.886m8.413-18.299A11.805 11.805 0 0012.05 0C5.495 0 .16 5.336.158 11.896a11.87 11.87 0 001.588 5.949L0 24l6.3-1.652a11.91 11.91 0 005.75 1.465h.005c6.557 0 11.892-5.336 11.895-11.897a11.832 11.832 0 00-3.488-8.403Z" />
            </svg>
          </span>
          <span className="vf-whatsapp-glass__copy relative z-10 flex flex-col items-start gap-0.5">
            <span className="text-[15px] font-bold leading-[1.1] tracking-[0.02em]">WhatsApp</span>
            <span className="vf-whatsapp-glass__subtitle text-[9px] font-semibold uppercase leading-tight tracking-[0.16em]">Escríbenos</span>
          </span>
        </a>
      )}
    </>
  );
};

export default FloatingContactPopup;
