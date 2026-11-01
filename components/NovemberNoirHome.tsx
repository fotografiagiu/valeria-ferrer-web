import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Clock3, Tag, Wallet, Sparkles } from 'lucide-react';
import { officialWhatsAppUrlWithText } from '../lib/officialContact';
import { getModelCoverThumbnailPath } from '../lib/modelGridImage';
import '../styles/november-noir.css';

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
const PRIORITY_SLUGS = ['laura2', 'susi', 'bea', 'karol', 'camila', 'daniela'];

/** Presentational homepage only. The catalog, model routes and live admin overrides remain authoritative. */
const NovemberNoirHome: React.FC<NovemberNoirHomeProps> = ({ models }) => {
  const featuredModels = useMemo(() => {
    const active = models.filter((model) => model.active !== false);
    const bySlug = new Map(active.map((model) => [model.slug, model]));
    const selected = PRIORITY_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (model): model is NoirModel => Boolean(model)
    );
    const used = new Set(selected.map((model) => model.slug));
    return [...selected, ...active.filter((model) => !used.has(model.slug))].slice(0, 4);
  }, [models]);

  const heroModel = featuredModels[0];
  const heroImage = heroModel?.coverImageUrl || heroModel?.profileImageUrl || '/images/home-hero-banner-mobile-v4-premium.webp';

  return (
    <div className="vf-noir" id="november-noir">
      <section className="vf-noir-hero" aria-label="Valeria Ferrer, November Noir">
        <div className="vf-noir-hero__visual" aria-hidden="true">
          <img
            src={heroImage}
            alt=""
            width={760}
            height={1100}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="vf-noir-hero__veil" aria-hidden="true" />
        <div className="vf-noir-hero__ambient" aria-hidden="true" />
        <div className="vf-noir-hero__inner">
          <div className="vf-noir-hero__copy">
            <h1 className="vf-noir-eyebrow">Valeria Ferrer <span aria-hidden="true">·</span> Escorts en Valencia</h1>
            <p className="vf-noir-title" aria-label="November Noir">
              <span>November</span>
              <em>Noir</em>
            </p>
            <span className="vf-noir-fine-line" aria-hidden="true" />
            <p className="vf-noir-hero__subtitle">Elegancia, exclusividad y<br /> nuevas experiencias</p>
            <div className="vf-noir-hero__actions">
              <Link to="/models" className="vf-noir-btn vf-noir-btn--gold">
                Ver perfiles <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/booking" className="vf-noir-btn vf-noir-btn--outline">
                Reservar ahora <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="vf-noir-hero__micro">Fotografías reales · Atención privada · Valencia</p>
          </div>
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
            const thumbnail = getModelCoverThumbnailPath(image);
            return (
              <article key={model.slug} className="vf-noir-profile">
                <Link to={'/models/' + model.slug} className="vf-noir-profile__link" aria-label={'Ver perfil de ' + model.name}>
                  <div className="vf-noir-profile__photo">
                    <img
                      src={thumbnail}
                      onError={(event) => { if (event.currentTarget.src !== new URL(image, window.location.origin).href) event.currentTarget.src = image; }}
                      alt={model.name + ' — perfil de Valeria Ferrer en Valencia'}
                      loading={index < 2 ? 'eager' : 'lazy'}
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
    </div>
  );
};

export default NovemberNoirHome;
