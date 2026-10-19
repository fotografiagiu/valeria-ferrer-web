import { useEffect, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Drama, Gem, ShieldCheck, Heart } from 'lucide-react';
import HalloweenScene from './HalloweenScene';
import { halloweenIsLive } from './HalloweenCampaign';

const MOBILE_MQ = '(max-width: 767px)';
/** La misma bruja en móvil y escritorio. El texto va en HTML, no dentro de la foto. */
const HALLOWEEN_WITCH = '/images/halloween-hero-witch.jpg';
const HERO_BANNER_MOBILE_WEBP = '/images/home-hero-banner-mobile-v4-premium.webp';
const HERO_BANNER_MOBILE_FALLBACK = '/images/home-hero-banner-mobile-v4-premium.png';
const DESKTOP_VIDEO_SRC =
  'https://www.youtube.com/embed/lor3hN0e600?autoplay=1&mute=1&playsinline=1&loop=1&playlist=lor3hN0e600&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0';

function useIsMobileHero(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(MOBILE_MQ);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(MOBILE_MQ).matches,
    () => false
  );
}

function hideHeroLcpShell(): void {
  const shell = document.getElementById('hero-lcp-shell');
  if (!shell) return;

  const reveal = () => {
    shell.classList.add('is-hidden');
    window.setTimeout(() => shell.remove(), 450);
  };

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(reveal);
    });
    return;
  }

  window.setTimeout(reveal, 32);
}

