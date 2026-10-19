import React from 'react';
import { halloweenIsLive } from './HalloweenCampaign';

/**
 * Decoración fotorrealista de Halloween SOBRE fotos reales:
 * la portada de cada modelo no se edita ni se sustituye.
 * El PNG lleva un centro negro, que desaparece con screen en CSS.
 */
export const HALLOWEEN_CARD_ART = 'https://d8j0ntlcm91z4.cloudfront.net/user_36DayVJkjOLFx77vIiJcDWRkvYc/hf_20261019_102547_21bc3352-2304-4534-b4d9-8871a5e54018.png';

const HalloweenCardOverlay: React.FC = () => {
  if (!halloweenIsLive()) return null;
  return (
    <span aria-hidden="true" className="vf-halloween-decor-layer pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      <img
        src={HALLOWEEN_CARD_ART}
        alt=""
        loading="lazy"
        decoding="async"
        width={896}
        height={1120}
        className="vf-halloween-decor-image absolute inset-0 h-full w-full"
      />
    </span>
  );
};
export default HalloweenCardOverlay;
