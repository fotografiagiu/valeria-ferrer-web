import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MOBILE_VIDEO_ID = 'j2kjUoDzWEE';
const DESKTOP_VIDEO_ID = 'lor3hN0e600';

const YT_EMBED_PARAMS =
  'autoplay=1&mute=1&playsinline=1&loop=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0';

const mobileEmbedSrc = `https://www.youtube-nocookie.com/embed/${MOBILE_VIDEO_ID}?${YT_EMBED_PARAMS}&playlist=${MOBILE_VIDEO_ID}`;
const desktopEmbedSrc = `https://www.youtube-nocookie.com/embed/${DESKTOP_VIDEO_ID}?${YT_EMBED_PARAMS}&playlist=${DESKTOP_VIDEO_ID}`;

const MOBILE_POSTER = '/images/home-mobile-hero.jpg';
const DESKTOP_POSTER = `https://i.ytimg.com/vi/${DESKTOP_VIDEO_ID}/hqdefault.jpg`;

const MOBILE_MEDIA_CLASS =
  'pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[100vw] min-h-[110%] min-w-[100vw] origin-center object-cover';
const MOBILE_MEDIA_STYLE: CSSProperties = {
  transform: 'translate(-50%, -57%) scale(1.04, 1.19)',
};

function scheduleDeferredMount(onMount: () => void): () => void {
  let cancelled = false;
  let done = false;

  const run = () => {
    if (cancelled || done) return;
    done = true;
    onMount();
  };

  const timeoutId = window.setTimeout(run, 1500);
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const idleId =
    typeof w.requestIdleCallback === 'function'
      ? w.requestIdleCallback(run, { timeout: 2500 })
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
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => scheduleDeferredMount(() => setLoadVideo(true)), []);

  return (
    <section className="relative flex min-h-[100dvh] h-[100dvh] md:min-h-screen md:h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background Media — poster first paint, iframe after idle/1.5s */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Mobile */}
        <div className="block md:hidden absolute inset-0 overflow-hidden bg-black">
          <img
            src={MOBILE_POSTER}
            alt=""
            decoding="async"
            fetchPriority="high"
            className={`${MOBILE_MEDIA_CLASS} transition-opacity duration-500 ${
              loadVideo ? 'opacity-0' : 'opacity-100'
            }`}
            style={MOBILE_MEDIA_STYLE}
          />
          {loadVideo && (
            <iframe
              src={mobileEmbedSrc}
              className={MOBILE_MEDIA_CLASS}
              style={MOBILE_MEDIA_STYLE}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Valeria Ferrer Background Video Mobile"
            />
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block absolute inset-0 overflow-hidden bg-black">
          <img
            src={DESKTOP_POSTER}
            alt=""
            decoding="async"
            className={`pointer-events-none absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500 ${
              loadVideo ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {loadVideo && (
            <iframe
              src={desktopEmbedSrc}
              className="pointer-events-none absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Valeria Ferrer Background Video"
            />
          )}
        </div>

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
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-8xl font-light tracking-wider leading-none mb-4">
              <span className="block bg-gradient-to-r from-[#f7e7ce] via-[#e8d4b0] via-[#d4af37] via-[#c2b2a3] to-[#f7e7ce] bg-clip-text text-transparent">
                Valeria Ferrer
              </span>
            </h1>

            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
              <div className="w-2 h-2 rounded-full bg-[#c2b2a3]/50"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c2b2a3]/30 to-transparent max-w-xs"></div>
            </div>

            <div className="relative">
              <span className="text-2xl md:text-4xl tracking-[0.4em] font-light text-[#c2b2a3] block">
                Agencia Premium
              </span>
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

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-60">
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#c2b2a3] to-transparent"></div>
        <span className="text-[9px] tracking-[0.6em] uppercase text-[#c2b2a3] font-bold">
          Descubrir más
        </span>
      </div>
    </section>
  );
};

export default Hero;
