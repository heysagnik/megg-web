'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AvailableFilters, SortOption } from '@/lib/api'
import ProductCard from './ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'
import type { Product } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BrowseFilters {
  subcategory: string
  category:   string
  color:      string
  brand:      string
  sort:       SortOption | 'relevance' | ''
}

export const BROWSE_EMPTY: BrowseFilters = { subcategory: '', category: '', color: '', brand: '', sort: '' }

const SORT_OPTIONS: { label: string; value: BrowseFilters['sort'] }[] = [
  { label: 'Relevance',         value: 'relevance'  },
  { label: 'Price: Low → High', value: 'price_asc'  },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest',            value: 'newest'     },
  { label: 'Popular',           value: 'popular'    },
]

export interface ProductBrowseLayoutProps {
  // Header
  title:    string
  crumb?:   ReactNode     // optional breadcrumb slot above title

  // Data
  products:  Product[]
  total:     number
  loading:   boolean
  hasMore:   boolean
  sentinel:  React.RefObject<HTMLDivElement | null>

  // Sidebar nav (e.g. subcategory list)
  sidebarNav?: ReactNode

  // Filters
  filters:         BrowseFilters
  availableFilters: AvailableFilters
  onFilterChange:  (next: BrowseFilters) => void
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

function FilterPanel({
  open,
  onClose,
  filters,
  avail,
  total,
  onChange,
}: {
  open:     boolean
  onClose:  () => void
  filters:  BrowseFilters
  avail:    AvailableFilters
  total:    number
  onChange: (next: BrowseFilters) => void
}) {
  const colors = avail.colors ?? []
  const brands = avail.brands ?? []

  const toggle = (key: 'color' | 'brand', value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? '' : value })

  const setSort = (s: BrowseFilters['sort']) =>
    onChange({ ...filters, sort: s })

