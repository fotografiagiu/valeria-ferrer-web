import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck, Camera, Gem, ShieldCheck, Star } from 'lucide-react';
import '../styles/november-noir.css';
import '../styles/valeria-luxury-v5.css';
import '../styles/valeria-home-final.css';

/**
 * Portada limpia. SIN hacer zoom artificial ni recortar capturas de maquetas.
 * La imagen estática proviene de public/images/valeria-premium-hero.webp.
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
    <section className="vf-lux-hero" aria-labelledby="vf-lux-hero-title">
      <div className="vf-lux-hero__visual" aria-hidden="true">
        <img
          src="/images/valeria-premium-hero.webp"
          alt=""
          width={1264}
          height={954}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="vf-lux-hero__shade" aria-hidden="true" />
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
