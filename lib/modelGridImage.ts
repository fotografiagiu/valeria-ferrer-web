/** Rutas de imagen: original (chicas) vs comprimida (chicas-thumbnails). */

export function resolveOriginalImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
}

/** Portada / card principal — siempre original alta calidad. */
export function getModelCoverImage(coverImageUrl: string): string {
  return resolveOriginalImageUrl(coverImageUrl);
}

/** Miniatura de portada — solo UI pequeña (mockups, hover, etc.). */
export function getModelCoverThumbnailPath(coverImageUrl: string): string {
  const normalized = resolveOriginalImageUrl(coverImageUrl);

  // Portadas con nombre propio (p. ej. portada-lenceria-jul2026.jpg): misma ruta en thumbnails.
  // Evita cache immutable de cover-thumbnail.jpg al renovar fotos.
  const isGenericCover =
    /\/portada(-nueva)?\.jpg$/i.test(normalized) || /\/cover\.jpg$/i.test(normalized);
  if (!isGenericCover) {
    if (normalized.includes('/chicas-optimized/')) {
      return normalized.replace('/chicas-optimized/', '/chicas-thumbnails/');
    }
    if (normalized.includes('/chicas/')) {
      return normalized.replace('/chicas/', '/chicas-thumbnails/');
    }
  }

  const pathParts = normalized.split('/');

  const optimizedIndex = pathParts.indexOf('chicas-optimized');
  const chicasIndex = pathParts.indexOf('chicas');

  let baseDirectory = '';

  if (optimizedIndex !== -1) {
    baseDirectory = pathParts[optimizedIndex + 1];
  } else if (chicasIndex !== -1) {
    baseDirectory = pathParts[chicasIndex + 1];
  }

  if (!baseDirectory) {
    if (pathParts.includes('gallery')) {
      const galleryIndex = pathParts.indexOf('gallery');
      const directory = pathParts[galleryIndex - 1];
      return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
    }

    const directory = pathParts[pathParts.length - 2];
    return `/chicas-thumbnails/${directory}/cover-thumbnail.jpg`;
  }

  return `/chicas-thumbnails/${baseDirectory}/cover-thumbnail.jpg`;
}

/** Grid de inicio, hubs y catálogo editorial — portada original. */
export function getModelCardImage(_slug: string, coverImageUrl: string): string {
  return getModelCoverImage(coverImageUrl);
}

/** Portada del grid según viewport/modo (móvil 2×2 → cover-thumbnail). */
export function getModelGridCoverSrc(
  coverImageUrl: string,
  options: { useThumbnail: boolean }
): string {
  if (!coverImageUrl) return '';
  return options.useThumbnail
    ? getModelCoverThumbnailPath(coverImageUrl)
    : getModelCoverImage(coverImageUrl);
}

/**
 * Miniatura de una imagen de galería (misma convención de nombre en chicas-thumbnails).
 * Usada en strip desktop, carrusel del modal y hover del grid.
 */
export function getGalleryImageThumbnail(imageUrl: string): string {
  const normalized = resolveOriginalImageUrl(imageUrl);
  if (!normalized || normalized.includes('/chicas-thumbnails/')) {
    return normalized;
  }

  const thumbBase = normalized.includes('/chicas-optimized/')
    ? normalized.replace('/chicas-optimized/', '/chicas-thumbnails/')
    : normalized.replace('/chicas/', '/chicas-thumbnails/');

  if (normalized.endsWith('/portada.jpg') || normalized.endsWith('/portada-nueva.jpg')) {
    return thumbBase.replace(/\/portada(-nueva)?\.jpg$/, '/cover-thumbnail.jpg');
  }

  if (normalized.endsWith('/cover.jpg')) {
    return thumbBase.replace('/cover.jpg', '/cover-thumbnail.jpg');
  }

  return thumbBase;
}
