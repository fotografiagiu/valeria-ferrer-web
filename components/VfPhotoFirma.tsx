import React from 'react';
import '../styles/vf-photo-firma.css';
import { shouldShowFirma } from '../lib/firmaSkip';

/** White VF watermark overlay. Opacity is baked into the PNG (~68%). */
export const VF_FIRMA_WHITE_SRC = '/images/firma-valeria-ferrer-white.png';

type Props = {
  className?: string;
  /** Current photo URL — firma hidden if this image still has the old baked stamp. */
  photoSrc?: string | null;
  /** La galería ampliada debe mostrar la firma desde el primer fotograma. */
  priority?: boolean;
};

const VfPhotoFirma: React.FC<Props> = ({ className = '', photoSrc, priority = false }) => {
  if (!shouldShowFirma(photoSrc)) return null;
  return (
    <img
      className={`vf-photo-firma ${className}`.trim()}
      src={VF_FIRMA_WHITE_SRC}
      alt=""
      aria-hidden="true"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      width={1024}
      height={369}
      draggable={false}
    />
  );
};

export default React.memo(VfPhotoFirma);
