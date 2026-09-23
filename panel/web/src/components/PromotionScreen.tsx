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
    image: '/promos/promo-duo.webp',
    hint: 'Oferta dúplex',
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
  const [modal, setModal] = useState<null | {
    mode: 'activate' | 'replace';
    promotion: ActivatablePromotion;
  }>(null);
  const [duration, setDuration] = useState<PromotionDurationHours>(DEFAULT_DURATION);
  const [confirmOff, setConfirmOff] = useState(false);

  const effective: EffectivePromotion | null = state?.effective ?? null;
  const live = useMemo(() => {
    if (!effective?.active || !effective.endsAt) return false;
    return Date.now() < Date.parse(effective.endsAt);
  }, [effective, now]);

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
    if (!live || !effective?.endsAt) return;
    const ms = Date.parse(effective.endsAt) - Date.now();
    if (!Number.isFinite(ms) || ms <= 0) {
      void refresh();
      return;
    }
    const timer = window.setTimeout(() => {
      void refresh();
    }, Math.min(ms + 250, 2_147_000_000));
    return () => window.clearTimeout(timer);
  }, [live, effective?.endsAt]);

  function openActivate(promotion: ActivatablePromotion) {
    const activeType = live ? effective?.activePromotion : 'none';
    const replacing =
      live && activeType !== 'none' && activeType !== promotion;
    setDuration(DEFAULT_DURATION);
    setModal({
      mode: replacing ? 'replace' : 'activate',
      promotion,
    });
  }

  async function confirmActivate() {
    if (!modal) return;
    setBusy(true);
    try {
      const next = await activatePromotion(modal.promotion, duration);
      setState(next);
      setModal(null);
      onToast(
        modal.promotion === 'copas' ? 'Publicidad COPAS activada' : 'Publicidad DUPLEX activada'
      );
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
      const next = await deactivatePromotion();
      setState(next);
      setConfirmOff(false);
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

  const activeType = live ? effective?.activePromotion : 'none';
  const history: PromotionHistoryItem[] = state?.history ?? [];

  return (
    <section className="promo-section" aria-labelledby="promo-web-title">
      <div className="promo-section-head">
        <div>
          <h2 id="promo-web-title">Publicidad web</h2>
          <p className="promo-section-sub">
            Control remoto de Copas y Duplex · sin commit ni deploy
          </p>
        </div>
        <button type="button" className="ghost-btn" onClick={() => void refresh()} disabled={loading || busy}>
          Actualizar
        </button>
      </div>

      <div className="promo-status-bar">
        <span className="promo-status-label">Estado actual</span>
        {loading && !state ? (
          <span className="promo-status-value muted">Cargando…</span>
        ) : live && activeType && activeType !== 'none' ? (
          <span className="promo-status-value live">
            ● {activeType === 'copas' ? 'COPAS' : 'DUPLEX'} activa
            <span className="promo-status-meta">
              Finaliza {formatEndsAt(effective?.endsAt ?? null)} · Quedan{' '}
              {formatRemaining(effective?.endsAt ?? null, now)}
            </span>
          </span>
        ) : (
          <span className="promo-status-value muted">Desactivada</span>
        )}
      </div>

      {live ? (
        <div className="promo-actions-row">
          <button
            type="button"
            className="danger-btn"
            disabled={busy}
            onClick={() => setConfirmOff(true)}
          >
            Desactivar ahora
          </button>
        </div>
      ) : null}

      <div className="promo-cards">
        {(Object.keys(CREATIVES) as ActivatablePromotion[]).map((key) => {
          const creative = CREATIVES[key];
          const isActive = live && activeType === key;
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
                    Quedan {formatRemaining(effective?.endsAt ?? null, now)}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="primary-btn promo-card-cta"
                  disabled={busy}
                  onClick={() => openActivate(key)}
                >
                  {isActive ? 'Renovar' : 'Activar'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="promo-history">
        <h3>Historial reciente</h3>
        {history.length === 0 ? (
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
        )}
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
              {modal.mode === 'replace'
                ? `Sustituir por ${CREATIVES[modal.promotion].title}`
                : `Activar publicidad ${CREATIVES[modal.promotion].title}`}
            </h3>
            {modal.mode === 'replace' && live && effective?.activePromotion !== 'none' ? (
              <p className="promo-modal-warn">
                {effective?.activePromotion === 'copas' ? 'COPAS' : 'DUPLEX'} está activa hasta{' '}
                {formatEndsAt(effective?.endsAt ?? null)}. ¿Quieres sustituirla por{' '}
                {CREATIVES[modal.promotion].title}?
              </p>
            ) : null}
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
            <h3 id="promo-off-title">Desactivar publicidad</h3>
            <p className="muted">La web dejará de mostrar Copas/Duplex y Novedades volverá a su comportamiento normal.</p>
            <div className="promo-modal-actions">
              <button type="button" className="ghost-btn" disabled={busy} onClick={() => setConfirmOff(false)}>
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
