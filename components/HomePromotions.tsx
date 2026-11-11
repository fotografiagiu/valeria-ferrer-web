import React, { useEffect, useState } from 'react';
import { getCachedPromotions, startPromotionWatcher, subscribePromotions } from '../lib/webPromotionRemote';
import { isPromoLive, type PromoPopupConfig } from '../lib/promoPopupConfig';
import { ArrowUpRight, ChevronRight, Tag, Wallet } from 'lucide-react';
import { officialWhatsAppUrlWithText } from '../lib/officialContact';

const BLACK_URL = officialWhatsAppUrlWithText('Hola, quiero consultar las tarifas BLACK y reservar con una chica que tenga la etiqueta BLACK.');
const CASH_URL = officialWhatsAppUrlWithText('Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.');

/** BLACK editorial card stays visible. The second card tracks the actual panel promotion. */
const HomePromotions: React.FC = () => {
  const [promos, setPromos] = useState<PromoPopupConfig[]>(() => getCachedPromotions());
  useEffect(() => startPromotionWatcher(), []);
  useEffect(() => subscribePromotions(setPromos), []);
  const activePromos = promos.filter(p => isPromoLive(p));
  const active = activePromos[0] ?? null;
  return (
  <section className="vf-noir-promos vf-lux-promos" aria-label="Promociones disponibles">
    <div className="vf-noir-promos__grid vf-noir-promos__grid--two"
      style={activePromos.length > 1 ? { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))' } : undefined}>
      <a href={BLACK_URL} target="_blank" rel="noopener noreferrer"
        data-contact-placement="black_noir_home" className="vf-noir-promo vf-noir-promo--black">
        <span className="vf-noir-promo__icon" aria-hidden="true"><Tag size={26} /></span>
        <span className="vf-noir-promo__body"><strong>Menciona <i>BLACK</i><br /> en tu reserva</strong>
          <small>Tarifas especiales en chicas con etiqueta BLACK</small></span>
        <span className="vf-noir-promo__ticket" aria-hidden="true">BLACK</span>
        <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
      </a>
      {active?.kind === 'cash5' ? <a href={CASH_URL} target="_blank" rel="noopener noreferrer"
        data-contact-placement="cash_noir_home" className="vf-noir-promo vf-noir-promo--cash"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(34,8,25,.93), rgba(34,8,25,.82) 54%, rgba(34,8,25,.35)), url('/promos/promo-efectivo-premium-nov2026.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
        }}>
        <span className="vf-noir-promo__icon" aria-hidden="true"><Wallet size={27} /></span>
        <span className="vf-noir-promo__body"><strong><span className="vf-noir-promo__discount">−5 €</span>
          <span className="vf-noir-promo__cash-label">solo en<br /> efectivo</span></strong>
          <small>Descuento exclusivo para pagos en efectivo</small></span>
        <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
      </a> : active ? (
        <a href={officialWhatsAppUrlWithText(
          active.kind === 'copas'
            ? 'Hola, quiero consultar la promoción de copa de invitación.'
            : active.kind === 'duples'
              ? 'Hola, quiero consultar la promoción Dúplex.'
              : 'Hola, quiero consultar la promoción de salidas.'
        )} target="_blank" rel="noopener noreferrer"
          className="vf-noir-promo vf-noir-promo--active-remote"
          data-contact-placement={`promo_${active.kind}_home`}
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(24,7,20,.84), rgba(24,7,20,.42)), url(' + active.image + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <span className="vf-noir-promo__icon" aria-hidden="true"><Tag size={26}/></span>
          <span className="vf-noir-promo__body">
            <strong>{active.kind === 'copas' ? 'Copa de invitación' : active.kind === 'duples' ? 'Oferta Dúplex' : 'Promoción Salidas VIP'}</strong>
            <small>Oferta activa · Consultar condiciones y reservar</small>
          </span>
          <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true"/>
        </a>
      ) : null}
      {activePromos.slice(1).map((item) => (
        <a key={item.id}
          href={officialWhatsAppUrlWithText(
            item.kind === 'cash5'
              ? 'Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.'
              : item.kind === 'copas'
              ? 'Hola, quiero consultar la promoción de copa de invitación.'
              : item.kind === 'duples'
              ? 'Hola, quiero consultar la promoción Dúplex.'
              : 'Hola, quiero consultar la promoción de salidas.'
          )}
          target="_blank" rel="noopener noreferrer"
          className="vf-noir-promo vf-noir-promo--active-remote"
          data-contact-placement={`promo_${item.kind}_home`}
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(24,7,20,.84), rgba(24,7,20,.42)), url(' + item.image + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <span className="vf-noir-promo__icon" aria-hidden="true"><Tag size={26} /></span>
          <span className="vf-noir-promo__body">
            <strong>{item.kind === 'cash5' ? '−5 € solo efectivo'
              : item.kind === 'copas' ? 'Copa de invitación'
              : item.kind === 'duples' ? 'Oferta Dúplex' : 'Promoción Salidas VIP'}</strong>
            <small>Oferta activa · Consultar condiciones y reservar</small>
          </span>
          <ArrowUpRight size={19} className="vf-noir-promo__arrow" aria-hidden="true" />
        </a>
      ))}
    </div>
    <details className="vf-noir-promos__terms">
      <summary>Ver condiciones y precios de las promociones <ChevronRight size={15} aria-hidden="true" /></summary>
      <div className="vf-noir-promos__conditions">
        <div><strong>BLACK</strong><p>Tarifa especial únicamente para perfiles con etiqueta BLACK. Menciona BLACK al reservar.</p></div>
        {active?.kind === 'cash5' ? <div><strong>Solo efectivo</strong><p>5 € menos por servicio al pagar en efectivo. Ejemplos: 30 min 75 € · 1 hora 145 € · 1 hora y media 225 €. Solo durante la promoción activa.</p></div> : null}
        {active && active.kind !== 'cash5' ? <div><strong>Promoción temporal activa</strong><p>{active.kind === 'copas' ? 'Copa de invitación' : active.kind === 'duples' ? 'Dúplex especial' : 'Oferta de salidas'} · Consulta las condiciones al reservar.</p></div> : null}
        {activePromos.slice(1).map((item) => (
          <div key={item.id}><strong>{item.kind === 'cash5' ? 'Solo efectivo' : 'Promoción temporal activa'}</strong>
            <p>{item.kind === 'cash5'
              ? '5 € menos por servicio al pagar en efectivo. Oferta temporal.'
              : item.kind === 'copas' ? 'Copa de invitación'
              : item.kind === 'duples' ? 'Dúplex especial' : 'Oferta de salidas'} · Consulta las condiciones al reservar.</p>
          </div>
        ))}
      </div>
    </details>
  </section>
  );
};

export default HomePromotions;
