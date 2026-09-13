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
  id: 'promo-2026-09-13-duo',
  image: '/promos/promo-duo.webp?v=duplex-original-3h',
  startsAt: '2026-09-13T20:55:00+02:00',
  endsAt: '2026-09-13T23:55:00+02:00',
  enabled: true,
  ctaHref: '/booking',
  bannerText: 'Oferta dúplex · Aprovecha en estas 3 horas · Ver oferta',
}

export function isPromoLive(promo: PromoPopupConfig, now = Date.now()): boolean {
  if (!promo.enabled) return false
  const start = Date.parse(promo.startsAt)
  const end = Date.parse(promo.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false
  return now >= start && now < end
}
