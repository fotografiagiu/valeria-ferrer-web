import {
  resolvePromoFromRemote,
  type PromoPopupConfig,
  type RemotePromotionPayload,
} from './promoPopupConfig'

export const PRODUCTION_PROMOTION_URL =
  'https://valeria-ferrer-panel.vercel.app/api/public/promotion'

export function resolvePublicPromotionUrl(): string {
  const fromEnv =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUBLIC_PROMOTION_URL
      ? String(import.meta.env.VITE_PUBLIC_PROMOTION_URL).trim()
      : ''
  if (fromEnv) return fromEnv
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return PRODUCTION_PROMOTION_URL
  }
  if (typeof window !== 'undefined') return '/api/public/promotion'
  return PRODUCTION_PROMOTION_URL
}

function isValidPayload(data: unknown): data is RemotePromotionPayload {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const row = data as RemotePromotionPayload
  if (typeof row.active !== 'boolean') return false
  if (row.activePromotion != null && typeof row.activePromotion !== 'string') return false
  return true
}

/** Fail-safe: network/API errors → no promo (Novedades can show). */
export async function fetchRemotePromotion(
  fetchImpl: typeof fetch = fetch
): Promise<PromoPopupConfig | null> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 4000)
    try {
      const res = await fetchImpl(resolvePublicPromotionUrl(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      })
      if (!res.ok) return null
      const raw: unknown = await res.json()
      if (!isValidPayload(raw)) return null
      return resolvePromoFromRemote(raw)
    } finally {
      window.clearTimeout(timer)
    }
  } catch {
    return null
  }
}

export type PromotionListener = (promo: PromoPopupConfig | null) => void

let cached: PromoPopupConfig | null = null
let inFlight: Promise<PromoPopupConfig | null> | null = null
const listeners = new Set<PromotionListener>()

export function getCachedPromotion(): PromoPopupConfig | null {
  return cached
}

export function subscribePromotion(listener: PromotionListener): () => void {
  listeners.add(listener)
  listener(cached)
  return () => {
    listeners.delete(listener)
  }
}

function emit(next: PromoPopupConfig | null) {
  cached = next
  for (const listener of listeners) listener(next)
}

export async function refreshRemotePromotion(force = false): Promise<PromoPopupConfig | null> {
  if (inFlight && !force) return inFlight
  inFlight = fetchRemotePromotion()
    .then((promo) => {
      emit(promo)
      return promo
    })
    .finally(() => {
      inFlight = null
    })
  return inFlight
}

const POLL_MS = 45_000

let watcherCount = 0
let stopWatcher: (() => void) | null = null

function ensureWatcherRunning(): void {
  if (watcherCount > 0) return

  void refreshRemotePromotion(true)

  const onVisible = () => {
    if (document.visibilityState === 'visible') void refreshRemotePromotion(true)
  }
  const onFocus = () => {
    void refreshRemotePromotion(true)
  }
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('focus', onFocus)

  const poll = window.setInterval(() => {
    void refreshRemotePromotion(false)
  }, POLL_MS)

  let expiryTimer = 0
  const armExpiry = (promo: PromoPopupConfig | null) => {
    if (expiryTimer) window.clearTimeout(expiryTimer)
    expiryTimer = 0
    if (!promo?.endsAt) return
    const ms = Date.parse(promo.endsAt) - Date.now()
    if (!Number.isFinite(ms) || ms <= 0) {
      emit(null)
      return
    }
    expiryTimer = window.setTimeout(() => {
      emit(null)
      void refreshRemotePromotion(true)
    }, Math.min(ms + 200, 2_147_000_000))
  }
  armExpiry(cached)
  const unsub = subscribePromotion(armExpiry)

  stopWatcher = () => {
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('focus', onFocus)
    window.clearInterval(poll)
    if (expiryTimer) window.clearTimeout(expiryTimer)
    unsub()
    stopWatcher = null
  }
}

/** Boot + visibility + soft poll. Shared singleton; ref-counted. */
export function startPromotionWatcher(): () => void {
  ensureWatcherRunning()
  watcherCount += 1
  return () => {
    watcherCount = Math.max(0, watcherCount - 1)
    if (watcherCount === 0 && stopWatcher) stopWatcher()
  }
}
