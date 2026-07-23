'use client'

import { useEffect, useRef, useState } from 'react'
import { MOBILE_BAR_IDLE_SHOW_MS, MOBILE_BAR_MIN_SCROLL_Y } from '@/lib/constants'

/**
 * Auto-hide a sticky element when the user scrolls down past `minScrollY`,
 * re-show when they scroll up, and re-show after `idleMs` of no scrolling.
 *
 * Internally coalesces scroll events into one rAF tick so the underlying
 * `setState` only fires ~once per frame regardless of event rate.
 *
 * Returns `[visible, setVisible]` — the setter lets callers force-hide /
 * force-show without sending another scroll event.
 */
export function useScrollHideOnIdle(): [
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [visible, setVisible] = useState(true)
  const lastYRef = useRef<number | null>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const y = window.scrollY
        const lastY = lastYRef.current ?? y
        lastYRef.current = y

        // Moving down past the threshold hides; moving up shows immediately.
        if (y > lastY && y > MOBILE_BAR_MIN_SCROLL_Y) setVisible(false)
        else if (y < lastY) setVisible(true)

        // Always re-show after staying idle.
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        idleTimerRef.current = setTimeout(() => setVisible(true), MOBILE_BAR_IDLE_SHOW_MS)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  return [visible, setVisible]
}
