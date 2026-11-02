import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumProfileCard, { type PremiumProfile } from './PremiumProfileCard';

type Props = { models: PremiumProfile[] };

/**
 * Cartel físico suspendido sobre el final de la hero + carrusel real.
 * Las tarjetas se alimentan solo del catálogo ACTUAL del panel.
 * Cuatro a la vista en escritorio; scroll táctil en móvil.
 */
const HomeNovedadesStrip: React.FC<Props> = ({ models }) => {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const novedades = useMemo(() => {
    const active = models.filter(m => m.active !== false);
    const recent = active.filter(m => m.isNew === true || Boolean(m.galleryUpdated));
    const used = new Set(recent.map(m => m.slug));
    return [...recent, ...active.filter(m => !used.has(m.slug))].slice(0, 12);
  }, [models]);

  const stepTo = useCallback((direction: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>('.vf-luxury-card');
    if (!item) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const step = item.getBoundingClientRect().width + gap;
    el.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, []);

  const syncPage = useCallback(() => {
    const el = track.current;
    const item = el?.querySelector<HTMLElement>('.vf-luxury-card');
    if (!el || !item) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const step = item.getBoundingClientRect().width + gap;
    setPage(Math.round(el.scrollLeft / Math.max(1, step)));
  }, []);

  return (
    <section className="vf-lux-news" aria-labelledby="vf-lux-news-heading">
      <div className="vf-lux-news__rail" aria-hidden="true" />
      <div className="vf-lux-news__hanger">
        <span className="vf-lux-news__rope vf-lux-news__rope--left" aria-hidden="true" />
        <span className="vf-lux-news__rope vf-lux-news__rope--right" aria-hidden="true" />
        <div className="vf-lux-news__plaque">
          <p>VALERIA FERRER</p>
          <h2 id="vf-lux-news-heading">Novedades</h2>
          <span>ÚLTIMAS INCORPORACIONES</span>
        </div>
      </div>

      <div className="vf-lux-news__gallery">
        <button type="button" onClick={() => stepTo(-1)}
          className="vf-lux-news__arrow vf-lux-news__arrow--prev" aria-label="Ver perfiles anteriores"
          disabled={page === 0}><ChevronLeft size={24} aria-hidden="true" /></button>
        <div ref={track} onScroll={syncPage} className="vf-lux-news__track" tabIndex={0}
          role="region" aria-roledescription="carrusel" aria-label="Últimos perfiles disponibles">
          {novedades.map((model, i) => (
            <PremiumProfileCard key={model.slug} model={model} index={i} showNew />
          ))}
        </div>
        <button type="button" onClick={() => stepTo(1)}
          className="vf-lux-news__arrow vf-lux-news__arrow--next" aria-label="Ver más perfiles">
          <ChevronRight size={24} aria-hidden="true" /></button>
      </div>

      <div className="vf-lux-news__pagination" aria-label="Posición del carrusel">
        {Array.from({ length: Math.min(4, Math.max(1, novedades.length - 3)) }).map((_, i) => (
          <span key={i} className={i === Math.min(page, 3) ? 'is-active' : ''} aria-hidden="true" />
        ))}
      </div>
      <Link to="/models" className="vf-lux-news__all">Ver todas las chicas <ArrowRight size={17} aria-hidden="true" /></Link>
    </section>
  );
};

export default HomeNovedadesStrip;
