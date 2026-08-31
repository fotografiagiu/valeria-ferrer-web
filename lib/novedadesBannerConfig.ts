/**
 * Único punto de configuración del banner flotante de novedades.
 * Si `featuredSlugs` está definido, solo rotan esas fichas (en ese orden).
 */
export const NOVEDADES_BANNER = {
  enabled: true,
  /** Incrementar (v2, v3…) si quieres forzar el panel abierto tras un cambio de campaña. */
  storageKey: 'vf-novedades-banner-minimized-v9',
  /** Reservado (la pestaña ya no bloquea el salto al cargar). */
  dismissDays: 7,
  /** Retraso tras montar el banner (ms). Total ≈ preload App (~0,6s) + esto. */
  delayMs: 900,
  badge: 'NOVEDAD',
  /** Slugs que rotan en el popup (orden de aparición). */
  featuredSlugs: ['marta', 'paris'] as const,
  /** Cuántas novedades rotan en el popup. */
  rotateCount: 2,
  /** Intervalo entre slides (ms). */
  rotateMs: 3000,
  /** Línea de tarifas destacada (se renderiza con énfasis visual). */
  ratesLabel: 'Tarifa',
  rates: '80 € · 120 € · 150 €',
  ratesHint: '30′ / 45′ / 1h',
  ctaLabel: 'Ver ficha',
  /** Texto de la pestaña lateral al minimizar (como “Contacto”). */
  tabLabel: 'Novedades',
  /** Enlace del listado completo (punto / badge opcional). */
  listHref: '/novedades',
} as const;
