import assert from 'node:assert/strict'
import test from 'node:test'
import { applyCatalogOverrides } from './catalogOverrides.ts'

const primary = '/chicas/susi-model-agency-valencia-vf/portada.jpg'
const gallery1 = '/chicas/susi-model-agency-valencia-vf/gallery/01.jpg'
const gallery2 = '/chicas/susi-model-agency-valencia-vf/gallery/02.jpg'

test('portada elegida en panel se refleja en inicio y galería, incluso si la versión estática cambió', () => {
  const original = [{
    slug: 'susi',
    coverImageUrl: primary,
    image: primary,
    images: [gallery1, gallery2],
    gallery: [gallery1, gallery2],
    hoverImage: gallery1,
  }]
  const result = applyCatalogOverrides(original, [{
    slug: 'susi',
    displayOrder: 1,
    coverImagePath: gallery2,
    galleryImagePaths: [gallery1, primary],
  }])
  assert.equal(result[0]?.coverImageUrl, gallery2)
  assert.equal(result[0]?.image, gallery2)
  assert.equal(result[0]?.hoverImage, gallery1)
  assert.deepEqual(result[0]?.images, [gallery1, primary])
  assert.deepEqual(result[0]?.gallery, [gallery1, primary])
  // No alterar los datos de origen para la siguiente actualización.
  assert.equal(original[0]?.image, primary)
  assert.deepEqual(original[0]?.images, [gallery1, gallery2])
})

test('sustituir portada no altera el orden de perfiles del panel ni las otras fichas', () => {
  const originals = [
    { slug: 'ana', image: '/chicas/ana/portada.jpg', images: ['/chicas/ana/1.jpg'] },
    { slug: 'susi', image: primary, images: [gallery1] },
  ]
  const changed = applyCatalogOverrides(originals, [
    { slug: 'susi', displayOrder: 1, coverImagePath: gallery1 },
    { slug: 'ana', displayOrder: 2, coverImagePath: '/chicas/ana/portada.jpg' },
  ])
  assert.deepEqual(changed.map(m => m.slug), ['susi', 'ana'])
  assert.equal(changed[0]?.image, gallery1)
  assert.equal(changed[1]?.image, '/chicas/ana/portada.jpg')
})

test('ignora portada histórica obsoleta y nunca utiliza rutas ajenas a imágenes locales', () => {
  const model = [{ slug: 'sofia1', image: '/chicas/sofia1/portada.jpg' }]
  const old = applyCatalogOverrides(model, [{
    slug: 'sofia', displayOrder: 1,
    coverImagePath: '/chicas/sofia-valeria-ferrer-model-agency-valencia/portada.jpg',
  }])
  assert.equal(old[0]?.image, model[0]?.image)
  const invalid = applyCatalogOverrides(model, [{
    slug: 'sofia1', displayOrder: 1,
    coverImagePath: 'https://external.example/foto.jpg',
  }])
  assert.equal(invalid[0]?.image, model[0]?.image)
})

test('si la portada del panel tiene cuño horneado, usa la portada limpia del catálogo', () => {
  // luna nueva-09 is in firma-skip-stamped.json (baked); portada-nov2026 is clean.
  const stampedGallery = '/chicas/luna-model-agency-valencia-vf/gallery/nueva-09.jpg'
  const cleanCover = '/chicas/luna-model-agency-valencia-vf/portada-nov2026.jpg'
  const gallery = [
    '/chicas/luna-model-agency-valencia-vf/gallery/nueva-01.jpg',
    stampedGallery,
  ]
  const original = [{
    slug: 'luna',
    coverImageUrl: cleanCover,
    image: cleanCover,
    images: gallery,
    gallery,
  }]
  const result = applyCatalogOverrides(original, [{
    slug: 'luna',
    displayOrder: 1,
    coverImagePath: stampedGallery,
    galleryImagePaths: gallery,
  }])
  assert.equal(result[0]?.coverImageUrl, cleanCover)
  assert.equal(result[0]?.image, cleanCover)
  assert.deepEqual(result[0]?.images, gallery)
})

test('oculta slugs retirados sin afectar a las portadas de modelos visibles', () => {
  const list = [
    { slug: 'susi', image: primary },
    { slug: 'ana', image: '/chicas/ana/portada.jpg' },
  ]
  const got = applyCatalogOverrides(list, [
    { slug: 'susi', displayOrder: 1, coverImagePath: gallery1 },
    { slug: 'ana', displayOrder: 2, coverImagePath: '/chicas/ana/portada.jpg' },
  ], ['ana'])
  assert.deepEqual(got.map(m => m.slug), ['susi'])
  assert.equal(got[0]?.image, gallery1)
})
