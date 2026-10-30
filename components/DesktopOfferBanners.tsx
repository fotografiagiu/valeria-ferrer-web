import type { FC } from 'react'
import { ArrowUpRight, Clock3, Crown, Tag } from 'lucide-react'
import {
  BLACK_OFFER_IMAGE,
  BLACK_OFFER_IMAGE_WIDTH,
  BLACK_OFFER_IMAGE_HEIGHT,
} from '../lib/blackPromoAsset'

type DesktopOfferBannersProps = {
  onHappy: () => void
  onBlack: () => void
}

/**
 * Panoramic desktop presentation of two distinct promotions.
 * The complete poster image remains visible (object-contain), even though
 * the source Happy Hour artwork is landscape and BLACK is portrait.
 * Mobile retains the existing promotional cards unchanged.
 */
const DesktopOfferBanners: FC<DesktopOfferBannersProps> = ({ onHappy, onBlack }) => (
  <div className="hidden lg:grid gap-5 xl:gap-6" aria-label="Ofertas Happy Hour y BLACK">
    <section aria-labelledby="panorama-happy-hour" className="grid min-h-[380px] xl:min-h-[410px] 2xl:min-h-[450px] grid-cols-[44%_56%] overflow-hidden rounded-2xl border border-[#a35ad8]/55 bg-[#140b18] shadow-[0_20px_70px_rgba(0,0,0,.52)]">
      <button type="button" onClick={onHappy} className="relative flex min-h-[380px] xl:min-h-[410px] 2xl:min-h-[450px] items-center justify-center overflow-hidden border-r border-[#a35ad8]/35 bg-[#16051a] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#d9a8fa]" aria-label="Consultar cartel completo Happy Hour">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#4a153e]/35 via-transparent to-[#100713]" />
        <img
          src="/promos/promo-halloween-happy-hour-oct2026.webp"
          alt="Cartel Happy Hour Halloween. Consulta condiciones y disponibilidad."
          width={1024}
          height={682}
          decoding="async"
          fetchPriority="high"
          className="relative block h-[362px] w-full object-contain xl:h-[393px] 2xl:h-[432px]"
        />
      </button>
      <div className="flex flex-col justify-center px-9 py-8 xl:px-14 2xl:px-16">
        <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-[#e7baf6]"><Clock3 size={16} aria-hidden="true" /> Promoción por horario</p>
        <h3 id="panorama-happy-hour" className="font-serif text-[3.2rem] leading-none tracking-[0.02em] text-white xl:text-[4.1rem] 2xl:text-[4.6rem]">HAPPY <span className="text-[#dba5ee]">HOUR</span></h3>
        <p className="mt-4 text-[17px] leading-relaxed text-[#e4cfdf] xl:text-[18px]">Dos franjas horarias con tarifas especiales.</p>
        <p className="mt-3 text-[20px] font-bold tracking-[0.04em] text-[#f9e7fb] xl:text-[23px]">12:00–14:00 <span className="text-[#bd8ac9]">·</span> 01:00–03:00</p>
        <button type="button" onClick={onHappy} className="mt-6 inline-flex w-fit items-center justify-center gap-3 rounded-full border border-[#edc1f8]/50 bg-gradient-to-r from-[#9b3baf] to-[#6b248d] px-10 py-4 text-[14px] xl:py-5 font-bold uppercase tracking-[0.16em] text-white shadow-[0_5px_22px_rgba(183,69,229,.2)] transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eed5fa]">
          Consulta Happy Hour <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
    <section aria-labelledby="panorama-black" className="grid min-h-[380px] xl:min-h-[410px] 2xl:min-h-[450px] grid-cols-[44%_56%] overflow-hidden rounded-2xl border border-[#d6ac53]/60 bg-[#100e0b] shadow-[0_20px_70px_rgba(0,0,0,.52)]">
      <button type="button" onClick={onBlack} className="relative flex min-h-[380px] xl:min-h-[410px] 2xl:min-h-[450px] items-center justify-center overflow-hidden border-r border-[#d6ac53]/30 bg-[#0e0a08] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#f5d58a]" aria-label="Consultar cartel completo de la oferta BLACK">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#3f280a]/20 via-transparent to-[#090806]" />
        <img
          src={BLACK_OFFER_IMAGE}
          alt="Cartel oferta BLACK. Menciona BLACK en tu reserva para las chicas con etiqueta BLACK."
          width={BLACK_OFFER_IMAGE_WIDTH}
          height={BLACK_OFFER_IMAGE_HEIGHT}
          decoding="async"
          loading="lazy"
          className="relative block h-[362px] w-full object-contain xl:h-[393px] 2xl:h-[432px]"
        />
      </button>
      <div className="flex flex-col justify-center px-9 py-8 xl:px-14 2xl:px-16">
        <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.24em] text-[#e6bb6e]"><Crown size={16} aria-hidden="true" /> Modelos seleccionadas</p>
        <h3 id="panorama-black" className="font-serif text-[3.2rem] leading-none tracking-[0.05em] text-[#f5d58a] xl:text-[4.1rem] 2xl:text-[4.6rem]">OFERTA BLACK</h3>
        <p className="mt-4 text-[19px] font-bold leading-relaxed text-white xl:text-[21px]">Menciona <strong className="text-[#f4d17e]">«BLACK»</strong> al reservar.</p>
        <p className="mt-2 flex items-center gap-2 text-[15px] leading-relaxed text-[#dcc9a7]"><Tag size={15} aria-hidden="true" /> Solo chicas con la insignia BLACK: Adara, Alicia, Bea, Karol, Laura, Luna y Susi.</p>
        <p className="mt-3 text-[19px] font-semibold tracking-[0.04em] text-[#f5d58a] xl:text-[21px]">30 min 70 € <span className="text-[#9e834b]">·</span> 45 min 100 € <span className="text-[#9e834b]">·</span> 1 h 130 €</p>
        <button type="button" onClick={onBlack} className="mt-6 inline-flex w-fit items-center justify-center gap-3 rounded-full border border-[#f6d78f] bg-gradient-to-r from-[#b78635] via-[#e8c66a] to-[#a5772d] px-10 py-4 text-[14px] xl:py-5 font-extrabold uppercase tracking-[0.14em] text-[#241708] shadow-[0_5px_22px_rgba(210,167,82,.2)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5d58a]">
          Consultar tarifa BLACK <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  </div>
)

export default DesktopOfferBanners
