export type PromoPopupConfig = {
  id: string
  image: string
  startsAt: string
  endsAt: string
  enabled: boolean
  ctaHref: string
  bannerText: string
}

/**
 * Copas / invitación — campaña temporal (3 horas).
 *
 * Para activar en producción, cambia SOLO estos dos campos (zona Madrid +02:00):
 *   startsAt  → momento exacto de inicio
 *   endsAt    → startsAt + 3 horas
 * y pon enabled: true.
 *
 * Ejemplo (NO usar hasta decidir horario):
 *   startsAt: '2026-09-20T21:00:00+02:00'
 *   endsAt:   '2026-09-21T00:00:00+02:00'
 */
export const ACTIVE_PROMO: PromoPopupConfig = {
  id: 'promo-2026-09-copas-3h',
  image: '/promos/promo-copa.webp?v=copa-3h',
  // PLACEHOLDERS — sustituir juntos antes de activar (ventana de 3h).
  startsAt: '2026-09-20T00:00:00+02:00',
  endsAt: '2026-09-20T03:00:00+02:00',
  enabled: false,
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
