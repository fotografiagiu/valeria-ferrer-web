import React from 'react';
import { ArrowUpRight, ChevronRight, Tag, Wallet } from 'lucide-react';
import { officialWhatsAppUrlWithText } from '../lib/officialContact';

const BLACK_URL = officialWhatsAppUrlWithText('Hola, quiero consultar las tarifas BLACK y reservar con una chica que tenga la etiqueta BLACK.');
const CASH_URL = officialWhatsAppUrlWithText('Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.');
const SALIDAS_URL = officialWhatsAppUrlWithText('Hola, quiero consultar la promoción de salidas de 1 hora por 180 € y su disponibilidad.');

/** Promos activas en portada: BLACK + −5 € efectivo. Happy Hour fuera de momento. */
const HomePromotions: React.FC = () => (
  <section className="vf-noir-promos vf-lux-promos" aria-label="Promociones disponibles">
    <div className="vf-noir-promos__grid vf-noir-promos__grid--two">
      <a href={BLACK_URL} target="_blank" rel="noopener noreferrer"
        data-contact-placement="black_noir_home" className="vf-noir-promo vf-noir-promo--black">
        <span className="vf-noir-promo__icon" aria-hidden="true"><Tag size={26} /></span>
        <span className="vf-noir-promo__body"><strong>Menciona <i>BLACK</i><br /> en tu reserva</strong>
          <small>Tarifas especiales en chicas con etiqueta BLACK</small></span>
        <span className="vf-noir-promo__ticket" aria-hidden="true">BLACK</span>
        <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
      </a>
      <a href={CASH_URL} target="_blank" rel="noopener noreferrer"
        data-contact-placement="cash_noir_home" className="vf-noir-promo vf-noir-promo--cash">
        <span className="vf-noir-promo__icon" aria-hidden="true"><Wallet size={27} /></span>
        <span className="vf-noir-promo__body"><strong><span className="vf-noir-promo__discount">−5 €</span>
          <span className="vf-noir-promo__cash-label">solo en<br /> efectivo</span></strong>
          <small>Descuento exclusivo para pagos en efectivo</small></span>
        <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
      </a>
    </div>
    <a
      href={SALIDAS_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-contact-placement="salidas_180_noir_home"
      aria-label="Promoción salidas: 1 hora por 180 euros. Consultar disponibilidad."
      className="mx-auto mt-5 block w-full max-w-[1300px] overflow-hidden rounded-xl border border-[#c9a568]/55 bg-[#0b0909] shadow-[0_14px_40px_rgba(0,0,0,.38)] transition-transform duration-200 hover:scale-[1.005] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e5c37d]"
    >
      <img
        src="/promos/valeria-ferrer-promo-salidas-180.webp"
        alt="Valeria Ferrer. Promoción salidas premium: 1 hora por 180 euros. Elegancia, discreción y exclusividad."
        width={1916}
        height={821}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      <span className="block bg-[#14100d] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#ecd3a5] md:text-sm">
        Consultar disponibilidad de salidas · 1 h / 180 €
      </span>
    </a>
    <details className="vf-noir-promos__terms">
      <summary>Ver condiciones y precios de las promociones <ChevronRight size={15} aria-hidden="true" /></summary>
      <div className="vf-noir-promos__conditions">
        <div><strong>BLACK</strong><p>Tarifa especial únicamente para perfiles con etiqueta BLACK. Menciona BLACK al reservar.</p></div>
        <div><strong>Solo efectivo</strong><p>5 € menos por servicio al pagar en efectivo. Ejemplos: 30 min 75 € · 1 hora 145 € · 1 hora y media 225 €.</p></div>
      </div>
    </details>
  </section>
);

export default HomePromotions;
