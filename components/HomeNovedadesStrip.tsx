import React, { Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import { getModelCoverThumbnailPath, getModelCoverImage } from '../lib/modelGridImage';

const ExploreProfilesNav = React.lazy(() => import('./ExploreProfilesNav'));

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
  return bits.join(' · ');
}

function descLine(model: NovedadesModel): string {
  if (model.vip) return 'Acompañante VIP · Experiencia exclusiva';
  const nat = (model.nationality || '').toLowerCase();
  if (nat.includes('españ')) return 'Modelo española · Experiencia única';
  if (nat.includes('colomb')) return 'Acompañante de lujo · Alta gama';
  if (nat.includes('venez')) return 'Acompañante latina · Alta gama';
  return 'Acompañante de lujo · Experiencia única';
}

const HomeNovedadesStrip: React.FC<HomeNovedadesStripProps> = ({
  models,
  exploreLinks,
  loadExploreNav,
}) => {
  const novedades = useMemo(
    () => models.filter((m) => m.isNew).slice(0, 3),
    [models],
  );
  const count = novedades.length;
  const countLabel =
    count === 1 ? '1 novedad ya disponible' : `${count} novedades ya disponibles`;

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

  return (
    <section className="home-novedades-vf" aria-labelledby="vf-novedades-title">
      <div className="vf-novedades-hero">
        <div className="vf-novedades-kicker">✦ Novedades ✦</div>
        <h2 id="vf-novedades-title" className="vf-novedades-title">
          ¿Te la vas a <span className="gold">perder?</span>
        </h2>
        <p className="vf-novedades-subtitle">Conócelas ahora</p>
        <p className="vf-novedades-text">
          {countLabel} en Valeria Ferrer. Descubre nuevas incorporaciones y experiencias
          exclusivas en Valencia.
        </p>
        <a href="#novedades-grid" className="vf-novedades-cta">
          Ver novedades
        </a>
      </div>

      <div className="vf-grid-intro">
        <h3 className="vf-grid-intro-title">Nuevas incorporaciones</h3>
        <span className="vf-grid-intro-line" aria-hidden />
      </div>

      <div id="novedades-grid" className="vf-novedades-grid">
        {novedades.map((model, index) => (
          <Link
            key={model.slug}
            to={`/models/${model.slug}`}
            className="vf-model-card is-new"
            data-model-name={model.name}
          >
            <div className="vf-model-card-media">
              <LazyImage
                src={coverOf(model)}
                alt={`${model.name} — nueva incorporación Valeria Ferrer`}
                className="h-full w-full object-cover"
                sizes="(max-width: 767px) 92vw, 33vw"
                priority={index === 0}
              />
              <span className="vf-badge-new">✦ Nueva</span>
            </div>
            <div className="vf-model-card-content">
              <h3 className="vf-model-name serif">{model.name}</h3>
              {model.nationality ? (
                <p className="vf-model-origin">{model.nationality}</p>
              ) : null}
              <p className="vf-model-meta">{metaLine(model)}</p>
              <p className="vf-model-desc">{descLine(model)}</p>
              <span className="vf-model-link">Ver perfil →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="vf-novedades-footer">
        <Link to="/novedades" className="vf-novedades-cta vf-novedades-cta--ghost">
          Ver todas las novedades →
        </Link>
      </div>

      <div className="vf-floating-callout" role="note">
        <strong>Novedades</strong> · nuevas chicas ya disponibles
      </div>

      <div className="vf-explore-slot">
        <ExploreNavSlot exploreLinks={exploreLinks} loadExploreNav={loadExploreNav} />
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
