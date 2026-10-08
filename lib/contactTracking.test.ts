import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CONTACT_EVENT,
  detectContactChannel,
  isUntrackableContactHref,
  modelSlugFromPath,
  resolveContactClickFromAnchor,
  setContactTrackImpl,
  trackContactClick,
} from './contactTracking.ts'

type TrackCall = { event: string; data?: Record<string, unknown> }

function withMockTrack(fn: (calls: TrackCall[]) => void): void {
  const calls: TrackCall[] = []
  setContactTrackImpl((event, data) => {
    calls.push({ event, data })
  })
  try {
    fn(calls)
  } finally {
    setContactTrackImpl(null)
  }
}

function fakeAnchor(attrs: Record<string, string | null>) {
  return {
    getAttribute: (name: string) => (name in attrs ? attrs[name] : null),
    closest: (_selector: string) => null as Element | null,
  }
}

test('detectContactChannel: telegram / phone / whatsapp', () => {
  assert.equal(detectContactChannel('https://t.me/Valeriaferreeer'), 'telegram')
  assert.equal(detectContactChannel('tel:645872227'), 'phone')
  assert.equal(detectContactChannel('https://wa.me/34687410110'), 'whatsapp')
  assert.equal(
    detectContactChannel('https://api.whatsapp.com/send?phone=34645872227'),
    'whatsapp'
  )
})

test('isUntrackableContactHref: QuickView placeholder skipped', () => {
  const href =
    'https://api.whatsapp.com/send?phone=+34XXXXXXXXXX&text=Hola'
  assert.equal(isUntrackableContactHref(href), true)
  assert.equal(detectContactChannel(href), null)
})

test('modelSlugFromPath', () => {
  assert.equal(modelSlugFromPath('/models/carolina2-model-agency-valencia-vf'), 'carolina2-model-agency-valencia-vf')
  assert.equal(modelSlugFromPath('/models/foo/'), 'foo')
  assert.equal(modelSlugFromPath('/booking'), null)
  assert.equal(modelSlugFromPath('/'), null)
})

test('Home Telegram → 1 event (home_banner)', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer',
        'data-contact-placement': 'home_banner',
      }),
      '/'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.deepEqual(calls[0], {
      event: CONTACT_EVENT,
      data: {
        model_slug: null,
        channel: 'telegram',
        placement: 'home_banner',
        page: '/',
      },
    })
  })
})

test('Navbar tel → 1 event', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'tel:645872227',
        'data-contact-placement': 'navbar',
      }),
      '/'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.channel, 'phone')
    assert.equal(calls[0].data?.placement, 'navbar')
  })
})

test('Floating Telegram → 1 event', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer',
        'data-contact-placement': 'floating',
      }),
      '/models'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.placement, 'floating')
    assert.equal(calls[0].data?.channel, 'telegram')
  })
})

test('Detail sticky → includes model_slug', () => {
  withMockTrack((calls) => {
    const slug = 'carolina2-model-agency-valencia-vf'
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer?text=Hola',
        'data-contact-placement': 'detail_sticky',
        'data-model-slug': slug,
      }),
      `/models/${slug}`
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.model_slug, slug)
    assert.equal(calls[0].data?.placement, 'detail_sticky')
    assert.equal(calls[0].data?.channel, 'telegram')
  })
})

test('Detail sticky falls back to path slug when attr missing', () => {
  const slug = 'martina-model-agency-valencia-vf'
  const resolved = resolveContactClickFromAnchor(
    fakeAnchor({
      href: 'tel:645872227',
      'data-contact-placement': 'detail_sticky',
    }),
    `/models/${slug}`
  )
  assert.ok(resolved)
  assert.equal(resolved.model_slug, slug)
})

test('Booking submit → 1 event before Telegram open', () => {
  withMockTrack((calls) => {
    trackContactClick({
      model_slug: null,
      channel: 'telegram',
      placement: 'booking',
      page: '/booking',
    })
    assert.equal(calls.length, 1)
    assert.deepEqual(calls[0].data, {
      model_slug: null,
      channel: 'telegram',
      placement: 'booking',
      page: '/booking',
    })
  })
})

test('Contact WhatsApp → 1 event', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://wa.me/34687410110',
        'data-contact-placement': 'contact_page',
      }),
      '/contact'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.channel, 'whatsapp')
    assert.equal(calls[0].data?.placement, 'contact_page')
  })
})

test('Casting WhatsApp → 1 event', () => {
  withMockTrack((calls) => {
    trackContactClick({
      model_slug: null,
      channel: 'whatsapp',
      placement: 'casting',
      page: '/casting',
    })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.channel, 'whatsapp')
    assert.equal(calls[0].data?.placement, 'casting')
  })
})

test('Footer → 1 event', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer',
        'data-contact-placement': 'footer',
      }),
      '/models'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.placement, 'footer')
  })
})

test('Promo popup CTAs use promo_popup placement (no double local track)', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'tel:645872227',
        'data-contact-placement': 'promo_popup',
      }),
      '/'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.placement, 'promo_popup')
  })
})

test('SEO landing Telegram → seo_landing', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer',
        'data-contact-placement': 'seo_landing',
      }),
      '/escorts-de-lujo-valencia'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].data?.placement, 'seo_landing')
    assert.equal(calls[0].data?.channel, 'telegram')
    assert.equal(calls[0].data?.model_slug, null)
  })
})

test('Anchor without placement → no event', () => {
  const resolved = resolveContactClickFromAnchor(
    fakeAnchor({ href: 'https://t.me/Valeriaferreeer' }),
    '/'
  )
  assert.equal(resolved, null)
})

test('ningún click produce dos contact_click (single fire)', () => {
  withMockTrack((calls) => {
    const resolved = resolveContactClickFromAnchor(
      fakeAnchor({
        href: 'https://t.me/Valeriaferreeer',
        'data-contact-placement': 'navbar',
      }),
      '/'
    )
    assert.ok(resolved)
    trackContactClick(resolved)
    assert.equal(calls.length, 1)
    assert.equal(calls.filter((c) => c.event === CONTACT_EVENT).length, 1)
  })
})

test('QuickView placeholder resolves to null (out of tracking)', () => {
  const resolved = resolveContactClickFromAnchor(
    fakeAnchor({
      href: 'https://api.whatsapp.com/send?phone=+34XXXXXXXXXX&text=Hola',
      'data-contact-placement': 'detail_sidebar',
    }),
    '/models/foo'
  )
  assert.equal(resolved, null)
})
