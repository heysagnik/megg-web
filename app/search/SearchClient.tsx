'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchProducts, getProducts, type Product, type SearchParams } from '@/lib/api'
import CardSkeleton from '@/components/ui/CardSkeleton'
import ProductCard from '@/components/product/ProductCard'

// ─── Category chips ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'All', slug: '' },
  { label: 'Shirts', slug: 'Shirt' },
  { label: 'Jeans', slug: 'Jeans' },
  { label: 'Shoes', slug: 'Shoes' },
  { label: 'T-Shirts', slug: 'Tshirt' },
  { label: 'Jackets', slug: 'Jacket' },
  { label: 'Hoodies', slug: 'Hoodies' },
  { label: 'Accessories', slug: 'Mens Accessories' },
  { label: 'Innerwear', slug: 'Innerwear' },
  { label: 'Sweater', slug: 'Sweater' },
  { label: 'Sweatshirt', slug: 'Sweatshirt' },
  { label: 'Track Pants', slug: 'Trackpants' },
  { label: 'Traditional', slug: 'Traditional' },
  { label: 'Perfume', slug: 'Perfume' },
  { label: 'Body Care', slug: 'Body Care' },
  { label: 'Daily Essentials', slug: 'Daily Essentials' },
]

const SORT_OPTIONS: { label: string; value: SearchParams['sort'] | '' }[] = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
]

const PAGE_SIZE = 20

// ─── SearchPage ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  )
}

function SearchInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQ = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQ)
  const [inputValue, setInputValue] = useState(initialQ)
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SearchParams['sort'] | ''>('')
  const [maxPrice, setMaxPrice] = useState('')

  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searched, setSearched] = useState(!!initialQ)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Fetch one page of results ──────────────────────────────────────────────

  const fetchPage = useCallback(
    async (q: string, pageNum: number, cat: string, sortVal: SearchParams['sort'] | '', maxP: string, reset: boolean) => {
      if (fetchingRef.current) return
      fetchingRef.current = true
      setLoading(true)

      try {
        let res
        if (q.trim()) {
          res = await searchProducts({
            q: q.trim(),
            page: pageNum,
            limit: PAGE_SIZE,
            category: cat || undefined,
            sort: sortVal || undefined,
            maxPrice: maxP ? Number(maxP) : undefined,
          })
        } else {
          res = await getProducts(pageNum, PAGE_SIZE, cat || undefined)
        }

        const incoming = res.products ?? []
        setTotal(res.total ?? null)

        setProducts((prev) => {
          if (reset) return incoming
          const seen = new Set(prev.map((p) => p.id))
          return [...prev, ...incoming.filter((p) => !seen.has(p.id))]
        })

        const fetched = (pageNum - 1) * PAGE_SIZE + incoming.length
        setHasMore(incoming.length === PAGE_SIZE && (res.total == null || fetched < res.total))
      } catch {
        setHasMore(false)
      } finally {
        setLoading(false)
        fetchingRef.current = false
      }
    },
    [],
  )

  // ── Handle submit ──────────────────────────────────────────────────────────

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      const q = inputValue.trim()
      setQuery(q)
      setPage(1)
      setProducts([])
      setHasMore(true)
      setSearched(true)
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : '/search', { scroll: false })
      fetchPage(q, 1, category, sort, maxPrice, true)
    },
    [inputValue, category, sort, maxPrice, fetchPage, router],
  )

  // ── On filter/sort change ──────────────────────────────────────────────────

  const applyFilters = useCallback(
    (cat: string, sortVal: SearchParams['sort'] | '', maxP: string) => {
      setPage(1)
      setProducts([])
      setHasMore(true)
      setSearched(true)
      fetchPage(query, 1, cat, sortVal, maxP, true)
    },
    [query, fetchPage],
  )

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    // Always show products on initial load — query if present, else browse all
    setSearched(true)
    fetchPage(initialQ, 1, '', '', '', true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Infinite scroll ────────────────────────────────────────────────────────

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current && searched) {
          const next = page + 1
          setPage(next)
          fetchPage(query, next, category, sort, maxPrice, false)
        }
      },
      { rootMargin: '300px', threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, page, query, category, sort, maxPrice, searched, fetchPage])

  // ── Render ─────────────────────────────────────────────────────────────────

  const hasResults = products.length > 0
  const showEmpty = searched && !loading && !hasResults

  return (
    <div
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 var(--container-px)',
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-3xl)',
      }}
    >
      <style>{`
        .chip { transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .chip:hover { opacity: 0.75; }
        .search-chips-row { scrollbar-width: none; }
        .search-chips-row::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Search bar ── */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
          Search
        </p>
        <h1 className="text-section" style={{ marginBottom: 'var(--space-lg)' }}>
          Find what you love
        </h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products, brands, categories…"
            style={{
              flex: 1,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              letterSpacing: '0.02em',
              border: '1px solid var(--color-border-mid)',
              borderRadius: 0,
              padding: '0.875rem 1rem',
              outline: 'none',
              color: 'var(--color-black)',
              background: 'var(--color-white)',
              textTransform: 'none',
            }}
            autoFocus
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ flexShrink: 0, paddingLeft: '1.75rem', paddingRight: '1.75rem' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Category chips ── */}
      <div
        className="search-chips-row"
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          marginBottom: searched ? 'var(--space-md)' : 0,
          paddingBottom: '4px',
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = category === cat.slug
          return (
            <button
              key={cat.slug}
              type="button"
              className="chip"
              onClick={() => {
                setCategory(cat.slug)
                applyFilters(cat.slug, sort, maxPrice)
              }}
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                border: `1px solid ${active ? 'var(--color-black)' : 'var(--color-border-mid)'}`,
                background: active ? 'var(--color-black)' : 'transparent',
                color: active ? 'var(--color-white)' : 'var(--color-black)',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* ── Sort + filter bar (shown after search) ── */}
      {searched && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: 'var(--space-lg)',
            flexWrap: 'wrap',
          }}
        >
          {/* Result count */}
          {total != null && (
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                color: 'var(--color-muted)',
                letterSpacing: '0.05em',
                textTransform: 'none',
                marginRight: 'auto',
              }}
            >
              {total.toLocaleString()} result{total !== 1 ? 's' : ''}
              {query ? ` for "${query}"` : ''}
            </span>
          )}

          {/* Max price filter */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
            }}
          >
            Max ₹
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
              }}
              onBlur={() => applyFilters(category, sort, maxPrice)}
              placeholder="Any"
              style={{
                width: '80px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                border: '1px solid var(--color-border-mid)',
                padding: '0.4rem 0.6rem',
                outline: 'none',
                textTransform: 'none',
                letterSpacing: 0,
              }}
            />
          </label>

          {/* Sort select */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value as SearchParams['sort'] | ''
              setSort(val)
              applyFilters(category, val, maxPrice)
            }}
            style={{
              appearance: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              borderBottom: '1px solid var(--color-black)',
              padding: '0.25rem 1.25rem 0.25rem 0',
              background: 'transparent',
              color: 'var(--color-black)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value ?? 'rel'} value={o.value ?? ''}>
                {o.label}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.5rem', color: 'var(--color-black)' }}>▾</span>
          </div>
        </div>
      )}

      {/* ── Results grid ── */}
      {searched && (
        <>
          <div className="search-grid">
            {loading && products.length === 0
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p.id} product={p} />)}

            {loading && products.length > 0 &&
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`more-${i}`} />)}
          </div>

          {showEmpty && (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-3xl) 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <p className="text-section" style={{ fontFamily: 'var(--font-serif)', opacity: 0.25 }}>
                No results found
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'none' }}>
                Try a different search term or browse by category.
              </p>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} aria-hidden="true" style={{ height: '1px' }} />

          {!hasMore && hasResults && !loading && (
            <p
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--color-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                paddingTop: 'var(--space-xl)',
              }}
            >
              End of results
            </p>
          )}
        </>
      )}
    </div>
  )
}
