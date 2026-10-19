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
      <svg className="vf-hanging-news__web" aria-hidden="true" viewBox="0 0 450 114" preserveAspectRatio="none">
        <g fill="none" stroke="#dca466" strokeWidth="1.1" opacity=".85">
          <path d="M225 0 225 44M225 0 100 75M225 0 350 75M225 0 23 22M225 0 427 22" />
          <path d="M162 0Q172 20 189 27M288 0Q278 20 261 27" />
          <path d="M144 24Q225 95 306 24M87 49Q225 119 363 49M60 63Q225 130 390 63" />
          <path d="M225 0v65M155 35l-13 67M295 35l13 67M100 75 84 113M350 75l16 38" />
        </g>
        <circle cx="225" cy="44" r="3.3" fill="#e9b978" />
      </svg>
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
                  <img src={model.imageSrc} alt={model.imageAlt} width={190} height={245} loading="eager" decoding="async" />
                  <span className="vf-hanging-news__new">NUEVA</span>
                  <svg className="vf-hanging-news__corner" aria-hidden="true" viewBox="0 0 62 62">
                    <g fill="none" stroke="#edaa5c" strokeWidth=".8" opacity=".8">
                      <path d="M0 0H62M0 0V62M0 0 54 54M0 0 28 62M0 0 62 28M0 19Q19 17 27 27M0 38Q34 34 46 46M19 0Q17 19 27 27M38 0Q34 34 46 46" />
                    </g>
                  </svg>
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
