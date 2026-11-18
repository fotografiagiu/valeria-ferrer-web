import { describe, expect, it } from 'vitest';
import { canUsePhotoAsCover, isPhotoKnownStamped, shouldPreviewGalleryWatermark } from '../web/src/lib/photoBranding';

import stampedInventory from '../../data/firma-skip-stamped.json';

// Use actual inventory entries instead of hard-coding photos that may have
// since been replaced with clean originals. Replacements must not break
// deployment of the private management panel.
const [cataleyaStamped, belenStamped] = stampedInventory.skipFirmaUrls.filter(
  (path: string) => path.startsWith('/chicas/')
);
const cataleyaCleanCover = '/chicas/test-fixture/clean-cover.jpg';

// Este test usa el inventario actual de fotos con cuño ya incrustado.
describe('cuño visual solo en galería y portada limpia', () => {
  it('detecta imágenes antiguas ya estampadas sin añadir un segundo cuño', () => {
    expect(cataleyaStamped).toBeTruthy();
    expect(belenStamped).toBeTruthy();
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