const Hero = () => {
  const isMobileHero = useIsMobileHero();
  const halloween = halloweenIsLive();

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    if (mq.matches) {
      hideHeroLcpShell();
    }
  }, []);

  return (
    <section className="vf-halloween-hero relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Móvil: imagen estática — sin iframe YouTube en el DOM */}
        {halloween ? (
          <>
            <div className="vf-halloween-hero__desktop-extend" aria-hidden="true" />
            <img
              src={HALLOWEEN_WITCH}
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              width={768}
              height={1376}
              className="vf-halloween-photographic-hero vf-halloween-hero__portrait absolute inset-0 h-full w-full object-cover object-center"
            />
          </>
        ) : isMobileHero ? (
          <picture className="absolute inset-0 h-full w-full">
            <source srcSet={HERO_BANNER_MOBILE_WEBP} type="image/webp" />
            <img
              src={HERO_BANNER_MOBILE_FALLBACK}
              alt=""
              decoding="sync"
              fetchPriority="high"
              loading="eager"
              width={576}
              height={1024}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        ) : (
          <iframe
            src={DESKTOP_VIDEO_SRC}
            className="absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Valeria Ferrer Background Video"
          />
        )}

        {/* Overlay — móvil: gradiente suave; desktop: plano */}
        <div className="absolute inset-0 z-10 hidden md:block bg-black/40" aria-hidden="true" />
        <div
          className="absolute inset-0 z-10 md:hidden bg-gradient-to-b from-black/15 via-black/30 to-black/55"
          aria-hidden="true"
        />
      </div>

      {halloween && <>
      <HalloweenScene />
      <a href="#halloween-campaign" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('vf:halloween-contact')); }} className="vf-halloween-hero__ticker" aria-label="Consultar ofertas Halloween por teléfono o WhatsApp">
        <span className="vf-halloween-hero__pumpkin" aria-hidden="true">🎃</span>
        <span className="vf-halloween-hero__line">ESPECIAL HALLOWEEN · VIVE UNA NOCHE DIFERENTE · VER OFERTAS</span>
        <span aria-hidden="true">›</span>
      </a>
      </>}

      {/* Content — móvil: visible al montar; desktop: animación framer-motion */}
      <div className="vf-halloween-hero__content relative z-20 text-center max-w-5xl px-6 max-md:mt-[4vh]">
        <motion.div
          initial={isMobileHero ? false : { opacity: 0, y: 50 }}
          animate={isMobileHero ? undefined : { opacity: 1, y: 0 }}
          transition={isMobileHero ? { duration: 0 } : { duration: 1, ease: 'easeOut' }}
          className="vf-halloween-hero__brand text-center mb-8"
        >
          {/* Main name with better visual organization */}
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-8xl font-light tracking-wider leading-none mb-4">
              <span className="block bg-gradient-to-r from-[#f7e7ce] via-[#e8d4b0] via-[#d4af37] via-[#c2b2a3] to-[#f7e7ce] bg-clip-text text-transparent">
                Valeria Ferrer
              </span>
              <span className="mt-4 md:mt-5 block text-base md:text-2xl tracking-[0.22em] md:tracking-[0.28em] font-light text-[#c2b2a3] uppercase">
                Escorts en Valencia
              </span>
            </h1>

            {/* Visual separator */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
              <div className="w-2 h-2 rounded-full bg-[#c2b2a3]/50"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
            </div>

            <p className="text-[11px] md:text-sm tracking-[0.35em] font-light text-[#c2b2a3]/80 uppercase">
              Agencia Premium
            </p>
          </div>
        </motion.div>

        {halloween && (
          <div className="vf-halloween-wordmark" aria-label="Especial Halloween">
            <img src="/images/halloween-wordmark.png" alt="" className="vf-halloween-wordmark__art" />
          </div>
        )}

        <motion.p
          initial={isMobileHero ? false : { opacity: 0 }}
          animate={isMobileHero ? undefined : { opacity: 1 }}
          transition={isMobileHero ? { duration: 0 } : { duration: 1, delay: 0.5 }}
          className="vf-halloween-hero__subtitle text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-200 mb-12 drop-shadow-xl max-md:max-w-[17rem] max-md:mx-auto max-md:leading-relaxed max-md:tracking-[0.22em] max-md:text-base"
        >
          Experiencias exclusivas y citas discretas en Valencia
        </motion.p>

        <motion.div
          initial={isMobileHero ? false : { opacity: 0, scale: 0.9 }}
          animate={isMobileHero ? undefined : { opacity: 1, scale: 1 }}
          transition={isMobileHero ? { duration: 0 } : { duration: 0.8, delay: 0.8 }}
          className="vf-halloween-hero__actions flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8"
        >
          {isMobileHero ? (
            <div className="w-full sm:w-auto">
              <Link
                to="/models"
                className="block px-12 py-5 border border-[#c2b2a3] text-[#c2b2a3] uppercase tracking-[0.3em] text-xs backdrop-blur-md hover:bg-[#c2b2a3] hover:text-black transition-all duration-700 w-full sm:w-auto group"
              >
                <span className="relative z-10">Chicas disponibles</span>
                <div className="absolute inset-0 bg-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </Link>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/models"
                className="block px-12 py-5 border border-[#c2b2a3] text-[#c2b2a3] uppercase tracking-[0.3em] text-xs backdrop-blur-md hover:bg-[#c2b2a3] hover:text-black transition-all duration-700 w-full sm:w-auto group"
              >
                <span className="relative z-10">Chicas disponibles</span>
                <div className="absolute inset-0 bg-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </Link>
            </motion.div>
          )}

          {isMobileHero ? (
            <div className="w-full sm:w-auto">
              <Link
                to="/booking"
                className="block px-12 py-5 luxury-gradient text-black uppercase tracking-[0.3em] text-xs font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(194,178,163,0.3)] transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
              >
                <span className="relative z-10">Reserva cita exclusiva</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/booking"
                className="block px-12 py-5 luxury-gradient text-black uppercase tracking-[0.3em] text-xs font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(194,178,163,0.3)] transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
              >
                <span className="relative z-10">Reserva cita exclusiva</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
          )}
        </motion.div>
        {halloween && (
          <div className="vf-halloween-values" aria-label="Atención personalizada y discreta">
            <div><Drama aria-hidden="true" size={23} strokeWidth={1.5} /><span>Atmósfera única</span></div>
            <div><Gem aria-hidden="true" size={23} strokeWidth={1.5} /><span>Ambiente premium</span></div>
            <div><ShieldCheck aria-hidden="true" size={23} strokeWidth={1.5} /><span>Discreción total</span></div>
            <div><Heart aria-hidden="true" size={23} strokeWidth={1.5} /><span>Experiencias especiales</span></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
