import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Image as ImageIcon } from 'lucide-react';
import type { Model } from '../types';
import BlackCornerRibbon from './BlackCornerRibbon';
import VfPhotoFirma from './VfPhotoFirma';

interface Props { model: Model; onOpenGallery: (index: number) => void; }
const standardPrices = {
  regular: ['80 €', '120 €', '150 €', '230 €', '300 €', '430 €', '200 €', '1.200 €', '2.800 €'],
  black: ['70 €', '100 €', '130 €', '200 €', '260 €', '370 €', '200 €', '1.200 €', '2.800 €'],
};
const priceLabels = ['30 minutos', '45 minutos', '1 hora', '1,5 horas', '2 horas', '3 horas', 'Salida', 'Noche (10h)', 'Noche (24h)'];
const vipPriceKeys = ['30min', '45min', '1h', '1.5h', '2h', '3h', 'salidaHotel', 'noche', 'dia'];

/** Uses the same live model as the model detail view, without stale catalogs. */
const EditorialProfileIntro: React.FC<Props> = ({ model, onOpenGallery }) => {
  // The cover is usually also gallery[0]. Do not repeat it as a phantom first photo.
  const photos = useMemo(
    () => Array.from(new Set([model.image, ...(model.gallery || [])].filter((src): src is string => typeof src === 'string' && src.startsWith('/') && src.length > 1))),
    [model.image, model.gallery]
  );
  const [selected, setSelected] = useState(0);
  const [selectedRateIndex, setSelectedRateIndex] = useState(2);
  useEffect(() => { setSelected(0); setSelectedRateIndex(2); }, [model.id]);
  const setPhoto = useCallback((value: number) => {
    setSelected((value + photos.length) % Math.max(photos.length, 1));
  }, [photos.length]);
  const facts = [
    { name: 'Edad', value: String(model.age) },
    { name: 'Estatura', value: String(model.height) },
    { name: 'Peso', value: model.weight === undefined ? 'Consultar' : String(model.weight) },
    { name: 'Nacionalidad', value: model.nationality || 'Española' },
    { name: 'Ciudad', value: model.city || 'Valencia' },
    { name: 'Disponibilidad', value: model.availability || '24h' },
    { name: 'Idiomas', value: (model.languages || ['Español']).join(', ') },
  ];
  const vipDefaults = ['100 €','150 €','200 €','300 €','350 €','520 €','250 €','2.000 €','3.000 €'];
  const rateRows = priceLabels.map((label, index) => ({
    label: model.vip && index === 6 ? 'Salida hotel' : model.vip && index === 8 ? 'Todo el día (24h)' : label,
    amount: model.vip
      ? model.vipRates?.[vipPriceKeys[index]] || vipDefaults[index]
      : standardPrices[model.black ? 'black' : 'regular'][index],
  }));
  const subtitle = model.vip
    ? (model.nationality || 'Española') + ' VIP en ' + (model.city || 'Valencia')
    : 'Acompañante ' + (model.nationality || 'Española').toLowerCase() + ' en ' + (model.city || 'Valencia');

  return (
    <section className="vf-editorial-intro" aria-labelledby="vf-editorial-profile-name">
      <div className="vf-editorial-intro__top">
        <div className="vf-editorial-intro__visual">
          <div className="vf-editorial-intro__photo-frame">
            {photos.length > 0 ? (
              <>
                <button type="button" className="vf-editorial-intro__photo-open"
                  onClick={() => onOpenGallery(selected)}
                  aria-label={'Ampliar fotografía ' + (selected + 1) + ' de ' + model.name}>
                  <img key={photos[selected]} src={photos[selected]}
                    alt={model.name + ' — fotografía ' + (selected + 1)} loading="eager" decoding="async"
                    className="is-loaded" />
                </button>
                <VfPhotoFirma className="vf-editorial-intro__firma" photoSrc={photos[selected]} />
                {photos.length > 1 && (
                  <>
                    <button type="button" className="vf-editorial-intro__arrow vf-editorial-intro__arrow--prev" aria-label="Fotografía anterior" onClick={() => setPhoto(selected - 1)}><ChevronLeft size={21}/></button>
                    <button type="button" className="vf-editorial-intro__arrow vf-editorial-intro__arrow--next" aria-label="Fotografía siguiente" onClick={() => setPhoto(selected + 1)}><ChevronRight size={21}/></button>
                  </>
                )}
                <div className="vf-editorial-intro__photo-bottom">
                  <span>{selected + 1} / {photos.length}</span>
                  <span className="vf-editorial-intro__dots" aria-label="Fotografía seleccionada">
                    {photos.slice(0, 9).map((_, index) => (
                      <button key={index} type="button" className={selected === index ? 'is-selected' : ''} onClick={() => setPhoto(index)} aria-label={'Ver fotografía ' + (index + 1)} />
                    ))}
                  </span>
                </div>
              </>
            ) : <span className="vf-editorial-intro__missing"><ImageIcon size={30}/> Galería próximamente</span>}
            {model.black && <BlackCornerRibbon profile />}
          </div>
          <div className="vf-editorial-intro__thumbnails" aria-label="Miniaturas de la galería">
            {photos.slice(0, 3).map((url, index) => (
              <button type="button" key={url + index} onClick={() => setPhoto(index)}
                aria-label={'Seleccionar fotografía ' + (index + 1)} aria-pressed={selected === index}>
                <img src={url} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
              </button>
            ))}
            {photos.length > 3 && <button type="button" className="vf-editorial-intro__view-all" onClick={() => onOpenGallery(selected)} aria-label="Ver galería completa">+{photos.length - 3} fotos</button>}
          </div>
        </div>

        <div className="vf-editorial-intro__specs" aria-label="Información y tarifas">
          <div className="vf-editorial-intro__facts">
            <h2>Detalles personales</h2>
            <dl>{facts.map((fact) => (
              <div key={fact.name}><dt>{fact.name}</dt><dd>{fact.value}</dd></div>
            ))}</dl>
          </div>
          <div className="vf-editorial-intro__rates">
            <h2>Tarifas {model.black ? 'BLACK' : ''}</h2>
            <dl>{rateRows.map((rate) => (
              <div key={rate.label}><dt>{rate.label}</dt><dd>{rate.amount}</dd></div>
            ))}</dl>
          </div>
        </div>
      </div>
      {/* Mobile: show only the essential facts and popular prices, with access to all information. */}
      <div className="vf-editorial-intro__mobile-summary">
        <div className="vf-editorial-intro__quick-facts" aria-label="Datos principales">
          <span>{model.age} años</span>
          <span>{model.height}</span>
          <span>{model.nationality || 'Española'}</span>
        </div>
        <details className="vf-editorial-intro__disclosure">
          <summary><span>Información personal <small>Toca para ver todos los datos</small></span><ChevronDown size={21} strokeWidth={2.4} aria-hidden="true" /></summary>
          <dl className="vf-editorial-intro__disclosure-rows">
            {facts.map((fact) => <div key={fact.name}><dt>{fact.name}</dt><dd>{fact.value}</dd></div>)}
          </dl>
        </details>
        <div className="vf-editorial-intro__mobile-rates" aria-label="Consulta de tarifas">
          <div className="vf-editorial-intro__mobile-rates-heading">
            <div>
              <span className="vf-editorial-intro__section-eyebrow">Tarifas {model.black ? 'BLACK' : ''}</span>
              <h2>Elige tu tiempo</h2>
            </div>
          </div>
          <div className="vf-editorial-intro__duration-selector" role="group" aria-label="Seleccionar duración">
            {[
              { index: 0, label: '30 min' },
              { index: 1, label: '45 min' },
              { index: 2, label: '1 hora' },
            ].map(({ index, label }) => (
              <button
                key={index}
                type="button"
                className={selectedRateIndex === index ? 'is-selected' : ''}
                aria-pressed={selectedRateIndex === index}
                onClick={() => setSelectedRateIndex(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="vf-editorial-intro__selected-quote" aria-live="polite" aria-atomic="true">
            <span>{rateRows[selectedRateIndex].label}</span>
            <strong>{rateRows[selectedRateIndex].amount}</strong>
          </div>
          <p className="vf-editorial-intro__rate-note">Consulta disponibilidad para tu reserva</p>
          <details className="vf-editorial-intro__disclosure vf-editorial-intro__disclosure--rates">
            <summary><span>Consultar todas las tarifas <small>Más duraciones y servicios</small></span><ChevronDown size={21} strokeWidth={2.4} aria-hidden="true" /></summary>
            <dl className="vf-editorial-intro__disclosure-rows">
              {rateRows.map((rate) => (
                <div key={rate.label}><dt>{rate.label}</dt><dd>{rate.amount}</dd></div>
              ))}
            </dl>
          </details>
        </div>
      </div>
      <div className="vf-editorial-intro__signature">
        <h1 id="vf-editorial-profile-name">{model.name}</h1>
        <span className="vf-editorial-intro__signature-rule" aria-hidden="true" />
        <p>{subtitle}</p>
      </div>
    </section>
  );
};

export default EditorialProfileIntro;
