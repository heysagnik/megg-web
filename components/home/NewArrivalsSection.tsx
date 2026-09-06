'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNewArrivals, type Gender, type Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { Button, EndOfFeed } from '@/components/ui'

const PAGE_SIZE = 12

export default function NewArrivalsSection({ gender }: { gender: Gender }) {

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
      const data = await getNewArrivals(pageNum, PAGE_SIZE, { gender })
      const incoming = data.products ?? []

      setProducts((prev) => {
        // Deduplicate by id in case of re-fetch
        const seen = new Set(prev.map((p) => p.id))
        const fresh = incoming.filter((p) => !seen.has(p.id))
        return [...prev, ...fresh]
      })

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
  }, [gender])

  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
    fetchingRef.current = false
    fetchPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender])

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
        rootMargin: '200px',
        threshold: 0,
      },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchPage])

  const showSkeletons = loading && products.length === 0
  const skeletonCount = PAGE_SIZE

  return (
    <>
      {/* Zara-style product grid: 3-column, wide gutters, 60px row breathing space */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 md:gap-x-12 lg:gap-x-14 md:gap-y-[60px] gap-x-5 gap-y-10 w-full"
      >
        {showSkeletons
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <CardSkeleton key={`skel-${i}`} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} fetchPriority="auto" />
            ))}

        {loading && products.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={`skel-more-${page}-${i}`} />
          ))}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-sm py-xl">
          <p className="font-sans text-xs text-muted tracking-wide uppercase">
            {error}
          </p>
          <Button variant="outline" onClick={() => fetchPage(page)}>
            Try Again
          </Button>
        </div>
      )}

      {/* Invisible sentinel — IntersectionObserver target */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

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
