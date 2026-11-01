import React, { Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
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
  galleryUpdated?: boolean;
  active?: boolean;
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

function originalOf(model: NovedadesModel): string {
  return getModelCoverImage(model.coverImageUrl || model.image || '');
}

const HomeNovedadesStrip: React.FC<HomeNovedadesStripProps> = ({
  models, exploreLinks, loadExploreNav,
}) => {
  // No historic hardcoded slugs. Respect the same active, staff-hidden and
  // administration-ordered catalog that drives the full homepage.
  const novedades = useMemo(() => {
    const available = models.filter((m) => m.active !== false);
    const flagged = available.filter((m) => m.isNew === true || m.galleryUpdated === true);
    return (flagged.length ? flagged : available).slice(0, 2);
  }, [models]);

  return (
    <section className="vf-hanging-news" aria-labelledby="vf-hanging-news-title">
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
        <div className="vf-hanging-news__grid">
          {novedades.map((model, index) => {
            const original = originalOf(model);
            return (
              <article className="vf-hanging-news__card" key={model.slug}>
                <Link to={'/models/' + model.slug} className="vf-hanging-news__card-link" aria-label={'Ver perfil de ' + model.name}>
                  <div className="vf-hanging-news__card-photo">
                    <LazyImage
                      src={coverOf(model)}
                      alt={model.name + ' — perfil actual de Valeria Ferrer Valencia'}
                      className="vf-hanging-news__card-image"
                      containerClassName="vf-hanging-news__img-container"
                      sizes="(max-width: 767px) 85vw, 410px"
                      priority={false}
                      loading="lazy"
                    />
                    <img
                      className="vf-hanging-news__fallback-original"
                      src={original}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                    />
                    <div className="vf-hanging-news__image-shade" />
                    {model.isNew ? <span className="vf-hanging-news__ribbon">NUEVA</span> : model.galleryUpdated ? <span className="vf-hanging-news__ribbon">ACTUALIZADA</span> : null}
                    <span className="vf-hanging-news__index" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <div className="vf-hanging-news__card-info">
                    <h3>{model.name}</h3>
                    {model.nationality && <p>{model.nationality}</p>}
                    <span className="vf-hanging-news__link-label">Descubrir su perfil <ArrowUpRight size={15} aria-hidden="true" /></span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        <Link to="/novedades" className="vf-hanging-news__all">
          Ver todas las novedades <ChevronRight size={19} aria-hidden="true" />
        </Link>
        <div className="vf-hanging-news__explore">
          {loadExploreNav && (
            <Suspense fallback={null}>
              <ExploreProfilesNav links={exploreLinks} title="Explorar" variant="embedded" />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeNovedadesStrip;
