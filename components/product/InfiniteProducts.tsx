'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Product } from '@/lib/api'
import { Spinner, EndOfFeed } from '@/components/ui'
import ProductGrid from './ProductGrid'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface InfiniteProductsProps {
  initialProducts: Product[]
  fetchMore: (page: number) => Promise<{ products: Product[]; hasMore: boolean }>
  pageSize?: number
  columns?: 2 | 3 | 4
  emptyState?: ReactNode
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function InfiniteProducts({
  initialProducts,
  fetchMore,
  pageSize: _pageSize = 20,  // reserved for callers that want to document intent
  columns = 4,
  emptyState,
}: InfiniteProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(
    // If the server gave us fewer items than a full page we already know there's no more.
    // We keep it true by default so the observer fires once and confirms on first fetch.
    (initialProducts?.length ?? 0) > 0,
  )
  const [page, setPage] = useState(1)

  // Sentinel element that the IntersectionObserver watches
  const sentinelRef = useRef<HTMLDivElement>(null)
  // Guard against concurrent fetches (ref so it doesn't cause re-renders)
  const fetchingRef = useRef(false)

  // ── Core fetch ──

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return

    fetchingRef.current = true
    setLoading(true)

    try {
      const nextPage = page + 1
      const result   = await fetchMore(nextPage)

      setProducts((prev) => {
        const seen   = new Set(prev.map((p) => p.id))
        const fresh  = result.products.filter((p) => !seen.has(p.id))
        return fresh.length > 0 ? [...prev, ...fresh] : prev
      })

      setPage(nextPage)
      setHasMore(result.hasMore)
    } catch (err) {
      // Surface in development; swallow silently in production so the UI
      // doesn't break — the user can scroll again to retry.
      if (process.env.NODE_ENV !== 'production') {
        console.error('[InfiniteProducts] fetchMore failed:', err)
      }
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [fetchMore, hasMore, page])

  // ── IntersectionObserver ──

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  // ── Sync when initialProducts changes (e.g. route change with fresh SSR data) ──

  useEffect(() => {
    setProducts(initialProducts ?? [])
    setPage(1)
    setHasMore((initialProducts?.length ?? 0) > 0)
    fetchingRef.current = false
  }, [initialProducts])

  // ── Styles ──

  const spinnerWrapStyle: CSSProperties = {
    display:        'flex',
    justifyContent: 'center',
    alignItems:     'center',
    padding:        'var(--space-lg) 0',
  }

  // ── Render ──

  return (
    <div>
      {/*
        ProductGrid handles two states internally:
          • loading=true  + products=[] → renders skeletonCount CardSkeletons
          • products=[]   + !loading    → renders the emptyState children slot
          • otherwise                  → renders the product cards grid
      */}
      <ProductGrid
        products={products}
        loading={loading && products.length === 0}
        columns={columns}
      >
        {emptyState}
      </ProductGrid>

      {/* Subsequent-page spinner — only shown when we already have cards visible */}
      {loading && products.length > 0 && (
        <div style={spinnerWrapStyle} aria-live="polite" aria-label="Loading more products">
          <Spinner size="md" />
        </div>
      )}

      {/* Sentinel — sits just below the last card row so the observer fires early */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      {/*
        EndOfFeed renders:
          • a centred Spinner when loading=true (first load)
          • the "You've seen everything" rule when !hasMore and count > 0
          • null otherwise
      */}
      <EndOfFeed
        loading={loading}
        hasMore={hasMore}
        count={products.length}
      />
    </div>
  )
}
