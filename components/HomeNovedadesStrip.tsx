import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import PremiumProfileCard, { type PremiumProfile } from './PremiumProfileCard';

type Props = {
  models: PremiumProfile[];
  exploreLinks: ReturnType<typeof import('../lib/homeExploreLinks').getHomeExploreLinks>;
  loadExploreNav: boolean;
};

const HomeNovedadesStrip: React.FC<Props> = ({ models }) => {
  const novedades = useMemo(() => models.filter((m) => m.active !== false).slice(0, 4), [models]);
  const trackRef = useRef<HTMLDivElement>(null);
  const advance = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.vf-luxury-card') as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth || 250) + 14), behavior: 'smooth' });
  };

  return (
    <section className="vf-hanging-news vf-hanging-news--open" aria-labelledby="vf-hanging-news-title">
      <div className="vf-hanging-news__atmosphere" aria-hidden="true" />
      <div className="vf-hanging-news__rig" aria-hidden="true">
        <span className="vf-hanging-news__rig-bar" />
        <span className="vf-hanging-news__rope vf-hanging-news__rope--left" />
        <span className="vf-hanging-news__rope vf-hanging-news__rope--right" />
      </div>
      <div className="vf-hanging-news__sign">
        <p>VALERIA FERRER</p>
        <h2 id="vf-hanging-news-title">Novedades</h2>
        <span>ÚLTIMAS INCORPORACIONES</span>
      </div>
      <div className="vf-hanging-news__inner">
        <div className="vf-hanging-news__lead">
          <span className="vf-hanging-news__intro-tag"><Sparkles size={14} aria-hidden="true" /> SELECCIÓN ACTUALIZADA</span>
          <p>Descubre los perfiles destacados del catálogo actual</p>
        </div>
        <div className="vf-hanging-news__gallery-wrap">
          <button type="button" aria-label="Ver novedades anteriores" className="vf-hanging-news__arrow vf-hanging-news__arrow--prev" onClick={() => advance(-1)}>
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <div className="vf-hanging-news__grid" ref={trackRef}>
            {novedades.map((model, index) => (
              <PremiumProfileCard key={model.slug} model={model} index={index} showNew />
            ))}
          </div>
          <button type="button" aria-label="Ver más novedades" className="vf-hanging-news__arrow vf-hanging-news__arrow--next" onClick={() => advance(1)}>
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        <Link to="/models" className="vf-hanging-news__all">Ver todas las chicas <ArrowRight size={18} aria-hidden="true" /></Link>

      </div>
    </section>
  );
};

export default HomeNovedadesStrip;
