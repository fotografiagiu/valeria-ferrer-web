/** Posición compartida de las pestañas laterales (Contacto + Novedades). */
export const FLOATING_SIDE_TABS = {
  /** Tailwind: distancia del borde inferior a la pestaña Contacto (= 8rem). */
  contactBottomClass: 'bottom-32',
  /**
   * Altura aproximada de una pestaña (icono + texto vertical + padding).
   * Sirve para apilar Novedades encima con hueco tipo “separador de libros”.
   */
  tabHeight: '9.25rem',
  gapMobile: '0.5cm',
  gapDesktop: '1cm',
} as const;

/** Clases bottom para la pestaña Novedades (encima de Contacto + gap). */
export const NOVEDADES_TAB_BOTTOM_CLASS =
  'bottom-[calc(8rem+9.25rem+0.5cm)] md:bottom-[calc(8rem+9.25rem+1cm)]';
