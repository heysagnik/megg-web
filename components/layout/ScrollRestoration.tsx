'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    const key = `scroll_${pathname}`
    const saved = sessionStorage.getItem(key)

    if (saved) {
      const y = parseInt(saved, 10)
      const tryRestore = () => {
        if (document.body.scrollHeight >= y + window.innerHeight * 0.5) {
          window.scrollTo(0, y)
          return true
        }
        return false
      }

      if (!tryRestore()) {
        let attempts = 0
        const interval = setInterval(() => {
          attempts++
          if (tryRestore() || attempts > 20) clearInterval(interval)
        }, 100)
        return () => clearInterval(interval)
      }
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll_${pathname}`, String(window.scrollY))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return null
}
