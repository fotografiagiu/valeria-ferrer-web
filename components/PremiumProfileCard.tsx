import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Crown } from 'lucide-react';

/** One consistent editorial card for the homepage, Novedades and the catalog.
 * Uses the public catalog's current cover URL; does not invent profiles or cache old thumbnails.
 */
export type PremiumProfile = {
  slug: string;
  name: string;
  coverImageUrl?: string;
  profileImageUrl?: string;
  image?: string;
  active?: boolean;
  black?: boolean;
  vip?: boolean;
  isNew?: boolean;
  galleryUpdated?: boolean | string;
};

type Props = {
  model: PremiumProfile;
  priority?: boolean;
  showNew?: boolean;
  index?: number;
};

const PremiumProfileCard: React.FC<Props> = ({ model, priority = false, showNew = false, index = 0 }) => {
  const image = model.coverImageUrl || model.profileImageUrl || model.image || '';
  return (
    <article className="vf-luxury-card" data-profile-slug={model.slug}
      style={{ '--vf-card-order': Math.min(index, 6) } as React.CSSProperties}
      itemScope itemType="https://schema.org/Person">
      <Link to={`/models/${model.slug}`} className="vf-luxury-card__link"
        itemProp="url" aria-label={`Ver el perfil de ${model.name}`}>
        <div className="vf-luxury-card__media">
          {image ? (
            <img src={image} alt={`${model.name} — Valeria Ferrer Valencia`}
              loading={priority ? 'eager' : 'lazy'} decoding="async"
              fetchPriority={priority ? 'high' : 'auto'} width={640} height={900} />
          ) : <div className="vf-luxury-card__placeholder" aria-hidden="true" />}
          <div className="vf-luxury-card__veil" aria-hidden="true" />
          {model.black === true && <span className="vf-luxury-card__black" aria-label="Etiqueta BLACK"><span>BLACK</span></span>}
          {model.vip === true && <span className="vf-luxury-card__vip"><Crown size={12} aria-hidden="true" /> VIP</span>}
          {showNew && (model.isNew === true || !!model.galleryUpdated) &&
            <span className="vf-luxury-card__new">{model.isNew ? 'NUEVA' : 'ACTUALIZADA'}</span>}
          <div className="vf-luxury-card__information">
            <h3 itemProp="name">{model.name}</h3>
            <span className="vf-luxury-card__cta">Ver perfil <ChevronRight size={14} aria-hidden="true" /></span>
          </div>
          <span className="vf-luxury-card__corner" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>
      </Link>
      <meta itemProp="addressLocality" content="Valencia" />
      <meta itemProp="addressRegion" content="Comunidad Valenciana" />
    </article>
  );
};

export default React.memo(PremiumProfileCard);
