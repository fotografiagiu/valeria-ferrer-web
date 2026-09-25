import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortablePhoto({
  path,
  index,
}: {
  path: string;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: path,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      className={`gallery-tile${index === 0 ? ' is-cover' : ''}${isDragging ? ' dragging' : ''}`}
      aria-label={index === 0 ? 'Portada · arrastrar para reordenar' : `Foto ${index + 1} · arrastrar`}
      {...attributes}
      {...listeners}
    >
      <img src={publicThumbUrl(path)} alt="" loading="lazy" decoding="async" draggable={false} />
      <span className="gallery-tile-badge">{index === 0 ? 'PORTADA' : String(index + 1)}</span>
    </button>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 8 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPaths((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
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

  const cover = paths[0];
  const gallery = paths.slice(1);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Fotos de ${model.name}`}>
      <div className="modal-sheet gallery-sheet">
        <div className="modal-header">
          <div>
            <h2>{model.name}</h2>
            <p className="hint-text" style={{ margin: '6px 0 0' }}>
              Arrastra para ordenar · 1ª = portada · preview = ficha web
            </p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
            Cerrar
          </button>
        </div>

        <div className="modal-body gallery-editor-body">
          <section className="gallery-preview" aria-label="Previsualización ficha pública">
            <p className="gallery-preview-label">Así se verá en la web</p>
            <div className="gallery-preview-hero">
              {cover ? (
                <img src={publicThumbUrl(cover)} alt="" draggable={false} />
              ) : null}
              <span className="gallery-preview-hero-tag">Portada</span>
            </div>
            {gallery.length > 0 ? (
              <div className="gallery-preview-grid">
                {gallery.map((path, idx) => (
                  <div key={path} className="gallery-preview-cell">
                    <img src={publicThumbUrl(path)} alt="" loading="lazy" decoding="async" draggable={false} />
                    <span>{idx + 2}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={paths} strategy={rectSortingStrategy}>
              <div className="gallery-sort-grid">
                {paths.map((path, index) => (
                  <SortablePhoto key={path} path={path} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
