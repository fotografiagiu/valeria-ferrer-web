import React, { useState, useEffect, useCallback } from 'react';
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        navigateNext(); // Swipe left - next image
      } else {
        navigatePrevious(); // Swipe right - previous image
      }
    }
  }, [navigateNext, navigatePrevious]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
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
  }, [navigateNext, navigatePrevious]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Cerrar galería"
      >
        <X size={24} className="transition-transform group-hover:rotate-90 duration-300" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={navigatePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1 duration-300" />
          </button>
          
          <button
            onClick={navigateNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={24} className="transition-transform group-hover:translate-x-1 duration-300" />
          </button>
        </>
      )}

      {/* Main image container */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] mx-auto"
        onTouchStart={(e) => {
          e.currentTarget.setAttribute('data-touch-start', e.touches[0].clientX.toString());
        }}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${modelName} - Imagen ${currentIndex + 1} de ${images.length}`}
          className="max-w-full max-h-[90vh] object-contain select-none"
          draggable={false}
        />
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full">
            <p className="text-white text-sm font-medium tracking-wider">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Cerrar al hacer clic fuera"
      />
    </div>
  );
};

export default GalleryModal;
