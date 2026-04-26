'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/* ─── Types ──────────────────────────────────────────── */
interface BarState {
  visible:    boolean
  scaleX:     number
  opacity:    number
  transition: string
}

const HIDDEN: BarState = {
  visible:    false,
  scaleX:     0,
  opacity:    1,
  transition: 'none',
}

/* ─── Component ──────────────────────────────────────── */
export default function ProgressBar() {
  const pathname          = usePathname()
  const prevPathnameRef   = useRef(pathname)
  const timersRef         = useRef<ReturnType<typeof setTimeout>[]>([])
  const [bar, setBar]     = useState<BarState>(HIDDEN)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    // Skip the very first render — no navigation has happened yet
    if (pathname === prevPathnameRef.current) return
    prevPathnameRef.current = pathname

    clearTimers()

    // ── Step 1: Mount the bar at scaleX(0), invisible width ─
    setBar({
      visible:    true,
      scaleX:     0,
      opacity:    1,
      transition: 'none',
    })

    // ── Step 2: Next paint → animate to 70 % ─────────────────
    const t1 = setTimeout(() => {
      setBar({
        visible:    true,
        scaleX:     0.7,
        opacity:    1,
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      })
    }, 16) // one rAF frame so the transition fires

    // ── Step 3: Jump to 100 % ─────────────────────────────────
    const t2 = setTimeout(() => {
      setBar({
        visible:    true,
        scaleX:     1,
        opacity:    1,
        transition: 'transform 0.2s ease-out',
      })
    }, 430) // 16 + 400ms (loading phase) + 14ms buffer

    // ── Step 4: Fade out ──────────────────────────────────────
    const t3 = setTimeout(() => {
      setBar({
        visible:    true,
        scaleX:     1,
        opacity:    0,
        transition: 'opacity 0.3s ease',
      })
    }, 660) // + 200ms (complete phase) + 30ms buffer

    // ── Step 5: Unmount ───────────────────────────────────────
    const t4 = setTimeout(() => {
      setBar(HIDDEN)
    }, 990) // + 300ms (fade) + 30ms buffer

    timersRef.current = [t1, t2, t3, t4]

    return clearTimers
  }, [pathname])

  if (!bar.visible) return null

  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        height:          '1.5px',
        backgroundColor: 'var(--color-black)',
        zIndex:          9999,
        transformOrigin: 'left center',
        pointerEvents:   'none',
        transform:       `scaleX(${bar.scaleX})`,
        opacity:         bar.opacity,
        transition:      bar.transition,
        willChange:      'transform, opacity',
      }}
    />
  )
}
