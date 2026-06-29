/**
 * Contenido HTML estático para inyección post-build (Fase B).
 * Solo rutas explícitas; el resto mantiene #root vacío.
 *
 * Rollback parcial: /escorts-valencia desactivado para evitar canibalización con home.
 */

/** @type {Record<string, string>} */
export const STATIC_BODY_BY_PATH = {};

/** Comprobaciones mínimas para verify-inject-seo (solo Fase B). */
export const STATIC_BODY_CHECKS = {};
