'use client'

import { useState } from 'react'

export interface BuyButtonProps {
  href?: string
  onClick?: () => void
}

/**
 * Solid black CTA on the PDP. Opens the affiliate URL in a new tab
 * when `href` is set; always invokes `onClick` first (analytics).
 */
export default function BuyButton({ href, onClick }: BuyButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    onClick?.()
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="w-full min-h-13 flex items-center justify-center border-none cursor-pointer text-white uppercase font-sans text-xs font-semibold tracking-widest transition-all duration-150 ease-out mt-lg"
      style={{
        background: hovered ? '#2a2a2a' : '#0a0a0a',
        transform:  pressed ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      Buy Now
    </button>
  )
}
