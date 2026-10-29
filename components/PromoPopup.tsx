import React, { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Phone, Send, X } from 'lucide-react'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
} from '../lib/officialContact'
import { halloweenIsLive } from './HalloweenCampaign'
import { isPromoLive, type PromoPopupConfig } from '../lib/promoPopupConfig'
import {
  getCachedPromotion,
  startPromotionWatcher,
  subscribePromotion,
} from '../lib/webPromotionRemote'

type PromoView = 'hidden' | 'popup' | 'banner'

const PromoPopup: React.FC = () => {
  const [promo, setPromo] = useState<PromoPopupConfig | null>(() => getCachedPromotion())
  const [view, setView] = useState<PromoView>('hidden')
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => startPromotionWatcher(), [])

  useEffect(() => subscribePromotion(setPromo), [])

  const syncVisibility = useCallback(() => {
    // Happy Hour (novedad Halloween) has the screen until 2 Nov.
    if (halloweenIsLive() || !isPromoLive(promo)) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    // Always reopen the large popup on a fresh page load / new promo id.
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

  // Reset minimize state when the remote promo identity changes (Copas ↔ Duples).
  useEffect(() => {
    setContactOpen(false)
    setView('hidden')
  }, [promo?.id])

  useEffect(() => {
    syncVisibility()

    if (!promo) return

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
  }, [promo, syncVisibility])

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

  if (!promo || view === 'hidden') return null

  return (
    <>
      {view === 'banner' ? (
        <button
          type="button"
          onClick={reopenPopup}
          className="promo-mini-banner fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] flex items-center justify-center gap-2 overflow-hidden border-b border-[#d946ef]/40 bg-[#1a0618]/92 px-3 py-2.5 text-center text-[11px] sm:text-xs tracking-[0.14em] text-[#f5d0fe] backdrop-blur-md hover:bg-[#2a0a24] hover:text-white transition-colors"
        >
          <span className="relative z-[1]">{promo.bannerText}</span>
          <style>{`
            @keyframes promo-banner-shimmer {
              0% { transform: translateX(-120%); opacity: 0; }
              18% { opacity: 0.85; }
              42% { opacity: 0.55; }
              70% { transform: translateX(120%); opacity: 0; }
              100% { transform: translateX(120%); opacity: 0; }
            }
            @keyframes promo-banner-glow {
              0%, 100% { box-shadow: inset 0 0 0 0 rgba(217, 70, 239, 0); }
              35% { box-shadow: inset 0 0 28px 0 rgba(217, 70, 239, 0.28); }
            }
            .promo-mini-banner {
              animation: promo-banner-glow 2.8s ease-in-out infinite;
            }
            .promo-mini-banner::before {
              content: '';
              position: absolute;
              inset: 0;
              width: 42%;
              background: linear-gradient(
                105deg,
                transparent 0%,
                rgba(244, 114, 182, 0.08) 28%,
                rgba(232, 121, 249, 0.55) 50%,
                rgba(244, 114, 182, 0.08) 72%,
                transparent 100%
              );
              animation: promo-banner-shimmer 3.4s ease-in-out infinite;
              pointer-events: none;
            }
            @media (prefers-reduced-motion: reduce) {
              .promo-mini-banner,
              .promo-mini-banner::before {
                animation: none;
              }
            }
          `}</style>
        </button>
      ) : null}

      {view === 'popup' ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-3 pt-24 sm:p-6 sm:pt-24"
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

          <button
            type="button"
            onClick={minimizePromo}
            aria-label="Cerrar oferta y continuar viendo los perfiles"
            style={{ top: 'max(12px, env(safe-area-inset-top))' }}
            className="fixed right-3 z-30 inline-flex min-h-[64px] items-center gap-2 rounded-2xl border-[3px] border-white bg-[#f8d88c] px-3 py-2 text-[#1a1209] shadow-[0_8px_34px_rgba(0,0,0,.85)] transition hover:bg-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:px-5"
          >
            <ArrowRight size={22} strokeWidth={3} aria-hidden="true" className="shrink-0 motion-safe:animate-pulse" />
            <span className="text-left text-[13px] font-black uppercase leading-tight tracking-[0.02em]">
              <span className="block">Cerrar aquí</span>
              <span className="block text-[10px] sm:text-xs">para ver los perfiles</span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17110d] text-white" aria-hidden="true">
              <X size={28} strokeWidth={3} />
            </span>
          </button>

          <div className="relative z-10 w-full max-w-[920px]">
            <h2 id="promo-popup-title" className="sr-only">
              Oferta especial Valeria Ferrer
            </h2>


            <button
              type="button"
              onClick={openContact}
              className="block w-full overflow-hidden rounded-lg shadow-[0_20px_80px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2b2a3]"
              aria-label="Reserva ahora"
            >
              <img
                src={promo.image}
                alt="Oferta especial Valeria Ferrer. Reserva ahora."
                className="block h-auto w-full max-h-[68dvh] object-contain bg-black sm:max-h-[76dvh]"
                width={promo.imageWidth}
                height={promo.imageHeight}
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
                data-contact-placement="promo_popup"
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
                data-contact-placement="promo_popup"
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
