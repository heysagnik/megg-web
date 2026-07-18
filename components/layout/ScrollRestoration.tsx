'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()
  const wasPopstateRef = useRef(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
    const onPopstate = () => {
      wasPopstateRef.current = true
      if (document.documentElement) {
        document.documentElement.setAttribute('data-scroll-instant', 'true')
      }
    }
    window.addEventListener('popstate', onPopstate, { passive: true })
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  useEffect(() => {
    if (wasPopstateRef.current) {
      wasPopstateRef.current = false
      const root = document.documentElement
      requestAnimationFrame(() => {
        root.removeAttribute('data-scroll-instant')
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
