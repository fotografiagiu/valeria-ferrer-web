import React, { useCallback, useEffect, useState } from 'react'
import { MessageCircle, Phone, Send, X } from 'lucide-react'
import { halloweenIsLive } from './HalloweenCampaign'
import { setHalloweenCashPopupOpen } from '../lib/halloweenCashGate'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact'
import { isPromoLive } from '../lib/promoPopupConfig'
import {
  getCachedPromotion,
  startPromotionWatcher,
  subscribePromotion,
} from '../lib/webPromotionRemote'

const IMAGE = '/promos/promo-halloween-happy-hour-oct2026.webp'
const WHATSAPP_URL = officialWhatsAppUrlWithText(
  'Hola, quiero información sobre el Happy Hour de Halloween.'
)

type View = 'hidden' | 'popup' | 'banner'

/** Novedad Halloween Happy Hour — popup grande; al pinchar: teléfono, WhatsApp y Telegram. */
const HalloweenCashPromo: React.FC = () => {
  const [panelPromo, setPanelPromo] = useState(() => isPromoLive(getCachedPromotion()))
  const [view, setView] = useState<View>('hidden')
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => startPromotionWatcher(), [])

  useEffect(() => {
    return subscribePromotion((promo) => {
      setPanelPromo(isPromoLive(promo))
    })
  }, [])

  const campaignOn = halloweenIsLive() && !panelPromo

  useEffect(() => {
    if (!campaignOn) {
      setContactOpen(false)
      setView('hidden')
      return
    }
    setView((current) => (current === 'banner' ? 'banner' : 'popup'))
  }, [campaignOn])

  useEffect(() => {
    setHalloweenCashPopupOpen(view === 'popup')
    return () => setHalloweenCashPopupOpen(false)
  }, [view])

  const minimize = useCallback(() => {
    setContactOpen(false)
    setView(campaignOn ? 'banner' : 'hidden')
  }, [campaignOn])

  const reopen = useCallback(() => {
    if (!campaignOn) return
    setView('popup')
  }, [campaignOn])

  useEffect(() => {
    if (view !== 'popup') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (contactOpen) {
        setContactOpen(false)
        return
      }
      minimize()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [contactOpen, minimize, view])

  if (!campaignOn || view === 'hidden') return null

  return (
    <>
      {view === 'banner' ? (
        <button
          type="button"
          onClick={reopen}
          className="fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] border-b border-[#c084fc]/45 bg-[#16081c]/94 px-4 py-2.5 text-center text-[11px] sm:text-xs tracking-[0.14em] text-[#f5d0fe] backdrop-blur-md hover:bg-[#241030] hover:text-white transition-colors"
        >
          🎃 Happy Hour Halloween · A partir del jueves 29 · Ver oferta
        </button>
      ) : null}

      {view === 'popup' ? (
        <div
          className="fixed inset-0 z-[140] overflow-y-auto bg-black/84"
          role="dialog"
          aria-modal="true"
          aria-labelledby="halloween-happy-hour-title"
          onClick={minimize}
        >
          <div className="flex min-h-full items-center justify-center px-3 py-6 sm:p-8">
            <div
              className="relative z-10 w-full max-w-[1100px]"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="halloween-happy-hour-title" className="sr-only">
                Happy Hour Halloween. A partir del jueves 29 de octubre. Llama para informarte.
              </h2>
              <button
                type="button"
                onClick={minimize}
                className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white border border-white/25 hover:bg-black"
                aria-label="Cerrar"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="overflow-hidden rounded-xl border border-[#c084fc]/55 bg-[#120814] shadow-[0_0_70px_rgba(192,70,255,0.28),0_28px_80px_rgba(0,0,0,0.65)]">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e879f9]"
                  aria-label="Abrir opciones para llamar, WhatsApp o Telegram sobre el Happy Hour"
                >
                  <img
                    src={IMAGE}
                    alt="Valeria Ferrer Valencia. Happy Hour. A partir del jueves 29 de octubre. Llama para informarte."
                    width={1024}
                    height={682}
                    decoding="async"
                    fetchPriority="high"
                    className="block h-auto w-full max-h-[min(82dvh,720px)] object-contain bg-black"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="block w-full bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#a855f7] py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white hover:from-[#c084fc] hover:via-[#f0abfc] hover:to-[#c084fc] hover:text-[#1a0a1f] transition-colors"
                >
                  Llama · WhatsApp · Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {view === 'popup' && contactOpen ? (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="halloween-happy-hour-contact-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar opciones de contacto"
            onClick={() => setContactOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[#c084fc]/40 bg-[#141018]/96 p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
              aria-label="Cerrar"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h3
              id="halloween-happy-hour-contact-title"
              className="pr-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#e879f9]"
            >
              Happy Hour Halloween
            </h3>
            <p className="mt-3 mb-5 text-[12px] leading-relaxed text-gray-300">
              A partir del jueves 29 de octubre. Elige cómo quieres informarte.
            </p>
            <div className="space-y-3">
              <a
                href={OFFICIAL_PHONE_TEL}
                data-contact-placement="halloween_happy_hour"
                className="flex items-center justify-between w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white/10"
              >
                <span className="flex items-center">
                  <Phone size={15} className="mr-3 text-[#e879f9]" />
                  Llamar ahora
                </span>
                <span className="text-[10px] font-medium tracking-normal text-gray-400">
                  {OFFICIAL_PHONE_LABEL}
                </span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_happy_hour"
                className="flex items-center justify-between w-full bg-[#25d366] text-[#07230f] py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#41e17b]"
              >
                <span className="flex items-center">
                  <MessageCircle size={15} className="mr-3" />
                  WhatsApp
                </span>
                <span className="text-[10px] font-medium tracking-normal opacity-70">
                  {OFFICIAL_PHONE_LABEL}
                </span>
              </a>
              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_happy_hour"
                className="flex items-center justify-between w-full bg-[#c084fc] text-[#1a0a1f] py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white"
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

export default HalloweenCashPromo
