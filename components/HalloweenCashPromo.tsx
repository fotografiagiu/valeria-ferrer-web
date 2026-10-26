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

const IMAGE = '/promos/promo-halloween-efectivo-oct2026.webp'
const WHATSAPP_URL = officialWhatsAppUrlWithText(
  'Hola, quiero el descuento de 5€ pagando en efectivo.'
)

const RATES = [
  { label: '30 min', from: '80€', to: '75€' },
  { label: '1 hora', from: '150€', to: '145€' },
  { label: '1,5 horas', from: '230€', to: '225€' },
] as const

type View = 'hidden' | 'popup' | 'banner'

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
          className="fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] border-b border-[#e7c27a]/45 bg-[#1a0c08]/94 px-4 py-2.5 text-center text-[11px] sm:text-xs tracking-[0.14em] text-[#ffe0b0] backdrop-blur-md hover:bg-[#2a140c] hover:text-white transition-colors"
        >
          5 € menos en todas las tarifas pagando en efectivo · Ver oferta
        </button>
      ) : null}

      {view === 'popup' ? (
        <div
          className="fixed inset-0 z-[140] overflow-y-auto bg-black/84"
          role="dialog"
          aria-modal="true"
          aria-labelledby="halloween-cash-title"
          onClick={minimize}
        >
          <div className="flex min-h-full items-center justify-center px-3 py-6 sm:p-8">
          <div className="relative z-10 w-full max-w-[1100px]" onClick={(event) => event.stopPropagation()}>
            <h2 id="halloween-cash-title" className="sr-only">
              Promoción Halloween. 5 euros menos en todas las tarifas pagando en efectivo.
            </h2>
            <button
              type="button"
              onClick={minimize}
              className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white border border-white/25 hover:bg-black"
              aria-label="Cerrar"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="overflow-hidden rounded-xl border border-[#e7c27a]/55 bg-[#12080c] shadow-[0_0_70px_rgba(255,150,50,0.22),0_28px_80px_rgba(0,0,0,0.65)]">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c27a]"
                aria-label="Reservar con 5 euros de descuento pagando en efectivo"
              >
                <img
                  src={IMAGE}
                  alt="Promoción exclusiva. Pagos en efectivo: 5 euros menos en todas las tarifas. 30 min 75 euros, 1 hora 145 euros, 1,5 horas 225 euros. Solo efectivo."
                  width={1024}
                  height={576}
                  decoding="async"
                  fetchPriority="high"
                  className="block h-auto w-full max-h-[min(78dvh,640px)] object-contain bg-black"
                />
              </button>
              <div className="border-t border-[#e7c27a]/30 bg-[#160d12] px-4 py-3 sm:hidden">
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e7c27a]">
                  Solo efectivo · 5 € menos
                </p>
                <ul className="mt-2 space-y-1.5">
                  {RATES.map((rate) => (
                    <li key={rate.label} className="flex items-baseline justify-between gap-3 text-white">
                      <span className="text-[13px] tracking-wide text-[#f3e6d4]">{rate.label}</span>
                      <span className="flex items-baseline gap-2">
                        <span className="text-[13px] text-[#d7c4b0]/55 line-through">{rate.from}</span>
                        <span className="text-[#c9a27a]" aria-hidden="true">→</span>
                        <span className="vf-cash-price text-[1.65rem] font-semibold leading-none">{rate.to}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-center text-[12px] text-[#f0d7b4]">
                  El resto de tarifas, también 5 € menos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="block w-full bg-[#e7c27a] py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#1a1008] hover:bg-[#fff1d2] transition-colors"
              >
                Reservar con 5 € menos
              </button>
            </div>
            <style>{`
              @keyframes vf-cash-ember {
                0%, 100% { text-shadow: 0 0 8px rgba(255, 186, 92, 0.28); color: #ffd9a0; }
                50% { text-shadow: 0 0 14px rgba(255, 196, 110, 0.75), 0 0 2px rgba(255, 236, 200, 0.85); color: #ffe7c2; }
              }
              .vf-cash-price { animation: vf-cash-ember 2.8s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .vf-cash-price { animation: none; color: #ffd9a0; text-shadow: 0 0 8px rgba(255, 186, 92, 0.4); }
              }
            `}            </style>
          </div>
          </div>
        </div>
      ) : null}

      {view === 'popup' && contactOpen ? (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="halloween-cash-contact-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar opciones de reserva"
            onClick={() => setContactOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[#e7c27a]/35 bg-[#14100e]/96 p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
              aria-label="Cerrar"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h3 id="halloween-cash-contact-title" className="pr-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#e7c27a]">
              5 € menos en efectivo
            </h3>
            <p className="mt-3 mb-5 text-[12px] leading-relaxed text-gray-300">
              El descuento es solo pagando en efectivo. Elige cómo quieres reservar.
            </p>
            <div className="space-y-3">
              <a
                href={OFFICIAL_PHONE_TEL}
                data-contact-placement="halloween_cash"
                className="flex items-center justify-between w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white/10"
              >
                <span className="flex items-center">
                  <Phone size={15} className="mr-3 text-[#e7c27a]" />
                  Llamar ahora
                </span>
                <span className="text-[10px] font-medium tracking-normal text-gray-400">{OFFICIAL_PHONE_LABEL}</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_cash"
                className="flex items-center justify-between w-full bg-[#25d366] text-[#07230f] py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#41e17b]"
              >
                <span className="flex items-center">
                  <MessageCircle size={15} className="mr-3" />
                  WhatsApp
                </span>
                <span className="text-[10px] font-medium tracking-normal opacity-70">{OFFICIAL_PHONE_LABEL}</span>
              </a>
              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="halloween_cash"
                className="flex items-center justify-between w-full bg-[#e7c27a] text-[#1a1008] py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white"
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
