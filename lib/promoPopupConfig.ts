export type PromoPopupConfig = {
  id: string
  image: string
  startsAt: string
  endsAt: string
  enabled: boolean
  ctaHref: string
  bannerText: string
}

export const ACTIVE_PROMO: PromoPopupConfig = {
  id: 'promo-2026-09-11-copa',
  image: '/promos/promo-copa.webp',
  startsAt: '2026-09-11T21:38:00+02:00',
  endsAt: '2026-09-12T00:38:00+02:00',
  enabled: true,
  ctaHref: '/booking',
  bannerText: '🥂 Copa de invitación · Oferta activa · Ver oferta',
}

export function isPromoLive(promo: PromoPopupConfig, now = Date.now()): boolean {
  if (!promo.enabled) return false
  const start = Date.parse(promo.startsAt)
  const end = Date.parse(promo.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false
  return now >= start && now < end
}
