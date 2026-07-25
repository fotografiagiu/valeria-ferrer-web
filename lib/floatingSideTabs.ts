/** Posición compartida de las pestañas laterales (Contacto + Novedades). */
export const FLOATING_SIDE_TABS = {
  /** Tailwind: distancia del borde inferior a la pestaña Contacto (= 8rem). */
  contactBottomClass: 'bottom-32',
  /**
   * Altura aproximada de la pestaña Contacto (icono + texto vertical + padding).
   * Si se solapan, subir este valor.
   */
  tabHeight: '11.5rem',
  /** Hueco entre pestañas (tipo separador de libros). */
  gapMobile: '1cm',
  gapDesktop: '2cm',
} as const;
