import React from 'react';
import '../styles/vf-photo-firma.css';
import { shouldShowFirma } from '../lib/firmaSkip';

/** White VF watermark overlay. Opacity is baked into the PNG (~68%). */
export const VF_FIRMA_WHITE_SRC = '/images/firma-valeria-ferrer-white.png';

type Props = {
  className?: string;
  /** Current photo URL — firma hidden if this image still has the old baked stamp. */
  photoSrc?: string | null;
};

const VfPhotoFirma: React.FC<Props> = ({ className = '', photoSrc }) => {
  if (!shouldShowFirma(photoSrc)) return null;
  return (
    <img
      className={`vf-photo-firma ${className}`.trim()}
      src={VF_FIRMA_WHITE_SRC}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={1024}
      height={369}
      draggable={false}
    />
  );
};

export default React.memo(VfPhotoFirma);
