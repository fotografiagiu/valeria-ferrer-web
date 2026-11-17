# Restauración masiva de originales SIN cuño

El sistema web añade automáticamente el logo en la **galería pública** y no lo añade en la **portada**. Este script sustituye las fotografías antiguas que contienen el logo grabado en los píxeles. No borra ni reconstruye logotipos por inteligencia artificial.

## Preparar originales

Crea en la raíz del repositorio una carpeta **`originales-limpios`** con **la misma ruta relativa** de cada foto que se va a sustituir, sin el prefijo `public/chicas/`.

Ejemplo:

```
originales-limpios/
  cataleya-model-agency-valencia-vf/
    gallery/
      02.jpg
      03.jpg
  belen-model-agency-valencia-vf/
    gallery/
      01.jpg
```

Los archivos deben ser originales limpios en JPEG/WebP/PNG (mismo formato del archivo original, sin cuño ni logotipos superpuestos). **Confirma visualmente que cada foto coincide con la posición y pose del archivo que sustituye.** Un archivo con nombre equivocado no se puede detectar por nombre. La carpeta `originales-limpios` está ignorada por Git.

## Comprobar sin cambiar nada

```bash
npm run photos:report
```

Muestra cuántas rutas estampadas conocidas tienen un original listo y las que siguen pendientes. El repositorio contiene además fotos históricas que necesitan revisión humana si no aparecen en el inventario.

## Sustituir y actualizar miniaturas

```bash
npm run photos:restore
```

- Primero crea copia de las fotos anteriores y sus miniaturas en `.photo-restoration-backups/` (ignoradas por Git).
- Sustituye únicamente los archivos para los cuales existe un original limpio con el nombre exacto.
- Actualiza las miniaturas existentes para que no conserven el logo anterior.
- Elimina esas rutas de `data/firma-skip-stamped.json`: el componente público volverá a añadir el cuño SOLO al mostrar la galería.
- No cambia slugs, nombres, SEO, orden de las fichas, registros, ni imágenes sin original proporcionado.

**Después:** revisa localmente el resultado (portada limpia, galería con cuño) y publica los archivos `public/chicas`, `public/chicas-thumbnails` y el JSON mediante GitHub. Las copias de seguridad no deben subirse. Esta es una restauración por reemplazo de archivos, no una descarga masiva de portadas.

## Pruebas

```bash
npm run test:photos
```

Si no se dispone del original limpio de una fotografía, **no la sustituyas**; el panel seguirá avisando y el cuño existente seguirá visible hasta obtenerla. En particular, no se puede reconstruir una imagen exactamente como antes de imprimir el logo sin contar con el original.
