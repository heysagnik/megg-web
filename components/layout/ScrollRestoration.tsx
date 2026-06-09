'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()

  // Always open to top on route change, even on back button
  useEffect(() => {
    // Disable native browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Force scroll to top
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
