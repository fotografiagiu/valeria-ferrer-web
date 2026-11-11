import {
  resolvePromosFromRemote,
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
export async function fetchRemotePromotions(
  fetchImpl: typeof fetch = fetch
): Promise<PromoPopupConfig[]> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 4000)
    try {
      // Avoid cache:'no-store' — it forces Cache-Control on the request and the
      // panel CORS Allow-Headers historically rejected that preflight.
      const res = await fetchImpl(resolvePublicPromotionUrl(), {
        method: 'GET',
        signal: controller.signal,
      })
      if (!res.ok) return []
      const raw: unknown = await res.json()
      if (!isValidPayload(raw)) return []
      return resolvePromosFromRemote(raw)
    } finally {
      window.clearTimeout(timer)
    }
  } catch {
    return []
  }
}

/** Legacy single-campaign consumer receives the first live one. */
export async function fetchRemotePromotion(fetchImpl: typeof fetch = fetch) {
  const all = await fetchRemotePromotions(fetchImpl)
  return all[0] ?? null
}

export type PromotionListener = (promo: PromoPopupConfig | null) => void

export type PromotionsListener = (promos: PromoPopupConfig[]) => void

let cached: PromoPopupConfig | null = null
let cachedPromotions: PromoPopupConfig[] = []
let inFlight: Promise<PromoPopupConfig | null> | null = null
const listeners = new Set<PromotionListener>()
const promotionsListeners = new Set<PromotionsListener>()

export function getCachedPromotions(): PromoPopupConfig[] {
  return cachedPromotions
}

export function subscribePromotions(listener: PromotionsListener): () => void {
  promotionsListeners.add(listener)
  listener(cachedPromotions)
  return () => { promotionsListeners.delete(listener) }
}

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

function emit(next: PromoPopupConfig[]) {
  cachedPromotions = next
  cached = next[0] ?? null
  for (const listener of listeners) listener(cached)
  for (const listener of promotionsListeners) listener(cachedPromotions)
}

export async function refreshRemotePromotion(force = false): Promise<PromoPopupConfig | null> {
  if (inFlight && !force) return inFlight
  inFlight = fetchRemotePromotions()
    .then((promos) => {
      emit(promos)
      return promos[0] ?? null
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
  const armExpiry = (promos: PromoPopupConfig[]) => {
    if (expiryTimer) window.clearTimeout(expiryTimer)
    expiryTimer = 0
    const nextExpiry = promos.map(p => Date.parse(p.endsAt))
      .filter(ms => Number.isFinite(ms) && ms > Date.now())
      .sort((a, b) => a - b)[0]
    if (!nextExpiry) return
    expiryTimer = window.setTimeout(() => {
      emit(cachedPromotions.filter(p => Date.parse(p.endsAt) > Date.now()))
      void refreshRemotePromotion(true)
    }, Math.min(nextExpiry - Date.now() + 200, 2_147_000_000))
  }
  armExpiry(cachedPromotions)
  const unsub = subscribePromotions(armExpiry)

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
