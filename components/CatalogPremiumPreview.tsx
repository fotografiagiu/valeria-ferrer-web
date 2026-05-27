/**
 * PREVIEW — catálogo horizontal editorial (/models).
 * Rama: preview/catalog-premium
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, MapPin } from 'lucide-react';

export type CatalogPreviewModel = {
  slug: string;
  name: string;
  coverImageUrl: string;
  age?: number;
  height?: string;
  nationality?: string;
  city?: string;
  featured?: boolean;
  isNew?: boolean;
  vip?: boolean;
};

function resolveCoverUrl(coverImageUrl: string): string {
  if (!coverImageUrl) return '';
  return coverImageUrl.startsWith('/') ? coverImageUrl : `/${coverImageUrl}`;
}

function pickHero(models: CatalogPreviewModel[]): CatalogPreviewModel | null {
  if (!models.length) return null;
  return models.find((m) => m.vip) ?? models.find((m) => m.featured) ?? models[0];
}

function metaLine(model: CatalogPreviewModel): string {
  const place = model.nationality || model.city || 'Valencia';
  if (model.age) return `${model.age} años · ${place}`;
  return place;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c2b2a3]/40" />
      <span className="text-[9px] uppercase tracking-[0.42em] text-[#c2b2a3]/75">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c2b2a3]/40" />
    </div>
  );
}

type HorizontalCardProps = {
  model: CatalogPreviewModel;
  variant: 'hero' | 'list';
  index?: number;
};

/** Card horizontal premium: foto dominante (~45%) + panel editorial. */
function HorizontalEditorialCard({ model, variant }: HorizontalCardProps) {
  const isHero = variant === 'hero';
  const imageSrc = resolveCoverUrl(model.coverImageUrl);

  return (
    <Link
      to={`/models/${model.slug}`}
      data-model-name={model.name}
      data-card-layout="horizontal"
      className={`group relative flex flex-row overflow-hidden rounded-2xl border border-[#c2b2a3]/25 bg-[#080808] transition-all duration-500 ease-out hover:border-[#c2b2a3]/45 hover:shadow-[0_20px_56px_-16px_rgba(0,0,0,0.9),0_0_48px_-20px_rgba(194,178,163,0.22)] ${
        isHero
          ? 'min-h-[200px] shadow-[0_16px_52px_-18px_rgba(0,0,0,0.85),0_0_40px_-18px_rgba(194,178,163,0.14)] md:min-h-[220px]'
          : 'min-h-[156px] shadow-[0_12px_40px_-14px_rgba(0,0,0,0.8),0_0_32px_-16px_rgba(194,178,163,0.1)] md:min-h-[168px]'
      }`}
    >
      {/* Zona foto — protagonista (img directa: LazyImage colapsaba el contenedor) */}
      <div className="relative w-[45%] min-h-full shrink-0 self-stretch overflow-hidden bg-[#0d0d0d]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${model.name} — Valeria Ferrer Valencia`}
            loading={isHero ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[0.85s] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" aria-hidden />
        )}
        {/* Viñeta cinematográfica — la foto respira */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        {/* Transición suave hacia el panel */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent" />

        {model.isNew && (
          <span className="absolute left-2.5 top-2.5 border border-[#c2b2a3]/30 bg-black/50 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.22em] text-[#e8ddd2] backdrop-blur-sm">
            Nueva
          </span>
        )}
      </div>

      {/* Panel datos */}
      <div className="relative flex min-w-0 flex-1 flex-col justify-center bg-gradient-to-br from-[#0e0e0e] via-[#0a0a0a] to-[#060606] px-4 py-4 md:px-5 md:py-5">
        <div className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-transparent via-[#c2b2a3]/35 to-transparent" />
        <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-[#c2b2a3]/[0.06] blur-2xl" />

        <div className="relative z-10">
          {model.vip && (
            <span className="mb-2 inline-block text-[8px] uppercase tracking-[0.32em] text-[#c2b2a3]/70">
              VIP
            </span>
          )}

          <h3
            className={`serif font-light uppercase leading-none tracking-wide text-white ${
              isHero ? 'text-[1.65rem] md:text-3xl' : 'text-xl md:text-2xl'
            }`}
          >
            {model.name}
          </h3>

          {isHero && (
            <Crown className="mt-2 mb-2 h-4 w-4 text-[#c2b2a3]/55" strokeWidth={1.15} aria-hidden />
          )}

          <div className="mt-2 flex items-center gap-1.5 text-[#c2b2a3]/85">
            <MapPin className="h-3 w-3 shrink-0 opacity-80" strokeWidth={1.25} aria-hidden />
            <p className="text-[10px] uppercase tracking-[0.18em] md:text-[11px]">{metaLine(model)}</p>
          </div>

          {!isHero && model.height && (
            <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-gray-500">{model.height}</p>
          )}

          <div className="mt-4 h-px w-10 bg-gradient-to-r from-[#c2b2a3]/60 to-transparent" />

          <span
            className={`mt-4 inline-flex items-center gap-2 border border-[#c2b2a3]/40 bg-[#c2b2a3]/[0.07] uppercase tracking-[0.26em] text-[#e8ddd2] transition-all duration-400 group-hover:border-[#c2b2a3]/65 group-hover:bg-[#c2b2a3]/15 ${
              isHero ? 'px-5 py-2.5 text-[10px]' : 'px-4 py-2 text-[9px]'
            }`}
          >
            Ver perfil
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-400 group-hover:translate-x-0.5"
              strokeWidth={1.25}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  models?: CatalogPreviewModel[];
}

function normalizeModels(models: CatalogPreviewModel[]): CatalogPreviewModel[] {
  return models.map((m) => {
    const raw = m as CatalogPreviewModel & { image?: string; images?: string[] };
    const coverImageUrl =
      m.coverImageUrl || raw.image || raw.images?.[0] || '';
    return { ...m, coverImageUrl };
  });
}

const CatalogPremiumPreview: React.FC<Props> = ({ models = [] }) => {
  const normalized = useMemo(() => normalizeModels(models), [models]);
  const hero = useMemo(() => pickHero(normalized), [normalized]);
  const listModels = useMemo(
    () => (hero ? normalized.filter((m) => m.slug !== hero.slug) : normalized),
    [normalized, hero]
  );

  return (
    <section
      id="catalog-horizontal-preview-root"
      data-catalog-preview="horizontal"
      className="relative overflow-hidden bg-[#030303] py-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(194,178,163,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent" />

      <div className="relative mx-auto w-full max-w-[520px] px-3 sm:px-4 md:max-w-[560px]">
        {import.meta.env.DEV && (
          <p className="mb-5 text-center text-[8px] uppercase tracking-[0.35em] text-[#c2b2a3]/35">
            Preview · lista horizontal premium
          </p>
        )}

        {hero && (
          <>
            <SectionLabel>Selección</SectionLabel>
            <div className="mb-8">
              <HorizontalEditorialCard model={hero} variant="hero" />
            </div>
          </>
        )}

        {listModels.length > 0 && (
          <>
            <SectionLabel>Catálogo</SectionLabel>
            <ul
              id="models-grid-start"
              className="flex flex-col gap-4"
              aria-label="Listado de modelos"
            >
              {listModels.map((model, index) => (
                <li key={model.slug}>
                  <HorizontalEditorialCard model={model} variant="list" index={index} />
                </li>
              ))}
            </ul>
          </>
        )}

        {listModels.length === 0 && !hero && (
          <p className="py-16 text-center text-sm font-light text-gray-500">
            No hay modelos que coincidan con el filtro.
          </p>
        )}
      </div>
    </section>
  );
};

export default CatalogPremiumPreview;
