export type PromoKind = 'copas' | 'duples'

export type PromoPopupConfig = {
  id: string
  kind: PromoKind
  image: string
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
    ctaHref: '/booking',
    bannerText: '🥂 Copa de invitación · Oferta activa · Ver oferta',
  },
  duples: {
    kind: 'duples',
    image: '/promos/promo-duo.webp',
    ctaHref: '/booking',
    bannerText: 'Oferta dúplex · Oferta activa · Ver oferta',
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

/** Hardcoded fallback is OFF — remote panel state owns activation. */
export const ACTIVE_PROMO: PromoPopupConfig = {
  id: 'promo-remote-idle',
  kind: 'copas',
  image: PROMO_CREATIVES.copas.image,
  startsAt: '1970-01-01T00:00:00.000Z',
  endsAt: '1970-01-01T00:00:00.000Z',
  enabled: false,
  ctaHref: '/booking',
  bannerText: PROMO_CREATIVES.copas.bannerText,
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
  if (kind !== 'copas' && kind !== 'duples') return null
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
  const bannerText =
    kind === 'copas'
      ? hours
        ? `🥂 Copa de invitación · Aprovecha en estas ${hours} ${hours === 1 ? 'hora' : 'horas'} · Ver oferta`
        : creative.bannerText
      : hours
        ? `Oferta dúplex · Aprovecha en estas ${hours} ${hours === 1 ? 'hora' : 'horas'} · Ver oferta`
        : creative.bannerText

  return {
    ...creative,
    id: payload.promoId || `${kind}-${startsAt}`,
    startsAt,
    endsAt,
    enabled: true,
    bannerText,
  }
}
