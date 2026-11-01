
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import HalloweenCampaign, { halloweenIsLive } from '../components/HalloweenCampaign';
import ModelsGrid from '../components/ModelsGrid';
import FAQ from '../components/FAQ';
import PageSEOHead from '../components/PageSEOHead';
import HomeNovedadesStrip from '../components/HomeNovedadesStrip';
import HomeWhatsAppNews from '../components/HomeWhatsAppNews';
import modelsData from '../data/models.json';
import { filterActiveModels } from '../lib/modelsCatalog';
import { useCatalogWithOverrides } from '../hooks/useCatalogWithOverrides';
import { Diamond, ShieldCheck, Star, Send, Phone, MessageCircle } from 'lucide-react';
import { OFFICIAL_PHONE_TEL, officialWhatsAppUrlWithText } from '../lib/officialContact';
import { getHomeExploreLinks } from '../lib/homeExploreLinks';

const Reviews = React.lazy(() => import('../components/Reviews'));

const CASH_PROMO_IMAGE = '/promos/promo-halloween-efectivo-oct2026.webp';
const CASH_PROMO_WHATSAPP = officialWhatsAppUrlWithText(
  'Hola, quiero reservar con la promoción de 5 € menos pagando en efectivo.'
);
const CASH_PROMO_RATES = [
  { duration: '30 min', usual: '80 €', cash: '75 €' },
  { duration: '45 min', usual: '120 €', cash: '115 €' },
  { duration: '1 hora', usual: '150 €', cash: '145 €' },
  { duration: '1 h 30', usual: '230 €', cash: '225 €' },
] as const;

function scheduleBelowFoldWork(onReady: () => void): () => void {
  let cancelled = false;
  let done = false;

  const run = () => {
    if (cancelled || done) return;
    done = true;
    onReady();
  };

  const timeoutId = window.setTimeout(run, 2000);
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const idleId =
    typeof w.requestIdleCallback === 'function'
      ? w.requestIdleCallback(run, { timeout: 3500 })
      : undefined;

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    if (idleId !== undefined && w.cancelIdleCallback) {
      w.cancelIdleCallback(idleId);
    }
  };
}

