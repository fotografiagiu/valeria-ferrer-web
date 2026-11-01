import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import PremiumProfileCard, { type PremiumProfile } from './PremiumProfileCard';

type Props = { models: PremiumProfile[] };

const PremiumProfilesGallery: React.FC<Props> = ({ models }) => {
  const active = useMemo(() => models.filter((model) => model.active !== false), [models]);
  return (
    <section className="vf-all-profiles" id="models-grid-start" aria-labelledby="vf-all-profiles-heading">
      <header className="vf-all-profiles__header">
        <p className="vf-all-profiles__overline"><Sparkles size={15} aria-hidden="true" /> COLECCIÓN VALERIA FERRER</p>
        <h2 id="vf-all-profiles-heading">Chicas disponibles <em>en Valencia</em></h2>
        <p>Descubre todos nuestros perfiles actuales. Fotografías reales y atención privada.</p>
        <span className="vf-all-profiles__rule" aria-hidden="true" />
      </header>
      <div className="vf-all-profiles__grid">
        {active.map((model, index) => <PremiumProfileCard key={model.slug} model={model} index={index} />)}
      </div>
      <div className="vf-all-profiles__bottom">
        <p>Consulta cada perfil para ver su galería, detalles y disponibilidad.</p>
        <Link className="vf-all-profiles__all-link" to="/models">Explorar el catálogo completo <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  );
};

export default PremiumProfilesGallery;
