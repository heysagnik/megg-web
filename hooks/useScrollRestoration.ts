'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useScrollRestoration<T>({
  key,
  data,
  page,
  onRestore,
  enabled = true,
}: {
  key: string
  data: T | null
  page: number
  onRestore: (cachedData: T, cachedPage: number) => void
  enabled?: boolean
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isRestored = useRef(false)

  const cacheKey = `megg-scroll:${key}:${pathname}?${searchParams.toString()}`

  // 1. Restore state on mount
  useEffect(() => {
    if (!enabled) return
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        onRestore(parsed.data, parsed.page)
        
        // Wait for rendering to settle (double animation frames to ensure DOM height is updated)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, parsed.scrollY)
            isRestored.current = true
          })
        })
      } catch (e) {
        console.error('Failed to restore scroll position', e)
        isRestored.current = true
      }
    } else {
      isRestored.current = true
    }
  }, [cacheKey, enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Save state on scroll and unmount
  useEffect(() => {
    if (!enabled || !data) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      if (!isRestored.current) return
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const state = {
          data,
          page,
          scrollY: window.scrollY,
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(state))
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
      if (isRestored.current) {
        const state = {
          data,
          page,
          scrollY: window.scrollY,
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(state))
      }
    }
  }, [cacheKey, enabled, data, page])
}
