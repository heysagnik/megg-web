'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getProducts, type Product, type Subcategory, type SortOption } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

const PAGE_SIZE = 20

const SORT_OPTIONS: { label: string; value: SortOption | '' }[] = [
  { label: 'Default',           value: ''           },
  { label: 'Price: Low → High', value: 'price_asc'  },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest',            value: 'newest'     },
  { label: 'Popular',           value: 'popular'    },
]

interface Props {
  category:        string
  displayName:     string
  initialProducts: Product[]
  total:           number
  subcategories:   Subcategory[]
}

export default function CategoryPageClient({
  category,
  displayName,
  initialProducts,
  total: initialTotal,
  subcategories,
}: Props) {
  const [products,   setProducts]   = useState<Product[]>(initialProducts)
  const [page,       setPage]       = useState(1)
  const [total,      setTotal]      = useState(initialTotal)
  const [loading,    setLoading]    = useState(false)
  const [hasMore,    setHasMore]    = useState(initialProducts.length === PAGE_SIZE)
  const [subcat,     setSubcat]     = useState('')
  const [sort,       setSort]       = useState<SortOption | ''>('')

  const sentinelRef  = useRef<HTMLDivElement>(null)
  const fetchingRef  = useRef(false)

  // ── Fetch a page ───────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (
    pageNum: number,
    sc: string,
    s: SortOption | '',
    reset: boolean,
  ) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)

    try {
      const res = await getProducts(pageNum, PAGE_SIZE, category, sc || undefined, s || undefined)
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)

      setProducts(prev => {
        if (reset) return incoming
        const seen = new Set(prev.map(p => p.id))
        return [...prev, ...incoming.filter(p => !seen.has(p.id))]
      })
      setHasMore(incoming.length === PAGE_SIZE)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [category])

  // ── Subcategory or sort change ─────────────────────────────────────────────
  const applyFilter = useCallback((sc: string, s: SortOption | '') => {
    setPage(1)
    setHasMore(true)
    fetchPage(1, sc, s, true)
  }, [fetchPage])

  // ── Infinite scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
        const next = page + 1
        setPage(next)
        fetchPage(next, subcat, sort, false)
      }
    }, { rootMargin: '300px', threshold: 0 })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, page, subcat, sort, fetchPage])

  return (
    <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-3xl)' }}>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          paddingBottom: 'var(--space-md)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--space-md)',
        }}
      >
        <nav style={{ marginBottom: '0.75rem' }}>
          <Link href="/" className="text-label" style={{ color: 'var(--color-muted)' }}>Home</Link>
          <span className="text-label" style={{ color: 'var(--color-muted)', margin: '0 0.4rem' }}>/</span>
          <span className="text-label" style={{ color: 'var(--color-black)' }}>{displayName}</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="text-section">{displayName}</h1>
          {total > 0 && (
            <span className="text-label" style={{ color: 'var(--color-muted)' }}>
              {total.toLocaleString()} items
            </span>
          )}
        </div>
      </div>

      {/* ── Filter + Sort bar ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <style>{`
          .cat-chips { scrollbar-width: none; }
          .cat-chips::-webkit-scrollbar { display: none; }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Subcategory chips */}
          {subcategories.length > 0 && (
            <div
              className="cat-chips"
              style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', flex: 1 }}
            >
              {/* "All" chip */}
              <button
                type="button"
                onClick={() => { setSubcat(''); applyFilter('', sort) }}
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '0.6rem 0.9rem', minHeight: '44px',
                  border: `1px solid ${subcat === '' ? 'var(--color-black)' : 'var(--color-border-mid)'}`,
                  background: subcat === '' ? 'var(--color-black)' : 'transparent',
                  color: subcat === '' ? 'var(--color-white)' : 'var(--color-black)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                All
              </button>

              {subcategories.map(sc => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => { setSubcat(sc.name); applyFilter(sc.name, sort) }}
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.6rem 0.9rem', minHeight: '44px',
                    border: `1px solid ${subcat === sc.name ? 'var(--color-black)' : 'var(--color-border-mid)'}`,
                    background: subcat === sc.name ? 'var(--color-black)' : 'transparent',
                    color: subcat === sc.name ? 'var(--color-white)' : 'var(--color-black)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          )}

          {/* Sort */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sort}
              onChange={e => { const v = e.target.value as SortOption | ''; setSort(v); applyFilter(subcat, v) }}
              style={{
                appearance: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-black)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-black)',
                padding: '0.25rem 1.25rem 0.25rem 0',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.5rem', color: 'var(--color-black)' }}>▾</span>
          </div>
        </div>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
        }}
      >
        <style>{`
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
          @media (min-width: 1024px) {
            .cat-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>

        <div className="cat-grid">
          {loading && products.length === 0
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
          {loading && products.length > 0 &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={`more-${i}`} />)
          }
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <p className="text-section" style={{ opacity: 0.2, marginBottom: '1rem' }}>No products found</p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => { setSubcat(''); setSort(''); applyFilter('', '') }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

        <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
      </div>
    </div>
  )
}
