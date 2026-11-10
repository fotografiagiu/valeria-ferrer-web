import assert from 'node:assert/strict'
import test from 'node:test'
import {
  isPromoLive,
  resolvePromoFromRemote,
  type PromoPopupConfig,
} from './promoPopupConfig.ts'

const now = Date.parse('2026-09-23T12:00:00.000Z')

test('none / error payload → null promo', () => {
  assert.equal(resolvePromoFromRemote(null, now), null)
  assert.equal(resolvePromoFromRemote({ active: false, activePromotion: 'none' }, now), null)
})

test('copas live → promo config', () => {
  const promo = resolvePromoFromRemote(
    {
      active: true,
      activePromotion: 'copas',
      startsAt: '2026-09-23T11:00:00.000Z',
      endsAt: '2026-09-23T14:00:00.000Z',
      durationHours: 3,
      promoId: 'copas-1',
    },
    now
  )
  assert.ok(promo)
  assert.equal(promo.kind, 'copas')
  assert.equal(promo.image.includes('promo-copa'), true)
  assert.equal(isPromoLive(promo, now), true)
})

test('duples live → promo config', () => {
  const promo = resolvePromoFromRemote(
    {
      active: true,
      activePromotion: 'duples',
      startsAt: '2026-09-23T11:00:00.000Z',
      endsAt: '2026-09-23T12:30:00.000Z',
      durationHours: 1,
      promoId: 'duples-1',
    },
    now
  )
  assert.ok(promo)
  assert.equal(promo.kind, 'duples')
  assert.equal(promo.image.includes('promo-duplex-precios-oct2026'), true)
  assert.equal(promo.image.includes('promo-duo.webp'), false)
  assert.equal(isPromoLive(promo, now), true)
})

test('expired endsAt → null even if active:true (stale cache)', () => {
  const promo = resolvePromoFromRemote(
    {
      active: true,
      activePromotion: 'copas',
      startsAt: '2026-09-23T08:00:00.000Z',
      endsAt: '2026-09-23T11:00:00.000Z',
      promoId: 'stale',
    },
    now
  )
  assert.equal(promo, null)
})

test('isPromoLive hides expired mini-banner candidate', () => {
  const expired: PromoPopupConfig = {
    id: 'x',
    kind: 'copas',
    image: '/promos/promo-copa.webp',
    imageWidth: 1024,
    imageHeight: 576,
    startsAt: '2026-09-23T08:00:00.000Z',
    endsAt: '2026-09-23T11:00:00.000Z',
    enabled: true,
    ctaHref: '/booking',
    bannerText: 'x',
  }
  assert.equal(isPromoLive(expired, now), false)
})

test('salidas live → promo config', () => {
  const promo = resolvePromoFromRemote(
    {
      active: true,
      activePromotion: 'salidas',
      startsAt: '2026-09-23T11:00:00.000Z',
      endsAt: '2026-09-23T14:00:00.000Z',
      durationHours: 3,
      promoId: 'salidas-1',
    },
    now
  )
  assert.ok(promo)
  assert.equal(promo.kind, 'salidas')
  assert.equal(promo.image.includes('promo-salidas-premium-nov2026'), true)
  assert.equal(promo.imageWidth, 1024)
  assert.equal(promo.imageHeight, 438)
  assert.equal(isPromoLive(promo, now), true)
})

test('cash5 active: public creative is resolved; inactive and expired do not show', () => {
  const data = {
    active: true,
    activePromotion: 'cash5',
    startsAt: '2026-09-23T11:00:00.000Z',
    endsAt: '2026-09-23T14:00:00.000Z',
    durationHours: 3,
    promoId: 'cash5-one',
  }
  const promo = resolvePromoFromRemote(data, now)
  assert.ok(promo)
  assert.equal(promo.kind, 'cash5')
  assert.match(promo.image, /efectivo/)
  assert.equal(isPromoLive(promo, now), true)
  assert.equal(resolvePromoFromRemote({ ...data, active: false }, now), null)
  assert.equal(resolvePromoFromRemote(data, Date.parse('2026-09-23T14:00:00.000Z')), null)
})
