export type PromoPopupConfig = {
  id: string
  image: string
  startsAt: string
  endsAt: string
  enabled: boolean
  ctaHref: string
  bannerText: string
}

/** Copas / invitación — ventana de exactamente 3 horas (Madrid +02:00). */
export const ACTIVE_PROMO: PromoPopupConfig = {
  id: 'promo-2026-09-20-copa',
  image: '/promos/promo-copa.webp?v=copa-sin-3h',
  startsAt: '2026-09-20T03:30:00+02:00',
  endsAt: '2026-09-20T06:30:00+02:00',
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
