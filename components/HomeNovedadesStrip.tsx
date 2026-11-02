import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import PremiumProfileCard, { type PremiumProfile } from './PremiumProfileCard';

type Props = {
  models: PremiumProfile[];
};

/** Two substantial cards, sourced exclusively from the current public catalog. */
const HomeNovedadesStrip: React.FC<Props> = ({ models }) => {
  const novedades = useMemo(() => {
    const active = models.filter((model) => model.active !== false);
    const latest = active.filter((model) => model.isNew || model.galleryUpdated);
    return (latest.length ? latest : active).slice(0, 2);
  }, [models]);

  return (
    <section className="vf-hanging-news vf-hanging-news--open vf-hanging-news--two" aria-labelledby="vf-hanging-news-title">
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
          <span className="vf-hanging-news__intro-tag">
            <Sparkles size={14} aria-hidden="true" /> SELECCIÓN ACTUALIZADA
          </span>
          <p>Descubre las últimas incorporaciones de Valeria Ferrer</p>
        </div>
        <div className="vf-hanging-news__gallery-wrap">
          <div className="vf-hanging-news__grid">
            {novedades.map((model, index) => (
              <PremiumProfileCard key={model.slug} model={model} index={index} showNew />
            ))}
          </div>
        </div>
        <Link to="/novedades" className="vf-hanging-news__all">
          Ver todas las novedades <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default HomeNovedadesStrip;
