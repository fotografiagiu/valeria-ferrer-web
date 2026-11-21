import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck, Camera, Gem, ShieldCheck, Star } from 'lucide-react';
import '../styles/november-noir.css';
import '../styles/valeria-luxury-v5.css';
import '../styles/valeria-home-final.css';

/**
 * Portada limpia. Desktop: valeria-premium-hero.webp (landscape).
 * Móvil: valeria-premium-hero-mobile.webp (vertical 9:16 impactante).
 * `models` se mantiene por compatibilidad con pages/Home.tsx.
 */
interface HomeHeroProps { models?: ReadonlyArray<{ slug: string }> }

const NovemberNoirHome: React.FC<HomeHeroProps> = () => {
  useEffect(() => {
    const shell = document.getElementById('hero-lcp-shell');
    if (!shell) return;
    shell.classList.add('is-hidden');
    const timer = window.setTimeout(() => shell.remove(), 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
  <div className="vf-noir vf-lux-home-intro" id="valeria-ferrer-home">
    <section className="vf-lux-hero vf-lux-hero--black-friday" aria-labelledby="vf-lux-hero-title">
      <div className="vf-lux-hero__visual" aria-hidden="true">
        <picture>
          {/* Campaña de escritorio: fotografía en resolución original + creatividad Black Friday
              del boceto aprobado, sin barra de navegación ni texto HTML incrustado. */}

          <source
            media="(max-width: 767px)"
            srcSet="/images/valeria-premium-hero-mobile.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/valeria-premium-hero-mobile.png"
            type="image/png"
          />
          <img
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/d9204eed-98ae-4157-9294-468a172bd333.png"
            alt=""
            width={1916}
            height={821}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="vf-lux-hero__shade" aria-hidden="true" />
      <div className="vf-lux-hero__mobile-black" aria-label="Próximamente Black Friday, descuentos exclusivos por tiempo limitado">
        <img src="https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/d9204eed-98ae-4157-9294-468a172bd333.png"
          width={1916} height={821} alt="" loading="eager" decoding="async" />
      </div>
      <div className="vf-lux-hero__content">
        <p className="vf-lux-hero__eyebrow"><Gem size={14} aria-hidden="true" /> AGENCIA PREMIUM EN VALENCIA</p>
        <h1 id="vf-lux-hero-title" className="vf-lux-hero__title">
          <span>Escorts en</span><em>Valencia</em>
        </h1>
        <p className="vf-lux-hero__tagline">Elegancia · Sensualidad · Exclusividad</p>
        <p className="vf-lux-hero__description">
          Descubre los perfiles disponibles de Valeria Ferrer. Fotografías reales,
          máxima discreción y atención personalizada en Valencia.
        </p>
        <div className="vf-lux-hero__actions">
          <Link to="/models" className="vf-lux-hero__button vf-lux-hero__button--primary">
            Descubrir perfiles <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/booking" className="vf-lux-hero__button vf-lux-hero__button--outline">
            <CalendarCheck size={17} aria-hidden="true" /> Reservar ahora
          </Link>
        </div>
        <div className="vf-lux-hero__features" aria-label="Características del servicio">
          <span><Camera size={21} aria-hidden="true" />Fotos reales</span>
          <span><ShieldCheck size={21} aria-hidden="true" />Discreción total</span>
          <span><Gem size={21} aria-hidden="true" />Selección exclusiva</span>
          <span><Star size={21} aria-hidden="true" />Atención personalizada</span>
        </div>
      </div>
    </section>
  </div>
  );
};

export default NovemberNoirHome;
