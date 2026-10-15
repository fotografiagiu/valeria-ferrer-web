import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import { getModelCoverThumbnailPath, getModelCoverImage } from '../lib/modelGridImage';

const ExploreProfilesNav = React.lazy(() => import('./ExploreProfilesNav'));

/** Home strip promo slot — visual order only; does not alter catalog/SEO. */
const HOME_NOVEDADES_PROMO_SLUGS = ['thania', 'shantell', 'pamela'] as const;

type NovedadesModel = {
  slug: string;
  name: string;
  age?: number;
  height?: number | string;
  nationality?: string;
  city?: string;
  coverImageUrl?: string;
  image?: string;
  isNew?: boolean;
  vip?: boolean;
};

type HomeNovedadesStripProps = {
  models: NovedadesModel[];
  exploreLinks: ReturnType<typeof import('../lib/homeExploreLinks').getHomeExploreLinks>;
  loadExploreNav: boolean;
};

function coverOf(model: NovedadesModel): string {
  return getModelCoverThumbnailPath(getModelCoverImage(model.coverImageUrl || model.image || ''));
}

function metaLine(model: NovedadesModel): string {
  const bits: string[] = [];
  if (model.age) bits.push(`${model.age} años`);
  if (model.height) bits.push(String(model.height));
  if (model.nationality) bits.push(model.nationality);
  return bits.join(' · ');
}

function descLine(model: NovedadesModel): string {
  if (model.vip) return 'Acompañante VIP · Experiencia exclusiva';
  const nat = (model.nationality || '').toLowerCase();
  if (nat.includes('españ')) return 'Modelo española · Experiencia única';
  if (nat.includes('colomb')) return 'Acompañante de lujo · Alta gama';
  if (nat.includes('venez')) return 'Modelo venezolana · Experiencia única';
  return 'Acompañante de lujo · Experiencia única';
}

const HomeNovedadesStrip: React.FC<HomeNovedadesStripProps> = ({
  models,
  exploreLinks,
  loadExploreNav,
}) => {
  const novedades = useMemo(() => {
    const bySlug = new Map(models.map((m) => [m.slug, m]));
    const pinned = HOME_NOVEDADES_PROMO_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (m): m is NovedadesModel => Boolean(m),
    );
    if (pinned.length > 0) return pinned.slice(0, 3);
    return models.filter((m) => m.isNew).slice(0, 3);
  }, [models]);
  const count = novedades.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 12;
    const cardWidth = first.offsetWidth + gap;
    if (cardWidth <= 0) return;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(count - 1, idx)));
  }, [count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener('scroll', syncActiveFromScroll, { passive: true });
    return () => el.removeEventListener('scroll', syncActiveFromScroll);
  }, [syncActiveFromScroll, count]);

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el || !el.children[index]) return;
    const card = el.children[index] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
  };

  if (!count) {
    return (
      <section className="bg-[#111111] border-y border-white/5 py-8 md:py-10">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-gray-400 font-light text-sm md:text-base tracking-wide mb-4">
              Nuevas incorporaciones y mejoras
            </p>
            <Link
              to="/novedades"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#c2b2a3]/35 bg-[#c2b2a3]/10 text-[#c2b2a3] text-[10px] md:text-xs uppercase tracking-[0.32em] font-medium hover:bg-[#c2b2a3]/18 hover:border-[#c2b2a3]/50 hover:text-white transition-all duration-300"
            >
              Ver novedades
            </Link>
          </div>
          <ExploreNavSlot exploreLinks={exploreLinks} loadExploreNav={loadExploreNav} />
        </div>
      </section>
    );
  }

  const countCopy =
    count === 1
      ? '1 nueva incorporación · disponible ahora en Valencia'
      : `${count} nuevas incorporaciones · disponibles ahora en Valencia`;

  return (
    <section className="home-novedades-vf" aria-labelledby="vf-novedades-title">
      {/*
        Editorial plates REQUIRED (clean photo only — never full UI mockup):
        - /public/images/novedades-hero-editorial.webp
        - /public/images/novedades-hero-editorial-mobile.webp
        Until both exist, hero stays flat/black. Do not invent satin/figure with CSS.
      */}
      <div className="vf-news-bleed" aria-hidden="true">
        <div className="vf-news-hero__visual" />
      </div>

      <div className="vf-news-inner">
        <header className="vf-news-hero">
          <div className="vf-news-copy">
            <p className="vf-news-badge">Novedades</p>
            <h2 id="vf-novedades-title" className="vf-news-title">
              ¿Te la vas
              <br className="vf-news-title-break" />
              {' '}
              a <span className="gold">perder?</span>
            </h2>
            <p className="vf-news-subtitle">Conócelas ahora</p>
            <p className="vf-news-description">{countCopy}</p>
          </div>
        </header>

        <div className="vf-news-grid-heading">Nuevas incorporaciones</div>

        <div
          id="novedades-grid"
          ref={trackRef}
          className="vf-news-grid"
          role="list"
        >
          {novedades.map((model, index) => (
            <article
              key={model.slug}
              className="vf-news-card is-new"
              role="listitem"
              data-model-name={model.name}
            >
              <div className="vf-news-card__media">
                <LazyImage
                  src={coverOf(model)}
                  alt={`${model.name} — nueva incorporación Valeria Ferrer`}
                  className="h-full w-full object-cover object-center"
                  containerClassName="absolute inset-0 h-full w-full overflow-hidden"
                  sizes="(max-width: 767px) 75vw, 33vw"
                  priority={index === 0}
                />
                <span className="vf-new-ribbon" aria-hidden="true">
                  ✦ NUEVA
                </span>
              </div>
              <div className="vf-news-card__body">
                <h3 className="vf-news-card__name serif">{model.name}</h3>
                {model.nationality ? (
                  <p className="vf-news-card__origin">{model.nationality}</p>
                ) : null}
                <p className="vf-news-card__meta">
                  {metaLine(model)}
                  <br />
                  {descLine(model)}
                </p>
                <Link to={`/models/${model.slug}`} className="vf-news-card__cta">
                  Ver perfil →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="vf-news-dots" aria-label="Navegación de novedades" role="tablist">
          {novedades.map((model, index) => (
            <button
              key={model.slug}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Ver ${model.name}`}
              className={`vf-news-dot${activeIndex === index ? ' is-active' : ''}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <div className="vf-news-main-cta-wrap">
          <Link to="/novedades" className="vf-news-main-cta">
            Ver todas las novedades →
          </Link>
        </div>

        <div className="vf-explore-slot">
          <ExploreNavSlot exploreLinks={exploreLinks} loadExploreNav={loadExploreNav} />
        </div>
      </div>
    </section>
  );
};

const ExploreNavSlot: React.FC<{
  exploreLinks: HomeNovedadesStripProps['exploreLinks'];
  loadExploreNav: boolean;
}> = ({ exploreLinks, loadExploreNav }) => (
  <div className="min-h-[5.5rem] md:min-h-[4.5rem]">
    {loadExploreNav ? (
      <Suspense fallback={null}>
        <ExploreProfilesNav links={exploreLinks} title="Explorar" variant="embedded" />
      </Suspense>
    ) : null}
  </div>
);

export default HomeNovedadesStrip;
