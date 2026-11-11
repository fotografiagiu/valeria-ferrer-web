import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  itemProp?: string;
  priority?: boolean; // For critical images
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  className,
  width,
  height,
  loading = 'lazy',
  itemProp,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Preload critical images
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div 
        className={`bg-[#1a1a1a] border border-white/10 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-600 text-xs">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <picture className={className}>
      {/* Serve the actual asset URL. Do not guess a .webp sibling that may 404:
          a broken <source> can prevent the original JPG/PNG from appearing. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        itemProp={itemProp}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
          objectFit: 'cover',
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto'
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
