import { useEffect, useMemo, useState } from 'react';
import {
  ApiError,
  activatePromotion,
  deactivatePromotion,
  getPromotion,
  type ActivatablePromotion,
  type EffectivePromotion,
  type PromotionDurationHours,
  type PromotionHistoryItem,
  type StaffPromotionResponse,
} from '../lib/api';
import { publicAssetUrl } from '../lib/assets';

const DURATIONS: PromotionDurationHours[] = [1, 3, 4];
const DEFAULT_DURATION: PromotionDurationHours = 3;

const CREATIVES: Record<
  ActivatablePromotion,
  { title: string; image: string; hint: string }
> = {
  copas: {
    title: 'COPAS',
    image: '/promos/promo-copa.webp',
    hint: 'Copa de invitación',
  },
  duples: {
    title: 'DUPLEX',
    image: '/promos/promo-duplex-precios-oct2026.webp',
    hint: 'Oferta dúplex',
  },
  salidas: {
    title: 'SALIDAS VIP',
    image: '/promos/promo-salidas-premium-nov2026.webp',
    hint: 'Promoción salidas',
  },
  cash5: {
    title: '−5 € EFECTIVO',
    image: '/promos/promo-efectivo-premium-nov2026.webp',
    hint: '5 € de descuento exclusivamente al pagar en efectivo',
  },
};

type Props = {
  onToast: (message: string, tone?: 'success' | 'error') => void;
  onUnauthorized?: () => void;
};

