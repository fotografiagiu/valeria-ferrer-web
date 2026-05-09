import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  thumbnailSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23111111" width="400" height="600"/%3E%3C/svg%3E',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  title,
  loading = priority ? 'eager' : 'lazy',
  thumbnailSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Priority images load immediately
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01, // Earlier trigger for better UX
        rootMargin: '100px 0px 100px 0px' // Larger margin for smoother loading
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Generate WebP and fallback sources (only if WebP exists)
  const generateWebPSrc = (originalSrc: string) => {
    if (originalSrc.includes('.jpg') || originalSrc.includes('.jpeg') || originalSrc.includes('.png')) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return originalSrc;
  };

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    if (!originalSrc || originalSrc.includes('thumbnail')) {
      return '';
    }

    // For thumbnails, use smaller sizes
    if (originalSrc.includes('thumbnail')) {
      return `${originalSrc} 200w`;
    }

    const extensions = ['.jpg', '.jpeg', '.png'];
    const hasValidExtension = extensions.some(ext => originalSrc.includes(ext));
    
    if (!hasValidExtension) {
      return '';
    }

    // Generate different sizes for responsive images
    const basePath = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    
    return `
      ${basePath}-400w.jpg 400w,
      ${basePath}-800w.jpg 800w,
      ${basePath}-1200w.jpg 1200w,
      ${originalSrc} 1600w
    `.trim();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback for broken images
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = 'true';
      // Try to load the original image if WebP failed
      if (img.src.includes('.webp')) {
        img.src = img.src.replace('.webp', '.jpg');
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      <picture>
        {/* WebP source - only add if we want to use WebP */}
        {/* Temporarily disabled until WebP images are generated */}
        {/* <source
          srcSet={isInView || priority ? generateWebPSrc(src) : placeholder}
          type="image/webp"
        /> */}
        <img
          ref={imgRef}
          src={isInView || priority ? src : placeholder}
          alt={alt}
          title={title || alt}
          className={`transition-all duration-300 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-60 scale-105'} ${className}`}
          loading={loading}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleImageError}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#1a1a1a] animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
