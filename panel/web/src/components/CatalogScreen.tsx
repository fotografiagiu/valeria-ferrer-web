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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { ApiError, putOrder, removeCatalogModel, type StaffCatalogModel } from '../lib/api';
import { formatOrderNumber, publicAssetUrl } from '../lib/assets';
import { CoverPicker } from './CoverPicker';

type Props = {
  initialModels: StaffCatalogModel[];
  orderVersion: number;
  /** True while catalog membership ensure is running — blocks GUARDAR ORDEN. */
  orderSaveLocked?: boolean;
  onOrderVersion: (version: number) => void;
  onModelsChange: (models: StaffCatalogModel[]) => void;
  onToast: (message: string, tone?: 'success' | 'error') => void;
  onReload: () => void;
  onUnauthorized?: () => void;
};

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7h8M8 12h8M8 17h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 7l1 12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SortableCard({
  model,
  index,
  onOpenCover,
  onRequestRemove,
}: {
  model: StaffCatalogModel;
  index: number;
  onOpenCover: (model: StaffCatalogModel) => void;
  onRequestRemove: (model: StaffCatalogModel) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: model.slug,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`model-card${isDragging ? ' dragging' : ''}`}
      onClick={() => onOpenCover(model)}
    >
      <div className="order-num">{formatOrderNumber(index + 1)}</div>
      <img
        className="cover-thumb"
        src={publicAssetUrl(model.coverImagePath)}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="model-meta">
        <p className="name">{model.name}</p>
        <p className="slug">tocar · portada</p>
      </div>
      <div className="model-card-actions">
        <button
          type="button"
          className="trash-btn"
          aria-label={`Eliminar ${model.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onRequestRemove(model);
          }}
        >
          <TrashIcon />
        </button>
        <button
          type="button"
          className="drag-handle"
          aria-label={`Arrastrar ${model.name}`}
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <DragHandleIcon />
        </button>
      </div>
    </article>
  );
}

export function CatalogScreen({
  initialModels,
  orderVersion,
  orderSaveLocked = false,
  onOrderVersion,
  onModelsChange,
  onToast,
  onReload,
  onUnauthorized,
}: Props) {
  const [models, setModels] = useState(initialModels);
  const [savedOrder, setSavedOrder] = useState(initialModels.map((m) => m.slug));
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [selected, setSelected] = useState<StaffCatalogModel | null>(null);
  const [pendingRemove, setPendingRemove] = useState<StaffCatalogModel | null>(null);
  const [removing, setRemoving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
  );

  const dirty = useMemo(() => {
    const current = models.map((m) => m.slug);
    if (current.length !== savedOrder.length) return true;
    return current.some((slug, i) => slug !== savedOrder[i]);
  }, [models, savedOrder]);

  function applyLocalModels(next: StaffCatalogModel[]) {
    setModels(next);
    onModelsChange(next);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = models.findIndex((m) => m.slug === active.id);
    const newIndex = models.findIndex((m) => m.slug === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    applyLocalModels(arrayMove(models, oldIndex, newIndex));
  }

  async function saveOrder() {
    if (!dirty || saving || orderSaveLocked) return;
    const ok = window.confirm('¿Guardar el nuevo orden de las fichas?');
    if (!ok) return;

    setSaving(true);
    setConflict(false);
    try {
      const result = await putOrder(
        orderVersion,
        models.map((m) => m.slug)
      );
      onOrderVersion(result.orderVersion);
      setSavedOrder(models.map((m) => m.slug));
      onToast('✓ Cambios guardados', 'success');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onToast(err.message, 'error');
        onUnauthorized?.();
      } else if (err instanceof ApiError && err.status === 409) {
        setConflict(true);
        onToast('Los datos cambiaron. Recarga el catálogo.', 'error');
      } else if (err instanceof ApiError) {
        onToast(err.message, 'error');
      } else {
        onToast('No se pudo guardar el orden', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  function onCoverUpdated(slug: string, coverImagePath: string, coverVersion: number) {
    const next = models.map((m) =>
      m.slug === slug ? { ...m, coverImagePath, coverVersion } : m
    );
    applyLocalModels(next);
    setSelected((prev) =>
      prev && prev.slug === slug ? { ...prev, coverImagePath, coverVersion } : prev
    );
  }

  async function confirmRemove() {
    if (!pendingRemove || removing || orderSaveLocked) return;
    if (dirty) {
      onToast('Guarda o descarta el orden antes de eliminar.', 'error');
      return;
    }

    setRemoving(true);
    try {
      const result = await removeCatalogModel(pendingRemove.slug, orderVersion);
      const next = models.filter((m) => m.slug !== pendingRemove.slug);
      applyLocalModels(next);
      setSavedOrder(next.map((m) => m.slug));
      onOrderVersion(result.orderVersion);
      setPendingRemove(null);
      if (selected?.slug === pendingRemove.slug) setSelected(null);
      onToast(`✓ ${pendingRemove.name} eliminada del catálogo`, 'success');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onToast(err.message, 'error');
        onUnauthorized?.();
      } else if (err instanceof ApiError && err.status === 409) {
        setConflict(true);
        setPendingRemove(null);
        onToast('Los datos cambiaron. Recarga el catálogo.', 'error');
      } else if (err instanceof ApiError) {
        onToast(err.message, 'error');
      } else {
        onToast('No se pudo eliminar el perfil', 'error');
      }
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      {conflict ? (
        <div className="conflict-banner">
          El orden cambió en otro dispositivo. Recarga para continuar.
          <br />
          <button type="button" onClick={onReload}>
            Recargar catálogo
          </button>
        </div>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={models.map((m) => m.slug)} strategy={verticalListSortingStrategy}>
          <div className="model-list">
            {models.map((model, index) => (
              <SortableCard
                key={model.slug}
                model={model}
                index={index}
                onOpenCover={setSelected}
                onRequestRemove={setPendingRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="save-bar">
        <div className="inner">
          {dirty ? <div className="dirty">Orden modificado · sin guardar</div> : null}
          <button
            type="button"
            className="primary-btn"
            onClick={saveOrder}
            disabled={!dirty || saving || conflict || orderSaveLocked}
          >
            {orderSaveLocked ? 'Esperando catálogo…' : saving ? 'Guardando…' : 'GUARDAR ORDEN'}
          </button>
        </div>
      </div>

      {selected ? (
        <CoverPicker
          model={selected}
          onClose={() => setSelected(null)}
          onUpdated={onCoverUpdated}
          onToast={onToast}
          onUnauthorized={onUnauthorized}
          onConflict={() => {
            setConflict(true);
            setSelected(null);
          }}
        />
      ) : null}

      {pendingRemove ? (
        <div className="promo-modal-backdrop" role="presentation">
          <div
            className="promo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-model-title"
          >
            <h3 id="remove-model-title">¿Realmente desea eliminar este perfil?</h3>
            <p className="promo-modal-warn">
              Se quitará <strong>{pendingRemove.name}</strong> del panel y dejará de mostrarse en la
              página web.
            </p>
            <div className="promo-modal-actions">
              <button
                type="button"
                className="ghost-btn"
                disabled={removing}
                onClick={() => setPendingRemove(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="danger-btn"
                disabled={removing || orderSaveLocked}
                onClick={() => void confirmRemove()}
              >
                {removing ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
