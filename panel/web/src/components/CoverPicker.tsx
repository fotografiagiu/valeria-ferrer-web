import { useEffect, useState } from 'react';
import { ApiError, putCover, type StaffCatalogModel } from '../lib/api';
import { publicAssetUrl } from '../lib/assets';

type Props = {
  model: StaffCatalogModel;
  onClose: () => void;
  onUpdated: (slug: string, coverImagePath: string, coverVersion: number) => void;
  onToast: (message: string, tone?: 'success' | 'error') => void;
  onConflict: () => void;
};

export function CoverPicker({ model, onClose, onUpdated, onToast, onConflict }: Props) {
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [coverVersion, setCoverVersion] = useState(model.coverVersion);
  const [currentPath, setCurrentPath] = useState(model.coverImagePath);

  useEffect(() => {
    setCoverVersion(model.coverVersion);
    setCurrentPath(model.coverImagePath);
    setPendingPath(null);
  }, [model]);

  async function confirmCover() {
    if (!pendingPath || pendingPath === currentPath) return;
    setBusy(true);
    try {
      const result = await putCover(model.slug, pendingPath, coverVersion);
      setCurrentPath(result.coverImagePath);
      setCoverVersion(result.coverVersion);
      setPendingPath(null);
      onUpdated(model.slug, result.coverImagePath, result.coverVersion);
      onToast(`✓ Portada de ${model.name} actualizada`, 'success');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        onToast('Los datos cambiaron. Recarga el catálogo.', 'error');
        onConflict();
      } else if (err instanceof ApiError) {
        onToast(err.message, 'error');
      } else {
        onToast('No se pudo actualizar la portada', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Portada de ${model.name}`}>
      <div className="modal-sheet">
        <div className="modal-header">
          <div>
            <h2>{model.name}</h2>
            <p className="hint-text" style={{ margin: '6px 0 0' }}>
              Elige una fotografía existente · ★ portada actual
            </p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
            Cerrar
          </button>
        </div>

        <div className="modal-body">
          {pendingPath && pendingPath !== currentPath ? (
            <div className="confirm-box">
              <p>¿Usar esta fotografía como portada de {model.name}?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="primary-btn secondary-tone"
                  onClick={() => setPendingPath(null)}
                  disabled={busy}
                >
                  Cancelar
                </button>
                <button type="button" className="primary-btn" onClick={confirmCover} disabled={busy}>
                  {busy ? 'Guardando…' : 'Confirmar'}
                </button>
              </div>
            </div>
          ) : null}

          <div className="cover-grid" style={{ marginTop: pendingPath ? 16 : 0 }}>
            {model.allowedCoverPaths.map((path) => {
              const isCurrent = path === currentPath;
              const isPending = path === pendingPath;
              return (
                <button
                  key={path}
                  type="button"
                  className={`cover-option${isCurrent || isPending ? ' current' : ''}`}
                  onClick={() => {
                    if (isCurrent || busy) return;
                    setPendingPath(path);
                  }}
                  aria-label={isCurrent ? `Portada actual de ${model.name}` : `Elegir foto para ${model.name}`}
                >
                  <img src={publicAssetUrl(path)} alt="" loading="lazy" decoding="async" />
                  <span className="star" aria-hidden="true">
                    {isCurrent ? '★' : '☆'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
