import React, { useCallback, useEffect, useState } from 'react'
import { MessageCircle, Phone, Send, X } from 'lucide-react'
import { halloweenIsLive } from './HalloweenCampaign'
import { setHalloweenCashPopupOpen } from '../lib/halloweenCashGate'
import { BLACK_OFFER_IMAGE, BLACK_OFFER_IMAGE_WIDTH, BLACK_OFFER_IMAGE_HEIGHT, BLACK_OFFER_WHATSAPP_TEXT } from '../lib/blackPromoAsset'
import DesktopOfferBanners from './DesktopOfferBanners'
import {
  OFFICIAL_PHONE_LABEL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_TELEGRAM_HANDLE,
  OFFICIAL_TELEGRAM_URL,
  officialWhatsAppUrlWithText,
} from '../lib/officialContact'

type View = 'hidden' | 'popup' | 'banner'
type PromoKind = 'happy' | 'black'

const HAPPY_IMAGE = '/promos/promo-halloween-happy-hour-oct2026.webp'
const HAPPY_WHATSAPP_URL = officialWhatsAppUrlWithText('Hola, quiero información sobre el Happy Hour de Halloween.')
const BLACK_WHATSAPP_URL = officialWhatsAppUrlWithText(BLACK_OFFER_WHATSAPP_TEXT)