  const filterCount = [filters.color, filters.brand].filter(Boolean).length
  const hasAny = filterCount > 0 || (filters.sort && filters.sort !== 'relevance')

  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.02em',
    background: 'none', border: 'none', padding: '0.45rem 0', cursor: 'pointer',
    textAlign: 'left', width: '100%', textTransform: 'uppercase',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 299,
          background: 'rgba(0,0,0,0.18)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 300,
          width: '340px',
          background: 'var(--color-white)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.76,0,0.24,1)',
          willChange: 'transform',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Filters {hasAny && `(${[filters.color, filters.brand, filters.sort && filters.sort !== 'relevance' ? 1 : 0].filter(Boolean).length})`}
          </span>
          <button type="button" onClick={onClose} aria-label="Close filters" style={{
            fontFamily: 'var(--font-sans)', fontSize: '1rem', background: 'none',
            border: 'none', cursor: 'pointer', color: 'var(--color-muted)', lineHeight: 1, padding: '0.25rem',
          }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* Sort */}
          <section style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
              Sort By
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SORT_OPTIONS.map(o => (
                <button key={o.value} type="button" onClick={() => setSort(o.value)} style={{
                  ...row,
                  color: filters.sort === o.value ? 'var(--color-black)' : 'var(--color-muted)',
                  fontWeight: filters.sort === o.value ? 500 : 400,
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <span>{o.label}</span>
                  {filters.sort === o.value && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-black)' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Colour */}
          {colors.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                Colour
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {colors.map(c => (
                  <button key={c.name} type="button" onClick={() => toggle('color', c.name)} style={{
                    ...row,
                    color: filters.color === c.name ? 'var(--color-black)' : 'var(--color-muted)',
                    fontWeight: filters.color === c.name ? 500 : 400,
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <span>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: filters.color === c.name ? 'var(--color-black)' : 'var(--color-muted)' }}>
                      {filters.color === c.name ? '✓' : c.count}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Brand */}
          {brands.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                Brand
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {brands.map(b => (
                  <button key={b.name} type="button" onClick={() => toggle('brand', b.name)} style={{
                    ...row,
                    color: filters.brand === b.name ? 'var(--color-black)' : 'var(--color-muted)',
                    fontWeight: filters.brand === b.name ? 500 : 400,
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <span>{b.name}</span>
                    <span style={{ fontSize: '0.75rem', color: filters.brand === b.name ? 'var(--color-black)' : 'var(--color-muted)' }}>
                      {filters.brand === b.name ? '✓' : b.count}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)',
          display: 'flex', gap: '0.75rem', flexShrink: 0,
        }}>
          {hasAny && (
            <button type="button"
              onClick={() => onChange({ ...filters, color: '', brand: '', sort: '' })}
              style={{
                flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', background: 'none',
                border: '1px solid var(--color-border-mid)', padding: '0.875rem 0',
                cursor: 'pointer', color: 'var(--color-muted)',
              }}>
              Clear
            </button>
          )}
          <button type="button" onClick={onClose} style={{
            flex: 2, fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', background: 'var(--color-black)', border: 'none',
            padding: '0.875rem 0', cursor: 'pointer', color: 'var(--color-white)',
          }}>
            View {total.toLocaleString()} results
          </button>
        </div>
      </div>
    </>
  )
}

// ─── ProductBrowseLayout ──────────────────────────────────────────────────────

export default function ProductBrowseLayout({
  title, crumb,
  products, total, loading, hasMore, sentinel,
  sidebarNav,
  filters, availableFilters, onFilterChange,
}: ProductBrowseLayoutProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  const filterCount = [filters.color, filters.brand].filter(Boolean).length
  const activeCount = [filters.subcategory, filters.color, filters.brand, filters.sort && filters.sort !== 'relevance' ? 1 : 0].filter(Boolean).length

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const sideNavBtn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.06em',
    textTransform: 'uppercase', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', textAlign: 'left',
    color: active ? 'var(--color-black)' : 'var(--color-muted)',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <style>{`
        .browse-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 2rem 1.5rem 4rem;
          align-items: stretch;
        }
        @media (max-width: 900px)  { .browse-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 1rem; align-items: stretch; } }
        .browse-mobile-filter { display: none; }
        @media (max-width: 600px)  { .browse-sidebar { display: none !important; } .browse-mobile-filter { display: flex; align-items: center; gap: 0.4rem; } .browse-grid { gap: 0.5rem; padding: 0.75rem 0.5rem; align-items: stretch; } }
      `}</style>

      {/* ── Left sidebar ────────────────────────────── */}
      <aside className="browse-sidebar" style={{
        width: '180px', flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        padding: '2rem 1.25rem',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, maxHeight: '100vh',
        alignSelf: 'flex-start',
      }}>
        {/* Crumb / title */}
        {crumb && <div style={{ marginBottom: '1.5rem' }}>{crumb}</div>}

        {/* Nav slot (subcategories etc) */}
        {sidebarNav && (
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
            {sidebarNav}
          </div>
        )}

        {/* Filters button — pinned to bottom */}
        <div style={{ marginTop: 'auto' }}>
          {activeCount > 0 && (
            <button type="button"
              onClick={() => onFilterChange(BROWSE_EMPTY)}
              style={{
                ...sideNavBtn(false),
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

      {/* ── Main ────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(1.1rem, 2vw, 1.75rem)', letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Mobile filter button */}
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

        {/* Grid */}
        <div className="browse-grid">
          {loading && products.length === 0
            ? Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
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
            <button type="button" onClick={() => onFilterChange(BROWSE_EMPTY)} className="btn-outline">
              Clear filters
            </button>
          </div>
        )}

        <div ref={sentinel} aria-hidden="true" style={{ height: 1 }} />
        <div style={{ padding: '0 1.5rem' }}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
        </div>
      </div>

      {/* ── Right filter panel ───────────────────────── */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        avail={availableFilters}
        total={total}
        onChange={f => { onFilterChange(f) }}
      />
    </div>
  )
}
