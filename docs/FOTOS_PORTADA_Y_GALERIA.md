# Fotos de modelos: portada limpia y cuño solo en galería

- Sube siempre el archivo maestro **sin logo ni cuño incrustado** a `public/chicas/...`.
- El panel de «Orden y fichas» mantiene una foto de portada (primera posición) y fotos de galería (resto).
- La portada y las miniaturas del catálogo usan el archivo limpio, sin añadir la firma visual.
- En las fotografías de la galería del perfil y el visor ampliado se superpone el logo blanco Valeria Ferrer con CSS. No se modifica el archivo original.
- El panel indica «LOGO INCRUSTADO» en imágenes incluidas en el inventario histórico `data/firma-skip-stamped.json` y evita que se seleccione una de ellas como *nueva* portada. Una portada histórica marcada puede mantenerse mientras se recupera su original.
- Las imágenes antiguas con el logo ya incrustado **no pueden limpiarse automáticamente** mediante CSS. Hay que sustituirlas por los originales sin logo, conservando después sus posiciones en el panel.
- En el visor público, incluso si se abre desde la portada, el cuño se superpone a la imagen limpia; las imágenes históricas con cuño incrustado no reciben un segundo cuño.

**Sin cambios en las URL de las fichas, los nombres de los modelos, SEO o datos de ordenación existentes.**
