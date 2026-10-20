'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNewArrivals, type Gender, type Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { Button } from '@/components/ui'
import { Pagination } from '@/components/ui/Pagination'

const NEW_ARRIVALS_PAGE_SIZE = 30
const PAGE_SIZE = NEW_ARRIVALS_PAGE_SIZE

export default function NewArrivalsSection({ gender }: { gender: Gender }) {

  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

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

      setProducts(incoming)
      setTotal(data.total ?? 0)
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
    setTotal(0)
    fetchingRef.current = false
    fetchPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const goToPage = (nextPage: number) => {
    const boundedPage = Math.min(Math.max(nextPage, 1), totalPages)
    if (boundedPage === page || loading || fetchingRef.current) return
    setPage(boundedPage)
    void fetchPage(boundedPage)

    const section = document.getElementById('new-arrivals')
    if (section) {
      const headerHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        10,
      ) || 0
      const top = section.getBoundingClientRect().top + window.scrollY - headerHeight
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
  }

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

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={goToPage}
      />
    </>
  )
}
