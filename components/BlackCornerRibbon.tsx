import React from 'react'
import './BlackCornerRibbon.css'

/**
 * Thin diagonal BLACK corner ribbon (Laura reference). Decorative only.
 */
export default function BlackCornerRibbon({ profile = false }: { profile?: boolean }) {
  return (
    <div
      className={`vf-black-corner${profile ? ' vf-black-corner--profile' : ''}`}
      role="img"
      aria-label="Categoría BLACK"
    >
      <span className="vf-black-corner__band" aria-hidden="true">
        <span>BLACK</span>
      </span>
    </div>
  )
}
