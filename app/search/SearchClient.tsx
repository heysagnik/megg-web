'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchProducts, listProducts, type Product, type AvailableFilters, type SortOption } from '@/lib/api'
import ProductBrowseLayout, { BROWSE_EMPTY, type BrowseFilters } from '@/components/product/ProductBrowseLayout'

const PAGE_SIZE = 20

const CATEGORIES = [
  { label: 'All',              slug: '' },
  { label: 'Shirts',           slug: 'Shirt' },
  { label: 'Jeans',            slug: 'Jeans' },
  { label: 'Shoes',            slug: 'Shoes' },
  { label: 'T-Shirts',         slug: 'Tshirt' },
  { label: 'Jackets',          slug: 'Jacket' },
  { label: 'Hoodies',          slug: 'Hoodies' },
  { label: 'Accessories',      slug: 'Mens Accessories' },
  { label: 'Innerwear',        slug: 'Innerwear' },
  { label: 'Sweater',          slug: 'Sweater' },
  { label: 'Sweatshirt',       slug: 'Sweatshirt' },
  { label: 'Track Pants',      slug: 'Trackpants' },
  { label: 'Traditional',      slug: 'Traditional' },
  { label: 'Perfume',          slug: 'Perfume' },
  { label: 'Body Care',        slug: 'Body Care' },
  { label: 'Daily Essentials', slug: 'Daily Essentials' },
]

export default function SearchClient() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  )
}

function SearchInner() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const initialQ    = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(initialQ)
  const [query,      setQuery]      = useState(initialQ)
  const [products,   setProducts]   = useState<Product[]>([])
  const [page,       setPage]       = useState(1)
  const [total,      setTotal]      = useState<number | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [hasMore,    setHasMore]    = useState(true)
  const [filters,    setFilters]    = useState<BrowseFilters>(BROWSE_EMPTY)
  const [avail,      setAvail]      = useState<AvailableFilters>({ subcategories: [], colors: [], brands: [], categories: [] })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (
    q: string, pageNum: number, f: BrowseFilters, reset: boolean,
  ) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const sort = (f.sort && f.sort !== 'relevance') ? f.sort as SortOption : undefined
      let res
      if (q.trim()) {
        res = await searchProducts({
          q: q.trim(), page: pageNum, limit: PAGE_SIZE,
          category: f.subcategory || undefined,
          sort,
        })
      } else {
        res = await listProducts({
          page: pageNum, limit: PAGE_SIZE,
          category: f.subcategory || undefined,
          color: f.color || undefined,
          brand: f.brand || undefined,
          sort,
        })
      }
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)
      if ('availableFilters' in res && res.availableFilters) setAvail(res.availableFilters)
      setProducts(prev => {
        if (reset) return incoming
        const seen = new Set(prev.map(p => p.id))
        return [...prev, ...incoming.filter(p => !seen.has(p.id))]
      })
      const fetched = (pageNum - 1) * PAGE_SIZE + incoming.length
      setHasMore(incoming.length === PAGE_SIZE && (res.total == null || fetched < res.total))
    } catch { setHasMore(false) }
    finally { setLoading(false); fetchingRef.current = false }
  }, [])

  // Submit search
  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const q = inputValue.trim()
    setQuery(q); setPage(1); setProducts([]); setHasMore(true)
    router.replace(q ? `/search?q=${encodeURIComponent(q)}` : '/search', { scroll: false })
    fetchPage(q, 1, filters, true)
  }, [inputValue, filters, fetchPage, router])

  // Filter change
  const handleFilterChange = useCallback((next: BrowseFilters) => {
    setFilters(next); setPage(1); setHasMore(true)
    fetchPage(query, 1, next, true)
  }, [query, fetchPage])

  // Initial load
  useEffect(() => { fetchPage(initialQ, 1, BROWSE_EMPTY, true) }, []) // eslint-disable-line

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
        const next = page + 1; setPage(next)
        fetchPage(query, next, filters, false)
      }
    }, { rootMargin: '300px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, page, query, filters, fetchPage])

  const navBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', textAlign: 'left',
    color: active ? 'var(--color-black)' : 'var(--color-muted)',
  })

  // Sidebar: search bar + category list
  const sidebarNav = (
    <>
      {/* Search input */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-mid)', paddingBottom: '0.4rem' }}>
          <input
            type="search"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search…"
            autoFocus
            style={{
              flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
              border: 'none', outline: 'none', background: 'transparent',
              color: 'var(--color-black)', textTransform: 'uppercase', minWidth: 0,
            }}
          />
          <button type="submit" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--color-muted)', flexShrink: 0, paddingLeft: '0.5rem',
          }}>
            →
          </button>
        </div>
      </form>

      {/* Category list */}
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
    </>
  )

  const titleText = query
    ? `"${query}"`
    : filters.subcategory
      ? CATEGORIES.find(c => c.slug === filters.subcategory)?.label ?? 'Search'
      : 'Search'

  return (
    <ProductBrowseLayout
      title={titleText}
      products={products}
      total={total ?? 0}
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
