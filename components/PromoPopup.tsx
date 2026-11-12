import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, MessageCircle, Phone, Send, X } from 'lucide-react'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact'

import { halloweenIsLive } from './HalloweenCampaign'
import { isPromoLive, type PromoPopupConfig } from '../lib/promoPopupConfig'
import {
  getCachedPromotions,
  startPromotionWatcher,
  subscribePromotions,
} from '../lib/webPromotionRemote'

type PromoView = 'hidden' | 'popup' | 'banner'

const PromoPopup: React.FC = () => {
  const { pathname } = useLocation()
  // Keep profile photographs unobstructed by the pink promotional banner/popup.
  // Promotion remains available elsewhere on the site.
  const hideOnProfile = /^\/models\/[^/]+\/?$/.test(pathname)
  const [promos, setPromos] = useState<PromoPopupConfig[]>(() => getCachedPromotions())
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null)
  const livePromos = promos.filter((item) => isPromoLive(item))
  const promo = livePromos.find(item => item.id === selectedPromoId) ?? livePromos[0] ?? null
  const promoWhatsAppUrl = officialWhatsAppUrlWithText(
    promo?.kind === 'cash5' ? 'Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.'
      : promo?.kind === 'copas' ? 'Hola, quiero información sobre la copa de invitación.'
      : promo?.kind === 'duples' ? 'Hola, quiero información sobre la oferta Dúplex.'
      : 'Hola, quiero información sobre la promoción de salidas.'
  )
  const [view, setView] = useState<PromoView>('hidden')
  const [contactOpen, setContactOpen] = useState(false)
  const campaignKey = livePromos.map((item) => item.id).join('|')
  // Respect the visitor's X until the active campaign changes, including
  // refreshes of the remote promotion and navigation between pages.
  const minimizedCampaigns = useRef(new Set<string>())

  useEffect(() => startPromotionWatcher(), [])

  useEffect(() => subscribePromotions(setPromos), [])

  const syncVisibility = useCallback(() => {
    // Happy Hour (novedad Halloween) has the screen until 2 Nov.
    if (hideOnProfile || halloweenIsLive() || !isPromoLive(promo)) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    // Show the full promotion by default. Only the visitor's X minimizes it
    // to the small banner; polling and tab visibility must not reopen it.
    setView(minimizedCampaigns.current.has(campaignKey) ? 'banner' : 'popup')
  }, [promo, hideOnProfile, campaignKey])

  const minimizePromo = useCallback(() => {
    setContactOpen(false)
    if (!isPromoLive(promo)) {
      setView('hidden')
      return
    }
    minimizedCampaigns.current.add(campaignKey)
    setView('banner')
  }, [promo, campaignKey])

  const reopenPopup = useCallback((id?: string) => {
    const chosen = livePromos.find(item => item.id === id) ?? promo
    if (!isPromoLive(chosen)) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    setSelectedPromoId(chosen!.id)
    minimizedCampaigns.current.delete(campaignKey)
    setContactOpen(false)
    setView('popup')
  }, [promo, livePromos, campaignKey])

  const openContact = useCallback(() => {
    if (!isPromoLive(promo) || view !== 'popup') return
    setContactOpen(true)
  }, [promo, view])

  const closeContact = useCallback(() => {
    setContactOpen(false)
  }, [])

  // A different promotion (Copas ↔ Dúplex, etc.) may open by default.
  useEffect(() => {
    setContactOpen(false)
    setView('hidden')
  }, [campaignKey])

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

  if (hideOnProfile || !promo || view === 'hidden') return null

  return (
    <>
      {view === 'banner' ? (
        <div className="promo-mini-banner fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] flex items-center justify-center gap-1 sm:gap-3 overflow-hidden border-b border-[#d946ef]/40 bg-[#1a0618]/95 px-2 py-2 text-center text-[10px] sm:text-xs tracking-[0.08em] text-[#f5d0fe] backdrop-blur-md">
          {livePromos.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => reopenPopup(item.id)}
              className="relative z-[1] flex-1 sm:flex-none min-w-0 max-w-[580px] rounded-lg border border-[#f1d28a]/20 px-3 py-1.5 text-[#f5d0fe] hover:border-[#f1d28a]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d28a]"
              aria-label={`Ver promoción ${item.kind}`}
            >
              <span className="block truncate">{item.bannerText}</span>
            </button>
          ))}
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
        </div>
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
            {livePromos.length > 1 ? (
              <div className="mb-3 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Promociones activas">
                {livePromos.map(item => (
                  <button key={item.id} type="button" role="tab"
                    aria-selected={promo.id === item.id}
                    onClick={() => { setSelectedPromoId(item.id); setContactOpen(false) }}
                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1d28a] ${promo.id === item.id ? 'bg-[#f1d28a] text-[#211408]' : 'border border-[#f1d28a]/40 bg-black/80 text-white hover:bg-white/10'}`}>
                    {item.kind === 'cash5' ? '−5 € efectivo' : item.kind === 'salidas' ? 'Salidas' : item.kind === 'duples' ? 'Dúplex' : 'Copas'}
                  </button>
                ))}
              </div>
            ) : null}
            <h2 id="promo-popup-title" className="sr-only">
              Oferta especial Valeria Ferrer
            </h2>

            <div className="overflow-hidden rounded-lg shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <img
                src={promo.image}
                alt={promo.kind === 'cash5' ? "Promoción 5 euros menos únicamente al pagar en efectivo" : promo.kind === 'salidas' ? "Promoción salidas Valeria Ferrer. 1 hora 180 euros." : promo.kind === 'copas' ? "Copa de invitación Valeria Ferrer" : "Promoción Dúplex Valeria Ferrer"}
                className="block h-auto w-full max-h-[68dvh] object-contain bg-black sm:max-h-[76dvh]"
                width={promo.imageWidth}
                height={promo.imageHeight}
                decoding="async"
                fetchPriority="high"
              />
              <button
                type="button"
                onClick={openContact}
                className="block w-full bg-gradient-to-r from-[#b7873d] via-[#f1d28a] to-[#b7873d] px-3 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#231506] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d28a]"
              >
                Contactar
              </button>
            </div>
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
                href={promoWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="promo_popup"
                className="flex items-center justify-between w-full bg-[#25d366] text-[#07230f] py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#41e17b] transition-colors"
              >
                <span className="flex items-center">
                  <MessageCircle size={15} className="mr-3" />
                  WhatsApp
                </span>
                <span className="text-[10px] font-medium tracking-normal">{OFFICIAL_PHONE_LABEL}</span>
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
