export type PromoPopupConfig = {
  id: string
  image: string
  startsAt: string
  endsAt: string
  enabled: boolean
  ctaHref: string
}

export const ACTIVE_PROMO: PromoPopupConfig = {
  id: 'promo-2026-09-11-duo',
  image: '/promos/promo-duo.webp',
  startsAt: '2026-09-11T17:15:00+02:00',
  endsAt: '2026-09-11T20:15:00+02:00',
  enabled: true,
  ctaHref: '/booking',
}

export function promoClosedStorageKey(promoId: string): string {
  return `promo-closed:${promoId}`
}

export function isPromoLive(promo: PromoPopupConfig, now = Date.now()): boolean {
  if (!promo.enabled) return false
  const start = Date.parse(promo.startsAt)
  const end = Date.parse(promo.endsAt)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false
  return now >= start && now < end
}
