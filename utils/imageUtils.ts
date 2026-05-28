// Utilidades para optimización de imágenes responsive

import {
  getGalleryImageThumbnail,
  getModelCoverImage,
  getModelCoverThumbnailPath,
  resolveOriginalImageUrl,
} from '../lib/modelGridImage';

export { getGalleryImageThumbnail, getModelCoverImage, getModelCoverThumbnailPath };

/** @deprecated Usar getModelCoverThumbnailPath — solo para previews pequeños */
export const getThumbnailPath = getModelCoverThumbnailPath;

export const getMobileImageSrc = (imageUrl: string, useThumbnail = false): string => {
  if (!imageUrl) return '';
  return useThumbnail ? getModelCoverThumbnailPath(imageUrl) : resolveOriginalImageUrl(imageUrl);
};

/** @deprecated Usar getGalleryImageThumbnail */
export const getGalleryThumbnailPath = (imageUrl: string, _index: number): string => {
  return getGalleryImageThumbnail(imageUrl);
};

export const getResponsiveSizes = (isMobile: boolean = false): string => {
  if (isMobile) {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
  return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw';
};

export const getPriorityLoading = (index: number, isAboveFold: boolean = false): boolean => {
  return index < 3 || isAboveFold;
};
