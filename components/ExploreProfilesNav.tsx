import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ExploreProfileLink } from '../lib/exploreProfiles';

type Props = {
  links: ExploreProfileLink[];
  className?: string;
  /** Texto sobre la botonera; `null` para ocultar */
  title?: string | null;
  /** `embedded`: Home (PC estático); `default`: ficha (autoplay también en PC) */
  variant?: 'default' | 'embedded';
};

const AUTOPLAY_SPEED_PX_PER_SEC = 26;
const DESKTOP_AUTOPLAY_SPEED_PX_PER_SEC = 22;
const RESUME_DELAY_MS = 2000;
const TRACK_COPIES = 4;

const ExploreProfilesNav: React.FC<Props> = ({
  links,
  className = '',
  title = 'Explorar perfiles',
  variant = 'default',
}) => {
  const desktopAutoplay = variant === 'default';
  const viewportRef = useRef<HTMLDivElement>(null);
  const baseSetRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isViewportTrackingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
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
    if (isDraggingRef.current) return;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (isDraggingRef.current) return;
      setPaused(false);
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  /** Autoplay: móvil siempre; en PC solo en fichas (`variant="default"`). */
  useEffect(() => {
    if (reduceMotion || paused || links.length < 2) return;
    const viewport = viewportRef.current;
    const baseSet = baseSetRef.current;
    if (!viewport || !baseSet) return;
    let raf = 0;
    let last = 0;

    const step = (ts: number) => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (!isMobile && !desktopAutoplay) {
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

      const speed = isMobile ? AUTOPLAY_SPEED_PX_PER_SEC : DESKTOP_AUTOPLAY_SPEED_PX_PER_SEC;
      pixelCarryRef.current += speed * dt;
      const delta = Math.floor(pixelCarryRef.current);
      if (delta <= 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      pixelCarryRef.current -= delta;
      viewport.scrollLeft += delta;

      if (viewport.scrollLeft >= loopWidth) {
        viewport.scrollLeft -= loopWidth;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [links, paused, reduceMotion, desktopAutoplay]);

  if (!links.length) return null;

  const buttonClass =
    'explore-nav-btn flex-shrink-0 rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gray-400 transition-all duration-500 ease-out';

  const buttonClassDesktop =
    'md:px-6 md:py-3 md:text-[11px] md:tracking-[0.28em] md:border-white/15 md:shadow-[0_0_0_0_rgba(194,178,163,0)] md:hover:border-[#c2b2a3]/55 md:hover:text-[#c2b2a3] md:hover:shadow-[0_8px_28px_-8px_rgba(194,178,163,0.22)] md:hover:-translate-y-0.5';

  const renderLinkLabel = (item: ExploreProfileLink) => {
    if (item.key !== 'vip') return item.label;
    return (
      <>
        <span className="text-gray-400 group-hover:text-gray-300">Perfiles </span>
        <span
          className="luxury-text-gradient font-light tracking-[0.35em] drop-shadow-[0_0_10px_rgba(194,178,163,0.28)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_14px_rgba(194,178,163,0.38)]"
        >
          VIP
        </span>
      </>
    );
  };

  const handleLinkPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    pause();
    cancelResumeTimer();
  };

  const handleLinkPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!reduceMotion) scheduleResume();
  };

  const renderLink = (item: ExploreProfileLink, suffix = '') => (
    <Link
      key={`${item.key}${suffix}`}
      to={item.href}
      className={`group relative z-10 ${buttonClass} ${buttonClassDesktop}`}
      onPointerDown={handleLinkPointerDown}
      onPointerUp={handleLinkPointerUp}
      onPointerCancel={handleLinkPointerUp}
      onFocus={pause}
      onBlur={resume}
    >
      {renderLinkLabel(item)}
    </Link>
  );

  const trackCopies = useMemo(() => {
    return reduceMotion ? 1 : TRACK_COPIES;
  }, [reduceMotion]);

  const scrollViewportClass = desktopAutoplay
    ? 'overflow-x-auto overflow-y-hidden -mx-1 px-1'
    : 'md:hidden overflow-x-auto overflow-y-hidden -mx-1 px-1';

  const DRAG_THRESHOLD_PX = 6;

  const pointerHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('a')) return;
      const viewport = viewportRef.current;
      if (!viewport) return;
      isViewportTrackingRef.current = true;
      isDraggingRef.current = false;
      dragStartXRef.current = e.clientX;
      dragStartScrollRef.current = viewport.scrollLeft;
      pause();
      cancelResumeTimer();
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isViewportTrackingRef.current) return;
      const viewport = viewportRef.current;
      if (!viewport || e.buttons === 0) return;
      const dx = e.clientX - dragStartXRef.current;
      if (!isDraggingRef.current && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      isDraggingRef.current = true;
      viewport.scrollLeft = dragStartScrollRef.current - dx;
    },
    onPointerUp: () => {
      isViewportTrackingRef.current = false;
      isDraggingRef.current = false;
      if (!reduceMotion) scheduleResume();
    },
    onPointerCancel: () => {
      isViewportTrackingRef.current = false;
      isDraggingRef.current = false;
      if (!reduceMotion) scheduleResume();
    },
  };

  const scrollTrack = (
    <div
      ref={viewportRef}
      className={scrollViewportClass}
      style={{ WebkitOverflowScrolling: 'touch' }}
      {...pointerHandlers}
    >
      <div className={`flex w-max gap-2 py-0.5 ${reduceMotion ? 'flex-wrap justify-center w-full' : ''}`}>
        {Array.from({ length: trackCopies }).map((_, copyIdx) => (
          <div
            key={`copy-${copyIdx}`}
            ref={copyIdx === 0 ? baseSetRef : undefined}
            className={`flex gap-2 ${reduceMotion ? 'justify-center w-full' : ''}`}
          >
            {links.map((item) => renderLink(item, `-t-${copyIdx}`))}
          </div>
        ))}
      </div>
    </div>
  );

  const wrapperClass =
    variant === 'embedded'
      ? className
      : `mt-12 pt-10 border-t border-white/5 ${className}`;

  return (
    <nav className={wrapperClass} aria-label={title ?? 'Explorar perfiles'}>
      {title !== null && (
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-5 md:mb-6 md:text-[11px]">
          {title}
        </p>
      )}

      {scrollTrack}

      {/* Home en PC: estático (sin autoplay) */}
      {variant === 'embedded' && (
        <div className="hidden md:flex md:flex-wrap md:justify-center md:gap-3 md:px-2">
          {links.map((item) => renderLink(item))}
        </div>
      )}
    </nav>
  );
};

export default ExploreProfilesNav;
