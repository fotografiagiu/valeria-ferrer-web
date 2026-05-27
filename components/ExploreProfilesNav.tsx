import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ExploreProfileLink } from '../lib/exploreProfiles';

type Props = {
  links: ExploreProfileLink[];
  className?: string;
};

const AUTOPLAY_SPEED_PX_PER_SEC = 26;
const RESUME_DELAY_MS = 2000;
const MOBILE_COPIES = 4;

const ExploreProfilesNav: React.FC<Props> = ({ links, className = '' }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const baseSetRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const pixelCarryRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const cancelResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  }, []);

  const scheduleResume = useCallback(() => {
    if (isPointerDownRef.current) return;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (isPointerDownRef.current) return;
      setPaused(false);
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  /** Autoplay solo en móvil (< md), sin “pelear” contra scroll manual. */
  useEffect(() => {
    if (reduceMotion || paused || links.length < 2) return;
    const viewport = viewportRef.current;
    const baseSet = baseSetRef.current;
    if (!viewport || !baseSet) return;
    let raf = 0;
    let last = 0;

    const step = (ts: number) => {
      const mobileMq = window.matchMedia('(max-width: 767px)');
      if (!mobileMq.matches) {
        last = 0;
        pixelCarryRef.current = 0;
        raf = requestAnimationFrame(step);
        return;
      }

      const loopWidth = baseSet.scrollWidth;
      if (loopWidth <= 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      // Acumulador para evitar que algunos móviles redondeen sub-pixels a 0.
      pixelCarryRef.current += AUTOPLAY_SPEED_PX_PER_SEC * dt;
      const delta = Math.floor(pixelCarryRef.current);
      if (delta <= 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      pixelCarryRef.current -= delta;
      isAutoScrollingRef.current = true;
      viewport.scrollLeft += delta;
      isAutoScrollingRef.current = false;

      // Loop suave por el ancho del primer set.
      if (viewport.scrollLeft >= loopWidth) {
        viewport.scrollLeft -= loopWidth;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [links, paused, reduceMotion]);

  if (!links.length) return null;

  const buttonClass =
    'explore-nav-btn flex-shrink-0 rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gray-400 transition-all duration-500 ease-out';

  const buttonClassDesktop =
    'md:px-6 md:py-3 md:text-[11px] md:tracking-[0.28em] md:border-white/15 md:shadow-[0_0_0_0_rgba(194,178,163,0)] md:hover:border-[#c2b2a3]/55 md:hover:text-[#c2b2a3] md:hover:shadow-[0_8px_28px_-8px_rgba(194,178,163,0.22)] md:hover:-translate-y-0.5';

  const renderLink = (item: ExploreProfileLink, suffix = '') => (
    <Link
      key={`${item.key}${suffix}`}
      to={item.href}
      className={`${buttonClass} ${buttonClassDesktop}`}
      onFocus={pause}
      onBlur={resume}
    >
      {item.label}
    </Link>
  );

  const mobileCopies = useMemo(() => {
    // Asegura overflow/“cinta” incluso con pocos botones.
    return reduceMotion ? 1 : MOBILE_COPIES;
  }, [reduceMotion]);

  return (
    <nav
      className={`mt-12 pt-10 border-t border-white/5 ${className}`}
      aria-label="Explorar perfiles"
    >
      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-5 md:mb-7 md:text-[11px]">
        Explorar perfiles
      </p>

      {/* Móvil: scroll horizontal nativo + autoplay suave */}
      <div
        ref={viewportRef}
        className="md:hidden overflow-x-auto overflow-y-hidden -mx-1 px-1"
        style={{ WebkitOverflowScrolling: 'touch' as any }}
        onPointerDown={(e) => {
          // Capturamos el puntero para garantizar el pointerup aunque salga del área.
          try {
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          } catch {
            // noop
          }
          isPointerDownRef.current = true;
          pause();
          cancelResumeTimer();
        }}
        onPointerUp={() => {
          isPointerDownRef.current = false;
          if (!reduceMotion) scheduleResume();
        }}
        onPointerCancel={() => {
          isPointerDownRef.current = false;
          if (!reduceMotion) scheduleResume();
        }}
        onPointerLeave={() => {
          // Si el puntero sale y no está pulsando, tratamos como “fin de interacción”
          if (!isPointerDownRef.current && !reduceMotion) scheduleResume();
        }}
      >
        <div className={`flex w-max gap-2 py-0.5 ${reduceMotion ? 'flex-wrap justify-center w-full' : ''}`}>
          {Array.from({ length: mobileCopies }).map((_, copyIdx) => (
            <div
              key={`copy-${copyIdx}`}
              ref={copyIdx === 0 ? baseSetRef : undefined}
              className={`flex gap-2 ${reduceMotion ? 'justify-center w-full' : ''}`}
            >
              {links.map((item) => renderLink(item, `-m-${copyIdx}`))}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: estático, más presencia, sin marquee */}
      <div className="hidden md:flex md:flex-wrap md:justify-center md:gap-3 md:px-2">
        {links.map((item) => renderLink(item))}
      </div>
    </nav>
  );
};

export default ExploreProfilesNav;
