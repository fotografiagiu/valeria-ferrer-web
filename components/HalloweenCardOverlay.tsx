import React from 'react';
import { halloweenIsLive } from './HalloweenCampaign';

/**
 * Ornamentos en capas sin tocar la foto original de cada modelo.
 * Este fondo ya existente se mezcla en SCREEN y se enmascara al 35 % inferior:
 * no puede dibujar un fondo negro sobre el rostro ni sobre el centro.
 */
const PUMPKINS_AND_CANDLES =
  'https://d8j0ntlcm91z4.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/hf_20261019_102547_21bc3352-2304-4534-b4d9-8871a5e54018.png';

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
      <HalloweenWeb className="vf-halloween-info-web vf-halloween-info-web--left" />
      <HalloweenWeb flip className="vf-halloween-info-web vf-halloween-info-web--right" />
    </span>
  );
};

const HalloweenCardOverlay: React.FC = () => {
  if (!halloweenIsLive()) return null;
  return (
    <span aria-hidden="true" className="vf-halloween-decor-layer pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      <span className="vf-halloween-photo-ornament" style={{ backgroundImage: `url("${PUMPKINS_AND_CANDLES}")` }} />
      <HalloweenWeb className="vf-halloween-photo-web vf-halloween-photo-web--left" />
      <HalloweenWeb flip className="vf-halloween-photo-web vf-halloween-photo-web--right" />
      <svg className="vf-halloween-bats absolute inset-0 h-full w-full" viewBox="0 0 300 380" preserveAspectRatio="none" fill="none">
        <path d="M234 77q10-8 17 2l7-4-2 9q-4 6-11 1l-5 7-4-8q-7 3-12-4l-1-7z" fill="#10080b" fillOpacity=".82"/>
        <path d="M54 107q7-5 11 1l5-3-1 7-5 1-3 5-4-5q-6 1-8-4l-1-6z" fill="#140b0d" fillOpacity=".75"/>
      </svg>
      <span className="vf-halloween-photo-edge" />
    </span>
  );
};
export default HalloweenCardOverlay;
