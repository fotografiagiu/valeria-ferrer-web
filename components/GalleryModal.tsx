import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  modelName 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens with different initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
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

  // Prevent body scroll when modal is open
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

  const navigateNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const navigatePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    e.currentTarget.setAttribute('data-touch-start', touchStartX.toString());
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchStartX = e.currentTarget.getAttribute('data-touch-start');
    const touchEndX = e.changedTouches[0].clientX;
    
    if (touchStartX) {
      const diff = parseFloat(touchStartX) - touchEndX;
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          navigateNext(); // Swipe left - next image
        } else {
          navigatePrevious(); // Swipe right - previous image
        }
      }
    }
  }, [navigateNext, navigatePrevious]);

  if (!isOpen) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      filter: 'blur(5px)',
      transition: { duration: 0.3 } 
    }
  };

  const thumbnailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.2
      }
    },
    exit: { opacity: 0, y: 20 }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        delay: 0.1
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          {/* Close button */}
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

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              {/* Desktop navigation - positioned closer to image */}
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

              {/* Mobile navigation - keep current design */}
              <motion.button
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrevious();
                }}
                className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
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
                className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={24} className="transition-transform group-hover:translate-x-1 duration-300" />
              </motion.button>
            </>
          )}

          {/* Main image container */}
          <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
            <motion.div
              key={currentIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-[90vw] max-h-[70vh] mx-auto"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[currentIndex]}
                alt={`${modelName} - Imagen ${currentIndex + 1} de ${images.length}`}
                className="max-w-full max-h-[70vh] object-contain select-none rounded-lg shadow-2xl"
                draggable={false}
              />
              
              {/* Image counter */}
              {images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full"
                >
                  <p className="text-white text-sm font-medium tracking-wider">
                    {currentIndex + 1} / {images.length}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <motion.div
                variants={thumbnailVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 flex gap-2 overflow-x-auto py-2 px-4 max-w-[90vw] scrollbar-hide"
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentIndex 
                        ? 'ring-2 ring-[#c2b2a3] scale-110' 
                        : 'opacity-60 hover:opacity-80 hover:scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Click outside to close */}
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
