/**
 * Único punto de configuración del banner flotante de novedades.
 * Cambia título, texto, enlace, imagen o tarifas aquí.
 */
export const NOVEDADES_BANNER = {
  enabled: true,
  /** Incrementar (v2, v3…) si quieres forzar el panel abierto tras un cambio de campaña. */
  storageKey: 'vf-novedades-banner-minimized-v1',
  /** Reservado (la pestaña ya no bloquea el salto al cargar). */
  dismissDays: 7,
  /** Retraso tras montar el banner (ms). Total ≈ preload App (~0,6s) + esto. */
  delayMs: 900,
  badge: 'NOVEDAD',
  title: 'Carolina, nueva incorporación',
  text: 'Ya puedes ver su ficha.',
  /** Línea de tarifas destacada (se renderiza con énfasis visual). */
  ratesLabel: 'Tarifa',
  rates: '80 € · 120 € · 150 €',
  ratesHint: '30′ / 45′ / 1h',
  ctaLabel: 'Ver novedades',
  /** Texto de la pestaña lateral al minimizar (como “Contacto”). */
  tabLabel: 'Novedades',
  /** Ruta interna (SPA). Ej.: '/novedades' o '/models/carolina' */
  ctaHref: '/models/carolina',
  imageSrc:
    '/chicas-thumbnails/carolina-valeria-ferrer-model-agency-valencia/cover-thumbnail.jpg',
  imageAlt: 'Carolina, nueva modelo en Valeria Ferrer Valencia',
} as const;
