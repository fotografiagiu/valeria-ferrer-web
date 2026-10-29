import React from 'react'
import './BlackCornerRibbon.css'

/**
 * Banda BLACK diagonal, negro con ribete metálico y un pliegue en la esquina.
 * Elemento decorativo: no bloquea clics en la imagen ni en «Ver perfil».
 */
export default function BlackCornerRibbon({ profile = false }: { profile?: boolean }) {
  return (
    <div
      className={`vf-black-corner${profile ? ' vf-black-corner--profile' : ''}`}
      role="img"
      aria-label="Categoría BLACK"
    >
      <span className="vf-black-corner__fold" aria-hidden="true" />
      <span className="vf-black-corner__band" aria-hidden="true">
        <span>BLACK</span>
      </span>
    </div>
  )
}
