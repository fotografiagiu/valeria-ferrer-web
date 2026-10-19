import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';

/** Campaña independiente de las promociones gestionadas desde Administración. */
const HALLOWEEN_START = Date.parse('2026-10-19T00:00:00+02:00');
const HALLOWEEN_END = Date.parse('2026-11-02T00:00:00+01:00');
const BANNER = 'https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/b2d9d8f3-1fb4-49d1-8a86-e5dedc4c71e3.png';
const DISMISS_KEY = 'vf-halloween-2026-topbar-closed';
export const HALLOWEEN_CAMPAIGN_ENABLED = true;
export const halloweenIsLive = (now = Date.now()) => HALLOWEEN_CAMPAIGN_ENABLED && now >= HALLOWEEN_START && now < HALLOWEEN_END;

const HalloweenCampaign: React.FC<{ homeOnly?: boolean }> = ({ homeOnly = false }) => {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try { return window.sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
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
        <section aria-label="Campaña especial de Halloween" className="relative bg-[#090507] px-3 sm:px-6 py-7 md:py-12 border-y border-[#de627e]/25">
          <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl md:rounded-[28px] border border-[#ee6096]/30 shadow-[0_0_44px_rgba(210,35,103,0.18)]">
            <img
              src={BANNER}
              alt="Valeria Ferrer · Especial Halloween · Muy pronto, promociones exclusivas y chicas ambientadas para la ocasión"
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              className="block w-full h-auto"
            />
            <Link
              to="/contact"
              aria-label="Consultar las próximas promociones especiales de Halloween"
              className="absolute bottom-[3%] right-[3%] inline-flex items-center gap-1.5 rounded-full bg-[#1a0913]/90 border border-[#f5a9ca]/65 backdrop-blur px-3.5 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-semibold tracking-wide text-white shadow-[0_0_20px_rgba(255,83,157,0.3)] hover:bg-[#7c2346] transition-colors"
            >
              Más información <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="text-center text-[#d5a7b8] text-[10px] sm:text-xs tracking-[.12em] mt-3.5">
            HALLOWEEN 2026 · SORPRESAS Y PROMOCIONES PRÓXIMAMENTE
          </p>
        </section>
      )}
      {!homeOnly && showBar && (
        <div role="region" aria-label="Promoción de Halloween" className="relative z-10 mx-3 md:mx-auto max-w-7xl mt-28 lg:mt-32 mb-2 flex items-center justify-center gap-3 rounded-xl border border-[#f57d99]/40 bg-gradient-to-r from-[#180810] via-[#3d1026] to-[#180810] px-10 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.24)]">
          <Link to="/" className="text-[#ffe2e9] text-xs sm:text-sm text-center hover:text-white">
            <strong className="text-[#ffc092]">🎃 Especial Halloween</strong> · Muy pronto, promociones exclusivas y una ambientación única <span className="underline underline-offset-4 whitespace-nowrap">Descubrir</span>
          </Link>
          <button type="button" aria-label="Cerrar aviso de Halloween" onClick={closeBar} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#ffe2e9]/80 hover:text-white">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
};
export default HalloweenCampaign;