function formatEndsAt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatRemaining(endsAt: string | null, now: number): string {
  if (!endsAt) return '—';
  const ms = Date.parse(endsAt) - now;
  if (!Number.isFinite(ms) || ms <= 0) return 'Caducada';
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, '0')} min`;
}

function formatHistoryAt(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function PromotionScreen({ onToast, onUnauthorized }: Props) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<StaffPromotionResponse | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [modal, setModal] = useState<null | { promotion: ActivatablePromotion }>(null);
  const [duration, setDuration] = useState<PromotionDurationHours>(DEFAULT_DURATION);
  const [confirmOff, setConfirmOff] = useState<ActivatablePromotion | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const effective: EffectivePromotion | null = state?.effective ?? null;
  const activePromotions = useMemo(
    () => (effective?.promotions ?? []).filter(item =>
      item.endsAt && now < Date.parse(item.endsAt)),
    [effective, now],
  );
  const live = activePromotions.length > 0;

  async function refresh() {
    setLoading(true);
    try {
      const next = await getPromotion();
      setState(next);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized?.();
        return;
      }
      onToast(err instanceof ApiError ? err.message : 'No se pudo cargar publicidad', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activePromotions.length) return;
    const ms = Math.min(...activePromotions.map(p => Date.parse(p.endsAt) - Date.now()));
    if (!Number.isFinite(ms) || ms <= 0) { void refresh(); return; }
    const timer = window.setTimeout(() => void refresh(), Math.min(ms + 250, 2_147_000_000));
    return () => window.clearTimeout(timer);
  }, [activePromotions.map(p => p.promoId).join('|')]);

  function openActivate(promotion: ActivatablePromotion) {
    const isRenewal = activePromotions.some(p => p.activePromotion === promotion);
    if (!isRenewal && activePromotions.length >= 2) {
      onToast('Ya hay dos publicidades activas. Desactiva una antes de añadir otra.', 'error');
      return;
    }
    setDuration(DEFAULT_DURATION);
    setModal({ promotion });
  }

  async function confirmActivate() {
    if (!modal) return;
    setBusy(true);
    try {
      const next = await activatePromotion(modal.promotion, duration);
      setState(next);
      setModal(null);
      onToast(`Publicidad ${CREATIVES[modal.promotion].title} activada`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized?.();
        return;
      }
      onToast(err instanceof ApiError ? err.message : 'No se pudo activar', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDeactivate() {
    setBusy(true);
    try {
      if (!confirmOff) return;
      const next = await deactivatePromotion(confirmOff);
      setState(next);
      setConfirmOff(null);
      onToast('Publicidad desactivada');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized?.();
        return;
      }
      onToast(err instanceof ApiError ? err.message : 'No se pudo desactivar', 'error');
    } finally {
      setBusy(false);
    }
  }

  const history: PromotionHistoryItem[] = state?.history ?? [];

  return (
    <section id="publicidad" className="promo-section" aria-labelledby="promo-web-title">
      <div className="promo-section-head">
        <div>
          <h2 id="promo-web-title">Publicidad web</h2>
          <p className="promo-section-sub">
            Control remoto de Copas, Dúplex, Salidas VIP y −5 € efectivo · sin commit ni deploy
          </p>
        </div>
        <button type="button" className="ghost-btn" onClick={() => void refresh()} disabled={loading || busy}>
          Actualizar
        </button>
      </div>

      <div className="promo-status-bar">
        <span className="promo-status-label">Publicidades activas · {activePromotions.length}/2</span>
        {loading && !state ? <span className="promo-status-value muted">Cargando…</span>
        : live ? (
          <div style={{ display: 'grid', gap: 7 }}>
            {activePromotions.map(item => (
              <span className="promo-status-value live" key={item.promoId}>
                ● {CREATIVES[item.activePromotion]?.title ?? item.activePromotion}
                <span className="promo-status-meta">
                  Finaliza {formatEndsAt(item.endsAt)} · Quedan {formatRemaining(item.endsAt, now)}
                </span>
              </span>
            ))}
          </div>
        ) : <span className="promo-status-value muted">Desactivadas</span>}
      </div>
      <p className="muted" style={{ fontSize: 12, margin: '10px 0 14px' }}>
        Selecciona hasta dos publicidades. Cada una tiene su propio contador;
        puedes renovar o desactivar una sin afectar a la otra.
      </p>

      <div className="promo-cards">
        {(Object.keys(CREATIVES) as ActivatablePromotion[]).map((key) => {
          const creative = CREATIVES[key];
          const activeSlot = activePromotions.find(p => p.activePromotion === key);
          const isActive = Boolean(activeSlot);
          const isFull = !isActive && activePromotions.length >= 2;
          return (
            <article
              key={key}
              className={`promo-card${isActive ? ' is-active' : ''}`}
            >
              {isActive ? <span className="promo-badge">✓ Activa</span> : null}
              <div className="promo-card-media">
                <img
                  src={publicAssetUrl(creative.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="promo-card-body">
                <h3>{creative.title}</h3>
                <p className="muted">{creative.hint}</p>
                {isActive ? (
                  <p className="promo-card-countdown">
                    Quedan {formatRemaining(activeSlot?.endsAt ?? null, now)}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="primary-btn promo-card-cta"
                  disabled={busy || isFull}
                  onClick={() => openActivate(key)}
                >
                  {isActive ? 'Renovar' : isFull ? 'Máximo 2 activas' : 'Activar'}
                </button>
                {isActive ? (
                  <button type="button" className="danger-btn" style={{ marginTop: 7, width: '100%' }}
                    disabled={busy} onClick={() => setConfirmOff(key)}>
                    Desactivar esta publicidad
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className={`promo-history${historyOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="promo-history-toggle"
          aria-expanded={historyOpen}
          onClick={() => setHistoryOpen((open) => !open)}
        >
          <h3>Historial reciente</h3>
          <span className="promo-history-chevron" aria-hidden="true" />
        </button>
        {historyOpen ? (
          history.length === 0 ? (
            <p className="muted">Aún no hay activaciones registradas.</p>
          ) : (
            <ul className="promo-history-list">
              {history.map((item) => (
                <li key={`${item.at}-${item.action}-${item.summary}`}>
                  <span className="promo-history-at">{formatHistoryAt(item.at)}</span>
                  <span className="promo-history-actor">{item.actor || 'Admin'}</span>
                  <span className="promo-history-summary">{item.summary}</span>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>

      {modal ? (
        <div className="promo-modal-backdrop" role="presentation">
          <div
            className="promo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-modal-title"
          >
            <h3 id="promo-modal-title">
              {activePromotions.some(p => p.activePromotion === modal.promotion)
                ? `Renovar publicidad ${CREATIVES[modal.promotion].title}`
                : `Activar publicidad ${CREATIVES[modal.promotion].title}`}
            </h3>
            <p className="muted">
              Mientras esta publicidad esté activa, el popup de Novedades quedará oculto.
            </p>
            <p className="promo-duration-label">Duración</p>
            <div className="promo-duration-row">
              {DURATIONS.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  className={`ghost-btn${duration === hours ? ' is-selected' : ''}`}
                  onClick={() => setDuration(hours)}
                >
                  {hours} {hours === 1 ? 'hora' : 'horas'}
                </button>
              ))}
            </div>
            <div className="promo-modal-actions">
              <button type="button" className="ghost-btn" disabled={busy} onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button type="button" className="primary-btn" disabled={busy} onClick={() => void confirmActivate()}>
                Activar publicidad
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmOff ? (
        <div className="promo-modal-backdrop" role="presentation">
          <div className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="promo-off-title">
            <h3 id="promo-off-title">Desactivar {CREATIVES[confirmOff].title}</h3>
            <p className="muted">Solo se desactivará esta publicidad. La otra seguirá visible hasta vencer.</p>
            <div className="promo-modal-actions">
              <button type="button" className="ghost-btn" disabled={busy} onClick={() => setConfirmOff(null)}>
                Cancelar
              </button>
              <button type="button" className="danger-btn" disabled={busy} onClick={() => void confirmDeactivate()}>
                Desactivar publicidad
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
