'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useScrollRestoration } from './useScrollRestoration'
import {
  searchProductsRaw,
  type SearchResult,
  type SearchFilters,
  type SearchSort,
} from '@/lib/api'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'

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
}

export function useSearch() {
  const router   = useRouter()
  const pathname = usePathname()
  const raw      = useSearchParams()

  const params    = useMemo(() => normalise(raw), [raw])
  const filterKey = useMemo(() => sortedKey(params), [params])
  const facetScopeKey = useMemo(() => {
    const scope = new URLSearchParams(params)
    for (const key of ['subcategory', 'color', 'brand', 'page']) scope.delete(key)
    return sortedKey(scope)
  }, [params])
  const hasQuery  = !!params.get('query')
  const defaultSort: SearchSort = hasQuery ? 'relevance' : 'newest'

  const [page, setPage]    = useState(1)
  const [data, setData]    = useState<SearchResult | null>(null)
  const [loading, setLoad] = useState(false)
  const [facetState, setFacetState] = useState<{ scopeKey: string; filters: SearchFilters | null }>({ scopeKey: '', filters: null })
  const facetStateRef = useRef(facetState)
  const facetRequestRef = useRef(new Map<string, Promise<void>>())
  const restoredPageRef    = useRef<number | null>(null)
  const isMountedRef       = useRef(false)

  const rememberFacets = useCallback((scopeKey: string, filters: SearchFilters) => {
    const next = { scopeKey, filters }
    facetStateRef.current = next
    setFacetState(next)
  }, [])

  const fetchBaseFacets = useCallback((scopeKey: string, requestParams: URLSearchParams) => {
    if (facetStateRef.current.scopeKey === scopeKey && facetStateRef.current.filters) return
    if (facetRequestRef.current.has(scopeKey)) return

    const baseParams = new URLSearchParams(requestParams)
    for (const key of ['subcategory', 'color', 'brand']) baseParams.delete(key)
    baseParams.set('page', '1')
    baseParams.set('limit', '1')

    const request = searchProductsRaw(baseParams)
      .then(result => {
        if (result.availableFilters) rememberFacets(scopeKey, result.availableFilters)
      })
      .catch(() => {})
      .finally(() => facetRequestRef.current.delete(scopeKey))
    facetRequestRef.current.set(scopeKey, request)
  }, [rememberFacets])

  useScrollRestoration<SearchResult>({
    key: 'search',
    data,
    page,
    onRestore: useCallback((cachedData: SearchResult, cachedPage: number) => {
      restoredPageRef.current = cachedPage
      setData(cachedData)
      setPage(cachedPage)
      const hasFacetSelection = ['subcategory', 'color', 'brand'].some(key => params.getAll(key).length > 0)
      if (hasFacetSelection) fetchBaseFacets(facetScopeKey, params)
      else if (cachedData.availableFilters) rememberFacets(facetScopeKey, cachedData.availableFilters)
    }, [facetScopeKey, fetchBaseFacets, params, rememberFacets]),
  })
  useEffect(() => {
    if (isMountedRef.current) {
      // Intentional: reset pagination when the search filters change.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1)
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
    // Intentional: indicate that the new product request has started.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoad(true)
    const p = new URLSearchParams(params)

    if (!p.get('sort')) p.set('sort', defaultSort)
    p.set('page', String(page))
    p.set('limit', String(BROWSE_PAGE_SIZE))

    searchProductsRaw(p, { signal: ctrl.signal })
      .then(res => {
        if (ctrl.signal.aborted) return
        setData(res)
        const hasFacetSelection = ['subcategory', 'color', 'brand'].some(key => p.getAll(key).length > 0)
        if (!hasFacetSelection && res.availableFilters) rememberFacets(facetScopeKey, res.availableFilters)
        else if (hasFacetSelection) fetchBaseFacets(facetScopeKey, p)
      })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setLoad(false) })

    return () => ctrl.abort()
  }, [filterKey, page, defaultSort]) // eslint-disable-line react-hooks/exhaustive-deps

  // URL mutation — coalesced per animation frame
  const paramsRef = useRef(params)

  useEffect(() => {
    paramsRef.current = params
  }, [params])
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

  const changePage = useCallback((nextPage: number) => {
    if (nextPage >= 1 && nextPage <= (data?.totalPages ?? 0)) {
      setData(current => current ? { ...current, products: [] } : current)
      setPage(nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [data?.totalPages])

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
    page,
    totalPages: data?.totalPages ?? 0,
    availableFilters: facetState.scopeKey === facetScopeKey
      ? facetState.filters
      : data?.availableFilters ?? null,
    update, toggleMulti, addMulti, clearAll, changePage,
  }
}
