import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MOBILE_HERO_POSTER = '/images/home-mobile-hero.jpg';
const MOBILE_VIDEO_SRC =
  'https://www.youtube.com/embed/j2kjUoDzWEE?autoplay=1&mute=1&playsinline=1&loop=1&playlist=j2kjUoDzWEE&controls=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0&origin=https://www.valeriaferrer.com';
const DESKTOP_VIDEO_SRC =
  'https://www.youtube.com/embed/lor3hN0e600?autoplay=1&mute=1&playsinline=1&loop=1&playlist=lor3hN0e600&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0';

/** Mismo overscan/crop que el iframe móvil original — aplicado una sola vez al contenedor. */
const MOBILE_MEDIA_FRAME =
  'pointer-events-none absolute top-1/2 left-1/2 w-[205%] h-[118%] min-w-[100vw] min-h-[100vh] -translate-x-[55%] -translate-y-[55%] [clip-path:inset(0_11%_10%_0)]';

const MOBILE_MEDIA_FILL = 'absolute inset-0 h-full w-full border-0';

function scheduleMobileVideo(onReady: () => void): () => void {
  let cancelled = false;

  const run = () => {
    if (!cancelled) onReady();
  };

  const timeoutId = window.setTimeout(run, 3000);
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const idleId =
    typeof w.requestIdleCallback === 'function'
      ? w.requestIdleCallback(run, { timeout: 4500 })
      : undefined;

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    if (idleId !== undefined && w.cancelIdleCallback) {
      w.cancelIdleCallback(idleId);
    }
  };
}

const Hero = () => {
  const [loadMobileVideo, setLoadMobileVideo] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    return scheduleMobileVideo(() => setLoadMobileVideo(true));
  }, []);

  const handleMobileVideoLoad = () => {
    // Pequeña pausa para que YouTube pinte el primer frame antes del crossfade
    window.setTimeout(() => setMobileVideoReady(true), 500);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Mobile: poster (LCP) + YouTube en el mismo contenedor recortado */}
        <div className="block md:hidden absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className={`${MOBILE_MEDIA_FRAME} overflow-hidden`}>
            <img
              src={MOBILE_HERO_POSTER}
              alt=""
              decoding="async"
              fetchPriority="high"
              loading="eager"
              width={1280}
              height={720}
              className={`${MOBILE_MEDIA_FILL} object-cover object-center transition-opacity duration-1000 ease-out ${
                mobileVideoReady ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {loadMobileVideo ? (
              <iframe
                src={MOBILE_VIDEO_SRC}
                className={`${MOBILE_MEDIA_FILL} transition-opacity duration-1000 ease-out ${
                  mobileVideoReady ? 'opacity-100' : 'opacity-0'
                }`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Valeria Ferrer Background Video Mobile"
                onLoad={handleMobileVideoLoad}
              />
            ) : null}
          </div>
        </div>

        {/* Desktop: YouTube */}
        <iframe
          src={DESKTOP_VIDEO_SRC}
          className="hidden md:block absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Valeria Ferrer Background Video"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          {/* Main name with better visual organization */}
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-8xl font-light tracking-wider leading-none mb-4">
              <span className="block bg-gradient-to-r from-[#f7e7ce] via-[#e8d4b0] via-[#d4af37] via-[#c2b2a3] to-[#f7e7ce] bg-clip-text text-transparent">
                Valeria Ferrer
              </span>
            </h1>

            {/* Visual separator */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
              <div className="w-2 h-2 rounded-full bg-[#c2b2a3]/50"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
            </div>

            {/* Subtitle with better positioning */}
            <div className="relative">
              <span className="text-2xl md:text-4xl tracking-[0.4em] font-light text-[#c2b2a3] block">
                Agencia Premium
              </span>

              {/* Subtle underline */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/40 to-transparent"></div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-200 mb-12 drop-shadow-xl"
        >
          Experiencias exclusivas y citas discretas en Valencia
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8"
        >
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
              <span className="relative z-10">Descubrir Escorts</span>
              <div className="absolute inset-0 bg-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Link>
          </motion.div>

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
              <span className="relative z-10">Reservar Cita Exclusiva</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#c2b2a3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
