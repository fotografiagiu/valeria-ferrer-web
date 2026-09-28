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
    startsAt: '2026-09-23T08:00:00.000Z',
    endsAt: '2026-09-23T11:00:00.000Z',
    enabled: true,
    ctaHref: '/booking',
    bannerText: 'x',
  }
  assert.equal(isPromoLive(expired, now), false)
})
