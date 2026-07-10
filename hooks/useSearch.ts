'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useScrollRestoration } from './useScrollRestoration'
import {
  searchProductsRaw,
  type SearchResult,
  type SearchSort,
} from '@/lib/api'

const PAGE_SIZE = 20

function sortedKey(p: URLSearchParams): string {
  const rows = Array.from(p.entries()).filter(([k]) => k !== 'page')
  rows.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return rows.map(([k, v]) => `${k}=${v}`).join('&')
}

function normalise(p: URLSearchParams): URLSearchParams {
  const out = new URLSearchParams(p)
  if (!out.has('query') && out.has('q')) {
    out.set('query', out.get('q')!)
    out.delete('q')
  }
  return out
}export function useSearch() {
  const router   = useRouter()
  const pathname = usePathname()
  const raw      = useSearchParams()

  const params    = useMemo(() => normalise(raw), [raw])
  const filterKey = useMemo(() => sortedKey(params), [params])
  const hasQuery  = !!params.get('query')
  const defaultSort: SearchSort = hasQuery ? 'relevance' : 'newest'

  const [page, setPage]    = useState(1)
  const [data, setData]    = useState<SearchResult | null>(null)
  const [loading, setLoad] = useState(false)
  const accumulated        = useRef<SearchResult['products']>([])
  const restoredPageRef    = useRef<number | null>(null)
  const isMountedRef       = useRef(false)

  useScrollRestoration<SearchResult>({
    key: 'search',
    data,
    page,
    onRestore: useCallback((cachedData: SearchResult, cachedPage: number) => {
      restoredPageRef.current = cachedPage
      accumulated.current = cachedData.products
      setData(cachedData)
      setPage(cachedPage)
    }, []),
  })

  useEffect(() => {
    if (isMountedRef.current) {
      setPage(1)
      accumulated.current = []
    } else {
      isMountedRef.current = true
    }
  }, [filterKey])

  useEffect(() => {
    if (restoredPageRef.current !== null) {
      if (restoredPageRef.current === page) {
        restoredPageRef.current = null
      }
      return
    }

    const ctrl = new AbortController()
    setLoad(true)
    const p = new URLSearchParams(params)
    if (!p.get('sort')) p.set('sort', defaultSort)
    p.set('page', String(page))
    p.set('limit', String(PAGE_SIZE))

    searchProductsRaw(p)
      .then(res => {
        if (ctrl.signal.aborted) return
        const seen   = new Set(accumulated.current.map(x => x.id))
        const merged = page === 1
          ? res.products
          : [...accumulated.current, ...res.products.filter(x => !seen.has(x.id))]
        accumulated.current = merged
        setData({ ...res, products: merged })
      })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setLoad(false) })

    return () => ctrl.abort()
  }, [filterKey, page, defaultSort]) // eslint-disable-line react-hooks/exhaustive-deps

  // URL mutation — coalesced per animation frame
  const paramsRef   = useRef(params)
  paramsRef.current = params
  const pending     = useRef<URLSearchParams | null>(null)
  const rafId       = useRef<number | null>(null)

  const flush = useCallback(() => {
    rafId.current = null
    const next = pending.current
    pending.current = null
    if (!next) return
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [pathname, router])

  const enqueue = useCallback((mutate: (p: URLSearchParams) => void) => {
    if (!pending.current) pending.current = new URLSearchParams(paramsRef.current)
    mutate(pending.current)
    if (rafId.current == null) rafId.current = requestAnimationFrame(flush)
  }, [flush])

  const update = useCallback((patch: Record<string, string | string[] | number | null | undefined>) => {
    enqueue(p => {
      for (const [k, v] of Object.entries(patch)) {
        p.delete(k)
        if (v == null || v === '') continue
        if (Array.isArray(v)) v.forEach(x => x != null && x !== '' && p.append(k, String(x)))
        else p.set(k, String(v))
      }
    })
  }, [enqueue])

  const toggleMulti = useCallback((key: string, value: string) => {
    enqueue(p => {
      const cur = p.getAll(key)
      p.delete(key)
      const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
      next.forEach(v => p.append(key, v))
    })
  }, [enqueue])

  const addMulti = useCallback((key: string, value: string) => {
    enqueue(p => { if (!p.getAll(key).includes(value)) p.append(key, value) })
  }, [enqueue])

  const clearAll = useCallback((opts: { keepQuery?: boolean } = {}) => {
    enqueue(p => {
      const q = opts.keepQuery ? p.get('query') : null
      Array.from(p.keys()).forEach(k => p.delete(k))
      if (q) p.set('query', q)
    })
  }, [enqueue])

  const loadMore = useCallback(() => setPage(n => n + 1), [])

  const filters = useMemo(() => ({
    query:         params.get('query')    ?? '',
    category:      params.get('category') ?? '',
    subcategories: params.getAll('subcategory'),
    colors:        params.getAll('color'),
    brands:        params.getAll('brand'),
    minPrice:      params.get('minPrice') ?? '',
    maxPrice:      params.get('maxPrice') ?? '',
    sort:          params.get('sort')     ?? '',
  }), [params])

  return {
    data, loading, filters, defaultSort,
    hasMore: page < (data?.totalPages ?? 0),
    availableFilters: data?.availableFilters ?? null,
    update, toggleMulti, addMulti, clearAll, loadMore,
  }
}
