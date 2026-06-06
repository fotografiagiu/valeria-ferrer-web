import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';
import { getGalleryImageThumbnail } from '../lib/modelGridImage';

interface GalleryModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  modelName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [landscapeByIndex, setLandscapeByIndex] = useState<Record<number, boolean>>({});
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(
    (imageUrl) =>
      imageUrl &&
      imageUrl !== '/' &&
      imageUrl !== '' &&
      typeof imageUrl === 'string' &&
      imageUrl.startsWith('/') &&
      imageUrl.length > 1
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const syncViewport = () => setIsMobileViewport(mq.matches);
    syncViewport();
    mq.addEventListener('change', syncViewport);
    return () => mq.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  /** Precargar orientación antes de pintar (móvil). */
  useEffect(() => {
    if (!isOpen || !isMobileViewport) return;

    const src = validImages[currentIndex];
    if (!src) return;

    const probe = new Image();
    probe.onload = () => {
      if (!probe.naturalWidth || !probe.naturalHeight) return;
      setLandscapeByIndex((prev) => ({
        ...prev,
        [currentIndex]: probe.naturalWidth > probe.naturalHeight,
      }));
    };
    probe.src = src;
  }, [currentIndex, isOpen, isMobileViewport, validImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigatePrevious();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const mq = window.matchMedia('(max-width: 1023px)');
    if (!mq.matches) return;

    const el = modalRef.current;
    if (!el) return;

    const blockPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    el.addEventListener('touchmove', blockPinchZoom, { passive: false });
    return () => el.removeEventListener('touchmove', blockPinchZoom);
  }, [isOpen]);

  const navigateNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const navigatePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMainImageLoad = useCallback((index: number, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    setLandscapeByIndex((prev) => ({
      ...prev,
      [index]: img.naturalWidth > img.naturalHeight,
    }));
  }, []);

  const isMobileLandscape =
    isMobileViewport && landscapeByIndex[currentIndex] === true;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touchStartX = e.touches[0].clientX;
    e.currentTarget.setAttribute('data-touch-start', touchStartX.toString());
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      const touchStartX = e.currentTarget.getAttribute('data-touch-start');
      const touchEndX = e.changedTouches[0].clientX;

      if (touchStartX) {
        const diff = parseFloat(touchStartX) - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            navigateNext();
          } else {
            navigatePrevious();
          }
        }
      }
    },
    [navigateNext, navigatePrevious]
  );

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: isMobileLandscape ? 1 : 0.8,
      filter: isMobileLandscape ? 'blur(0px)' : 'blur(10px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: isMobileLandscape ? 0.2 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: isMobileLandscape ? 1 : 0.9,
      filter: isMobileLandscape ? 'blur(0px)' : 'blur(5px)',
      transition: { duration: 0.3 },
    },
  };

  const thumbnailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
    exit: { opacity: 0, y: 20 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  const currentSrc = validImages[currentIndex];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={modalRef}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={
            isMobileLandscape
              ? 'fixed inset-0 z-50 flex flex-col bg-black lg:flex lg:items-center lg:justify-center lg:bg-black/85 lg:backdrop-blur-md'
              : 'fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md'
          }
        >
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Cerrar galería"
          >
            <X size={24} className="transition-transform group-hover:rotate-90 duration-300" />
          </motion.button>

          {validImages.length > 1 && (
            <>
              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrevious();
                }}
                className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={28} className="transition-transform group-hover:-translate-x-1 duration-300" />
              </motion.button>

              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateNext();
                }}
                className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group z-10"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={28} className="transition-transform group-hover:translate-x-1 duration-300" />
              </motion.button>

              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrevious();
                }}
                className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group z-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1 duration-300" />
              </motion.button>

              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateNext();
                }}
                className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group z-10"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={24} className="transition-transform group-hover:translate-x-1 duration-300" />
              </motion.button>
            </>
          )}

          <div
            className={
              isMobileLandscape
                ? 'relative flex flex-col w-full h-full max-lg:flex-1 max-lg:min-h-0 max-lg:justify-center max-lg:px-0 lg:items-center lg:justify-center lg:px-4'
                : 'relative flex flex-col items-center justify-center w-full h-full px-4'
            }
          >
            <motion.div
              key={currentIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={
                isMobileLandscape
                  ? 'relative w-full max-lg:flex max-lg:flex-1 max-lg:items-center max-lg:justify-center max-lg:min-h-0 max-lg:touch-none max-lg:bg-black'
                  : 'relative max-w-[90vw] max-h-[70vh] mx-auto max-lg:touch-none'
              }
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {isMobileLandscape ? (
                <img
                  src={currentSrc}
                  alt={`${modelName} - Imagen ${currentIndex + 1} de ${validImages.length}`}
                  className="block w-[100vw] max-w-[100vw] max-h-[calc(100dvh-5.5rem)] h-auto object-contain object-center mx-auto select-none lg:hidden"
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                  onLoad={(event) => handleMainImageLoad(currentIndex, event.currentTarget)}
                />
              ) : null}

              <LazyImage
                src={currentSrc}
                alt={`${modelName} - Imagen ${currentIndex + 1} de ${validImages.length}`}
                className={
                  isMobileLandscape
                    ? 'hidden lg:block max-w-full max-h-[70vh] object-contain select-none rounded-lg shadow-2xl'
                    : 'max-w-full max-h-[70vh] object-contain select-none rounded-lg shadow-2xl'
                }
                priority={true}
                sizes={isMobileLandscape ? '100vw' : '90vw'}
                onImageLoad={(event) => handleMainImageLoad(currentIndex, event.currentTarget)}
              />

              {validImages.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full ${
                    isMobileLandscape ? 'bottom-2' : 'bottom-4'
                  }`}
                >
                  <p className="text-white text-sm font-medium tracking-wider">
                    {currentIndex + 1} / {validImages.length}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {validImages.length > 1 && (
              <motion.div
                variants={thumbnailVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex gap-2 overflow-x-auto py-2 scrollbar-hide max-lg:touch-pan-x shrink-0 ${
                  isMobileLandscape
                    ? 'mt-2 px-2 w-full max-w-full lg:mt-6 lg:px-4 lg:max-w-[90vw]'
                    : 'mt-6 px-4 max-w-[90vw]'
                }`}
              >
                {validImages.map((image, index) => {
                  const isVisible = Math.abs(index - currentIndex) <= 2;
                  return (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === currentIndex
                          ? 'ring-2 ring-[#c2b2a3] scale-110'
                          : 'opacity-60 hover:opacity-80 hover:scale-105'
                      }`}
                    >
                      {isVisible ? (
                        <LazyImage
                          src={getGalleryImageThumbnail(image)}
                          alt={`${modelName} - Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                          sizes="64px"
                          priority={index === currentIndex}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#111111] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={onClose}
            aria-label="Cerrar al hacer clic fuera"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
