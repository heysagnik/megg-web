'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import { CardSkeleton, Container, EndOfFeed } from '@/components/ui'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CategoryProductListProps {
  category: string
  initialProducts: Product[]
  displayName: string
}

// ─── CategoryProductList ───────────────────────────────────────────────────────

export default function CategoryProductList({
  category,
  initialProducts,
  displayName,
}: CategoryProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length === 16)

  const pageRef = useRef(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // ── Reset when category prop changes (shouldn't happen in App Router
  //    since each category is its own page, but defensive just in case) ──

  useEffect(() => {
    setProducts(initialProducts)
    setHasMore(initialProducts.length === 16)
    pageRef.current = 1
  }, [category, initialProducts])

  // ── Fetch next page ──

  const fetchNext = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      pageRef.current += 1
      const data = await getProducts(pageRef.current, 16, category)
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        const fresh = data.products.filter((p) => !seen.has(p.id))
        return [...prev, ...fresh]
      })
      if (data.products.length < 16) setHasMore(false)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, category])

  // ── IntersectionObserver wired to sentinel div ──

  useEffect(() => {
    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchNext()
        }
      },
      { rootMargin: '200px' },
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loading, fetchNext])

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Container style={{ padding: '2.5rem var(--container-px) var(--space-3xl)' }}>
      {/* ── Product Grid ── */}
      {products.length > 0 || loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}

          {/* Skeleton cards while next page loads */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`sk-${i}`} />)}
        </div>
      ) : (
        /* ── Empty State ── */
        <div
          style={{
            padding: 'var(--space-2xl) 0',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
              textTransform: 'none',
              letterSpacing: '0.02em',
              marginBottom: '1.5rem',
            }}
          >
            No products found in {displayName}.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      )}

      {/* ── Infinite scroll sentinel + end-of-feed marker ── */}
      <div ref={sentinelRef}>
        <EndOfFeed
          loading={loading}
          hasMore={hasMore}
          count={products.length}
          message={`End of ${displayName}`}
        />
      </div>
    </Container>
  )
}
