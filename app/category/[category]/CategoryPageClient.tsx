'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { listProducts, genderFromSearchParams, type Product, type AvailableFilters, type SortOption } from '@/lib/api'
import ProductBrowseLayout, { BROWSE_EMPTY, type BrowseFilters } from '@/components/product/ProductBrowseLayout'
import { useScrollRestoration } from '@/hooks/useScrollRestoration'

interface CachedBrowseState {
  products: Product[]
  total: number
  hasMore: boolean
  filters: BrowseFilters
  avail: AvailableFilters
}

const PAGE_SIZE = 20

interface Props {
  category: string
  displayName: string
  initialProducts: Product[]
  total: number
  availableFilters: AvailableFilters
}

export default function CategoryPageClient({
  category, displayName, initialProducts, total: initialTotal, availableFilters: initialFilters,
}: Props) {
  const gender = genderFromSearchParams(useSearchParams())
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(initialTotal)
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(initialProducts.length === PAGE_SIZE)
  const [filters, setFilters]   = useState<BrowseFilters>(BROWSE_EMPTY)
  const [avail, setAvail]       = useState<AvailableFilters>(initialFilters)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  useScrollRestoration<CachedBrowseState>({
    key: `category:${category}`,
    data: {
      products,
      total,
      hasMore,
      filters,
      avail,
    },
    page,
    onRestore: useCallback((cached, cachedPage) => {
      setProducts(cached.products)
      setTotal(cached.total)
      setHasMore(cached.hasMore)
      setFilters(cached.filters)
      setAvail(cached.avail)
      setPage(cachedPage)
    }, []),
  })

  const fetchPage = useCallback(async (pageNum: number, f: BrowseFilters, reset: boolean) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await listProducts({
        page: pageNum, limit: PAGE_SIZE, category,
        subcategory: f.subcategory || undefined,
        color: f.color || undefined,
        brand: f.brand || undefined,
        sort: (f.sort && f.sort !== 'relevance') ? f.sort as SortOption : undefined,
        maxPrice: f.maxPrice ?? undefined,
        gender,
      })
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)
      // Only refresh available filters when no filters are active so options don't disappear
      const noFilters = !f.subcategory && !f.color && !f.brand && f.maxPrice == null
      if (noFilters && res.availableFilters) setAvail(res.availableFilters)
      setProducts(prev => {
        if (reset) return incoming
        const seen = new Set(prev.map(p => p.id))
        return [...prev, ...incoming.filter(p => !seen.has(p.id))]
      })
      setHasMore(incoming.length === PAGE_SIZE)
    } catch { setHasMore(false) }
    finally { setLoading(false); fetchingRef.current = false }
  }, [category, gender])

  const handleFilterChange = useCallback((next: BrowseFilters) => {
    fetchingRef.current = false
    setFilters(next); setPage(1); setHasMore(true)
    fetchPage(1, next, true)
  }, [fetchPage])

  // Infinite scroll
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

  const subcats = avail.subcategories ?? []

  const navBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', textAlign: 'left',
    color: active ? 'var(--color-black)' : 'var(--color-muted)',
  })

  const sidebarNav = subcats.length > 0 ? (
    <ul style={{ listStyle: 'none' }}>
      <li style={{ marginBottom: '0.5rem' }}>
        <button type="button"
          onClick={() => handleFilterChange({ ...filters, subcategory: '' })}
          style={navBtn(!filters.subcategory)}>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>|00|</span>
          View All
        </button>
      </li>
      {subcats.map((s, i) => (
        <li key={s.name} style={{ marginBottom: '0.5rem' }}>
          <button type="button"
            onClick={() => handleFilterChange({ ...filters, subcategory: filters.subcategory === s.name ? '' : s.name })}
            style={navBtn(filters.subcategory === s.name)}>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>
              |{String(i + 1).padStart(2, '0')}|
            </span>
            {s.name}
          </button>
        </li>
      ))}
    </ul>
  ) : undefined

  const crumb = (
    <div>
      <Link href="/" style={{ ...navBtn(false), display: 'block', marginBottom: '0.3rem' }}>Home</Link>
      <span style={{ ...navBtn(true), display: 'block' }}>{displayName}</span>
    </div>
  )

  const mobileSubcatTabs = subcats.length > 0 ? (
    <>
      <button
        type="button"
        onClick={() => handleFilterChange({ ...filters, subcategory: '' })}
        style={{
          ...navBtn(!filters.subcategory),
          flexShrink: 0, whiteSpace: 'nowrap',
          padding: '0.7rem 0.875rem',
          borderBottom: !filters.subcategory ? '2px solid var(--color-black)' : '2px solid transparent',
          fontSize: '0.7rem', letterSpacing: '0.1em',
        }}
      >
        All
      </button>
      {subcats.map(s => (
        <button
          key={s.name}
          type="button"
          onClick={() => handleFilterChange({ ...filters, subcategory: filters.subcategory === s.name ? '' : s.name })}
          style={{
            ...navBtn(filters.subcategory === s.name),
            flexShrink: 0, whiteSpace: 'nowrap',
            padding: '0.7rem 0.875rem',
            borderBottom: filters.subcategory === s.name ? '2px solid var(--color-black)' : '2px solid transparent',
            fontSize: '0.7rem', letterSpacing: '0.1em',
          }}
        >
          {s.name}
        </button>
      ))}
    </>
  ) : undefined

  return (
    <ProductBrowseLayout
      title={displayName}
      crumb={crumb}
      products={products}
      total={total}
      loading={loading}
      hasMore={hasMore}
      sentinel={sentinelRef}
      sidebarNav={sidebarNav}
      mobileSubcategoryTabs={mobileSubcatTabs}
      filters={filters}
      availableFilters={avail}
      onFilterChange={handleFilterChange}
    />
  )
}
