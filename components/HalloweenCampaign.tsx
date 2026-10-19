import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact';

/** Campaña independiente de las promociones gestionadas desde Administración. */
const HALLOWEEN_START = Date.parse('2026-10-19T00:00:00+02:00');
const HALLOWEEN_END = Date.parse('2026-11-02T00:00:00+01:00');
const BANNER = 'https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/b2d9d8f3-1fb4-49d1-8a86-e5dedc4c71e3.png';
const DISMISS_KEY = 'vf-halloween-2026-topbar-closed';
const WHATSAPP_URL = officialWhatsAppUrlWithText('Hola, me gustaría recibir información sobre las próximas promociones de Halloween de Valeria Ferrer.');
export const HALLOWEEN_CAMPAIGN_ENABLED = true;
export const halloweenIsLive = (now = Date.now()) => HALLOWEEN_CAMPAIGN_ENABLED && now >= HALLOWEEN_START && now < HALLOWEEN_END;

const HalloweenCampaign: React.FC<{ homeOnly?: boolean }> = ({ homeOnly = false }) => {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try { return window.sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [contactOpen, setContactOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!contactOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContactOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [contactOpen]);

  if (!halloweenIsLive()) return null;
  if (homeOnly && pathname !== '/') return null;
  const isHome = pathname === '/';
  const showBar = !isHome && !dismissed && (
    pathname === '/models' || pathname.startsWith('/models/') ||
    pathname === '/escorts-valencia' || pathname === '/escorts-de-lujo-valencia' ||
    pathname === '/vip' || pathname === '/nuevas'
  );
  const closeBar = () => {
    setDismissed(true);
    try { window.sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* private mode */ }
  };

  return (
    <>
      {isHome && homeOnly && (
        <section id="halloween-campaign" aria-label="Campaña especial de Halloween" className="relative bg-[#090507] px-3 sm:px-6 py-7 md:py-12 border-y border-[#de627e]/25">
          <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl md:rounded-[28px] border border-[#ee6096]/30 shadow-[0_0_44px_rgba(210,35,103,0.18)]">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setContactOpen(true)}
              aria-label="Abrir opciones para llamar o escribir por WhatsApp sobre Halloween"
              className="relative block w-full text-left cursor-pointer group"
            >
              <img
                src={BANNER}
                alt="Valeria Ferrer · Especial Halloween · Muy pronto, promociones exclusivas y chicas ambientadas para la ocasión"
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.012]"
              />
              <span aria-hidden="true" className="absolute bottom-[3%] right-[3%] inline-flex items-center gap-1.5 rounded-full bg-[#1a0913]/90 border border-[#f5a9ca]/65 backdrop-blur px-3.5 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(255,83,157,0.3)] group-hover:bg-[#7c2346] transition-colors">
                Llamar o WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </button>
          </div>
          <p className="text-center text-[#d5a7b8] text-[10px] sm:text-xs tracking-[.12em] mt-3.5">
            HALLOWEEN 2026 · SORPRESAS Y PROMOCIONES PRÓXIMAMENTE
          </p>
        </section>
      )}
      {!homeOnly && showBar && (
        <div role="region" aria-label="Promoción de Halloween" className="relative z-10 mx-3 md:mx-auto max-w-7xl mt-28 lg:mt-32 mb-2 flex items-center justify-center gap-3 rounded-xl border border-[#f57d99]/40 bg-gradient-to-r from-[#180810] via-[#3d1026] to-[#180810] px-10 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setContactOpen(true)}
            className="text-[#ffe2e9] text-xs sm:text-sm text-center hover:text-white"
          >
            <strong className="text-[#ffc092]">🎃 Especial Halloween</strong> · Muy pronto, promociones exclusivas y una ambientación única <span className="underline underline-offset-4 whitespace-nowrap">Consultar</span>
          </button>
          <button type="button" aria-label="Cerrar aviso de Halloween" onClick={closeBar} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#ffe2e9]/80 hover:text-white">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      {contactOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6" role="presentation">
          <button
            type="button"
            aria-label="Cerrar opciones de contacto"
            tabIndex={-1}
            onClick={() => setContactOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-default"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="halloween-contact-title"
            aria-describedby="halloween-contact-description"
            className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#d54a7b]/55 bg-gradient-to-br from-[#2b0c1a] via-[#140b11] to-[#080809] px-6 pb-7 pt-8 sm:px-8 text-center text-white shadow-[0_0_70px_rgba(220,53,126,0.35)]"
          >
            <button
              type="button"
              ref={closeRef}
              onClick={() => setContactOpen(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 rounded-full p-2 text-white/65 hover:bg-white/10 hover:text-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <span className="text-[#f3a0be] text-[11px] font-semibold tracking-[0.3em] uppercase">Valeria Ferrer</span>
            <h2 id="halloween-contact-title" className="mt-3 font-serif text-3xl sm:text-4xl leading-tight text-white">Especial Halloween</h2>
            <p id="halloween-contact-description" className="mt-3 mb-7 text-sm text-[#ddc2ce] leading-relaxed">
              ¿Quieres saber más sobre las próximas promociones? Contacta directamente con nosotros.
            </p>
            <div className="grid gap-3">
              <a
                href={OFFICIAL_PHONE_TEL}
                data-contact-placement="halloween_banner"
                onClick={() => setContactOpen(false)}
                className="flex items-center justify-center gap-3 rounded-xl border border-[#eab5ca]/50 bg-[#3a1c29] px-5 py-4 font-semibold tracking-wide text-white hover:bg-[#593046] transition-colors"
              >
                <Phone size={20} aria-hidden="true" /> Llamar · {OFFICIAL_PHONE_LABEL}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_banner"
                onClick={() => setContactOpen(false)}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#25d366] px-5 py-4 font-bold tracking-wide text-[#07230f] hover:bg-[#41e17b] transition-colors"
              >
                <MessageCircle size={21} aria-hidden="true" /> Hablar por WhatsApp
              </a>
            </div>
            <p className="mt-5 text-xs text-[#c49aaa]">Atención discreta y personalizada</p>
          </div>
        </div>
      )}
    </>
  );
};
export default HalloweenCampaign;
