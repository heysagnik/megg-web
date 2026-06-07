'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { listProducts, type Product, type AvailableFilters, type SortOption } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import ProductBrowseLayout, { BROWSE_EMPTY, type BrowseFilters } from '@/components/product/ProductBrowseLayout'

const PAGE_SIZE = 20

const CATEGORIES = [
  { label: 'All',              slug: '' },
  { label: 'Shirts',           slug: 'Shirt' },
  { label: 'T-Shirts',         slug: 'Tshirt' },
  { label: 'Jeans',            slug: 'Jeans' },
  { label: 'Shoes',            slug: 'Shoes' },
  { label: 'Jackets',          slug: 'Jacket' },
  { label: 'Hoodies',          slug: 'Hoodies' },
  { label: 'Sweatshirts',      slug: 'Sweatshirt' },
  { label: 'Sweaters',         slug: 'Sweater' },
  { label: 'Track Pants',      slug: 'Trackpants' },
  { label: 'Accessories',      slug: 'Mens Accessories' },
  { label: 'Innerwear',        slug: 'Innerwear' },
  { label: 'Traditional',      slug: 'Traditional' },
  { label: 'Perfume',          slug: 'Perfume' },
  { label: 'Body Care',        slug: 'Body Care' },
  { label: 'Daily Essentials', slug: 'Daily Essentials' },
]

interface Props {
  initialCategory: string
  initialProducts: Product[]
  initialTotal: number
  initialFilters: AvailableFilters
}

export default function ProductsClient({
  initialCategory,
  initialProducts,
  initialTotal,
  initialFilters,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(initialTotal)
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(initialProducts.length === PAGE_SIZE)
  const [filters, setFilters]   = useState<BrowseFilters>({
    ...BROWSE_EMPTY,
    subcategory: initialCategory,
  })
  const [avail, setAvail]       = useState<AvailableFilters>(initialFilters)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  const fetchPage = useCallback(async (pageNum: number, f: BrowseFilters, reset: boolean) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await listProducts({
        page: pageNum, limit: PAGE_SIZE,
        category: f.subcategory || undefined,
        color: f.color || undefined,
        brand: f.brand || undefined,
        sort: (f.sort && f.sort !== 'relevance') ? f.sort as SortOption : undefined,
        maxPrice: f.maxPrice ?? undefined,
      })
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)
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
  }, [])

  const handleFilterChange = useCallback((next: BrowseFilters) => {
    fetchingRef.current = false
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

  const activeCategory = CATEGORIES.find(c => c.slug === filters.subcategory)
  const title = activeCategory?.label ?? getCategoryDisplay(filters.subcategory) ?? 'All Products'

  const sidebarNav = (
    <ul style={{ listStyle: 'none' }}>
      {CATEGORIES.map((cat, i) => (
        <li key={cat.slug} style={{ marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleFilterChange({ ...filters, subcategory: cat.slug })}
            style={navBtn(filters.subcategory === cat.slug)}
          >
            <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>
              |{String(i).padStart(2, '0')}|
            </span>
            {cat.label}
          </button>
        </li>
      ))}
    </ul>
  )

  const crumb = (
    <div>
      <Link href="/" style={{ ...navBtn(false), display: 'block', marginBottom: '0.3rem' }}>Home</Link>
      <span style={{ ...navBtn(true), display: 'block' }}>Shop</span>
    </div>
  )

  return (
    <ProductBrowseLayout
      title={title}
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
