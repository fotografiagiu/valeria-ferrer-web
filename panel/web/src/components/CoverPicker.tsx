import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
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

/**
 * Exactly one sortable tile per image. The photo itself is the drag handle,
 * on touchscreen (press then move), pointer devices, and keyboard.
 */
function SortablePhoto({
  path,
  index,
  modelName,
  busy,
}: {
  path: string;
  index: number;
  modelName: string;
  busy: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: path, disabled: busy });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`gallery-simple-card${index === 0 ? ' is-cover' : ''}${isDragging ? ' is-dragging' : ''}`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="gallery-simple-photo gallery-simple-drag-handle"
        aria-label={`Arrastrar foto ${index + 1} de ${modelName} para cambiar su posición`}
        disabled={busy}
        {...attributes}
        {...listeners}
      >
        <img
          src={publicThumbUrl(path)}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {index === 0 ? <span className="gallery-simple-cover-label">PORTADA</span> : null}
      </button>
      <div className="gallery-simple-controls">
        <div className="gallery-simple-caption">
          <strong>{index === 0 ? 'Portada' : `Foto ${index + 1}`}</strong>
          <span>Posición {index + 1}</span>
        </div>
        <span className="gallery-simple-grip" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="5" r="1.5" fill="currentColor" />
            <circle cx="15" cy="5" r="1.5" fill="currentColor" />
            <circle cx="9" cy="12" r="1.5" fill="currentColor" />
            <circle cx="15" cy="12" r="1.5" fill="currentColor" />
            <circle cx="9" cy="19" r="1.5" fill="currentColor" />
            <circle cx="15" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </span>
      </div>
    </article>
  );
}

/**
 * One image per tile, never a duplicate preview gallery.
 * The first item in the sortable list becomes the cover on save.
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(event: DragEndEvent) {
    if (busy || !event.over || event.active.id === event.over.id) return;
    const from = paths.indexOf(String(event.active.id));
    const to = paths.indexOf(String(event.over.id));
    if (from < 0 || to < 0) return;
    setPaths((previous) => arrayMove(previous, from, to));
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
              {paths.length} {paths.length === 1 ? 'fotografía' : 'fotografías'} · Arrastra las fotos para cambiar su orden
            </p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
            Cerrar
          </button>
        </div>

        <div className="modal-body gallery-editor-body gallery-editor-body--simple">
          <p className="gallery-simple-help">
            <strong>La posición 1 es la portada.</strong> Mantén pulsada una foto y arrástrala a su lugar. Las demás se ordenarán automáticamente.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={paths} strategy={rectSortingStrategy}>
              <div className="gallery-simple-grid" aria-label="Fotos disponibles, arrastrar para reordenar">
                {paths.map((path, index) => (
                  <SortablePhoto
                    key={path}
                    path={path}
                    index={index}
                    modelName={model.name}
                    busy={busy}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
