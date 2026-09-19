/**
 * Único punto de configuración del banner flotante de novedades.
 * Si `featuredSlugs` está definido, solo rotan esas fichas (en ese orden).
 * Tras `endsAt` el popup se desactiva solo (no molesta al cliente).
 */
export const NOVEDADES_BANNER = {
  enabled: true,
  /**
   * Ventana de campaña (Europe/Madrid).
   * Tras endsAt el banner no se muestra a nadie.
   */
  startsAt: '2026-09-19T00:00:00+02:00',
  endsAt: '2026-09-26T23:59:59+02:00',
  /** Incrementar (v2, v3…) si quieres forzar el panel abierto tras un cambio de campaña. */
  storageKey: 'vf-novedades-banner-minimized-v13',
  /**
   * Tras cerrar/minimizar, no volver a abrir el popup automáticamente
   * durante estos días (solo pestaña lateral).
   */
  dismissDays: 4,
  /** Retraso tras montar el banner (ms). Total ≈ preload App (~0,6s) + esto. */
  delayMs: 900,
  badge: 'NOVEDAD',
  /** Slugs que rotan en el popup (orden de aparición). */
  featuredSlugs: ['ana', 'sofia1'] as const,
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

export function isNovedadesBannerLive(
  cfg: Pick<typeof NOVEDADES_BANNER, 'enabled' | 'startsAt' | 'endsAt'> = NOVEDADES_BANNER,
  now = Date.now()
): boolean {
  if (!cfg.enabled) return false;
  const start = Date.parse(cfg.startsAt);
  const end = Date.parse(cfg.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
  return now >= start && now < end;
}

/** true = el usuario cerró el popup hace menos de dismissDays. */
export function isNovedadesBannerDismissed(
  cfg: Pick<typeof NOVEDADES_BANNER, 'storageKey' | 'dismissDays'> = NOVEDADES_BANNER,
  now = Date.now()
): boolean {
  try {
    const raw = localStorage.getItem(cfg.storageKey);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts) || ts <= 0) return false;
    const windowMs = cfg.dismissDays * 24 * 60 * 60 * 1000;
    if (now - ts >= windowMs) {
      localStorage.removeItem(cfg.storageKey);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
