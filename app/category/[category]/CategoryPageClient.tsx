'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  listProducts,
  genderFromSearchParams,
  type AvailableFilters,
  type Product,
  type SortOption,
} from '@/lib/api'
import {
  BROWSE_EMPTY,
  type BrowseFilters,
  readBrowseCache,
  writeBrowseCache,
} from '@/lib/browseFilters'
import ProductCard from '@/components/product/ProductCard'
import FilterPanel from '@/components/product/FilterPanel'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

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
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const search = searchParams?.toString() ?? ''
  const gender = genderFromSearchParams(searchParams)
  const cacheKey = useMemo(() => `category:${category}`, [category])

  // ── State ───────────────────────────────────────────────────────────────
  const [products, setProducts]   = useState<Product[]>(initialProducts)
  const [total, setTotal]         = useState<number>(initialTotal)
  const [hasMore, setHasMore]     = useState<boolean>(initialProducts.length === PAGE_SIZE)
  const [page, setPage]           = useState<number>(1)
  const [filters, setFilters]     = useState<BrowseFilters>(BROWSE_EMPTY)
  const [avail, setAvail]         = useState<AvailableFilters>(initialFilters)
  const [loading, setLoading]     = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [showMbar, setShowMbar]   = useState(true)
  const [showSubcats, setShowSubcats] = useState(true)
  const [footerIntersecting, setFooterIntersecting] = useState(false)

  const fetchingRef = useRef(false)
  const restoredRef = useRef(false)
  const pendingScrollRef = useRef<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // ── Restore from sessionStorage before paint ───────────────────────────
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const cached = readBrowseCache(cacheKey, pathname, search)
    if (!cached) { restoredRef.current = true; return }
    setProducts(cached.products)
    setTotal(cached.total)
    setHasMore(cached.hasMore)
    setPage(cached.page)
    setFilters(cached.filters)
    setAvail(cached.avail)
    pendingScrollRef.current = cached.scrollY
    restoredRef.current = true
  }, [cacheKey, pathname, search])

  // ── Scroll to restored position once the products have painted ─────────
  useEffect(() => {
    if (pendingScrollRef.current == null) return
    const y = pendingScrollRef.current
    pendingScrollRef.current = null
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0, behavior: 'auto' })
    })
    return () => cancelAnimationFrame(raf)
  }, [products])

  // ── Fetch helper ────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (pageNum: number, f: BrowseFilters, reset: boolean) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await listProducts({
        page: pageNum,
        limit: PAGE_SIZE,
        category,
        subcategory: f.subcategory || undefined,
        color: f.color || undefined,
        brand: f.brand || undefined,
        sort: f.sort && f.sort !== 'relevance' ? f.sort as SortOption : undefined,
        maxPrice: f.maxPrice ?? undefined,
        gender,
      })
      const incoming = res.products ?? []
      if (res.total != null) setTotal(res.total)
      setHasMore(incoming.length === PAGE_SIZE)
      const noFilters = !f.subcategory && !f.color && !f.brand && f.maxPrice == null
      if (reset && noFilters && res.availableFilters) setAvail(res.availableFilters)
      setProducts(prev => {
        if (reset) return incoming
        const seen = new Set(prev.map(p => p.id))
        return [...prev, ...incoming.filter(p => !seen.has(p.id))]
      })
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [category, gender])

  // ── Filter changes ─────────────────────────────────────────────────────
  const changeFilters = useCallback((next: BrowseFilters) => {
    fetchingRef.current = false
    setFilters(next)
    setPage(1)
    setHasMore(true)
    void fetchPage(1, next, true)
  }, [fetchPage])

  // ── Infinite scroll sentinel ───────────────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      if (!hasMore || loading || fetchingRef.current || !restoredRef.current) return
      const next = page + 1
      setPage(next)
      void fetchPage(next, filters, false)
    }, { rootMargin: '600px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, page, filters, fetchPage])

  // ── sessionStorage persistence ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !restoredRef.current) return
    let t: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        writeBrowseCache(cacheKey, pathname, search, {
          products, total, hasMore, page, filters, avail, scrollY: window.scrollY,
        })
      }, 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [cacheKey, pathname, search, products, total, hasMore, page, filters, avail])

  useEffect(() => {
    if (typeof window === 'undefined' || !restoredRef.current) return
    return () => {
      writeBrowseCache(cacheKey, pathname, search, {
        products, total, hasMore, page, filters, avail, scrollY: window.scrollY,
      })
    }
  }, [cacheKey, pathname, search, products, total, hasMore, page, filters, avail])

  // ── Escape key, scroll behaviour, footer intersection ───────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    let scrollTimeout: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      const y = window.scrollY
      if (y > lastY && y > 100) setShowMbar(false)
      else if (y < lastY) setShowMbar(true)
      setShowSubcats(false)
      lastY = y
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setShowMbar(true)
        setShowSubcats(true)
      }, 150)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFooterIntersecting(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  // ── Derived view state ─────────────────────────────────────────────────
  const navBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', textAlign: 'left',
    color: active ? 'var(--color-black)' : 'var(--color-muted)',
  })

  const filterCount = [filters.color, filters.brand].filter(Boolean).length
  const activeCount = [filters.subcategory, filters.color, filters.brand, filters.sort && filters.sort !== 'relevance' ? 1 : 0].filter(Boolean).length

  const subcats = avail.subcategories ?? []

  const sidebarNav = subcats.length > 0 ? (
    <ul style={{ listStyle: 'none' }}>
      <li style={{ marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => changeFilters({ ...filters, subcategory: '' })}
          style={navBtn(!filters.subcategory)}
        >
          <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>|00|</span>
          View All
        </button>
      </li>
      {subcats.map((s, i) => (
        <li key={s.name} style={{ marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => changeFilters({
              ...filters,
              subcategory: filters.subcategory === s.name ? '' : s.name,
            })}
            style={navBtn(filters.subcategory === s.name)}
          >
            <span style={{ color: 'var(--color-muted)', fontSize: '0.65rem', marginRight: '0.35rem' }}>
              |{String(i + 1).padStart(2, '0')}|
            </span>
            {s.name}
          </button>
        </li>
      ))}
    </ul>
  ) : undefined

  const mobileSubcatTabs = subcats.length > 0 ? (
    <>
      <button
        type="button"
        onClick={() => changeFilters({ ...filters, subcategory: '' })}
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
          onClick={() => changeFilters({
            ...filters,
            subcategory: filters.subcategory === s.name ? '' : s.name,
          })}
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

  const crumb = (
    <div>
      <Link href="/" style={{ ...navBtn(false), display: 'block', marginBottom: '0.3rem' }}>Home</Link>
      <span style={{ ...navBtn(true), display: 'block' }}>{displayName}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="browse-sidebar" style={{
        width: '180px', flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        padding: '2rem 1.25rem',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, maxHeight: '100vh',
        alignSelf: 'flex-start',
      }}>
        {crumb && <div style={{ marginBottom: '1.5rem' }}>{crumb}</div>}
        {sidebarNav && (
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
            {sidebarNav}
          </div>
        )}
        <div style={{ marginTop: 'auto' }}>
          {activeCount > 0 && (
            <button type="button"
              onClick={() => changeFilters(BROWSE_EMPTY)}
              style={{
                ...navBtn(false),
                display: 'block', marginBottom: '0.75rem',
                textDecoration: 'underline', textUnderlineOffset: '3px',
                fontSize: '0.7rem',
              }}>
              Clear all ({activeCount})
            </button>
          )}
          <button type="button" onClick={() => setFilterOpen(true)} style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', background: 'none', cursor: 'pointer',
            border: '1px solid var(--color-black)', padding: '0.7rem 0',
            color: 'var(--color-black)', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            Filters
            {filterCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '16px', height: '16px', borderRadius: '50%',
                background: 'var(--color-black)', color: 'var(--color-white)',
                fontSize: '0.6rem', fontWeight: 600, lineHeight: 1,
              }}>
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(1.1rem, 2vw, 1.75rem)', letterSpacing: '-0.02em',
          }}>
            {displayName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button type="button" onClick={() => setFilterOpen(true)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', background: 'none', border: '1px solid var(--color-black)',
              padding: '0.5rem 0.875rem', cursor: 'pointer', color: 'var(--color-black)',
            }}
              className="browse-mobile-filter">
              Filters{filterCount > 0 ? ` (${filterCount})` : ''}
            </button>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
              letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)',
            }}>
              {total.toLocaleString()} items
            </span>
          </div>
        </div>

        {mobileSubcatTabs && (
          <div
            className="browse-mobile-subcats"
            style={{
              position: 'sticky',
              top: 'var(--header-height)',
              zIndex: 90,
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              gap: 0,
              borderBottom: '1px solid var(--color-border)',
              padding: '0 0.75rem',
              opacity: showSubcats ? 1 : 0,
              transform: showSubcats ? 'translateY(0)' : 'translateY(-10px)',
              pointerEvents: showSubcats ? 'auto' : 'none',
              transition: 'opacity 0.25s ease, transform 0.25s ease-out',
            }}
          >
            {mobileSubcatTabs}
          </div>
        )}

        <div className="browse-grid">
          {loading && products.length === 0
            ? Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                />
              ))
          }
          {loading && products.length > 0 &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={`m${i}`} />)
          }
        </div>

        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, opacity: 0.25, marginBottom: '1rem' }}>
              No products found
            </p>
            <button type="button" onClick={() => changeFilters(BROWSE_EMPTY)} className="btn-outline">
              Clear filters
            </button>
          </div>
        )}

        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
        <div style={{ padding: '0 1.5rem' }}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
        </div>
      </div>

      <div className="browse-mbar" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 200,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        padding: '0.6rem 0.75rem', gap: '0.5rem',
        transform: (showMbar && !footerIntersecting) ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
      }}>
        <button type="button" onClick={() => setFilterOpen(true)} style={{
          flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'var(--color-black)', border: '1px solid var(--color-black)',
          padding: '0.7rem 0', cursor: 'pointer', color: 'var(--color-white)',
          width: '100%',
        }}>
          Filters{filterCount > 0 ? ` (${filterCount})` : ''}
        </button>
      </div>

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        avail={avail}
        total={total}
        onChange={changeFilters}
      />
    </div>
  )
}
