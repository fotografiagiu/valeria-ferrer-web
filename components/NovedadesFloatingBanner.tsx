import React, { useCallback, useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { NOVEDADES_BANNER as CFG } from '../lib/novedadesBannerConfig';

function persistMinimized(): void {
  try {
    localStorage.setItem(CFG.storageKey, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function clearMinimized(): void {
  try {
    localStorage.removeItem(CFG.storageKey);
  } catch {
    /* ignore */
  }
}

const NovedadesFloatingBanner: React.FC = () => {
  const location = useLocation();
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMinimized, setShowMinimized] = useState(false);

  const hideOnRoute =
    location.pathname === '/novedades' ||
    /^\/models\/[^/]+\/?$/.test(location.pathname);

  const minimize = useCallback(() => {
    persistMinimized();
    setIsOpen(false);
    setShowMinimized(true);
  }, []);

  const expand = useCallback(() => {
    clearMinimized();
    setShowMinimized(false);
    setIsOpen(true);
  }, []);

  // Como Contacto: al cargar la página siempre salta el panel (no arranca minimizado).
  useEffect(() => {
    if (!CFG.enabled || hideOnRoute) {
      setReady(false);
      setIsOpen(false);
      setShowMinimized(false);
      return;
    }

    const showTimer = window.setTimeout(() => {
      setReady(true);
      setIsOpen(true);
      setShowMinimized(false);
    }, CFG.delayMs);

    return () => window.clearTimeout(showTimer);
  }, [hideOnRoute]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') minimize();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, minimize]);

  if (!CFG.enabled || hideOnRoute || !ready) return null;

  return (
    <>
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className={[
            'fixed z-[60] pointer-events-auto',
            /* Ambos a la derecha: Novedades arriba, Contacto abajo (bottom-24). */
            'left-4 right-4 bottom-[calc(6rem+15.5rem+1cm)]',
            'md:left-auto md:right-6 md:bottom-[calc(6rem+16rem+2cm)] md:w-[min(100%,22.5rem)]',
            'animate-[novedades-banner-in_0.45s_ease-out_both]',
            'motion-reduce:animate-none',
          ].join(' ')}
        >
          <div
            className={[
              'relative overflow-hidden rounded-2xl',
              'border border-white/12 bg-[#121212]/78 backdrop-blur-xl',
              'shadow-[0_18px_50px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(194,178,163,0.06)]',
            ].join(' ')}
          >
            <div
              className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#c2b2a3]/10 blur-3xl"
              aria-hidden
            />

            <button
              type="button"
              onClick={minimize}
              className="absolute top-2.5 right-2.5 z-20 rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Minimizar banner de novedades"
            >
              <X size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <div className="relative z-10 flex gap-3 p-3.5 pr-10">
              <div className="shrink-0 w-[4.5rem] h-[5.75rem] md:w-[5rem] md:h-[6.25rem] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={CFG.imageSrc}
                  alt={CFG.imageAlt}
                  width={80}
                  height={100}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-center gap-1.5 py-0.5">
                <p className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-[#c2b2a3] font-medium">
                  <Sparkles className="w-3 h-3 shrink-0 opacity-80" strokeWidth={1.5} aria-hidden />
                  {CFG.badge}
                </p>
                <h2
                  id={titleId}
                  className="text-[13px] md:text-sm font-light text-white leading-snug tracking-wide"
                >
                  {CFG.title}
                </h2>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  {CFG.text}
                </p>
                <p className="text-[11px] leading-snug">
                  <span className="text-[#c2b2a3]/80 uppercase tracking-[0.18em] text-[9px] font-medium mr-1.5">
                    {CFG.ratesLabel}
                  </span>
                  <span className="text-[#e8dccf] font-semibold text-[13px] md:text-sm tracking-wide">
                    {CFG.rates}
                  </span>
                  <span className="text-gray-500 font-light text-[10px] ml-1.5">
                    ({CFG.ratesHint})
                  </span>
                </p>

                <Link
                  to={CFG.ctaHref}
                  onClick={minimize}
                  className={[
                    'mt-1.5 inline-flex self-start items-center justify-center',
                    'rounded-full px-4 py-2',
                    'bg-[#c2b2a3] text-black text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em]',
                    'hover:bg-white hover:shadow-[0_0_24px_-6px_rgba(194,178,163,0.55)]',
                    'transition-all duration-300',
                    'novedades-banner-cta',
                  ].join(' ')}
                >
                  {CFG.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}

      {showMinimized && !isOpen && (
        <button
          type="button"
          onClick={expand}
          className={[
            'fixed right-0 z-[60]',
            /* Encima de Contacto (bottom-32) + altura pestaña + gap 1cm / 2cm */
            'bottom-[calc(8rem+11.5rem+1cm)] md:bottom-[calc(8rem+11.5rem+2cm)]',
            'bg-[#c2b2a3] text-black py-3 px-2 rounded-l-xl shadow-2xl',
            'flex flex-col items-center space-y-2',
            'hover:bg-white transition-colors duration-300 group',
            'animate-[novedades-tab-in_0.35s_ease-out_both] motion-reduce:animate-none',
          ].join(' ')}
          aria-label={`Abrir ${CFG.tabLabel}`}
        >
          <Sparkles
            size={18}
            className="group-hover:scale-110 transition-transform"
            aria-hidden="true"
          />
          <span className="[writing-mode:vertical-rl] text-[9px] font-bold uppercase tracking-widest py-1">
            {CFG.tabLabel}
          </span>
        </button>
      )}

      <style>{`
        @keyframes novedades-banner-in {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes novedades-tab-in {
          from { opacity: 0; transform: translateX(0.75rem); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes novedades-cta-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(194, 178, 163, 0); }
          50% { box-shadow: 0 0 18px -4px rgba(194, 178, 163, 0.45); }
        }
        .novedades-banner-cta {
          animation: novedades-cta-glow 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .novedades-banner-cta { animation: none; }
        }
      `}</style>
    </>
  );
};

export default NovedadesFloatingBanner;
