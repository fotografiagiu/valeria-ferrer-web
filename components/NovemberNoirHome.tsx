import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Clock3, Tag, Wallet, Sparkles, ShieldCheck } from 'lucide-react';
import { officialWhatsAppUrlWithText } from '../lib/officialContact';
import '../styles/november-noir.css';
import '../styles/november-noir-v3.css';

type NoirModel = {
  slug: string;
  name: string;
  coverImageUrl?: string;
  profileImageUrl?: string;
  image?: string;
  black?: boolean;
  active?: boolean;
  nationality?: string;
};

interface NovemberNoirHomeProps {
  models: NoirModel[];
}

const HAPPY_URL = officialWhatsAppUrlWithText('Hola, quiero consultar la promoción Happy Hour y reservar.');
const CASH_URL = officialWhatsAppUrlWithText('Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.');
const BLACK_URL = officialWhatsAppUrlWithText('Hola, quiero consultar las tarifas BLACK y reservar con una chica que tenga la etiqueta BLACK.');

/** Presentational homepage only. The catalog, model routes and live admin overrides remain authoritative. */
const NovemberNoirHome: React.FC<NovemberNoirHomeProps> = ({ models }) => {
  // Clear the static mobile LCP shell once React has mounted the matching hero.
  useEffect(() => {
    const shell = document.getElementById('hero-lcp-shell');
    if (!shell) return;
    shell.classList.add('is-hidden');
    const removeTimer = window.setTimeout(() => shell.remove(), 470);
    return () => window.clearTimeout(removeTimer);
  }, []);

  // The public catalog (including panel overrides and hidden profiles) is authoritative.
  // Never pin an old profile in the featured cards.
  const activeModels = useMemo(() => models.filter((model) => model.active !== false), [models]);
  const featuredModels = activeModels.slice(0, 4);
  const heroModel = activeModels.find((model) => model.slug === 'laura2')
    ?? activeModels.find((model) => model.black && model.coverImageUrl)
    ?? activeModels[0];
  const heroImage = heroModel?.coverImageUrl || heroModel?.profileImageUrl || heroModel?.image || '/images/home-hero-banner-mobile-v4-premium.webp';
  const heroMobileImage = heroImage;

  return (
    <div className="vf-noir" id="valeria-ferrer-home">
      <section className="vf-noir-hero vf-premium-hero" aria-labelledby="vf-premium-hero-title">
        <div className="vf-noir-hero__visual vf-premium-hero__photo" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet={heroMobileImage} />
            <img
              src={heroImage}
              alt=""
              width={900}
              height={1300}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="vf-premium-hero__atmosphere" aria-hidden="true" />
        <div className="vf-premium-hero__glow" aria-hidden="true" />
        <div className="vf-premium-hero__frame" aria-hidden="true" />
        <div className="vf-noir-hero__veil vf-premium-hero__veil" aria-hidden="true" />
        <div className="vf-premium-hero__side-note" aria-hidden="true">VALERIA FERRER · VALENCIA · EST. 2026</div>
        <div className="vf-noir-hero__inner vf-premium-hero__inner">
          <div className="vf-noir-hero__copy vf-premium-hero__copy">
            <p className="vf-premium-hero__eyebrow">
              <span className="vf-premium-hero__sparkle" aria-hidden="true">✦</span>
              UNA SELECCIÓN EXCLUSIVA EN VALENCIA
            </p>
            <p className="vf-premium-hero__brand" aria-label="Valeria Ferrer">
              Valeria Ferrer
            </p>
            <span className="vf-premium-hero__brand-rule" aria-hidden="true" />
            <h1 id="vf-premium-hero-title" className="vf-premium-hero__headline">
              Escorts en Valencia
            </h1>
            <p className="vf-premium-hero__intro">Elegancia. Discreción. Exclusividad.</p>
            <p className="vf-premium-hero__description">
              Descubre los perfiles actuales de Valeria Ferrer.
              Fotografías reales, atención personalizada y reserva privada en Valencia.
            </p>
            <div className="vf-premium-hero__actions">
              <Link to="/models" className="vf-noir-btn vf-noir-btn--gold">
                Descubrir perfiles <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/booking" className="vf-noir-btn vf-noir-btn--outline">
                Reservar ahora <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="vf-premium-hero__confidence">
              <ShieldCheck size={15} strokeWidth={1.3} aria-hidden="true" />
              Fotos reales <span>·</span> Discreción <span>·</span> Atención personalizada
            </p>
          </div>
        </div>
        <div className="vf-premium-hero__bottom" aria-hidden="true">
          <span>EXCLUSIVIDAD EN CADA DETALLE</span>
          <span className="vf-premium-hero__bottom-rule" />
          <span>01 / VALERIA FERRER</span>
        </div>
      </section>

      <section className="vf-noir-promos" aria-label="Promociones disponibles">
        <div className="vf-noir-promos__grid">
          <a href={BLACK_URL} target="_blank" rel="noopener noreferrer" data-contact-placement="black_noir_home" className="vf-noir-promo vf-noir-promo--black">
            <span className="vf-noir-promo__icon" aria-hidden="true"><Tag size={26} strokeWidth={1.4} /></span>
            <span className="vf-noir-promo__body">
              <strong>Menciona <i>BLACK</i><br /> en tu reserva</strong>
              <small>Tarifas especiales en chicas con etiqueta BLACK</small>
            </span>
            <span className="vf-noir-promo__ticket" aria-hidden="true">BLACK</span>
            <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
          </a>
          <a href={HAPPY_URL} target="_blank" rel="noopener noreferrer" data-contact-placement="happy_noir_home" className="vf-noir-promo vf-noir-promo--happy">
            <span className="vf-noir-promo__icon" aria-hidden="true"><Clock3 size={37} strokeWidth={1.15} /></span>
            <span className="vf-noir-promo__body">
              <strong>Happy Hour</strong>
              <small>12:00–14:00 y 01:00–03:00<br />Consulta condiciones y disponibilidad</small>
            </span>
            <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
          </a>
          <a href={CASH_URL} target="_blank" rel="noopener noreferrer" data-contact-placement="cash_noir_home" className="vf-noir-promo vf-noir-promo--cash">
            <span className="vf-noir-promo__icon" aria-hidden="true"><Wallet size={27} strokeWidth={1.35} /></span>
            <span className="vf-noir-promo__body">
              <strong><span className="vf-noir-promo__discount">−5 €</span><span className="vf-noir-promo__cash-label">solo en<br /> efectivo</span></strong>
              <small>Descuento exclusivo para pagos en efectivo</small>
            </span>
            <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
          </a>
        </div>
        <details className="vf-noir-promos__terms">
          <summary>Ver condiciones y precios de las promociones <ChevronRight size={15} aria-hidden="true" /></summary>
          <div className="vf-noir-promos__conditions">
            <div>
              <strong>BLACK</strong>
              <p>Tarifa especial únicamente en los perfiles que llevan la etiqueta BLACK. Menciona BLACK al reservar.</p>
            </div>
            <div>
              <strong>Happy Hour</strong>
              <p>De 12:00 a 14:00 y de 01:00 a 03:00. 30 min: 70 € · 45 min: 100 € · 1 hora: 130 €. Consulta disponibilidad.</p>
            </div>
            <div>
              <strong>Solo efectivo</strong>
              <p>5 € menos por servicio si se paga en efectivo. Ejemplos: 30 min 75 € · 1 hora 145 € · 1 hora y media 225 €.</p>
            </div>
          </div>
        </details>
      </section>

      <section className="vf-noir-featured" aria-labelledby="vf-noir-featured-title">
        <div className="vf-noir-featured__heading">
          <div className="vf-noir-featured__heading-line" aria-hidden="true" />
          <div>
            <span className="vf-noir-featured__kicker"><Sparkles size={13} aria-hidden="true" /> Selección Valeria Ferrer</span>
            <h2 id="vf-noir-featured-title">Nuestras chicas</h2>
            <p>Descubre sus perfiles y elige tu experiencia</p>
          </div>
          <div className="vf-noir-featured__heading-line" aria-hidden="true" />
        </div>
        <div className="vf-noir-featured__grid">
          {featuredModels.map((model, index) => {
            const image = model.coverImageUrl || model.profileImageUrl || model.image || '';
            return (
              <article key={model.slug} className="vf-noir-profile">
                <Link to={'/models/' + model.slug} className="vf-noir-profile__link" aria-label={'Ver perfil de ' + model.name}>
                  <div className="vf-noir-profile__photo">
                    <img
                      src={image}
                      alt={model.name + ' — perfil de Valeria Ferrer en Valencia'}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={520}
                    />
                    {model.black === true && <span className="vf-noir-profile__ribbon">BLACK</span>}
                    <div className="vf-noir-profile__caption">
                      <h3>{model.name}</h3>
                      <span>Ver perfil <ChevronRight size={14} aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        <div className="vf-noir-featured__footer">
          <Link to="/models" className="vf-noir-btn vf-noir-btn--outline">
            Ver todas las chicas <ChevronRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="vf-noir-editorial" aria-labelledby="vf-noir-editorial-title">
        <div className="vf-noir-editorial__index"><span>V / F</span><small>VALENCIA · SELECCIÓN EXCLUSIVA</small></div>
        <div className="vf-noir-editorial__copy">
          <p className="vf-noir-editorial__kicker">Conoce Valeria Ferrer</p>
          <h2 id="vf-noir-editorial-title">Escorts de lujo en <em>Valencia</em></h2>
          <p>En Valeria Ferrer encontrarás una selección de escorts y acompañantes en Valencia con fotografías reales, perfiles individuales y atención privada. Consulta nuestras chicas disponibles, descubre sus galerías y elige con información clara antes de reservar.</p>
          <div className="vf-noir-editorial__links">
            <Link to="/escorts-de-lujo-valencia">Escorts de lujo en Valencia <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link to="/models">Explorar todas las chicas <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NovemberNoirHome;
