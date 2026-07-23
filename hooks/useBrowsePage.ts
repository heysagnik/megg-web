'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { AvailableFilters, ProductsResponse, Product, SortOption } from '@/lib/api'
import { browseFiltersToSearchParams, type BrowseFilters } from '@/lib/browseFilters'
import { BROWSE_PAGE_SIZE, INFINITE_SCROLL_PRECEDENCE_PX } from '@/lib/constants'
import { useFooterVisibility } from './useFooterVisibility'
import { useScrollHideOnIdle } from './useScrollHideOnIdle'

/**
 * Fetcher invoked on every page load / filter change.
 * The hook owns paging state; the page owns how to translate
 * `(pageNum, filters, reset)` into an API call.
 */
export type BrowseFetcher = (
  pageNum: number,
  filters: BrowseFilters,
  reset: boolean,
) => Promise<ProductsResponse>

export interface UseBrowsePageOptions {
  /** First-page data already fetched on the server. */
  initialProducts: Product[]
  initialTotal: number
  initialFilters: AvailableFilters
  /** Initial client-side filter state — usually `BROWSE_EMPTY`. */
  initialClientFilters: BrowseFilters
  /** True when the first page (server-rendered) already filters the list. */
  initialPageIsFiltered?: boolean
  fetcher: BrowseFetcher
}

export interface UseBrowsePageResult {
  products: Product[]
  total: number
  hasMore: boolean
  page: number
  filters: BrowseFilters
  /** Facet set driving both the left-rail nav and the FilterPanel. Stays
   *  pinned to the broadest (filter-free) response seen so option lists
   *  never shrink away just because a filter is active. */
  avail: AvailableFilters
  loading: boolean
  filterOpen: boolean
  showMbar: boolean
  footerIntersecting: boolean
  sentinelRef: React.RefObject<HTMLDivElement | null>
  setFilterOpen: (v: boolean) => void
  changeFilters: (next: BrowseFilters) => void
}

/**
 * State + side-effects shared by every browse-style page
 * (`/under699`, `/products`, `/category/[category]`).
 *
 * Owns paging, filter state, the infinite-scroll sentinel, ESC-to-close,
 * the mobile sticky-bar auto-hide, and the footer-visibility observer.
 * The two latter concerns live in dedicated hooks (`useScrollHideOnIdle`,
 * `useFooterVisibility`) so this hook stays a single source of truth
 * for *product-list* state.
 */
export function useBrowsePage({
  initialProducts,
  initialTotal,
  initialFilters,
  initialClientFilters,
  initialPageIsFiltered = false,
  fetcher,
}: UseBrowsePageOptions): UseBrowsePageResult {
  const router   = useRouter()
  const pathname = usePathname()

  const [products, setProducts]     = useState<Product[]>(initialProducts)
  const [total, setTotal]           = useState<number>(initialTotal)
  const [hasMore, setHasMore]       = useState<boolean>(
    initialProducts.length === BROWSE_PAGE_SIZE && !initialPageIsFiltered,
  )
  const [page, setPage]             = useState<number>(1)
  const [filters, setFilters]       = useState<BrowseFilters>(initialClientFilters)
  const [avail, setAvail]           = useState<AvailableFilters>(initialFilters)
  const [loading, setLoading]       = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const [showMbar, setShowMbar]           = useScrollHideOnIdle()
  const footerIntersecting                = useFooterVisibility()

  // Request-id token: a new request makes the older one stale so we
  // ignore its result if it lands late. Avoids the "unlock the ref"
  // hack previously needed when `changeFilters` interrupted an in-flight load.
  const latestRequestIdRef = useRef(0)
  const sentinelRef         = useRef<HTMLDivElement | null>(null)

  // ── Fetch loop ────────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (pageNum: number, f: BrowseFilters, reset: boolean) => {
      const id = ++latestRequestIdRef.current
      setLoading(true)
      try {
        const res = await fetcher(pageNum, f, reset)
        if (id !== latestRequestIdRef.current) return /* stale */

        const incoming = res.products ?? []
        if (res.total != null) setTotal(res.total)
        setHasMore(incoming.length === BROWSE_PAGE_SIZE)

        // avail only ever tracks the broadest (filter-free) facet set — never
        // narrowed by an active filter — so neither the sidebar nor the
        // FilterPanel lose options just because something is selected.
        const noFilters = !f.category && !f.subcategory && !f.color && !f.brand && f.maxPrice == null
        if (reset && noFilters && res.availableFilters) setAvail(res.availableFilters)

        setProducts(prev => {
          if (reset) return incoming
          const seen = new Set(prev.map(p => p.id))
          return [...prev, ...incoming.filter(p => !seen.has(p.id))]
        })
      } catch {
        if (id !== latestRequestIdRef.current) return
        setHasMore(false)
      } finally {
        if (id === latestRequestIdRef.current) setLoading(false)
      }
    },
    [fetcher],
  )

  // Initial fetch if page was loaded with URL filters present
  const isInitialMountedRef = useRef(false)
  useEffect(() => {
    if (!isInitialMountedRef.current) {
      isInitialMountedRef.current = true
      if (initialPageIsFiltered) {
        void fetchPage(1, initialClientFilters, true)
      }
    }
  }, [initialPageIsFiltered, initialClientFilters, fetchPage])

  const changeFilters = useCallback(
    async (next: BrowseFilters) => {
      setFilters(next)
      setPage(1)
      setHasMore(true)
      if (typeof window !== 'undefined') {
        const params = browseFiltersToSearchParams(next)
        const qs = params.toString()
        const newUrl = qs ? `${pathname}?${qs}` : pathname
        router.replace(newUrl, { scroll: false })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      await fetchPage(1, next, true)
    },
    [fetchPage, pathname, router],
  )

  // ── Infinite-scroll sentinel ─────────────────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        if (!hasMore || loading) return
        const next = page + 1
        setPage(next)
        void fetchPage(next, filters, false)
      },
      { rootMargin: `${INFINITE_SCROLL_PRECEDENCE_PX}px` },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, page, filters, fetchPage])

  // ── ESC closes the filter panel ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilterOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return {
    products, total, hasMore, page, filters, avail,
    loading, filterOpen, showMbar, footerIntersecting,
    sentinelRef, setFilterOpen, changeFilters,
  }
}

export type { SortOption }
