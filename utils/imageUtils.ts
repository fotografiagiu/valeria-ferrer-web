// Utilidades para optimización de imágenes responsive

export const getThumbnailPath = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  const pathParts = imageUrl.split('/');
  
  // Si el path contiene 'gallery/', necesitamos el directorio anterior
  if (pathParts.includes('gallery')) {
    const galleryIndex = pathParts.indexOf('gallery');
    const directory = pathParts[galleryIndex - 1];
    return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
  } else {
    const directory = pathParts[pathParts.length - 2];
    return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
  }
};

export const getMobileImageSrc = (imageUrl: string, useThumbnail: boolean = true): string => {
  if (!imageUrl) return '';
  
  // En móvil, preferir thumbnails
  if (useThumbnail) {
    return getThumbnailPath(imageUrl);
  }
  
  return imageUrl;
};

export const getGalleryThumbnailPath = (imageUrl: string, index: number): string => {
  if (!imageUrl) return '';
  
  const pathParts = imageUrl.split('/');
  const directory = pathParts[pathParts.length - 2];
  
  // Para thumbnails de galería, usar el nombre original
  const fileName = pathParts[pathParts.length - 1];
  
  return `/chicas-thumbnails/${directory}/gallery-${index + 1}-thumbnail.jpg`;
};

export const getResponsiveSizes = (isMobile: boolean = false): string => {
  if (isMobile) {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
  return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw';
};

export const getPriorityLoading = (index: number, isAboveFold: boolean = false): boolean => {
  // Prioridad para las primeras 3 imágenes o las que están above the fold
  return index < 3 || isAboveFold;
};
