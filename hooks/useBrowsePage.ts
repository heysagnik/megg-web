'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AvailableFilters, ProductsResponse, Product, SortOption } from '@/lib/api'
import {
  browseFiltersFromSearchParams,
  browseFiltersToSearchParams,
  hasBrowseFilterSelections,
  type BrowseFilters,
} from '@/lib/browseFilters'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'
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
  page: number
  totalPages: number
  filters: BrowseFilters
  /** Facet set driving both the left-rail nav and the FilterPanel. Stays
   *  pinned to the broadest (filter-free) response seen so option lists
   *  never shrink away just because a filter is active. */
  avail: AvailableFilters
  loading: boolean
  filterOpen: boolean
  showMbar: boolean
  footerIntersecting: boolean
  setFilterOpen: (v: boolean) => void
  changeFilters: (next: BrowseFilters) => void
  changePage: (page: number) => Promise<void>
}

/**
 * State + side-effects shared by every browse-style page
 * (`/under699`, `/products`, `/category/[category]`).
 *
 * Owns paging, filter state, ESC-to-close,
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
  const [products, setProducts]     = useState<Product[]>(initialProducts)
  const [total, setTotal]           = useState<number>(initialTotal)
  const [page, setPage]             = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(initialTotal / BROWSE_PAGE_SIZE))
  const [filters, setFilters]       = useState<BrowseFilters>(initialClientFilters)
  const [avail, setAvail]           = useState<AvailableFilters>(initialFilters)
  const [loading, setLoading]       = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const [showMbar]                        = useScrollHideOnIdle()
  const footerIntersecting                = useFooterVisibility()

  // Request-id token: a new request makes the older one stale so we
  // ignore its result if it lands late. Avoids the "unlock the ref"
  // hack previously needed when `changeFilters` interrupted an in-flight load.
  const latestRequestIdRef = useRef(0)

  // ── Fetch loop ────────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (pageNum: number, f: BrowseFilters, reset: boolean): Promise<boolean> => {
      const id = ++latestRequestIdRef.current
      setLoading(true)
      try {
        const res = await fetcher(pageNum, f, reset)
        if (id !== latestRequestIdRef.current) return false

        const incoming = res.products ?? []
        if (res.total != null) setTotal(res.total)
        setTotalPages(res.totalPages ?? Math.ceil((res.total ?? incoming.length) / BROWSE_PAGE_SIZE))

        // avail only ever tracks the broadest (filter-free) facet set — never
        // narrowed by an active filter — so neither the sidebar nor the
        // FilterPanel lose options just because something is selected.
        const noFacetSelections = !f.subcategory.length && !f.color.length && !f.brand.length
        if (reset && noFacetSelections && res.availableFilters) {
          setAvail(current => ({
            ...res.availableFilters!,
            categories: f.category ? current.categories : res.availableFilters!.categories,
          }))
        }

        setProducts(incoming)
        return true
      } catch {
        if (id !== latestRequestIdRef.current) return false
        return false
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
      const locationFilters = browseFiltersFromSearchParams(
        new URLSearchParams(window.location.search),
      )
      const hasUrlFilters = hasBrowseFilterSelections(locationFilters)
      const startingFilters = hasUrlFilters
        ? locationFilters
        : initialClientFilters

      setFilters(startingFilters)

      if (initialPageIsFiltered || hasUrlFilters) {
        void fetchPage(1, startingFilters, true)
        const hasMultiFacetSelection =
          startingFilters.subcategory.length > 0 ||
          startingFilters.color.length > 0 ||
          startingFilters.brand.length > 0

        if (startingFilters.category && hasMultiFacetSelection) {
          const requestId = latestRequestIdRef.current
          const categoryScope = {
            ...startingFilters,
            subcategory: [],
            color: [],
            brand: [],
          }
          void fetcher(1, categoryScope, true)
            .then((res) => {
              if (requestId !== latestRequestIdRef.current || !res.availableFilters) return
              setAvail((current) => ({
                ...res.availableFilters!,
                categories: current.categories,
              }))
            })
            .catch(() => {})
        }
      }
    }
  }, [initialPageIsFiltered, initialClientFilters, fetchPage, fetcher])

  const changeFilters = useCallback(
    async (next: BrowseFilters) => {
      const categoryChanged = next.category !== filters.category
      const nextFilters = categoryChanged
        ? { ...next, subcategory: [], color: [], brand: [] }
        : next
      setFilters(nextFilters)
      setPage(1)

      const params = browseFiltersToSearchParams(nextFilters)
      const query = params.toString()
      const path = window.location.pathname
      const newUrl = query ? `${path}?${query}` : path

      // Keep the framework's navigation metadata intact. Replacing it with
      // null makes some production routers treat this update as a full reload.
      window.history.replaceState(window.history.state, '', newUrl)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      await fetchPage(1, nextFilters, true)
    },
    [fetchPage, filters],
  )

  const changePage = useCallback(async (nextPage: number) => {
    if (loading || nextPage < 1 || nextPage > totalPages || nextPage === page) return
    const loaded = await fetchPage(nextPage, filters, false)
    if (!loaded) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [fetchPage, filters, loading, page, totalPages])

  // ── ESC closes the filter panel ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilterOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return {
    products, total, page, totalPages, filters, avail,
    loading, filterOpen, showMbar, footerIntersecting,
    setFilterOpen, changeFilters, changePage,
  }
}

export type { SortOption }
