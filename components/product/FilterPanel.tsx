'use client'

import type { AvailableFilters } from '@/lib/api'
import {
  type BrowseFilters,
  PRICE_OPTIONS,
  SORT_OPTIONS,
} from '@/lib/browseFilters'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  filters: BrowseFilters
  avail: AvailableFilters
  total: number
  onChange: (next: BrowseFilters) => void
}

export default function FilterPanel({
  open,
  onClose,
  filters,
  avail,
  total,
  onChange,
}: FilterPanelProps) {
  const categories    = avail.categories    ?? []
  const subcategories = avail.subcategories ?? []
  const colors        = avail.colors        ?? []
  const brands        = avail.brands        ?? []

  const setCategory = (value: string) =>
    onChange({ ...filters, subcategory: value })
  const setSubcategory = (value: string) =>
    onChange({ ...filters, subcategory: filters.subcategory === value ? '' : value })
  const toggle = (key: 'color' | 'brand', value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? '' : value })

  const setSort = (s: BrowseFilters['sort']) =>
    onChange({ ...filters, sort: s })

  const filterCount = [filters.subcategory, filters.color, filters.brand, filters.maxPrice != null ? '1' : ''].filter(Boolean).length
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
        className="filter-panel"
        data-open={open}
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

          {/* Subcategory */}
          {subcategories.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                Subcategory
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => setSubcategory('')}
                  style={{
                    ...row,
                    color: !filters.subcategory ? 'var(--color-black)' : 'var(--color-muted)',
                    fontWeight: !filters.subcategory ? 500 : 400,
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span>All</span>
                </button>
                {subcategories.map(s => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSubcategory(s.name)}
                    style={{
                      ...row,
                      color: filters.subcategory === s.name ? 'var(--color-black)' : 'var(--color-muted)',
                      fontWeight: filters.subcategory === s.name ? 500 : 400,
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span>{s.name}</span>
                    <span style={{ fontSize: '0.75rem', color: filters.subcategory === s.name ? 'var(--color-black)' : 'var(--color-muted)' }}>
                      {filters.subcategory === s.name ? '✓' : s.count}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Category (only when more than one) */}
          {categories.length > 1 && (
            <section style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                Category
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {categories.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setCategory(c.name)}
                    style={{
                      ...row,
                      color: filters.subcategory === c.name ? 'var(--color-black)' : 'var(--color-muted)',
                      fontWeight: filters.subcategory === c.name ? 500 : 400,
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      {c.count}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

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

          {/* Price */}
          <section style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
              Price
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PRICE_OPTIONS.map(o => (
                <button key={o.value} type="button"
                  onClick={() => onChange({ ...filters, maxPrice: filters.maxPrice === o.value ? null : o.value })}
                  style={{
                    ...row,
                    color: filters.maxPrice === o.value ? 'var(--color-black)' : 'var(--color-muted)',
                    fontWeight: filters.maxPrice === o.value ? 500 : 400,
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                  <span>{o.label}</span>
                  {filters.maxPrice === o.value && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-black)' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)',
          display: 'flex', gap: '0.75rem', flexShrink: 0,
        }}>
          {hasAny && (
            <button type="button"
              onClick={() => onChange({ ...filters, color: '', brand: '', sort: '', maxPrice: null })}
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
