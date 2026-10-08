/**
 * Unified contact conversion tracking for Vercel Analytics.
 * Pure helpers + trackContactClick — UI mounts ContactClickTracker globally.
 */

export type ContactChannel = 'telegram' | 'phone' | 'whatsapp'

export type ContactPlacement =
  | 'detail_sticky'
  | 'detail_sidebar'
  | 'floating'
  | 'navbar'
  | 'footer'
  | 'home_banner'
  | 'booking'
  | 'contact_page'
  | 'promo_popup'
  | 'casting'
  | 'seo_landing'

export type ContactClickPayload = {
  model_slug: string | null
  channel: ContactChannel
  placement: ContactPlacement
  page: string
}

export const CONTACT_EVENT = 'contact_click' as const

const PLACEMENTS = new Set<string>([
  'detail_sticky',
  'detail_sidebar',
  'floating',
  'navbar',
  'footer',
  'home_banner',
  'booking',
  'contact_page',
  'promo_popup',
  'casting',
  'seo_landing',
])

/** Non-functional / placeholder contact hrefs must not fire analytics. */
export function isUntrackableContactHref(href: string): boolean {
  const h = (href || '').trim()
  if (!h) return true
  if (/x{4,}/i.test(h)) return true
  if (/placeholder/i.test(h)) return true
  if (/phone=\+?34x+/i.test(h)) return true
  return false
}

export function detectContactChannel(href: string): ContactChannel | null {
  const h = (href || '').trim()
  if (!h || isUntrackableContactHref(h)) return null
  if (h.includes('t.me') || /telegram/i.test(h)) return 'telegram'
  if (h.includes('wa.me') || h.includes('api.whatsapp.com') || /whatsapp/i.test(h)) {
    return 'whatsapp'
  }
  if (h.startsWith('tel:')) return 'phone'
  return null
}

export function modelSlugFromPath(pathname: string): string | null {
  const m = (pathname || '').match(/^\/models\/([^/?#]+)\/?$/)
  if (!m) return null
  try {
    return decodeURIComponent(m[1])
  } catch {
    return m[1]
  }
}

export function parseContactPlacement(value: string | null | undefined): ContactPlacement | null {
  if (!value) return null
  return PLACEMENTS.has(value) ? (value as ContactPlacement) : null
}

type TrackFn = (event: string, data?: Record<string, unknown>) => void

let trackImpl: TrackFn | null = null

/** Injected in browser via ContactClickTracker; tests inject a mock. */
export function setContactTrackImpl(fn: TrackFn | null): void {
  trackImpl = fn
}

/**
 * Fire a single contact_click. Call from capture-phase listeners / before window.open
 * so the event is queued before tel: / external navigation proceeds.
 */
export function trackContactClick(payload: ContactClickPayload): void {
  const data = {
    model_slug: payload.model_slug,
    channel: payload.channel,
    placement: payload.placement,
    page: payload.page,
  }

  if (!trackImpl) return
  try {
    trackImpl(CONTACT_EVENT, data)
  } catch {
    /* ignore analytics failures */
  }
}

export type ResolvedContactClick = ContactClickPayload & { href: string }

/**
 * Resolve a click on an anchor into a contact payload, or null if not a tracked contact.
 */
export function resolveContactClickFromAnchor(
  anchor: Pick<HTMLAnchorElement, 'getAttribute'> & {
    closest?: (selector: string) => Element | null
  },
  pathname: string
): ResolvedContactClick | null {
  const href = anchor.getAttribute('href') || ''
  const channel = detectContactChannel(href)
  if (!channel) return null

  const placementAttr =
    anchor.getAttribute('data-contact-placement') ||
    (typeof anchor.closest === 'function'
      ? anchor.closest('[data-contact-placement]')?.getAttribute('data-contact-placement')
      : null)
  const placement = parseContactPlacement(placementAttr)
  if (!placement) return null

  const slugAttr =
    anchor.getAttribute('data-model-slug') ||
    (typeof anchor.closest === 'function'
      ? anchor.closest('[data-model-slug]')?.getAttribute('data-model-slug')
      : null)

  const model_slug =
    (slugAttr && slugAttr.trim()) ||
    (placement === 'detail_sticky' || placement === 'detail_sidebar'
      ? modelSlugFromPath(pathname)
      : null) ||
    null

  return {
    href,
    model_slug: model_slug || null,
    channel,
    placement,
    page: pathname || '/',
  }
}

/** Document click handler (capture). Returns true if an event was tracked. */
export function handleDocumentContactClick(
  event: MouseEvent,
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
): boolean {
  const target = event.target
  if (!(target instanceof Element)) return false
  const anchor = target.closest('a')
  if (!anchor) return false
  // Already handled explicitly in the same tick (e.g. programmatic + synthetic).
  if (anchor.getAttribute('data-contact-tracked') === 'pending') return false

  const resolved = resolveContactClickFromAnchor(anchor, pathname)
  if (!resolved) return false

  trackContactClick({
    model_slug: resolved.model_slug,
    channel: resolved.channel,
    placement: resolved.placement,
    page: resolved.page,
  })
  return true
}
