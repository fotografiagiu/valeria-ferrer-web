import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  ACTIVE_PROMO,
  isPromoLive,
  promoClosedStorageKey,
  type PromoPopupConfig,
} from '../lib/promoPopupConfig'

function wasClosed(promoId: string): boolean {
  try {
    return localStorage.getItem(promoClosedStorageKey(promoId)) === '1'
  } catch {
    return false
  }
}

const PromoPopup: React.FC<{ promo?: PromoPopupConfig }> = ({ promo = ACTIVE_PROMO }) => {
  const [open, setOpen] = useState(false)

  const closePromo = useCallback(() => {
    try {
      localStorage.setItem(promoClosedStorageKey(promo.id), '1')
    } catch {
      /* private mode: still hide for this visit */
    }
    setOpen(false)
  }, [promo.id])

  const syncVisibility = useCallback(() => {
    if (wasClosed(promo.id)) {
      setOpen(false)
      return
    }
    setOpen(isPromoLive(promo))
  }, [promo])

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
          setOpen(false)
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
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePromo()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [closePromo, open])

  if (!open) return null

  return (
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
        onClick={closePromo}
      />

      <div className="relative z-10 w-full max-w-[920px]">
        <h2 id="promo-popup-title" className="sr-only">
          Oferta especial Valeria Ferrer
        </h2>
        <button
          type="button"
          onClick={closePromo}
          className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 hover:bg-black hover:text-[#c2b2a3] transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <Link
          to={promo.ctaHref}
          onClick={closePromo}
          className="block overflow-hidden rounded-lg shadow-[0_20px_80px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2b2a3]"
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
        </Link>
      </div>
    </div>
  )
}

export default PromoPopup
