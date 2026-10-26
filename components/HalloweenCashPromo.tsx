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
              <div className="vf-cash-rates relative isolate overflow-hidden px-3 pb-3 pt-3.5 sm:hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,120,40,0.28),transparent_55%),radial-gradient(90%_80%_at_12%_100%,rgba(190,40,120,0.35),transparent_50%),radial-gradient(90%_80%_at_88%_100%,rgba(120,30,160,0.32),transparent_50%),linear-gradient(180deg,#2a1020_0%,#14080f_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9ad8]/80 to-transparent"
                />
                <div className="relative z-[1]">
                  <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#ff7eb6]/55 bg-[#2a0f1f]/85 px-3 py-1 shadow-[0_0_18px_rgba(255,90,170,0.35)]">
                    <span aria-hidden="true" className="text-[11px]">🎃</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffd0e8]">
                      Solo efectivo · −5 €
                    </span>
                    <span aria-hidden="true" className="text-[11px]">🎃</span>
                  </div>
                  <ul className="mt-3 grid grid-cols-3 gap-2">
                    {RATES.map((rate) => (
                      <li
                        key={rate.label}
                        className="rounded-xl border border-[#e7c27a]/35 bg-[#1a0b14]/72 px-1.5 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,210,160,0.12),0_8px_20px_rgba(0,0,0,0.28)] backdrop-blur-[2px]"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3d7a8]">
                          {rate.label}
                        </p>
                        <p className="mt-1 text-[11px] text-[#d7c4b0]/55 line-through">{rate.from}</p>
                        <p className="vf-cash-price mt-0.5 text-[1.35rem] font-bold leading-none tracking-tight">
                          {rate.to}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2.5 text-center text-[11px] leading-snug text-[#f0d7b4]/90">
                    El resto de tarifas, también 5 € menos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="block w-full bg-gradient-to-r from-[#f0c478] via-[#e7c27a] to-[#f0c478] py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#1a1008] hover:from-[#fff1d2] hover:via-[#ffe7b0] hover:to-[#fff1d2] transition-colors"
              >
                Reservar con 5 € menos
              </button>
            </div>
            <style>{`
              @keyframes vf-cash-neon {
                0%, 100% {
                  color: #ff9ad8;
                  text-shadow:
                    0 0 6px rgba(255, 90, 180, 0.55),
                    0 0 16px rgba(255, 70, 170, 0.35);
                }
                50% {
                  color: #ffd0ef;
                  text-shadow:
                    0 0 8px rgba(255, 140, 210, 0.95),
                    0 0 22px rgba(255, 70, 180, 0.55),
                    0 0 2px rgba(255, 230, 250, 0.9);
                }
              }
              .vf-cash-price { animation: vf-cash-neon 2.6s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .vf-cash-price {
                  animation: none;
                  color: #ff9ad8;
                  text-shadow: 0 0 10px rgba(255, 90, 180, 0.55);
                }
              }
            `}</style>
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
