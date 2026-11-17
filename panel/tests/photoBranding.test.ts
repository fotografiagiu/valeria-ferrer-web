import { describe, expect, it } from 'vitest';
import { canUsePhotoAsCover, isPhotoKnownStamped, shouldPreviewGalleryWatermark } from '../web/src/lib/photoBranding';

const cataleyaStamped = '/chicas/cataleya-model-agency-valencia-vf/gallery/01.jpg';
const cataleyaCleanCover = '/chicas/cataleya-model-agency-valencia-vf/portada.jpg';
const belenStamped = '/chicas/belen-model-agency-valencia-vf/gallery/01.jpg';

// Este test usa el inventario real de fotos antiguas con cuño ya incrustado.
describe('cuño visual solo en galería y portada limpia', () => {
  it('detecta imágenes antiguas ya estampadas sin añadir un segundo cuño', () => {
    expect(isPhotoKnownStamped(cataleyaStamped)).toBe(true);
    expect(isPhotoKnownStamped(belenStamped)).toBe(true);
    expect(shouldPreviewGalleryWatermark(cataleyaStamped, 1)).toBe(false);
  });

  it('no añade un cuño digital en posición de portada', () => {
    expect(shouldPreviewGalleryWatermark(cataleyaCleanCover, 0)).toBe(false);
    expect(shouldPreviewGalleryWatermark(cataleyaCleanCover, 2)).toBe(true);
  });

  it('impide que una galería ya marcada se convierta en portada por accidente', () => {
    expect(canUsePhotoAsCover(cataleyaStamped, cataleyaCleanCover)).toBe(false);
    expect(canUsePhotoAsCover(cataleyaCleanCover, cataleyaStamped)).toBe(true);
    expect(canUsePhotoAsCover(cataleyaStamped, cataleyaStamped)).toBe(true);
    expect(canUsePhotoAsCover('', cataleyaCleanCover)).toBe(false);
  });
});
