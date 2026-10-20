import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import '../styles/halloween-hanging-news.css';

type NewModel = {
  slug: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  text: string;
  href: string;
};

type Props = {
  models: NewModel[];
  titleId: string;
  onClose: () => void;
};

/** Lightweight CSS animation: no video, canvas, timers or generated model photos. */
const HalloweenHangingNovedades: React.FC<Props> = ({ models, titleId, onClose }) => {
  if (!models.length) return null;

  return (
    <aside
      className="vf-hanging-news"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-label="Nuevas incorporaciones de Halloween"
    >
      <img
        className="vf-hanging-news__web"
        src="/images/halloween-hanging-realistic.svg"
        alt=""
        aria-hidden="true"
        width={900}
        height={480}
        loading="eager"
        decoding="async"
      />
      <div className="vf-hanging-news__body">
        <header className="vf-hanging-news__header">
          <span className="vf-hanging-news__eyebrow">VALERIA FERRER · HALLOWEEN</span>
          <h2 id={titleId}>Novedades</h2>
          <span className="vf-hanging-news__hint">Nuevas incorporaciones</span>
          <button type="button" className="vf-hanging-news__close" onClick={onClose} aria-label="Cerrar novedades colgantes">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="vf-hanging-news__models">
          {models.map((model, index) => (
            <div key={model.slug} className={`vf-hanging-news__pendulum vf-hanging-news__pendulum--${index + 1}`}>
              <span className="vf-hanging-news__thread" aria-hidden="true" />
              <Link to={model.href} className="vf-hanging-news__card" onClick={onClose} aria-label={`Ver perfil de ${model.name}`}>
                <div className="vf-hanging-news__photo">
                  <img className="vf-hanging-news__portrait" src={model.imageSrc} alt={model.imageAlt} width={190} height={245} loading="eager" decoding="async" />
                  <span className="vf-hanging-news__new">NUEVA</span>
                  <img className="vf-hanging-news__web-corner vf-hanging-news__web-corner--left" src="/images/halloween-web-left.png" alt="" aria-hidden="true" width={312} height={356} decoding="async" />
                  <img className="vf-hanging-news__web-corner vf-hanging-news__web-corner--right" src="/images/halloween-web-right.png" alt="" aria-hidden="true" width={312} height={356} decoding="async" />
                </div>
                <div className="vf-hanging-news__caption">
                  <strong>{model.name}</strong>
                  <span>{model.text}</span>
                  <em>VER FICHA <span aria-hidden="true">↗</span></em>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default HalloweenHangingNovedades;
