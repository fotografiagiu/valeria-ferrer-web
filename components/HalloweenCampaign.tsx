import React, { useEffect, useRef, useState } from 'react';
import { BLACK_OFFER_IMAGE, BLACK_OFFER_IMAGE_WIDTH, BLACK_OFFER_IMAGE_HEIGHT, BLACK_OFFER_WHATSAPP_TEXT } from '../lib/blackPromoAsset';
import DesktopOfferBanners from './DesktopOfferBanners';
import { useLocation } from 'react-router-dom';
import { X, ArrowUpRight, Phone, MessageCircle, Send } from 'lucide-react';
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact';

/** Campaña independiente de las promociones gestionadas desde Administración. */
const HALLOWEEN_START = Date.parse('2026-10-19T00:00:00+02:00');
const HALLOWEEN_END = Date.parse('2026-11-02T00:00:00+01:00');
const BANNER = '/promos/promo-halloween-happy-hour-oct2026.webp';
const DISMISS_KEY = 'vf-halloween-2026-topbar-closed';
const WHATSAPP_URL = officialWhatsAppUrlWithText('Hola, quiero información sobre el Happy Hour de Halloween.');
const BLACK_WHATSAPP_URL = officialWhatsAppUrlWithText(BLACK_OFFER_WHATSAPP_TEXT);
export const HALLOWEEN_CAMPAIGN_ENABLED = true;
export const halloweenIsLive = (now = Date.now()) => HALLOWEEN_CAMPAIGN_ENABLED && now >= HALLOWEEN_START && now < HALLOWEEN_END;

