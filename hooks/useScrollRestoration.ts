'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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

  useIsoLayoutEffect(() => {
    if (!enabled) return
    const cached = sessionStorage.getItem(cacheKey)
    if (!cached) {
      isRestored.current = true
      return
    }
    try {
      const parsed = JSON.parse(cached) as { data: T; page: number; scrollY: number }
      onRestore(parsed.data, parsed.page)
    } catch (e) {
      console.error('Failed to restore scroll position', e)
      isRestored.current = true
      return
    }
    requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(sessionStorage.getItem(cacheKey) ?? '') as { scrollY: number }
        window.scrollTo(0, parsed.scrollY ?? 0)
      } catch {
        window.scrollTo(0, 0)
      }
      isRestored.current = true
    })
  }, [cacheKey, enabled])

  useEffect(() => {
    if (!enabled || !data) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      if (!isRestored.current) return
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, page, scrollY: window.scrollY }))
      }, 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
      if (isRestored.current) {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, page, scrollY: window.scrollY }))
      }
    }
  }, [cacheKey, enabled, data, page])
}
