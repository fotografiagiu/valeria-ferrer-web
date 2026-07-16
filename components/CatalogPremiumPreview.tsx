/**
 * PREVIEW — catálogo horizontal editorial (/models).
 * Rama: preview/catalog-premium
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

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

/** Edad + nacionalidad: útil para el usuario, sin repetir ciudad/Valencia en cada card. */
function profileMetaLine(model: CatalogPreviewModel): string {
  const parts: string[] = [];
  if (model.age) parts.push(`${model.age} años`);
  if (model.nationality) parts.push(model.nationality);
  return parts.join(' · ');
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 md:mb-7 lg:mb-8">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c2b2a3]/20 to-[#c2b2a3]/30" />
      <span className="flex shrink-0 items-center gap-2.5">
        <span className="h-[3px] w-[3px] rotate-45 bg-[#c2b2a3]/45" aria-hidden />
        <span className="text-[9px] uppercase tracking-[0.44em] text-[#c2b2a3]/70 md:text-[10px]">
          {children}
        </span>
        <span className="h-[3px] w-[3px] rotate-45 bg-[#c2b2a3]/45" aria-hidden />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c2b2a3]/20 to-[#c2b2a3]/30" />
    </div>
  );
}

function profileKicker(model: CatalogPreviewModel): string | null {
  if (model.vip) return 'VIP';
  if (model.isNew) return 'Nueva';
  if (model.featured) return 'Exclusive';
  return null;
}

function CrownDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex w-full max-w-[12rem] items-center gap-3 md:max-w-[13.5rem] ${className}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c2b2a3]/35 to-[#c2b2a3]/58" />
      <span className="relative flex h-7 w-9 shrink-0 items-center justify-center md:h-8 md:w-10">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(194,178,163,0.11),transparent_72%)]" />
        <Crown className="relative z-[1] h-3 w-3 text-[#c2b2a3]/72 md:h-3.5 md:w-3.5" strokeWidth={1.2} />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c2b2a3]/35 to-[#c2b2a3]/58" />
    </div>
  );
}

type HorizontalCardProps = {
  model: CatalogPreviewModel;
  variant: 'hero' | 'list';
};

/**
 * La imagen se desvanece (mask), no overlay negro: el fondo #0a0a0a de la card asoma
 * y funde foto → panel sin franja ni corte vertical.
 */
const PHOTO_FADE_MASK =
  'linear-gradient(to right, #000 0%, #000 30%, rgba(0,0,0,0.97) 42%, rgba(0,0,0,0.88) 54%, rgba(0,0,0,0.72) 66%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.26) 88%, rgba(0,0,0,0.1) 96%, transparent 100%)';

const photoFadeMaskStyle: React.CSSProperties = {
  WebkitMaskImage: PHOTO_FADE_MASK,
  maskImage: PHOTO_FADE_MASK,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
};

