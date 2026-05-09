import React, { useState, useEffect } from 'react';

interface ResponsiveLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  thumbnailSrc?: string;
}

const ResponsiveLazyImage: React.FC<ResponsiveLazyImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  thumbnailSrc
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En móvil, usar thumbnail si está disponible
      if (mobile && thumbnailSrc) {
        setImageSrc(thumbnailSrc);
      } else {
        setImageSrc(src);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [src, thumbnailSrc]);

  // Generar srcset para responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || baseSrc.includes('thumbnail')) {
      return '';
    }

    // Para imágenes grandes, generar diferentes tamaños
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExtension = extensions.some(ext => baseSrc.includes(ext));
    
    if (!hasValidExtension) {
      return '';
    }

    const basePath = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    return `
      ${basePath}-400w.webp 400w,
      ${basePath}-800w.webp 800w,
      ${basePath}-1200w.webp 1200w,
      ${basePath}.webp 1600w,
      ${basePath}-400w.jpg 400w,
      ${basePath}-800w.jpg 800w,
      ${basePath}-1200w.jpg 1200w,
      ${basePath}.jpg 1600w
    `.trim();
  };

  const srcSet = generateSrcSet(imageSrc);

  return (
    <img
      src={imageSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    />
  );
};

export default ResponsiveLazyImage;
