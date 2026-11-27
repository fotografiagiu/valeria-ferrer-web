import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck, Camera, Gem, ShieldCheck, Star } from 'lucide-react';
import '../styles/november-noir.css';
import '../styles/valeria-luxury-v5.css';
import '../styles/valeria-home-final.css';

/**
 * Campaña BLACK FRIDAY 27/11/2026, solo por fecha REAL de Madrid.
 * Desktop y móvil llevan artes finales completos (sin recorte ni doble texto).
 * Al terminar el día, se restablece automáticamente la portada editorial.
 * `models` se mantiene por compatibilidad con pages/Home.tsx.
 */
interface HomeHeroProps { models?: ReadonlyArray<{ slug: string }> }

const BF_2026_DESKTOP =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/3927befb-4a3c-4d2c-922f-cab0b747bd7f.png';
const BF_2026_MOBILE =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/3a31abcc-04bb-4a95-9ed7-04f4a120d851.png';
const EDITORIAL_DESKTOP = '/images/valeria-premium-hero.webp';
const EDITORIAL_MOBILE = '/images/valeria-premium-hero-mobile.webp';

function isBlackFridayDayInMadrid(date = new Date()): boolean {
  const values = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric',
  }).formatToParts(date);
  const part = (type: string) => values.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}` === '2026-11-27';
}

const NovemberNoirHome: React.FC<HomeHeroProps> = () => {
  const [blackFridayLive, setBlackFridayLive] = useState(() => isBlackFridayDayInMadrid());

  useEffect(() => {
    const refresh = () => setBlackFridayLive(isBlackFridayDayInMadrid());
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useEffect(() => {
    const shell = document.getElementById('hero-lcp-shell');
    if (!shell) return;
    shell.classList.add('is-hidden');
    const timer = window.setTimeout(() => shell.remove(), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = document.querySelector('.vf-lux-hero');
    if (!(hero instanceof HTMLElement)) return;

    const mq = window.matchMedia('(max-width: 767px)');
    const syncPastHero = () => {
      if (!mq.matches) {
        document.body.classList.remove('vf-past-mobile-hero');
        return;
      }
      const past = window.scrollY > hero.offsetHeight * 0.72;
      document.body.classList.toggle('vf-past-mobile-hero', past);
    };

    syncPastHero();
    window.addEventListener('scroll', syncPastHero, { passive: true });
    mq.addEventListener('change', syncPastHero);
    return () => {
      window.removeEventListener('scroll', syncPastHero);
      mq.removeEventListener('change', syncPastHero);
      document.body.classList.remove('vf-past-mobile-hero');
    };
  }, [blackFridayLive]);

  return (
  <div className="vf-noir vf-lux-home-intro" id="valeria-ferrer-home">
    <section className={`vf-lux-hero${blackFridayLive ? ' vf-lux-hero--black-friday vf-lux-hero--bf-2026' : ''}`} aria-labelledby="vf-lux-hero-title">
      <div className="vf-lux-hero__visual" aria-hidden={!blackFridayLive}>
        <picture>
          {blackFridayLive ? (
            <source media="(max-width: 767px)" type="image/png" srcSet={BF_2026_MOBILE} />
          ) : (
            <source media="(max-width: 767px)" type="image/webp" srcSet={EDITORIAL_MOBILE} />
          )}
          <img
            src={blackFridayLive ? BF_2026_DESKTOP : EDITORIAL_DESKTOP}
            alt={blackFridayLive ? 'Valeria Ferrer Black Friday: 30 minutos 70 euros, 45 minutos 100 euros y una hora 130 euros. Reserva en nuestra web o menciona Black Friday al llegar. Solo el 27 de noviembre, todo el día.' : ''}
            width={blackFridayLive ? 1672 : 1264}
            height={blackFridayLive ? 941 : 954}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="vf-lux-hero__shade" aria-hidden="true" />
      {blackFridayLive ? (
        <div className="vf-bf-hero__footer">
          <h1 id="vf-lux-hero-title">Escorts en Valencia</h1>
          <p>Black Friday · 30 min 70 € · 45 min 100 € · 1 h 130 €. Reserva en la web o menciona la promoción al llegar.</p>
          <div className="vf-bf-hero__footer-links">
            <Link to="/models">Ver perfiles <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link to="/booking"><CalendarCheck size={15} aria-hidden="true" /> Reservar ahora</Link>
          </div>
        </div>
      ) : (
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
      )}
    </section>
  </div>
  );
};

export default NovemberNoirHome;
