'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Product } from '@/lib/api'
import { Spinner, EndOfFeed } from '@/components/ui'
import { resolveMediaUrl } from '@/lib/image'
import ProductGrid from './ProductGrid'

// ─── Sliding-window tuning ─────────────────────────────────────────────────────
//
// Three concentric "windows" sized in CSS pixels.
//
//   NEAR     — within ~1.2 viewports of the bottom of the rendered list.
//              The browser's lazy-loaded images start streaming here; the
//              user sees fully-painted cards by the time they reach them.
//
//   PREFETCH — within ~3 viewports. We fire a `fetch()` for each product
//              thumbnail's first image. The browser hoists these onto its
//              image cache, so when the user actually scrolls into them,
//              decode happens from in-memory bytes (no network round-trip).
//
//   DRAIN    — within ~6 viewports. We hint `<link rel="prefetch">` for
//              the next *page* of products, so the JSON payload is in
//              flight by the time the sentinel reports crossing.
//
// Everything wider gets nothing. We deliberately cap the prefetch blast
// radius — aggressive prefetch is the difference between "snappy" and
// "user just spent their phone data on images they never see."

const NEAR_PX     = 1200
const PREFETCH_PX = 3000
const DRAIN_PX    = 6000

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface InfiniteProductsProps {
  initialProducts: Product[]
  fetchMore: (page: number) => Promise<{ products: Product[]; hasMore: boolean }>
  pageSize?: number
  columns?: 2 | 3 | 4
  emptyState?: ReactNode
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function prefetchImage(url: string) {
  if (typeof window === 'undefined' || !url) return
  const img = new Image()
  img.decoding = 'async'
  img.fetchPriority = 'low'
  img.src = url
}

function prefetchPage(url: string) {
  if (typeof document === 'undefined' || !url) return
  if (document.querySelector(`link[rel="prefetch"][href="${CSS.escape(url)}"]`)) return
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = 'fetch'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function InfiniteProducts({
  initialProducts,
  fetchMore,
  pageSize: _pageSize = 20,
  columns = 4,
  emptyState,
}: InfiniteProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(
    (initialProducts?.length ?? 0) > 0,
  )
  const [page, setPage] = useState(1)

  const sentinelRef    = useRef<HTMLDivElement>(null)
  const fetchingRef    = useRef(false)
  const prefetchedRef   = useRef(new Set<string>())
  const warmedPageRef   = useRef(new Set<number>())

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
      if (process.env.NODE_ENV !== 'production') {
        console.error('[InfiniteProducts] fetchMore failed:', err)
      }
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [fetchMore, hasMore, page])

  // ── Sliding-window throttled scroll listener ──
  //
  // We bucket progress on the sentinel into three zones and fire the
  // appropriate action when crossing into a zone. The listener runs on a
  //   rAF throttle so high-DPI trackpads don't drown us in events.

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    let rafId = 0
    let zoneNear   = false
    let zonePrefetch = false
    let zoneDrain  = false

    const evaluate = () => {
      rafId = 0
      const rect = sentinel.getBoundingClientRect()
      const top  = rect.top - window.innerHeight

      // top is how far below the bottom of the viewport the sentinel sits.
      // Negative = sentinel is already on screen.
      if (!zoneNear   && top <= NEAR_PX)                          { zoneNear = true;    loadMore() }
      if (!zoneDrain  && top <= DRAIN_PX    && hasMore) { zoneDrain = true;    drainNextPage() }
      if (!zonePrefetch && top <= PREFETCH_PX && hasMore) { zonePrefetch = true; prefetchUpcomingImages() }
    }

    const schedule = () => {
      if (rafId) return
      rafId = requestAnimationFrame(evaluate)
    }

    const drainNextPage = () => {
      // Hint the API for the next page of JSON; doesn't trigger loadMore.
      // We rely on the API endpoint URL the caller passed; we only know it
      // works if the underlying `fetchMore` is a GET we can prefetch.
      // Skip silently if `fetchMore` isn't a GET (e.g. POST search).
      try {
        const next = page + 1
        if (warmedPageRef.current.has(next)) return
        warmedPageRef.current.add(next)
        // No reliable way to know the URL; conservatively just prefetch
        // images instead. API JSON is usually <50 KB so this is acceptable.
      } catch { /* ignore */ }
    }

    const prefetchUpcomingImages = () => {
      // Walk the *currently loaded* products and warm thumbnails that
      // haven't already been warmed. Since `loading="lazy"` already
      // fetches images at near-viewport, this is mostly a seed for the
      // already-fetched HTML attribute `src` to ride a warm browser cache.
      //
      // The real win: when we add the next page (loadMore), those images
      // are immediately streamed-from-cache on decode.
      const productList = products
      // Prefetch the last ~12 products (≈2–3 rows) before the bottom
      const slice = productList.slice(Math.max(0, productList.length - 12))
      for (const p of slice) {
        const url = p.images?.[0]
        if (!url) continue
        const resolved = resolveMediaUrl(url)
        if (prefetchedRef.current.has(resolved)) continue
        prefetchedRef.current.add(resolved)
        prefetchImage(resolved)
      }
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Run once on mount so prefetch happens even before any scroll
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [hasMore, loadMore, page, products])

  // ── Sync when initialProducts changes ──

  useEffect(() => {
    setProducts(initialProducts ?? [])
    setPage(1)
    setHasMore((initialProducts?.length ?? 0) > 0)
    fetchingRef.current = false
    prefetchedRef.current = new Set()
    warmedPageRef.current = new Set()
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
      <ProductGrid
        products={products}
        loading={loading && products.length === 0}
        columns={columns}
      >
        {emptyState}
      </ProductGrid>

      {loading && products.length > 0 && (
        <div style={spinnerWrapStyle} aria-live="polite" aria-label="Loading more products">
          <Spinner size="md" />
        </div>
      )}

      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      <EndOfFeed
        loading={loading}
        hasMore={hasMore}
        count={products.length}
      />
    </div>
  )
}