/** Card horizontal: foto izquierda + panel derecho, integrados. */
function HorizontalEditorialCard({ model, variant }: HorizontalCardProps) {
  const isHero = variant === 'hero';
  const imageSrc = resolveCoverUrl(model.coverImageUrl);
  const meta = profileMetaLine(model);
  const kicker = profileKicker(model);

  return (
    <Link
      to={`/models/${model.slug}`}
      data-model-name={model.name}
      data-card-layout="horizontal"
      className={`group relative flex min-h-[inherit] flex-row overflow-hidden rounded-2xl border border-[#c2b2a3]/28 bg-[#0a0a0a] transition-[border-color,box-shadow,transform] duration-500 ease-out md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:-translate-y-0.5 md:hover:border-[#c2b2a3]/45 md:hover:shadow-[0_22px_56px_-18px_rgba(0,0,0,0.9),0_0_32px_-14px_rgba(194,178,163,0.14)] ${
        isHero
          ? 'min-h-[220px] md:min-h-[272px] lg:min-h-[288px]'
          : 'min-h-[184px] md:min-h-[212px] lg:min-h-[224px]'
      }`}
    >
      {/* Línea champagne en la unión — sobre el desvanecido, no un corte */}
      <div
        className="pointer-events-none absolute inset-y-6 z-[5] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c2b2a3]/44 to-transparent left-[58%] md:inset-y-7 md:left-[59%]"
        aria-hidden
      />

      {/* Foto — se evapora hacia la derecha vía mask (sin overlay negro) */}
      <div className="relative min-h-[inherit] w-[58%] shrink-0 self-stretch md:w-[59%]">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[65%] bg-[radial-gradient(ellipse_at_38%_50%,rgba(194,178,163,0.055),transparent_68%)]"
          aria-hidden
        />
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Retrato de ${model.name}`}
            loading={isHero ? 'eager' : 'lazy'}
            decoding="async"
            style={photoFadeMaskStyle}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out md:duration-[1.1s] md:group-hover:scale-[1.03] ${
              model.slug === 'lili' ? 'object-[center_12%]' : 'object-[center_20%]'
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" aria-hidden />
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38%] bg-gradient-to-t from-black/16 to-transparent"
          aria-hidden
        />
      </div>

      {/* Panel — mismo fondo que la card; sin borde vertical propio */}
      <div className="relative flex min-h-[inherit] min-w-0 flex-1 flex-col items-center justify-center px-2 py-5 text-center sm:px-3 md:px-5 md:py-6 lg:px-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_50%_42%,rgba(194,178,163,0.07),transparent_72%)]"
          aria-hidden
        />

        <div className="relative z-10 flex w-full min-w-0 max-w-full flex-col items-center">
          {kicker && (
            <span
              className={`mb-2 text-[7px] uppercase tracking-[0.38em] md:mb-2.5 md:text-[8px] ${
                kicker === 'VIP' ? 'vip-gold-kicker font-medium' : 'text-[#c2b2a3]/60'
              }`}
            >
              {kicker}
            </span>
          )}

          <h3
            className={`serif font-light uppercase leading-none tracking-[0.1em] text-[#ebe3da] ${
              isHero
                ? 'text-[1.75rem] md:text-[2.35rem] lg:text-[2.55rem]'
                : 'text-[1.35rem] md:text-[1.55rem] lg:text-[1.65rem]'
            }`}
          >
            {model.name}
          </h3>

          <CrownDivider className="my-2.5 w-full justify-center md:my-3" />

          {(meta || model.height) && (
            <div className="mt-0 flex w-full min-w-0 max-w-full flex-col items-center gap-1">
              {meta && (
                <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-[#c2b2a3]/78 sm:text-[8.5px] md:text-[10px] md:tracking-[0.22em]">
                  {meta}
                </p>
              )}
              {model.height && (
                <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-[#c2b2a3]/62 sm:text-[8.5px] md:text-[9px] md:tracking-[0.16em]">
                  {model.height}
                </p>
              )}
            </div>
          )}

          <span
            className={`mt-4 rounded-full border border-[#c2b2a3]/48 bg-[#c2b2a3]/[0.06] uppercase tracking-[0.28em] text-[#e8ddd2] transition-[border-color,background-color,box-shadow] duration-500 ease-out md:mt-5 md:duration-700 md:group-hover:border-[#c2b2a3]/68 md:group-hover:bg-[#c2b2a3]/[0.1] ${
              isHero ? 'px-6 py-2.5 text-[10px]' : 'px-5 py-2 text-[9px]'
            }`}
          >
            Ver perfil
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
      className="relative overflow-hidden bg-[#020202] py-10 md:py-16 lg:py-[4.5rem]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_28%,rgba(28,24,20,0.55)_0%,#050504_45%,#020202_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_18%,rgba(194,178,163,0.045),transparent_68%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/25 to-transparent" />

      <div className="relative mx-auto w-full max-w-[520px] px-3 sm:px-4 md:max-w-[720px] lg:max-w-[840px] xl:max-w-[900px]">
        {import.meta.env.DEV && (
          <p className="mb-5 text-center text-[8px] uppercase tracking-[0.35em] text-[#c2b2a3]/35">
            Preview · lista horizontal premium
          </p>
        )}

        {hero && (
          <>
            <SectionLabel>Selección</SectionLabel>
            <div id="models-catalog-selection" className="mb-8 md:mb-10 lg:mb-12">
              <HorizontalEditorialCard model={hero} variant="hero" />
            </div>
          </>
        )}

        {listModels.length > 0 && (
          <>
            <SectionLabel>Colección</SectionLabel>
            <ul
              id="models-grid-start"
              className="flex flex-col gap-5 md:gap-7 lg:gap-8"
              aria-label="Listado de modelos"
            >
              {listModels.map((model) => (
                <li key={model.slug}>
                  <HorizontalEditorialCard model={model} variant="list" />
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