/** Ambas promociones comparten modal, pero cada una tiene consulta y CTA específicos. */
const HalloweenCashPromo: React.FC = () => {
  const [view, setView] = useState<View>('hidden')
  const [contactKind, setContactKind] = useState<PromoKind | null>(null)
  const campaignOn = halloweenIsLive()

  useEffect(() => {
    if (!campaignOn) {
      setContactKind(null)
      setView('hidden')
      return
    }
    setView((current) => current === 'banner' ? 'banner' : 'popup')
  }, [campaignOn])

  useEffect(() => {
    setHalloweenCashPopupOpen(view === 'popup')
    return () => setHalloweenCashPopupOpen(false)
  }, [view])

  const minimize = useCallback(() => {
    setContactKind(null)
    setView(campaignOn ? 'banner' : 'hidden')
  }, [campaignOn])
  const reopen = useCallback(() => {
    if (campaignOn) setView('popup')
  }, [campaignOn])

  useEffect(() => {
    if (view !== 'popup') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (contactKind) setContactKind(null)
      else minimize()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [contactKind, minimize, view])

  if (!campaignOn || view === 'hidden') return null

  return (
    <>
      {view === 'banner' && (
        <button type="button" onClick={reopen}
          className="fixed left-0 right-0 top-[5.75rem] md:top-[7.25rem] z-[52] border-b border-[#d6ad60]/45 bg-[#160d14]/95 px-4 py-2.5 text-center text-[11px] sm:text-xs font-bold tracking-[0.12em] text-[#f9e2b1] backdrop-blur-md hover:bg-[#34201c] hover:text-white transition-colors"
        >
          🎃 HAPPY HOUR + ✦ BLACK · Dos ofertas · Ver promociones
        </button>
      )}

      {view === 'popup' && (
        <div className="fixed inset-0 z-[140] overflow-y-auto overscroll-contain bg-black/90" role="dialog" aria-modal="true" aria-labelledby="halloween-offers-title" onClick={minimize}>
          <div className="flex min-h-full items-center justify-center px-3 py-6 sm:p-6">
            <div className="relative z-10 w-full max-w-[1220px] xl:max-w-[1360px]" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={minimize}
                className="absolute right-0 top-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/85 text-white hover:bg-black"
                aria-label="Cerrar ofertas">
                <X size={20} aria-hidden="true"/>
              </button>
              <h2 id="halloween-offers-title" className="pr-10 text-center font-serif text-2xl text-[#f2d69b] sm:text-3xl">
                Descubre nuestras dos ofertas
              </h2>
              <p className="mb-5 mt-2 text-center text-[12px] text-[#e7d2b1]">
                Happy Hour por horario y tarifa BLACK para chicas con etiqueta BLACK
              </p>
              <DesktopOfferBanners onHappy={() => setContactKind("happy")} onBlack={() => setContactKind("black")} />
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6 lg:hidden">
                <section aria-label="Oferta Happy Hour" className="overflow-hidden rounded-xl border border-[#c084fc]/55 bg-[#110a17] shadow-[0_14px_50px_rgba(0,0,0,.45)]">
                  <h3 className="p-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#f0dcfc]">🎃 HAPPY HOUR</h3>
                  <button type="button" onClick={() => setContactKind('happy')} className="block w-full focus-visible:outline-2 focus-visible:outline-[#d5a8fc]" aria-label="Consultar Happy Hour">
                    <img src={HAPPY_IMAGE} alt="Happy Hour Valeria Ferrer. A partir del jueves 29. Llama para informarte." width={1024} height={682} fetchPriority="high" decoding="async"
                      className="block h-auto max-h-[70dvh] w-full object-contain bg-black"/>
                  </button>
                  <button type="button" onClick={() => setContactKind('happy')}
                    className="block w-full bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-3 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:brightness-110">
                    Consultar Happy Hour
                  </button>
                </section>
                <section aria-label="Oferta BLACK" className="overflow-hidden rounded-xl border border-[#e2bf6e]/70 bg-[#120d0a] shadow-[0_14px_50px_rgba(0,0,0,.45)]">
                  <h3 className="p-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#f4d998]">✦ TARIFA BLACK</h3>
                  <button type="button" onClick={() => setContactKind('black')} className="block w-full focus-visible:outline-2 focus-visible:outline-[#e2bf6e]" aria-label="Consultar tarifa BLACK">
                    <img src={BLACK_OFFER_IMAGE} alt="Oferta BLACK Valeria Ferrer. Menciona BLACK al reservar para la tarifa especial de chicas con etiqueta BLACK." width={BLACK_OFFER_IMAGE_WIDTH} height={BLACK_OFFER_IMAGE_HEIGHT} decoding="async" loading="lazy"
                      className="block h-auto max-h-[70dvh] w-full object-contain bg-black"/>
                  </button>
                  <button type="button" onClick={() => setContactKind('black')}
                    className="block w-full bg-gradient-to-r from-[#b78531] via-[#efce76] to-[#b78531] px-3 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1b1207] hover:brightness-110">
                    Menciona BLACK · Consultar tarifa
                  </button>
                </section>
              </div>
              <p className="mt-3 text-center text-xs text-[#d6bf91]">
                <span className="lg:hidden">Desliza para ver ambos carteles.</span> Cada oferta se consulta por separado.
              </p>
            </div>
          </div>
        </div>
      )}

      {view === 'popup' && contactKind && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="halloween-offer-contact-title">
          <button type="button" className="absolute inset-0 bg-black/65" onClick={() => setContactKind(null)} aria-label="Cerrar opciones de contacto" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[#d6b166]/50 bg-[#141018] p-5 shadow-2xl">
            <button type="button" onClick={() => setContactKind(null)} className="absolute right-3 top-3 p-1 text-gray-400 hover:text-white" aria-label="Cerrar"><X size={18}/></button>
            <h3 id="halloween-offer-contact-title" className="pr-8 text-[12px] font-bold uppercase tracking-[0.18em] text-[#eed098]">
              {contactKind === 'black' ? 'Tarifa BLACK' : 'Happy Hour Halloween'}
            </h3>
            <p className="mb-5 mt-3 text-sm text-gray-300">
              {contactKind === 'black'
                ? 'Menciona BLACK en tu reserva. Oferta solo para chicas identificadas con etiqueta BLACK.'
                : 'Consulta condiciones y disponibilidad del Happy Hour.'}
            </p>
            <div className="space-y-3">
              <a href={OFFICIAL_PHONE_TEL} data-contact-placement="halloween_offers" className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-white/10">
                <span className="flex items-center"><Phone size={15} className="mr-3 text-[#e7c17b]"/> Llamar ahora</span>
                <span className="text-xs font-medium tracking-normal text-gray-400">{OFFICIAL_PHONE_LABEL}</span>
              </a>
              <a href={contactKind === 'black' ? BLACK_WHATSAPP_URL : HAPPY_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-contact-placement="halloween_offers" className="flex w-full items-center justify-between rounded-xl bg-[#25d366] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#07230f] hover:bg-[#41e17b]">
                <span className="flex items-center"><MessageCircle size={15} className="mr-3"/> WhatsApp</span>
                <span className="text-xs font-medium tracking-normal">{OFFICIAL_PHONE_LABEL}</span>
              </a>
              <a href={OFFICIAL_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" data-contact-placement="halloween_offers" className="flex w-full items-center justify-between rounded-xl bg-[#c084fc] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a0a1f] hover:bg-white">
                <span className="flex items-center"><Send size={15} className="mr-3"/> Telegram</span>
                <span className="text-xs font-medium tracking-normal">{OFFICIAL_TELEGRAM_HANDLE}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HalloweenCashPromo