const HalloweenCampaign: React.FC<{ homeOnly?: boolean }> = ({ homeOnly = false }) => {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try { return window.sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [contactOpen, setContactOpen] = useState<'happy' | 'black' | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // La franja superior de Halloween del hero usa el modal global.
    // La instancia homeOnly no escucha para evitar modales duplicados.
    if (homeOnly) return;
    const onPromoContact = () => setContactOpen('happy');
    window.addEventListener('vf:halloween-contact', onPromoContact);
    return () => window.removeEventListener('vf:halloween-contact', onPromoContact);
  }, [homeOnly]);

  useEffect(() => {
    if (!contactOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContactOpen(null);
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
        <section id="halloween-campaign" aria-label="Promociones Happy Hour y BLACK" className="relative border-y border-[#d7a767]/25 bg-[#090507] px-3 py-8 sm:px-6 md:py-12">
          <div className="mx-auto max-w-[1650px]">
            <div className="mb-6 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d6b57b]">Valeria Ferrer · Promociones</p>
              <h2 className="mt-2 font-serif text-2xl text-[#f5dfb2] md:text-4xl">Dos ofertas para descubrir</h2>
            </div>
            <DesktopOfferBanners onHappy={() => setContactOpen("happy")} onBlack={() => setContactOpen("black")} />
            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-7 lg:hidden">
              <div className="overflow-hidden rounded-2xl border border-[#c084fc]/40 bg-[#160d19] shadow-[0_14px_50px_rgba(0,0,0,.45)]">
                <h3 className="p-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#edd5fd]">🎃 Happy Hour · Oferta por horario</h3>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setContactOpen('happy')}
                  aria-label="Consultar la oferta Happy Hour"
                  className="block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c084fc]"
                >
                  <img src={BANNER} alt="Happy Hour Valeria Ferrer, desde el 29 de octubre. Llama para informarte." width={1024} height={682} loading="lazy" decoding="async" className="block h-auto w-full" />
                </button>
                <button type="button" onClick={() => setContactOpen('happy')} className="flex w-full items-center justify-center gap-2 bg-[#54236a] px-4 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-[#723593]">
                  Consultar Happy Hour <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#d9b669]/50 bg-[#120e0a] shadow-[0_14px_50px_rgba(0,0,0,.45)]">
                <h3 className="p-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#f2d38d]">✦ BLACK · Tarifa especial por modelo</h3>
                <button
                  type="button"
                  onClick={() => setContactOpen('black')}
                  aria-label="Consultar la tarifa especial de las chicas con etiqueta BLACK"
                  className="block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b669]"
                >
                  <img src={BLACK_OFFER_IMAGE} alt="Aprovecha la oferta BLACK. Menciona BLACK al reservar para acceder a la tarifa especial de las chicas con etiqueta BLACK." width={BLACK_OFFER_IMAGE_WIDTH} height={BLACK_OFFER_IMAGE_HEIGHT} loading="lazy" decoding="async" className="block h-auto w-full" />
                </button>
                <button type="button" onClick={() => setContactOpen('black')} className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#9b722b] via-[#dfb85e] to-[#9b722b] px-4 py-4 text-xs font-extrabold uppercase tracking-[0.15em] text-[#1c1205] hover:brightness-110">
                  Consultar tarifa BLACK <ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <p className="px-4 pb-3 pt-2 text-center text-[11px] text-[#e4cda1]">Solo chicas con etiqueta BLACK. Menciónalo en tu reserva.</p>
              </div>
            </div>
          </div>
        </section>
      )}
      {!homeOnly && showBar && (
        <div role="region" aria-label="Promoción de Halloween" className="relative z-10 mx-3 md:mx-auto max-w-7xl mt-28 lg:mt-32 mb-2 flex items-center justify-center gap-3 rounded-xl border border-[#f57d99]/40 bg-gradient-to-r from-[#180810] via-[#3d1026] to-[#180810] px-10 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setContactOpen('happy')}
            className="text-[#ffe2e9] text-xs sm:text-sm text-center hover:text-white"
          >
            <strong className="text-[#ffc092]">🎃 Happy Hour Halloween</strong> + <strong className="text-[#f4d58d]">Tarifa BLACK</strong> · Consulta ambas ofertas <span className="underline underline-offset-4 whitespace-nowrap">Contactar</span>
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
            onClick={() => setContactOpen(null)}
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
              onClick={() => setContactOpen(null)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 rounded-full p-2 text-white/65 hover:bg-white/10 hover:text-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <span className="text-[#f3a0be] text-[11px] font-semibold tracking-[0.3em] uppercase">Valeria Ferrer</span>
            <h2 id="halloween-contact-title" className="mt-3 font-serif text-3xl sm:text-4xl leading-tight text-white">
              {contactOpen === 'black' ? 'Tarifa especial BLACK' : 'Happy Hour Halloween'}
            </h2>
            <p id="halloween-contact-description" className="mt-3 mb-7 text-sm text-[#ddc2ce] leading-relaxed">
              {contactOpen === 'black'
                ? 'Menciona BLACK en tu reserva. Tarifa especial exclusiva de las chicas con etiqueta BLACK.'
                : 'A partir del jueves 29 de octubre. Elige cómo quieres informarte.'}
            </p>
            <div className="grid gap-3">
              <a
                href={OFFICIAL_PHONE_TEL}
                data-contact-placement="halloween_banner"
                onClick={() => setContactOpen(null)}
                className="flex items-center justify-center gap-3 rounded-xl border border-[#eab5ca]/50 bg-[#3a1c29] px-5 py-4 font-semibold tracking-wide text-white hover:bg-[#593046] transition-colors"
              >
                <Phone size={20} aria-hidden="true" /> Llamar · {OFFICIAL_PHONE_LABEL}
              </a>
              <a
                href={contactOpen === 'black' ? BLACK_WHATSAPP_URL : WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_banner"
                onClick={() => setContactOpen(null)}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#25d366] px-5 py-4 font-bold tracking-wide text-[#07230f] hover:bg-[#41e17b] transition-colors"
              >
                <MessageCircle size={21} aria-hidden="true" /> Hablar por WhatsApp
              </a>
              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_banner"
                onClick={() => setContactOpen(null)}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#c084fc] px-5 py-4 font-bold tracking-wide text-[#1a0a1f] hover:bg-white transition-colors"
              >
                <Send size={20} aria-hidden="true" /> Telegram · {OFFICIAL_TELEGRAM_HANDLE}
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
