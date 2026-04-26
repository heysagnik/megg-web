'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getUnder699, type Product, type AvailableFilters, type SortOption } from '@/lib/api'
import ProductBrowseLayout, { BROWSE_EMPTY, type BrowseFilters } from '@/components/product/ProductBrowseLayout'

const PAGE_SIZE = 20

export default function Under699Client() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(true)
  const [filters, setFilters]   = useState<BrowseFilters>(BROWSE_EMPTY)
  const [avail, setAvail]       = useState<AvailableFilters>({ subcategories: [], colors: [], brands: [], categories: [] })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  const fetchPage = useCallback(async (pageNum: number, f: BrowseFilters, reset: boolean) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await getUnder699(pageNum, PAGE_SIZE, undefined,
        (f.sort && f.sort !== 'relevance') ? f.sort as SortOption : undefined)
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)
      if (res.availableFilters) setAvail(res.availableFilters)
      setProducts(prev => {
        if (reset) return incoming
        const seen = new Set(prev.map(p => p.id))
        return [...prev, ...incoming.filter(p => !seen.has(p.id))]
      })
      setHasMore(incoming.length === PAGE_SIZE)
    } catch { setHasMore(false) }
    finally { setLoading(false); fetchingRef.current = false }
  }, [])

  useEffect(() => { fetchPage(1, BROWSE_EMPTY, true) }, [fetchPage])

  const handleFilterChange = useCallback((next: BrowseFilters) => {
    setFilters(next); setPage(1); setHasMore(true)
    fetchPage(1, next, true)
  }, [fetchPage])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
        const next = page + 1; setPage(next)
        fetchPage(next, filters, false)
      }
    }, { rootMargin: '300px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, page, filters, fetchPage])

  return (
    <ProductBrowseLayout
      title="Shop Under ₹699"
      products={products}
      total={total}
      loading={loading}
      hasMore={hasMore}
      sentinel={sentinelRef}
      filters={filters}
      availableFilters={avail}
      onFilterChange={handleFilterChange}
    />
  )
}
