# Assets por ficha (slug)

Estructura prevista para cada ficha:

```
public/chicas/<slug>/
  portada.jpg      → imagen principal (card + hero detalle)
  hover.jpg        → imagen hover en grid
  gallery/         → imágenes del portafolio (01.jpg, 02.jpg, …)
  videos/          → opcional (01.mp4, …)
```

En `data/models.json`, las rutas son URLs absolutas del sitio, por ejemplo `/chicas/mi-slug/portada.jpg`.

El script `scripts/import-valeriaferrer.mjs` (modo descarga) puede rellenar estas carpetas; hasta entonces el JSON puede seguir usando URLs remotas.