const Home: React.FC = () => {
  const exploreLinks = useMemo(() => getHomeExploreLinks(), []);
  const activeModels = useMemo(() => filterActiveModels(modelsData), []);
  const homeModels = useCatalogWithOverrides(activeModels, { homePinFallback: true });
  const [loadExploreNav, setLoadExploreNav] = useState(false);
  const [loadReviews, setLoadReviews] = useState(false);
  const reviewsSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => scheduleBelowFoldWork(() => setLoadExploreNav(true)), []);

  useEffect(() => {
    const node = reviewsSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadReviews(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const homeSEOData = {
    title: 'Valeria Ferrer | Escorts en Valencia',
    description:
      'Descubre nuestras escorts y acompañantes exclusivas en Valencia. Modelos sofisticadas para eventos, cenas y momentos especiales. Atención discreta y reserva privada.',
    canonicalUrl: 'https://www.valeriaferrer.com',
  };

  const isHalloweenPreview = halloweenIsLive();

  return (
    <div className="overflow-x-hidden">
      <PageSEOHead
        title={homeSEOData.title}
        description={homeSEOData.description}
        canonicalUrl={homeSEOData.canonicalUrl}
      />
      <Hero />
      {/* Oferta -5 € efectivo: recuperar cartel original sin sustituir Happy Hour ni BLACK.
          Esta sección independiente podrá pasar al panel remoto cuando se integre el control. */}
      <section id="promocion-efectivo" aria-labelledby="cash-promo-heading"
        className="relative border-y border-[#e5c17d]/35 bg-gradient-to-br from-[#210d19] via-[#110a0f] to-[#0b090a] px-3 py-7 sm:px-6 md:py-11"
      >
        <div className="mx-auto grid max-w-[1700px] gap-5 overflow-hidden rounded-2xl border border-[#e5c17d]/45 bg-[#120c0e] shadow-[0_18px_65px_rgba(0,0,0,0.5)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-0">
          <div className="flex items-center justify-center bg-[#1a0b12] lg:border-r lg:border-[#e5c17d]/25">
            <img
              src={CASH_PROMO_IMAGE}
              alt="Cartel original de Valeria Ferrer. Promoción exclusiva para pagos en efectivo: 5 euros menos en todas las tarifas."
              width={1024}
              height={576}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center px-5 pb-7 pt-1 sm:px-8 lg:px-11 lg:py-10 xl:px-14">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f1cf8d]">
              Promoción exclusiva · Solo efectivo
            </p>
            <h2 id="cash-promo-heading" className="font-serif text-3xl leading-tight text-white sm:text-4xl xl:text-5xl">
              <span className="text-[#f0c87a]">5 € MENOS</span> pagando en efectivo
            </h2>
            <p className="mb-5 mt-3 text-sm leading-relaxed text-[#e9d5ce] sm:text-base">
              Todas las duraciones tienen 5 € de descuento si pagas en efectivo.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3" aria-label="Tarifas con descuento en efectivo">
              {CASH_PROMO_RATES.map(({ duration, usual, cash }) => (
                <div key={duration} className="rounded-xl border border-[#ddbb80]/30 bg-[#2a1720] p-3 sm:p-4">
                  <p className="text-xs font-semibold text-[#f3dfc6] sm:text-sm">{duration}</p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-2">
                    <del className="text-sm text-[#d0b5ae]/70">{usual}</del>
                    <strong className="text-xl font-black text-[#f7d489] sm:text-2xl">{cash}</strong>
                  </p>
                </div>
              ))}
            </div>
            <p className="mb-5 mt-3 text-xs text-[#d9bda8]">
              En el resto de tarifas también se descuentan 5 €. Solo pagos en efectivo.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={CASH_PROMO_WHATSAPP} target="_blank" rel="noopener noreferrer"
                data-contact-placement="cash_promo_home"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-center text-xs font-extrabold uppercase tracking-[0.08em] text-[#092311] transition hover:bg-[#45e37b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle size={18} aria-hidden="true" /> Reservar con descuento
              </a>
              <a href={OFFICIAL_PHONE_TEL} data-contact-placement="cash_promo_home"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#f0ca81] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#f4d8a0] transition hover:bg-[#f0ca81] hover:text-[#120c0e]"
              >
                <Phone size={18} aria-hidden="true" /> Llamar
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Halloween: la promo de efectivo ocupa el primer bloque; el catálogo sigue justo debajo. */}
      {isHalloweenPreview && <HalloweenCampaign homeOnly />}
      {isHalloweenPreview && (
        <ModelsGrid
          models={homeModels}
          heading="Nuestras chicas disponibles"
          subtitle="Modelos exclusivas en Valencia · Citas discretas · Experiencias únicas"
        />
      )}

      {!isHalloweenPreview && <HalloweenCampaign homeOnly />}

      <HomeWhatsAppNews />

      <HomeNovedadesStrip
        models={homeModels}
        exploreLinks={exploreLinks}
        loadExploreNav={loadExploreNav}
      />

      {/* Elite Experience Section — sin Framer en cards (mismo aspecto final) */}
      <section className="py-12 md:py-24 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-2xl md:text-5xl font-light tracking-wider mb-2 md:mb-4">La Experiencia Elite</h2>
            <div className="w-16 md:w-24 h-[1px] md:h-[2px] bg-[#c2b2a3] mx-auto"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-8">
            <div className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center">
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <Diamond className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase">Exclusividad</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Un proceso de selección riguroso asegura que solo las mujeres más excepcionales formen parte de nuestra agencia.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center">
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase text-nowrap">Discreción</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Su privacidad es nuestra máxima prioridad. Manejamos todas las reservas con el más alto nivel de confidencialidad.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/5 p-3 md:p-12 text-center hover:border-[#c2b2a3]/30 transition-colors group flex flex-col items-center">
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-full border border-[#c2b2a3]/20 flex items-center justify-center mb-3 md:mb-8 group-hover:bg-[#c2b2a3]/5 transition-colors">
                <Star className="w-5 h-5 md:w-8 md:h-8 text-[#c2b2a3]" />
              </div>
              <h3 className="text-[10px] md:text-2xl font-light tracking-widest mb-2 md:mb-6 uppercase text-nowrap">Calidad</h3>
              <p className="hidden md:block text-gray-400 font-light leading-relaxed">
                Desde el primer contacto hasta el final de la cita, garantizamos un servicio impecable y personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#111111] py-4 border-b border-white/5 text-center">
        <a
          href="https://t.me/Valeriaferreeer" data-contact-placement="home_banner"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.5em] text-[#c2b2a3] hover:text-white transition-colors uppercase font-bold flex items-center justify-center"
        >
          <Send size={14} className="mr-3" />
          Contactar por Telegram: @Valeriaferreeer
        </a>
      </div>

      {/* Anclas de intención: lujo y catálogo (genérico consolidado en Home) */}
      <nav
        aria-label="Explorar por intención"
        className="bg-[#0a0a0a] py-5 px-6 border-b border-white/5 text-center"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
          <li>
            <Link
              to="/escorts-de-lujo-valencia"
              className="text-[#c2b2a3] hover:text-white transition-colors underline underline-offset-4 decoration-[#c2b2a3]/35"
            >
              Escorts de lujo en Valencia
            </Link>
          </li>
          <li className="hidden sm:inline text-white/15" aria-hidden="true">
            ·
          </li>
          <li>
            <Link
              to="/models"
              className="hover:text-[#c2b2a3] transition-colors"
            >
              Chicas disponibles
            </Link>
          </li>
        </ul>
      </nav>

      {!isHalloweenPreview && (
        <ModelsGrid
          models={homeModels}
          heading="Escorts en Valencia"
          subtitle="Selección Valeria Ferrer · Fotos reales · Reserva discreta"
        />
      )}

      <div ref={reviewsSentinelRef} className="min-h-[32rem] md:min-h-[28rem]">
        {loadReviews ? (
          <Suspense fallback={null}>
            <Reviews />
          </Suspense>
        ) : null}
      </div>

      <FAQ />

      <section className="py-32 relative flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/og-image.jpg"
            className="w-full h-full object-cover opacity-20"
            alt="CTA BG"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-light mb-8 uppercase tracking-widest leading-tight">
            ¿Listo para una <span className="italic luxury-text-gradient">experiencia</span> inolvidable?
          </h2>
          <Link
            to="/booking"
            className="inline-block px-12 py-5 bg-[#c2b2a3] text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
          >
            Realizar Reserva
          </Link>
          <p className="mt-8 text-[10px] text-gray-400 tracking-[0.4em] uppercase">Manejo 100% confidencial</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
