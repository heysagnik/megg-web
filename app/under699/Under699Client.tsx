'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getUnder699, type Product, type SortOption } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

const PAGE_SIZE = 20

const CATEGORIES = [
  { label: 'All',              slug: ''                  },
  { label: 'Shirts',           slug: 'Shirt'             },
  { label: 'T-Shirts',         slug: 'Tshirt'            },
  { label: 'Jeans',            slug: 'Jeans'             },
  { label: 'Shoes',            slug: 'Shoes'             },
  { label: 'Jackets',          slug: 'Jacket'            },
  { label: 'Hoodies',          slug: 'Hoodies'           },
  { label: 'Sweatshirts',      slug: 'Sweatshirt'        },
  { label: 'Sweaters',         slug: 'Sweater'           },
  { label: 'Track Pants',      slug: 'Trackpants'        },
  { label: 'Accessories',      slug: 'Mens Accessories'  },
  { label: 'Innerwear',        slug: 'Innerwear'         },
  { label: 'Traditional',      slug: 'Traditional'       },
  { label: 'Perfume',          slug: 'Perfume'           },
  { label: 'Body Care',        slug: 'Body Care'         },
  { label: 'Daily Essentials', slug: 'Daily Essentials'  },
]

const SORT_OPTIONS: { label: string; value: SortOption | '' }[] = [
  { label: 'Default',           value: ''           },
  { label: 'Price: Low → High', value: 'price_asc'  },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest',            value: 'newest'     },
  { label: 'Popular',           value: 'popular'    },
]

export default function Under699Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState<number | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [hasMore,  setHasMore]  = useState(true)
  const [category, setCategory] = useState('')
  const [sort,     setSort]     = useState<SortOption | ''>('')

  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef(false)

  const fetchPage = useCallback(async (
    pageNum: number,
    cat: string,
    s: SortOption | '',
    reset: boolean,
  ) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await getUnder699(pageNum, PAGE_SIZE, cat || undefined, s || undefined)
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
  }, [])

  useEffect(() => { fetchPage(1, '', '', true) }, [fetchPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
        const next = page + 1
        setPage(next)
        fetchPage(next, category, sort, false)
      }
    }, { rootMargin: '300px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, page, category, sort, fetchPage])

  const applyFilter = useCallback((cat: string, s: SortOption | '') => {
    setPage(1)
    setHasMore(true)
    fetchPage(1, cat, s, true)
  }, [fetchPage])

  const chipStyle = (active: boolean) => ({
    flexShrink: 0 as const,
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '0.6rem 0.85rem', minHeight: '44px',
    border: `1px solid ${active ? 'var(--color-black)' : 'var(--color-border-mid)'}`,
    background: active ? 'var(--color-black)' : 'transparent',
    color: active ? 'var(--color-white)' : 'var(--color-muted)',
    cursor: 'pointer' as const,
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  })

  return (
    <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-3xl)' }}>
      <style>{`
        .u699-chips { scrollbar-width: none; }
        .u699-chips::-webkit-scrollbar { display: none; }
        .u699-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 1024px) {
          .u699-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
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
        <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
          Limited Time
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
          <h1 className="text-section">Shop Under ₹699</h1>
          {total != null && (
            <span className="text-label" style={{ color: 'var(--color-muted)' }}>
              {total.toLocaleString()} items
            </span>
          )}
        </div>
      </div>

      {/* ── Filter + Sort bar ────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Category chips */}
        <div className="u699-chips" style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => { setCategory(cat.slug); applyFilter(cat.slug, sort) }}
              style={chipStyle(category === cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Sort</span>
          <div style={{ position: 'relative' }}>
            <select
              value={sort}
              onChange={e => { const v = e.target.value as SortOption | ''; setSort(v); applyFilter(category, v) }}
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

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
        }}
      >
        <div className="u699-grid">
          {loading && products.length === 0
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
          {loading && products.length > 0 &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={`m-${i}`} />)
          }
        </div>

        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <p className="text-section" style={{ opacity: 0.2, marginBottom: '1rem' }}>No products found</p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => { setCategory(''); setSort(''); applyFilter('', '') }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
        <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} message="You've seen all picks under ₹699" />
      </div>
    </div>
  )
}
