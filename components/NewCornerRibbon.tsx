import React from 'react'
import './NewCornerRibbon.css'

/**
 * Banda diagonal NOVEDAD en rosa empolvado: contrapunto visual a BLACK.
 * Solo para incorporaciones marcadas con isNew; nunca implica una tarifa.
 * No intercepta clics ni tapa controles de la ficha.
 */
export default function NewCornerRibbon({ profile = false }: { profile?: boolean }) {
  return (
    <div
      className={`vf-new-corner${profile ? ' vf-new-corner--profile' : ''}`}
      role="img"
      aria-label="Nueva incorporación"
    >
      <span className="vf-new-corner__fold" aria-hidden="true" />
      <span className="vf-new-corner__band" aria-hidden="true">
        <span>NOVEDAD</span>
      </span>
    </div>
  )
}
