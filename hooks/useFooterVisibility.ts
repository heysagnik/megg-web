'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks whether the page's `<footer>` is currently in the viewport.
 * Used to hide autohide UI (e.g. the mobile catalogue filter bar) when
 * the footer is visible, so it doesn't overlap footer content.
 *
 * Returns `false` if no `<footer>` element exists on the page.
 */
export function useFooterVisibility(): boolean {
  const [intersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return intersecting
}
