import React from 'react';

/**
 * Decoración SVG ligera en portada. Sin vídeo extra, sin nuevas fuentes,
 * sin eventos interactivos y sin alterar el LCP original.
 */
const HalloweenScene: React.FC = () => (
  <div className="vf-halloween-scene pointer-events-none absolute inset-0 z-[12] overflow-hidden" aria-hidden="true">
    <svg className="vf-halloween-scene__art" viewBox="0 0 430 860" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vfMoon" cx="46%" cy="42%" r="65%">
          <stop offset="0" stopColor="#ffe1ab" stopOpacity=".93"/>
          <stop offset=".74" stopColor="#ca754c" stopOpacity=".54"/>
          <stop offset="1" stopColor="#942f39" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="vfFlame" cx="50%" cy="50%" r="50%">
          <stop stopColor="#ffebad" stopOpacity=".74"/>
          <stop offset="1" stopColor="#ef7a2c" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="vfPumpkin" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d78b36"/><stop offset=".53" stopColor="#824221"/><stop offset="1" stopColor="#2d1410"/>
        </linearGradient>
      </defs>

      {/* Luna de octubre y cielo de fondo */}
      <circle cx="360" cy="221" r="105" fill="url(#vfMoon)" opacity=".78"/>
      <circle cx="365" cy="214" r="42" fill="#eda76c" fillOpacity=".12"/>
      <path d="M305 190c3-5 9-5 15-1l7-5-2 10 7 5-12-1-5 6-2-8-8-6Zm-26 25c3-5 8-5 12-2l9-6-1 11 6 5-10-1-5 6-4-8-7-5Zm111 70c4-7 9-6 15-2l7-4-2 10 9 5-13-1-5 6-3-9-8-5Z" fill="#110a0c" fillOpacity=".7"/>

      {/* Telarañas superiores en líneas finas */}
      <g stroke="#b77971" strokeWidth=".85" opacity=".5">
        <path d="M0 0 102 103M0 0 137 61M0 0 66 150M0 0 15 155M0 0 154 15"/>
        <path d="M0 35Q42 31 69 71M0 71Q58 51 101 102M0 112Q75 80 125 66M22 0Q44 29 64 37M65 0Q68 23 101 42M116 0Q119 11 137 18"/>
        <path d="M430 0 330 102M430 0 298 53M430 0 371 136M430 0 417 147M430 0 287 9"/>
        <path d="M430 37Q393 29 362 71M430 74Q372 51 336 97M430 117Q351 74 312 51M403 0Q396 20 371 37M370 0Q368 26 334 42"/>
      </g>

      {/* Siluetas de ramas */}
      <g stroke="#241319" strokeWidth="5" strokeLinecap="round" opacity=".8">
        <path d="M-5 97Q30 81 48 50L66 19M37 65Q51 72 86 54M24 83Q25 40 32 4M438 110Q414 66 391 48L374 7M410 71Q384 66 367 41"/>
      </g>

      {/* Velas y reflejos en las esquinas inferiores */}
      <g opacity=".89">
        <ellipse cx="33" cy="667" rx="80" ry="126" fill="url(#vfFlame)" opacity=".55"/>
        <ellipse cx="396" cy="708" rx="85" ry="124" fill="url(#vfFlame)" opacity=".42"/>
        <path d="M12 720h19v75H12zM35 686h18v109H35zM58 730h13v65H58zM385 700h13v96h-13zM404 723h14v73h-14z" fill="#cba880" fillOpacity=".9"/>
        <path d="M21 701c-8 14 7 20 0 28-8-6-10-17 0-28Zm22-24c-8 13 7 20 0 28-7-8-9-18 0-28Zm22 43c-6 11 6 16 0 22-7-7-9-14 0-22Zm327-29c-7 13 6 19 0 25-8-6-9-16 0-25Zm19 22c-6 11 6 16 0 22-7-7-9-14 0-22Z" fill="#ffdf93"/>
        <path d="M21 714v-22M43 686v-20M65 733v-20M392 699v-19M410 723v-20" stroke="#dfad65" strokeWidth="1"/>
        <path d="M4 796h81m295 0h50" stroke="#8c552e" strokeWidth="4" strokeLinecap="round"/>
      </g>

      {/* Calabazas talladas discretas, sin superponer el texto */}
      <g transform="translate(39 746)" opacity=".95">
        <path d="M10 7C-11-1-24 11-23 33c1 23 25 31 44 27C50 58 58 37 50 19 43 3 29 2 17 7" fill="url(#vfPumpkin)" stroke="#b37537" strokeWidth="1.4"/>
        <path d="M12 7Q11-1 15-8l5 1-4 15" fill="#4a452b"/>
        <path d="M-9 23-4 17 1 24ZM27 22l7-7 6 8ZM3 41l10-7 11 7-4 9H7z" fill="#ffbd59" fillOpacity=".8"/>
        <path d="M7 13Q-5 33 7 55M26 12Q37 35 25 55" stroke="#412219" strokeOpacity=".48" strokeWidth="2"/>
      </g>
      <g transform="translate(400 763) scale(.65)" opacity=".8">
        <path d="M10 7C-11-1-24 11-23 33c1 23 25 31 44 27C50 58 58 37 50 19 43 3 29 2 17 7" fill="url(#vfPumpkin)" stroke="#b37537" strokeWidth="2"/>
        <path d="M12 7Q11-1 15-8l5 1-4 15" fill="#4a452b"/>
        <path d="M-9 23-4 17 1 24ZM27 22l7-7 6 8ZM3 41l10-7 11 7-4 9H7z" fill="#ffc269"/>
      </g>
    </svg>
    <div className="vf-halloween-scene__vignette"/>
  </div>
);
export default HalloweenScene;
