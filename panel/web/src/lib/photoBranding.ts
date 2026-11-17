import { shouldShowFirma } from '../../../../lib/firmaSkip';

/** Lista heredada de imágenes que ya llevan el cuño grabado en sus píxeles. */
export function isPhotoKnownStamped(path: string): boolean {
  return Boolean(path) && !shouldShowFirma(path);
}

/** La portada no se marca con una imagen conocida como estampada. Las portadas antiguas no se reescriben. */
export function canUsePhotoAsCover(nextPath: string, currentPath: string): boolean {
  return Boolean(nextPath) && (nextPath === currentPath || !isPhotoKnownStamped(nextPath));
}

/** El cuño se pinta solo en las posiciones de galería y nunca se duplica sobre fotos estampadas. */
export function shouldPreviewGalleryWatermark(path: string, index: number): boolean {
  return index > 0 && Boolean(path) && shouldShowFirma(path);
}
