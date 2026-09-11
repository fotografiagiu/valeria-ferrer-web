import { useCallback, useEffect, useState } from 'react';
import { ApiError, getActivity, type ActivityItem } from '../lib/api';

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const weekday = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
  }).format(date);
  const time = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  const day = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${day} ${time}`;
}

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivity(30);
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
        <p className="activity-empty">Todavía no hay cambios registrados.</p>
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
                <span className="activity-sep">—</span>
                <span className="activity-summary">{item.summary}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
