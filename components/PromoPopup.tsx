import React, { useCallback, useEffect, useState } from 'react'
import { Phone, Send, X } from 'lucide-react'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
} from '../lib/officialContact'
import {
  ACTIVE_PROMO,
  isPromoLive,
  type PromoPopupConfig,
} from '../lib/promoPopupConfig'

type PromoView = 'hidden' | 'popup' | 'banner'

const PromoPopup: React.FC<{ promo?: PromoPopupConfig }> = ({ promo = ACTIVE_PROMO }) => {
  const [view, setView] = useState<PromoView>('hidden')
  const [contactOpen, setContactOpen] = useState(false)

  const syncVisibility = useCallback(() => {
    if (!isPromoLive(promo)) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    // Always reopen the large popup on a fresh page load.
    // Minimize only lives in memory until the next navigation/reload.
    setView((current) => (current === 'banner' ? 'banner' : 'popup'))
  }, [promo])

  const minimizePromo = useCallback(() => {
    setContactOpen(false)
    if (!isPromoLive(promo)) {
      setView('hidden')
      return
    }
    setView('banner')
  }, [promo])

  const reopenPopup = useCallback(() => {
    if (!isPromoLive(promo)) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    setView('popup')
  }, [promo])

  const openContact = useCallback(() => {
    if (!isPromoLive(promo) || view !== 'popup') return
    setContactOpen(true)
  }, [promo, view])

  const closeContact = useCallback(() => {
    setContactOpen(false)
  }, [])

  useEffect(() => {
    syncVisibility()

    const start = Date.parse(promo.startsAt)
    const end = Date.parse(promo.endsAt)
    const now = Date.now()
    const timers: number[] = []

    if (Number.isFinite(start) && now < start) {
      timers.push(window.setTimeout(syncVisibility, start - now))
    }
    if (Number.isFinite(end) && now < end) {
      timers.push(
        window.setTimeout(() => {
          setContactOpen(false)
          setView('hidden')
        }, end - now),
      )
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncVisibility()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [promo.endsAt, promo.startsAt, syncVisibility])

  useEffect(() => {
    if (view !== 'popup') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (contactOpen) {
        closeContact()
        return
      }
      minimizePromo()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [closeContact, contactOpen, minimizePromo, view])

  if (view === 'hidden') return null

  return (
    <>
      {view === 'banner' ? (
        <button
          type="button"
          onClick={reopenPopup}
          className="fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] flex items-center justify-center gap-2 border-b border-[#c2b2a3]/25 bg-black/85 px-3 py-2 text-center text-[11px] sm:text-xs tracking-[0.12em] text-[#c2b2a3] backdrop-blur-md hover:bg-black hover:text-white transition-colors"
        >
          <span>{promo.bannerText}</span>
        </button>
      ) : null}

      {view === 'popup' ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-popup-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80"
            aria-label="Cerrar promoción"
            onClick={minimizePromo}
          />

          <div className="relative z-10 w-full max-w-[920px]">
            <h2 id="promo-popup-title" className="sr-only">
              Oferta especial Valeria Ferrer
            </h2>
            <button
              type="button"
              onClick={minimizePromo}
              className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 hover:bg-black hover:text-[#c2b2a3] transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={openContact}
              className="block w-full overflow-hidden rounded-lg shadow-[0_20px_80px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2b2a3]"
              aria-label="Reserva ahora"
            >
              <img
                src={promo.image}
                alt="Oferta especial Valeria Ferrer. Reserva ahora."
                className="block h-auto w-full max-h-[82dvh] object-contain bg-black"
                width={1024}
                height={576}
              />
              <span className="sr-only">Reserva ahora</span>
            </button>
          </div>
        </div>
      ) : null}

      {view === 'popup' && contactOpen ? (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-contact-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="Cerrar opciones de reserva"
            onClick={closeContact}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[#c2b2a3]/25 bg-[#111111]/95 p-5 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={closeContact}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Cerrar"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h3 id="promo-contact-title" className="pr-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#c2b2a3]">
              Reserva ahora
            </h3>
            <p className="mt-3 mb-5 text-[12px] leading-relaxed text-gray-300">
              Elige cómo quieres contactar.
            </p>
            <div className="space-y-3">
              <a
                href={OFFICIAL_PHONE_TEL}
                className="flex items-center justify-between w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center">
                  <Phone size={15} className="mr-3 text-[#c2b2a3]" />
                  Llamar ahora
                </span>
                <span className="text-[10px] font-medium tracking-normal text-gray-400">{OFFICIAL_PHONE_LABEL}</span>
              </a>
              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-[#c2b2a3] text-black py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white transition-colors"
              >
                <span className="flex items-center">
                  <Send size={15} className="mr-3" />
                  Telegram
                </span>
                <span className="text-[10px] opacity-70">{OFFICIAL_TELEGRAM_HANDLE}</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default PromoPopup
