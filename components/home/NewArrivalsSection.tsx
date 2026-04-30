'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNewArrivals, type Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

const PAGE_SIZE = 12

// ─── NewArrivalsSection ─────────────────────────────────────────────────────────

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)
  // Prevent duplicate fetches when the observer fires multiple times
  const fetchingRef = useRef(false)


  // ── Fetch a single page ────────────────────────────────────────────────────

  const fetchPage = useCallback(async (pageNum: number) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const data = await getNewArrivals(pageNum, PAGE_SIZE)
      const incoming = data.products ?? []

      setProducts((prev) => {
        // Deduplicate by id in case of re-fetch
        const seen = new Set(prev.map((p) => p.id))
        const fresh = incoming.filter((p) => !seen.has(p.id))
        return [...prev, ...fresh]
      })

      // If we got fewer than PAGE_SIZE, we've reached the end
      const total = data.total ?? Infinity
      const fetched = (pageNum - 1) * PAGE_SIZE + incoming.length
      setHasMore(incoming.length === PAGE_SIZE && fetched < total)
    } catch (err) {
      console.error('[NewArrivalsSection] fetch error:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  // ── Initial load ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── IntersectionObserver — load next page when sentinel enters view ─────────

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !loading && !fetchingRef.current) {
          setPage((prev) => {
            const next = prev + 1
            fetchPage(next)
            return next
          })
        }
      },
      {
        // Start fetching slightly before the sentinel is fully visible
        rootMargin: '200px',
        threshold: 0,
      },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchPage])

  // ── Render ─────────────────────────────────────────────────────────────────

  const showSkeletons = loading && products.length === 0
  const skeletonCount = PAGE_SIZE

  return (
    <>
      {/* Product grid */}
      <div className="product-grid-3">
        {showSkeletons
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <CardSkeleton key={`skel-${i}`} />
            ))
          : products.map((product, i) => (
              <ProductCard key={product.id} product={product} fetchPriority={i < 6 ? 'high' : 'auto'} />
            ))}

        {/* Append skeleton rows while loading subsequent pages */}
        {loading && products.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={`skel-more-${page}-${i}`} />
          ))}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-xl) 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'var(--color-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {error}
          </p>
          <button
            type="button"
            className="btn-outline"
            onClick={() => fetchPage(page)}
            style={{ fontSize: '0.65rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Invisible sentinel — IntersectionObserver target */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: '1px' }} />

      {/* End-of-feed indicator */}
      <EndOfFeed
        loading={loading}
        hasMore={hasMore}
        count={products.length}
        message="You've seen all new arrivals"
      />
    </>
  )
}
