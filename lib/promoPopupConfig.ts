export type PromoKind = 'copas' | 'duples' | 'salidas'

export type PromoPopupConfig = {
  id: string
  kind: PromoKind
  image: string
  /** Intrinsic pixel size of the creative (helps CLS; prices stay baked in the asset). */
  imageWidth: number
  imageHeight: number
  startsAt: string
  endsAt: string
  enabled: boolean
  ctaHref: string
  bannerText: string
}

/** Static creatives — activation window comes from the panel API. */
export const PROMO_CREATIVES: Record<
  PromoKind,
  Omit<PromoPopupConfig, 'id' | 'startsAt' | 'endsAt' | 'enabled'>
> = {
  copas: {
    kind: 'copas',
    image: '/promos/promo-copa.webp',
    imageWidth: 1024,
    imageHeight: 576,
    ctaHref: '/booking',
    bannerText: '🥂 Copa de invitación · Oferta activa · Ver oferta',
  },
  duples: {
    kind: 'duples',
    image: '/promos/promo-duplex-precios-oct2026.webp',
    imageWidth: 1024,
    imageHeight: 682,
    ctaHref: '/booking',
    bannerText: 'Oferta dúplex · Oferta activa · Ver oferta',
  },
  salidas: {
    kind: 'salidas',
    image: '/promos/promo-salidas-vip.webp',
    imageWidth: 1024,
    imageHeight: 682,
    ctaHref: '/booking',
    bannerText: 'Salidas VIP · Oferta activa · Ver oferta',
  },
}

export type RemotePromotionPayload = {
  activePromotion?: string | null
  active?: boolean
  startsAt?: string | null
  endsAt?: string | null
  durationHours?: number | null
  promoId?: string | null
  updatedAt?: string | null
}

export function isPromoLive(promo: PromoPopupConfig | null | undefined, now = Date.now()): boolean {
  if (!promo || !promo.enabled) return false
  const start = Date.parse(promo.startsAt)
  const end = Date.parse(promo.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false
  return now >= start && now < end
}

export function resolvePromoFromRemote(
  payload: RemotePromotionPayload | null | undefined,
  now = Date.now()
): PromoPopupConfig | null {
  if (!payload || payload.active !== true) return null
  const kind = payload.activePromotion
  if (kind !== 'copas' && kind !== 'duples' && kind !== 'salidas') return null
  const startsAt = payload.startsAt
  const endsAt = payload.endsAt
  if (!startsAt || !endsAt) return null
  const end = Date.parse(endsAt)
  if (!Number.isFinite(end) || now >= end) return null

  const creative = PROMO_CREATIVES[kind]
  const hours =
    typeof payload.durationHours === 'number' && payload.durationHours > 0
      ? payload.durationHours
      : null
  const timedBanner =
    kind === 'copas'
      ? `🥂 Copa de invitación · Aprovecha en estas ${hours} ${hours === 1 ? 'hora' : 'horas'} · Ver oferta`
      : kind === 'duples'
        ? `Oferta dúplex · Aprovecha en estas ${hours} ${hours === 1 ? 'hora' : 'horas'} · Ver oferta`
        : `Salidas VIP · Aprovecha en estas ${hours} ${hours === 1 ? 'hora' : 'horas'} · Ver oferta`
  const bannerText = hours ? timedBanner : creative.bannerText

  return {
    ...creative,
    id: payload.promoId || `${kind}-${startsAt}`,
    startsAt,
    endsAt,
    enabled: true,
    bannerText,
  }
}
