import React from 'react';
import { halloweenIsLive } from './HalloweenCampaign';

/**
 * Ornamentos en capas sin tocar la foto original de cada modelo.
 * Este fondo ya existente se mezcla en SCREEN y se enmascara al 35 % inferior:
 * no puede dibujar un fondo negro sobre el rostro ni sobre el centro.
 */
const CARD_FRAME = '/images/halloween-card-frame.png';
const WEB_LEFT = '/images/halloween-web-left.png';
const WEB_RIGHT = '/images/halloween-web-right.png';

export const HalloweenWeb: React.FC<{ className?: string; flip?: boolean }> = ({ className = '', flip = false }) => (
  <svg className={className} viewBox="0 0 128 128" aria-hidden="true" fill="none"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <g stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".86">
      <path d="M0 0L126 4M0 0L122 23M0 0L116 52M0 0L102 86M0 0L74 114M0 0L38 127M0 0L4 128" />
      <path d="M18 1Q14 11 13 18Q33 12 45 9Q44 28 43 39Q63 35 72 31Q73 51 78 62Q88 64 104 62" />
      <path d="M42 1Q34 19 34 34Q54 29 70 30Q70 49 82 66Q92 66 108 65" />
      <path d="M66 3Q56 24 56 47Q77 43 87 46Q88 62 100 78Q108 78 119 76" />
      <path d="M5 44Q22 40 33 50Q33 71 46 88M5 72Q18 68 24 83Q27 101 38 116" />
      <path d="M15 19Q36 15 50 24Q63 33 66 47M34 34Q48 39 58 58Q65 76 77 84" />
    </g>
    <g stroke="currentColor" strokeWidth=".38" opacity=".38">
      <path d="M9 7 34 15M26 2 31 12M9 28 17 28M19 49 34 54M50 8 45 23M60 32 70 37M47 59 61 65" />
    </g>
  </svg>
);

export const HalloweenInfoWebs: React.FC = () => {
  if (!halloweenIsLive()) return null;
  return (
    <span className="vf-halloween-info-webs" aria-hidden="true">
      <img src={WEB_LEFT} alt="" decoding="async" className="vf-halloween-info-web vf-halloween-info-web--left" />
      <img src={WEB_RIGHT} alt="" decoding="async" className="vf-halloween-info-web vf-halloween-info-web--right" />
    </span>
  );
};

const HalloweenCardOverlay: React.FC = () => {
  if (!halloweenIsLive()) return null;
  return (
    <img
      src={CARD_FRAME}
      alt=""
      aria-hidden="true"
      decoding="async"
      className="halloween-overlay"
    />
  );
};
export default HalloweenCardOverlay;
