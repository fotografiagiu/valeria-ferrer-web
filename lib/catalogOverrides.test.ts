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
    images: [gallery1],
    gallery: [gallery1],
    hoverImage: gallery1,
  }]
  const result = applyCatalogOverrides(original, [{
    slug: 'susi',
    displayOrder: 1,
    coverImagePath: gallery2,
    galleryImagePaths: [primary, gallery1],
  }])
  assert.equal(result[0]?.coverImageUrl, gallery2)
  assert.equal(result[0]?.image, gallery2)
  assert.equal(result[0]?.hoverImage, primary)
  assert.deepEqual(result[0]?.images, [primary, gallery1])
  assert.deepEqual(result[0]?.gallery, [primary, gallery1])
  // No alterar los datos de origen para la siguiente actualización.
  assert.equal(original[0]?.image, primary)
  assert.deepEqual(original[0]?.images, [gallery1])
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
