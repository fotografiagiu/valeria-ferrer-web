import React, { useId } from 'react';
import { halloweenIsLive } from './HalloweenCampaign';

/**
 * 100% transparent SVG, constructed in code (no external image, no black PNG).
 * Decorative shapes sit above the ACTUAL original model photograph.
 * No backdrop, blend mode or opaque central layer can conceal a portrait.
 */
const HalloweenCobweb: React.FC<{ mirror?: boolean; className?: string }> = ({ mirror = false, className = '' }) => (
  <svg className={className} viewBox="0 0 110 110" fill="none" aria-hidden="true"
    style={mirror ? { transform: 'scaleX(-1)' } : undefined}>
    <g stroke="#f9e1c6" strokeOpacity=".88" strokeWidth=".85" strokeLinecap="round">
      <path d="M0 0L108 8M0 0L108 35M0 0L107 78M0 0L78 108M0 0L34 108M0 0L5 108" />
      <path d="M13 1Q17 11 10 20Q23 22 34 13Q35 29 43 37Q57 32 65 25Q67 48 74 53Q89 50 96 45" />
      <path d="M29 3Q30 24 19 37Q38 35 54 29Q58 52 68 64Q83 60 102 60" />
      <path d="M50 5Q51 37 29 54Q56 57 79 77Q100 70 108 79" />
      <path d="M7 49Q23 56 27 75Q35 88 49 96M3 77Q14 86 17 102" />
    </g>
  </svg>
);

export const HalloweenInfoWebs: React.FC = () => {
  if (!halloweenIsLive()) return null;
  return <span className="vf-halloween-info-webs" aria-hidden="true">
    <HalloweenCobweb className="vf-halloween-info-web vf-halloween-info-web--left" />
    <HalloweenCobweb mirror className="vf-halloween-info-web vf-halloween-info-web--right" />
  </span>;
};

const HalloweenCardOverlay: React.FC = () => {
  const gradientId = useId().replace(/:/g, '');
  if (!halloweenIsLive()) return null;
  return (
    <span aria-hidden="true" className="vf-halloween-decor-layer absolute inset-0 z-[8] pointer-events-none overflow-hidden">
      <HalloweenCobweb className="vf-halloween-photo-web vf-halloween-photo-web--left" />
      <HalloweenCobweb mirror className="vf-halloween-photo-web vf-halloween-photo-web--right" />
      <svg viewBox="0 0 400 500" preserveAspectRatio="none"
        className="vf-halloween-ornaments absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id={`hwp-${gradientId}`} cx="30%" cy="28%" r="85%">
            <stop offset="0%" stopColor="#ffce72" />
            <stop offset="32%" stopColor="#ec8b24" />
            <stop offset="68%" stopColor="#af4a14" />
            <stop offset="100%" stopColor="#3d150e" />
          </radialGradient>
          <radialGradient id={`hwg-${gradientId}`}>
            <stop offset="0%" stopColor="#fff6b8" stopOpacity=".8"/>
            <stop offset="100%" stopColor="#f18b2d" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Little bats near the upper edges: deliberately away from the face. */}
        <g fill="#1b080c" stroke="#e2a46c" strokeWidth=".6" strokeOpacity=".55">
          <path d="M300 120q13-16 23 0l9-7 0 13q-4 8-13 3l-7 9-5-9q-9 5-16-3l-2-13z"/>
          <path d="M68 139q8-9 15 0l6-4v8l-6 2-4 5-4-5q-6 1-9-3v-8z"/>
        </g>
        {/* Amber halo ONLY at the edges; true transparent elsewhere. */}
        <ellipse cx="38" cy="460" rx="75" ry="54" fill={`url(#hwg-${gradientId})`} />
        <ellipse cx="358" cy="460" rx="68" ry="53" fill={`url(#hwg-${gradientId})`} />
        {/* Brass candle holders and glowing tips on right side. */}
        <g>
          <path d="M345 453v-68h13v68m-18 1h25m-20 5h15" fill="#f3d0a1" stroke="#a76838" strokeWidth="1.7"/>
          <path d="M365 448v-42h11v42m-16 4h20" fill="#e8bea0" stroke="#a76838" strokeWidth="1.6"/>
          <path d="M351 382q-9-11-1-25q9 12 1 25zm19 21q-7-8-1-19q8 10 1 19" fill="#ffe9a1" stroke="#ed7b28" strokeWidth="1.3"/>
          <circle cx="352" cy="377" r="15" fill={`url(#hwg-${gradientId})`} />
        </g>
        {/* Jack-o'-lantern lower left, complete contour and glowing carved face */}
        <g transform="translate(49 455)">
          <ellipse cx="0" cy="30" rx="61" ry="9" fill="#000" opacity=".35"/>
          <path d="M-42-11Q-53-31-25-41Q-10-52 0-43Q23-54 39-39Q57-29 47-3Q39 31 14 31Q-10 35-31 22Q-48 11-42-11Z"
            fill={`url(#hwp-${gradientId})`} stroke="#f7ba5a" strokeWidth="1.6"/>
          <path d="M-1-43Q-6-63 9-62L10-42" fill="#4f522c" stroke="#2b3417" strokeWidth="2"/>
          <path d="M-20-39Q-31-3-17 23M19-40Q32-5 18 25" fill="none" stroke="#7d2c13" strokeWidth="3" opacity=".55"/>
          <path d="M-27-10L-16-25-6-10ZM10-11L22-25 32-11ZM-16 5L-4 9 6 4 17 8 25 5 18 20-7 22-25 14Z"
            fill="#ffef9c" stroke="#51230e" strokeWidth="2"/>
          <path d="M-5 8L0 14 4 8" fill="#8f3416"/>
        </g>
        {/* Small second pumpkin lower right; a little candle behind it */}
        <g transform="translate(357 474) scale(.62)">
          <ellipse cx="0" cy="31" rx="57" ry="10" fill="#000" opacity=".3"/>
          <path d="M-41-8Q-52-30-24-40Q-6-51 7-42Q31-51 42-31Q53-6 40 16Q26 34 0 32Q-35 34-41-8Z"
            fill={`url(#hwp-${gradientId})`} stroke="#ffb864" strokeWidth="2"/>
          <path d="M0-42q-7-23 9-24L13-43" fill="#425129"/>
          <path d="M-25-9l13-16 10 16zm36 0 13-16 11 16zM-20 6l12 4 7-7 11 7 14-5-8 16h-32z" fill="#ffed9b" stroke="#56200a" strokeWidth="2"/>
        </g>
      </svg>
    </span>
  );
};
export default HalloweenCardOverlay;
