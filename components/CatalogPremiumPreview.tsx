/** The /models collection uses the same luxury cards as the homepage.
 * All images and order are provided by the live public catalog overrides.
 * Filtering and the SEO head remain owned by pages/Models.tsx.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PremiumProfileCard, { type PremiumProfile } from './PremiumProfileCard';

export type CatalogPreviewModel = PremiumProfile & {
  coverImageUrl: string;
  age?: number;
  height?: string;
  nationality?: string;
  city?: string;
  featured?: boolean;
};

interface Props { models?: CatalogPreviewModel[] }

const CatalogPremiumPreview: React.FC<Props> = ({ models = [] }) => {
  const current = useMemo(() =>
    models.filter((model) => model.active !== false).map((model) => {
      const raw = model as CatalogPreviewModel & { images?: string[] };
      return { ...model, coverImageUrl: model.coverImageUrl || model.image || raw.images?.[0] || '' };
    }), [models]);
  return (
    <section id="catalog-horizontal-preview-root" className="vf-luxury-catalog" aria-labelledby="vf-luxury-catalog-title">
      <div className="vf-luxury-catalog__inner">
        <div className="vf-luxury-catalog__header">
          <p>SELECCIÓN VALERIA FERRER</p>
          <h2 id="vf-luxury-catalog-title">Nuestros perfiles</h2>
        </div>
        {current.length ? (
          <div id="models-grid-start" className="vf-luxury-catalog__grid">
            {current.map((model, index) => <PremiumProfileCard model={model} index={index} key={model.slug} showNew />)}
          </div>
        ) : <p className="vf-luxury-catalog__empty">No hay modelos que coincidan con el filtro.</p>}
        <div className="vf-luxury-catalog__footer">
          <Link to="/" className="vf-luxury-catalog__home">Volver a Valeria Ferrer</Link>
        </div>
      </div>
    </section>
  );
};
export default CatalogPremiumPreview;
