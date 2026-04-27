'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getUnder699, type Product, type AvailableFilters, type SortOption } from '@/lib/api'
import ProductBrowseLayout, { BROWSE_EMPTY, type BrowseFilters } from '@/components/product/ProductBrowseLayout'

const PAGE_SIZE = 20

interface Props {
  initialProducts?: Product[]
  total?: number
  availableFilters?: AvailableFilters
}

export default function Under699Client({ initialProducts = [], total: initialTotal = 0, availableFilters: initialFilters }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(initialTotal)
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState((initialProducts ?? []).length === PAGE_SIZE)
  const [filters, setFilters]   = useState<BrowseFilters>(BROWSE_EMPTY)
  const [avail, setAvail]       = useState<AvailableFilters>(initialFilters ?? { subcategories: [], colors: [], brands: [], categories: [] })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  const fetchPage = useCallback(async (pageNum: number, f: BrowseFilters, reset: boolean) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await getUnder699(
        pageNum,
        PAGE_SIZE,
        f.subcategory || undefined,
        (f.sort && f.sort !== 'relevance') ? f.sort as SortOption : undefined,
      )
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

  const navBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', textAlign: 'left',
    color: active ? 'var(--color-black)' : 'var(--color-muted)',
  })

  const sidebarNav = (
    <ul style={{ listStyle: 'none' }}>
      <li style={{ marginBottom: '0.5rem' }}>
        <button type="button" onClick={() => handleFilterChange({ ...filters, subcategory: '' })} style={navBtn(!filters.subcategory)}>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>|00|</span>
          All Under 699
        </button>
      </li>
      {(avail.categories ?? []).map((cat, i) => (
        <li key={cat.name} style={{ marginBottom: '0.5rem' }}>
          <button type="button" onClick={() => handleFilterChange({ ...filters, subcategory: filters.subcategory === cat.name ? '' : cat.name })} style={navBtn(filters.subcategory === cat.name)}>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>
              |{String(i + 1).padStart(2, '0')}|
            </span>
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  )

  const crumb = (
    <div>
      <Link href="/" style={{ ...navBtn(false), display: 'block', marginBottom: '0.3rem' }}>Home</Link>
      <span style={{ ...navBtn(true), display: 'block' }}>Under Rs. 699</span>
    </div>
  )

  return (
    <ProductBrowseLayout
      title="Under Rs. 699"
      crumb={crumb}
      products={products}
      total={total}
      loading={loading}
      hasMore={hasMore}
      sentinel={sentinelRef}
      sidebarNav={sidebarNav}
      filters={filters}
      availableFilters={avail}
      onFilterChange={handleFilterChange}
    />
  )
}
