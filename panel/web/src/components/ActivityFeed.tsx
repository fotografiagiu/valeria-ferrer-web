import { useCallback, useEffect, useState } from 'react';
import { ApiError, getActivity, type ActivityItem } from '../lib/api';

/** Time only — the feed is limited to the last 24h. */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivity(40);
      setItems(res.items);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(null);
        setItems([]);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('No se pudo cargar la actividad');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="activity-section" aria-label="Actividad reciente">
      <div className="activity-header">
        <h2>Actividad reciente</h2>
        <button type="button" className="ghost-btn" onClick={load} disabled={loading}>
          Actualizar
        </button>
      </div>

      {loading && items.length === 0 ? (
        <p className="activity-empty">Cargando…</p>
      ) : null}

      {error ? <p className="activity-error">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <p className="activity-empty">Sin cambios en las últimas 24 h</p>
      ) : null}

      {items.length > 0 ? (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id} className="activity-item">
              <div className="activity-when">{formatWhen(item.at)}</div>
              <div className="activity-body">
                <span className={`activity-subject${item.automatic ? ' system' : ''}`}>
                  {item.subject}
                </span>
                <span className="activity-sep">·</span>
                <span className="activity-summary">{item.summary}</span>
              </div>
              {item.details && item.details.length > 0 ? (
                <ul className="activity-details">
                  {item.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
