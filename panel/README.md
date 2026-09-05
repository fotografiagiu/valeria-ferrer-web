# Valeria Ferrer — Panel Encargadas (Fase 2)

API + persistencia para que las encargadas cambien **solo**:

1. `display_order` (orden del catálogo)
2. `cover_image_path` (referencia a una foto ya existente)

**No** modifica `public/chicas/`, Git, ni el runtime de `www.valeriaferrer.com` (eso es Fase 4).

Proyecto Vercel previsto: `panel.valeriaferrer.com`  
DB: Neon Postgres **exclusiva** de ValeriaFerrer.com (aún no creada — ver abajo).

---

## Fuente única del catálogo (sin copia manual)

Canónico: **`../data/models.json`** (web).

El panel **no** mantiene un segundo JSON editable.

```bash
npm run catalog:snapshot   # lee data/models.json → generated/catalog-snapshot.json
npm run catalog:check      # falla si el snapshot no coincide con el hash del canónico
```

`generated/catalog-snapshot.json` es un **artefacto generado** (hash + timestamp + campos mínimos):

- `slug`, `name`, `active`, `coverImageUrl`, `images[]`

No incluye descripciones, teléfonos ni SEO.

### Por qué un artefacto generado (opción B)

En Vercel, si el Root Directory del proyecto panel es `panel/`, **no se sube** `../data/`.  
Por eso el snapshot se genera en el monorepo y se incluye en el deploy del panel.

Flujo obligatorio cuando cambias el catálogo en la web:

1. Editas `data/models.json` + fotos en el repo web  
2. `cd panel && npm run catalog:snapshot`  
3. Compruebas `npm run catalog:check`  
4. Despliegas el panel (cuando exista) **y/o** ejecutas `npm run catalog:sync` contra Neon  
5. Las encargadas ya ven nuevas fichas/fotos candidatas

En local/CI con acceso al monorepo, `catalog:snapshot` siempre regenera desde el canónico. Si el hash no coincide, **build/check fallan**.

---

## Endpoints

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/health` | no |
| GET | `/api/public/overrides` | no (CORS allowlist) |
| POST | `/api/staff/login` | no (rate limit) |
| POST | `/api/staff/logout` | cookie |
| GET | `/api/staff/me` | cookie |
| GET | `/api/staff/catalog` | cookie |
| PUT | `/api/staff/order` | cookie + Origin | body `{ version, orderedSlugs }` |
| PUT | `/api/staff/cover` | cookie + Origin | body `{ slug, coverImagePath, version }` |

No existe `PATCH /model/:id`.

---

## Scripts admin

```bash
npm run print:order           # orden efectivo Home (seed)
npm run seed:overrides:dry    # ver seed sin escribir
npm run seed:overrides        # requiere DATABASE_URL
npm run catalog:sync:dry
npm run catalog:sync
npm run staff:create -- --username ana --password '********' --name 'Ana'
npm test
```

### Añadir una chica nueva

1. Añadir ficha + fotos en el repo web (`data/models.json`, `public/chicas/...`)  
2. Deploy web normal  
3. `cd panel && npm run catalog:snapshot`  
4. `npm run catalog:sync` → crea override al **final** del orden, portada = `coverImageUrl`  
5. No borra overrides de inactivas  
6. Las encargadas pueden reordenar / elegir ★  

### Añadir fotografías nuevas

1. Añadir archivos + entradas en `images[]` del `models.json` canónico  
2. `npm run catalog:snapshot` (+ deploy panel si aplica)  
3. **No** hace falta tocar la DB: `allowedCoverPaths` = `coverImageUrl ∪ images[]` del snapshot  
4. Ya aparecen como candidatas ★ en `/api/staff/catalog`  

### Desactivar (`active: false`)

- Desaparece del panel y del GET público  
- El override **permanece** con `display_order = NULL`  
- Audit intacto  
- Activas restantes se renumeran `1…N` (orden relativo conservado)  
- `order_version` sube → un PUT de orden antiguo recibe `409` (obligar a refrescar)  

### Reactivar (`active: true` de nuevo)

- Vuelve a aparecer **al FINAL** del orden activo  
- **No** recupera posición antigua  
- No desplaza el resto salvo el append al final + renumeración  

---

## Seguridad

- Passwords: bcrypt  
- Sesión: token opaco, solo hash en DB, cookie `HttpOnly` (+ `Secure` en prod), `SameSite=Lax`  
- Writes: Origin debe ser `PANEL_ORIGIN`  
- Rate limit login/writes en Postgres  
- Schemas Zod `.strict()`  
- Cover: path ∈ allowlist de esa ficha  
- Order: set activo exacto, atómico, `409` si `order_version` no coincide  
- Cover: `409` si `cover_version` no coincide  
- `audit_log` append-only desde la app  

---

## Fase 4 — avisos (NO implementado)

### Conexión web

`www` solo hará GET a  
`https://panel.valeriaferrer.com/api/public/overrides`  
y mergeará con `models.json` (fallback si falla).

### `modelGridImage.ts`

Hoy, covers genéricos `portada.jpg` mapean a `cover-thumbnail.jpg`.  
Si el override apunta a `gallery/07.jpg`, **no** debe forzarse `cover-thumbnail.jpg` (miniatura antigua).  
Usar thumbnail de galería (`getGalleryImageThumbnail`) o la imagen completa.  
Documentado aquí; **no tocado en Fase 2**.

### Informe orden (antes de conectar)

| Vista | Hoy | Tras Fase 4 con seed |
|-------|-----|----------------------|
| Home | `pinOrder` + resto | = seed (igual que Home hoy) |
| `/models` | orden array activo JSON | pasará a = Home (cambia respecto a hoy) |
| Hubs orden general | JSON | = display_order |
| FEATURED_SLUGS / VIP / novedades | propios | **sin cambio** |

---

## Deploy Vercel (Fase 2 — solo API)

Root Directory: `panel`

`vercel.json` fija:
- `framework: null` (no preset estático)
- `outputDirectory: null` (no exige `public/` ni `dist/`)
- `buildCommand`: snapshot + check + typecheck
- función `api/index.ts` + rewrite `/(.*)` → `/api`

### Ajustes manuales en Project Settings → Build & Output Settings

Si el dashboard aún tiene valores por defecto, **Override** y deja:

| Campo | Valor |
|--------|--------|
| Framework Preset | **Other** |
| Build Command | *(usar vercel.json — o el mismo `npm run build`)* |
| Output Directory | **vacío** (Override ON, campo en blanco). **No** `public` |
| Install Command | `npm install` |

Sin esto, Vercel puede seguir buscando `public/` aunque el build de TypeScript pase.

Cuando apruebes:

1. Vercel → proyecto **panel** → Storage → crear **Neon** (Marketplace) exclusivo VF  
2. Copiar `DATABASE_URL` solo a env del proyecto panel (Preview + Production)  
3. Añadir también `SESSION_SECRET`, `PANEL_ORIGIN`, `PUBLIC_WEB_ORIGINS`  
4. Aplicar migración: `psql $DATABASE_URL -f db/migrations/0001_init.sql`  
   (o script migrate cuando lo añadamos)  
5. `npm run seed:overrides`  
6. `npm run staff:create -- ...`  
7. Tests de humo contra staging  

**No ejecutar esto hasta confirmación explícita.**

---

## Variables (nombres)

Ver `.env.example`: `DATABASE_URL`, `SESSION_SECRET`, `STAFF_COOKIE_NAME`, `STAFF_SESSION_TTL_HOURS`, `PANEL_ORIGIN`, `PUBLIC_WEB_ORIGINS`.

Nunca `VITE_*` con secretos.
