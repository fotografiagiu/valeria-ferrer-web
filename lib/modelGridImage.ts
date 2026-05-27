/** Rutas de imagen para cards del catálogo (preview y grid). */
export function getModelThumbnailPath(coverImageUrl: string): string {
  const pathParts = coverImageUrl.split('/');

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

export function getModelCardImage(slug: string, coverImageUrl: string): string {
  return slug === 'mia' ? coverImageUrl : getModelThumbnailPath(coverImageUrl);
}
