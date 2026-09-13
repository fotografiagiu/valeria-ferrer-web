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
  id: 'promo-2026-09-14-copa',
  image: '/promos/promo-copa.webp?v=4h',
  startsAt: '2026-09-14T00:40:00+02:00',
  endsAt: '2026-09-14T04:40:00+02:00',
  enabled: true,
  ctaHref: '/booking',
  bannerText: '🥂 Copa de invitación · Aprovecha en estas 4 horas · Ver oferta',
}

export function isPromoLive(promo: PromoPopupConfig, now = Date.now()): boolean {
  if (!promo.enabled) return false
  const start = Date.parse(promo.startsAt)
  const end = Date.parse(promo.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false
  return now >= start && now < end
}
