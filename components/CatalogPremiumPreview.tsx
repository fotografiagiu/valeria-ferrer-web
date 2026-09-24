/**
 * Catálogo premium (/models) — VIP horizontal + fichas verticales 4:5.
 * Presentación solamente: mismas rutas /models/{slug} y mismos datos de modelo.
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
  galleryUpdated?: string;
  vip?: boolean;
};

function resolveCoverUrl(coverImageUrl: string): string {
  if (!coverImageUrl) return '';
  return coverImageUrl.startsWith('/') ? coverImageUrl : `/${coverImageUrl}`;
}

/** Solo modelos con flag real `vip` — sin fallback a featured ni primer item. */
function pickVipHero(models: CatalogPreviewModel[]): CatalogPreviewModel | null {
  if (!models.length) return null;
  return models.find((m) => m.vip === true) ?? null;
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

function statusBadge(model: CatalogPreviewModel): string | null {
  if (model.galleryUpdated) return 'Actualizada';
  if (model.isNew) return 'Nueva';
  return null;
}

/** Separador neutro para fichas normales (sin corona). */
function DiamondDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex w-full max-w-[10rem] items-center gap-3 ${className}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-[#c2b2a3]/45" />
      <span className="h-[3px] w-[3px] rotate-45 bg-[#c2b2a3]/50" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c2b2a3]/30 to-[#c2b2a3]/45" />
    </div>
  );
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

/**
 * La imagen se desvanece (mask) en desktop vía clase `.vip-cover-fade` (index.css).
 */

/** Focal point por modelo (object-cover) — sin editar archivos. */
const COVER_OBJECT_POSITION: Record<string, string> = {
  lili: 'object-[center_12%]',
  naty: 'object-[center_64%]',
  monica: 'object-[center_52%]',
};

/** VIP: tarjeta horizontal destacada (desktop) / apilada en móvil. */
function VipHorizontalCard({ model }: { model: CatalogPreviewModel }) {
  const imageSrc = resolveCoverUrl(model.coverImageUrl);
  const meta = profileMetaLine(model);
  const objectPos = COVER_OBJECT_POSITION[model.slug] ?? 'object-[center_20%]';

  return (
    <Link
      to={`/models/${model.slug}`}
      data-model-name={model.name}
      data-card-layout="vip-horizontal"
      className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-[rgba(201,172,120,0.28)] bg-[#0a0a0a] transition-[border-color,box-shadow,transform] duration-500 ease-out md:min-h-[300px] md:flex-row md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:-translate-y-0.5 md:hover:border-[rgba(201,172,120,0.42)] md:hover:shadow-[0_22px_56px_-18px_rgba(0,0,0,0.9),0_0_32px_-14px_rgba(194,178,163,0.14)] lg:min-h-[320px]"
    >
      <div
        className="pointer-events-none absolute inset-y-6 z-[5] hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c2b2a3]/44 to-transparent md:left-[52%] md:block lg:left-[54%]"
        aria-hidden
      />

      {/* Foto */}
      <div className="relative aspect-[4/5] w-full shrink-0 self-stretch md:aspect-auto md:min-h-[inherit] md:w-[52%] lg:w-[54%]">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[65%] bg-[radial-gradient(ellipse_at_38%_50%,rgba(194,178,163,0.055),transparent_68%)]"
          aria-hidden
        />
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Retrato de ${model.name}`}
            width={720}
            height={900}
            loading="eager"
            decoding="async"
            className={`vip-cover-fade absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out md:duration-[1.1s] md:group-hover:scale-[1.02] ${objectPos}`}
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" aria-hidden />
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38%] bg-gradient-to-t from-black/16 to-transparent"
          aria-hidden
        />
        <div className="absolute right-3 top-3 z-20 md:right-4 md:top-4">
          <div className="vip-gold-badge relative flex items-center space-x-1.5 px-3 py-1.5 md:space-x-2 md:px-4 md:py-2">
            <Crown className="relative z-[1] h-3 w-3 text-[#1a1208] md:h-3.5 md:w-3.5" strokeWidth={1.6} />
            <span className="vip-gold-text relative z-[1] text-[10px] uppercase md:text-[11px]">VIP</span>
          </div>
        </div>
      </div>

      {/* Panel info */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-visible px-4 py-6 text-center sm:px-5 md:px-5 md:py-8 lg:px-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_50%_42%,rgba(194,178,163,0.07),transparent_72%)]"
          aria-hidden
        />
        <div className="relative z-10 flex w-full min-w-0 max-w-full flex-col items-center px-1">
          <span className="vip-gold-kicker mb-2.5 text-[8px] font-medium uppercase tracking-[0.38em] md:mb-3 md:text-[9px]">
            VIP
          </span>

          <h3 className="serif max-w-full text-[1.65rem] font-light uppercase leading-[1.05] tracking-[0.08em] text-[#ebe3da] md:text-[1.95rem] lg:text-[2.25rem]">
            {model.name}
          </h3>

          <CrownDivider className="my-3 w-full justify-center md:my-3.5" />

          {(meta || model.height) && (
            <div className="mt-0 flex w-full min-w-0 max-w-full flex-col items-center gap-1 px-1">
              {meta && (
                <p className="text-center text-[9px] uppercase tracking-[0.14em] text-[#c2b2a3]/78 md:text-[10px] md:tracking-[0.18em]">
                  {meta}
                </p>
              )}
              {model.height && (
                <p className="text-center text-[9px] uppercase tracking-[0.14em] text-[#c2b2a3]/62 md:text-[10px]">
                  {model.height}
                </p>
              )}
            </div>
          )}

          <span className="mt-5 shrink-0 rounded-full border border-[#c2b2a3]/48 bg-[#c2b2a3]/[0.06] px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] text-[#e8ddd2] transition-[border-color,background-color] duration-500 ease-out md:mt-6 md:px-6 md:group-hover:border-[#c2b2a3]/68 md:group-hover:bg-[#c2b2a3]/[0.1]">
            Ver perfil
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Ficha normal: tarjeta vertical 4:5. */
function VerticalModelCard({ model }: { model: CatalogPreviewModel }) {
  const imageSrc = resolveCoverUrl(model.coverImageUrl);
  const meta = profileMetaLine(model);
  const badge = statusBadge(model);
  const objectPos = COVER_OBJECT_POSITION[model.slug] ?? 'object-[center_22%]';

  return (
    <Link
      to={`/models/${model.slug}`}
      data-model-name={model.name}
      data-card-layout="vertical"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(201,172,120,0.20)] bg-[#0a0a0a] transition-[border-color,box-shadow,transform] duration-500 ease-out md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:-translate-y-0.5 md:hover:border-[rgba(201,172,120,0.35)] md:hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.85),0_0_28px_-12px_rgba(194,178,163,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2b2a3]/55"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Retrato de ${model.name}`}
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out md:duration-[1.05s] md:group-hover:scale-[1.02] ${objectPos}`}
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414]" aria-hidden />
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black/35 to-transparent"
          aria-hidden
        />
        {badge && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-sm border border-[#c2b2a3]/25 bg-[#0a0a0a]/72 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.28em] text-[#e8ddd2] backdrop-blur-[2px] md:text-[9px]">
              {badge}
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col items-center px-4 pb-5 pt-4 text-center md:px-5 md:pb-6 md:pt-5">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(ellipse_at_50%_0%,rgba(194,178,163,0.06),transparent_70%)]"
          aria-hidden
        />

        <h3 className="serif relative z-[1] text-[1.35rem] font-light uppercase leading-none tracking-[0.12em] text-[#ebe3da] md:text-[1.5rem] lg:text-[1.55rem]">
          {model.name}
        </h3>

        <DiamondDivider className="my-2.5 justify-center md:my-3" />

        {(meta || model.height) && (
          <div className="relative z-[1] flex w-full flex-col items-center gap-0.5">
            {meta && (
              <p className="text-[8.5px] uppercase tracking-[0.16em] text-[#c2b2a3]/78 md:text-[9.5px] md:tracking-[0.2em]">
                {meta}
              </p>
            )}
            {model.height && (
              <p className="text-[8px] uppercase tracking-[0.14em] text-[#c2b2a3]/58 md:text-[9px]">
                {model.height}
              </p>
            )}
          </div>
        )}

        <span className="relative z-[1] mt-4 inline-flex rounded-full border border-[#c2b2a3]/42 bg-transparent px-5 py-2 text-[9px] uppercase tracking-[0.28em] text-[#e8ddd2] transition-[border-color,background-color] duration-500 md:mt-5 md:group-hover:border-[#c2b2a3]/62 md:group-hover:bg-[#c2b2a3]/[0.08]">
          Ver perfil
        </span>
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
  const vipHero = useMemo(() => pickVipHero(normalized), [normalized]);
  const listModels = useMemo(
    () => (vipHero ? normalized.filter((m) => m.slug !== vipHero.slug) : normalized),
    [normalized, vipHero]
  );

  return (
    <section
      id="catalog-horizontal-preview-root"
      data-catalog-preview="vertical-grid"
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

      <div className="relative mx-auto w-full max-w-[520px] px-3 sm:max-w-[640px] sm:px-4 md:max-w-[760px] lg:max-w-[900px] xl:max-w-[960px]">
        {import.meta.env.DEV && (
          <p className="mb-5 text-center text-[8px] uppercase tracking-[0.35em] text-[#c2b2a3]/35">
            Preview · VIP horizontal · colección vertical 4:5
          </p>
        )}

        {vipHero && (
          <>
            <SectionLabel>Selección</SectionLabel>
            <div id="models-catalog-selection" className="mb-8 md:mb-10 lg:mb-12">
              <VipHorizontalCard model={vipHero} />
            </div>
          </>
        )}

        {listModels.length > 0 && (
          <>
            <SectionLabel>Colección</SectionLabel>
            <ul
              id="models-grid-start"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:gap-7"
              aria-label="Listado de modelos"
            >
              {listModels.map((model) => (
                <li key={model.slug} className="min-w-0">
                  <VerticalModelCard model={model} />
                </li>
              ))}
            </ul>
          </>
        )}

        {listModels.length === 0 && !vipHero && (
          <p className="py-16 text-center text-sm font-light text-gray-500">
            No hay modelos que coincidan con el filtro.
          </p>
        )}
      </div>
    </section>
  );
};

export default CatalogPremiumPreview;
