import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, putGallery, type StaffCatalogModel } from '../lib/api';
import { buildOrderedImagePaths, publicThumbUrl } from '../lib/assets';

type Props = {
  model: StaffCatalogModel;
  onClose: () => void;
  onUpdated: (
    slug: string,
    coverImagePath: string,
    coverVersion: number,
    galleryImagePaths: string[]
  ) => void;
  onToast: (message: string, tone?: 'success' | 'error') => void;
  onConflict: () => void;
  onUnauthorized?: () => void;
};

/**
 * One image per tile. Changing its position moves it within the list
 * (the other photos shift automatically); position 1 becomes the cover.
 * There is deliberately NO separate preview and NO second photo gallery.
 */
export function CoverPicker({
  model,
  onClose,
  onUpdated,
  onToast,
  onConflict,
  onUnauthorized,
}: Props) {
  const initialOrder = useMemo(() => buildOrderedImagePaths(model), [model]);
  const [paths, setPaths] = useState(initialOrder);
  const [savedPaths, setSavedPaths] = useState(initialOrder);
  const [busy, setBusy] = useState(false);
  const [coverVersion, setCoverVersion] = useState(model.coverVersion);

  useEffect(() => {
    const next = buildOrderedImagePaths(model);
    setPaths(next);
    setSavedPaths(next);
    setCoverVersion(model.coverVersion);
  }, [model]);

  const dirty = paths.join('\0') !== savedPaths.join('\0');

  function movePhoto(path: string, targetIndex: number) {
    if (busy) return;
    setPaths((prev) => {
      const from = prev.indexOf(path);
      if (from < 0 || targetIndex < 0 || targetIndex >= prev.length || from === targetIndex) {
        return prev;
      }
      return arrayMove(prev, from, targetIndex);
    });
  }

  async function saveOrder() {
    if (!dirty || busy) return;
    setBusy(true);
    try {
      const result = await putGallery(model.slug, paths, coverVersion);
      setCoverVersion(result.coverVersion);
      const next = [result.coverImagePath, ...result.galleryImagePaths];
      setPaths(next);
      setSavedPaths(next);
      onUpdated(model.slug, result.coverImagePath, result.coverVersion, result.galleryImagePaths);
      onToast(`✓ Fotos de ${model.name} actualizadas`, 'success');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onToast(err.message, 'error');
        onUnauthorized?.();
      } else if (err instanceof ApiError && err.status === 409) {
        onToast('Los datos cambiaron. Recarga el catálogo.', 'error');
        onConflict();
      } else if (err instanceof ApiError) {
        onToast(err.message, 'error');
      } else {
        onToast('No se pudo guardar el orden de fotos', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Fotos de ${model.name}`}>
      <div className="modal-sheet gallery-sheet gallery-sheet--simple">
        <div className="modal-header">
          <div>
            <h2>{model.name}</h2>
            <p className="hint-text" style={{ margin: '6px 0 0' }}>
              {paths.length} {paths.length === 1 ? 'fotografía' : 'fotografías'} · Elige la posición de cada foto
            </p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
            Cerrar
          </button>
        </div>

        <div className="modal-body gallery-editor-body gallery-editor-body--simple">
          <p className="gallery-simple-help">
            <strong>La posición 1 es la portada.</strong> Cambia un número para mover la foto; las demás se ordenarán solas.
          </p>
          <div className="gallery-simple-grid" aria-label="Fotos disponibles, ordenadas por posición">
            {paths.map((path, index) => (
              <article key={path} className={`gallery-simple-card${index === 0 ? ' is-cover' : ''}`}>
                <div className="gallery-simple-photo">
                  <img
                    src={publicThumbUrl(path)}
                    alt={`Fotografía en posición ${index + 1} de ${model.name}`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  {index === 0 ? <span className="gallery-simple-cover-label">PORTADA</span> : null}
                </div>
                <div className="gallery-simple-controls">
                  <div className="gallery-simple-caption">
                    <strong>{index === 0 ? 'Portada' : `Foto ${index + 1}`}</strong>
                    <span>Posición</span>
                  </div>
                  <select
                    aria-label={`Posición de ${index === 0 ? 'la portada' : `foto ${index + 1}`} de ${model.name}`}
                    value={index + 1}
                    onChange={(event) => movePhoto(path, Number(event.target.value) - 1)}
                    disabled={busy}
                  >
                    {paths.map((_, position) => (
                      <option key={position} value={position + 1}>
                        {position + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
          {dirty ? (
            <p className="gallery-simple-changed" role="status">Orden modificado · Guarda los cambios para publicarlos en la web.</p>
          ) : null}
        </div>

        {dirty ? (
          <div className="gallery-save-bar">
            <button
              type="button"
              className="primary-btn secondary-tone"
              onClick={() => setPaths(savedPaths)}
              disabled={busy}
            >
              Deshacer
            </button>
            <button type="button" className="primary-btn" onClick={saveOrder} disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar orden'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
