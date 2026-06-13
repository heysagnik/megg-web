'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import type {
  AppliedFilters, FilterOption, SearchBanner,
  SearchFilters, SearchSort, SuggestedFilters, Product,
} from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActiveFilters {
  category:      string
  subcategories: string[]
  colors:        string[]
  brands:        string[]
  minPrice:      string
  maxPrice:      string
  sort:          string
}

export interface SearchLayoutProps {
  title:    string
  products: Product[]
  total:    number
  loading:  boolean
  hasMore:  boolean
  sentinel: RefObject<HTMLDivElement | null>

  categories:        { label: string; slug: string; count?: number }[]
  categoriesLoading: boolean

  filters:          ActiveFilters
  availableFilters: SearchFilters | null
  appliedFilters:   AppliedFilters | null
  suggestedFilters: SuggestedFilters | null
  banners:          SearchBanner[]
  searchMode:       string | null
  defaultSort:      SearchSort

  onCategorySelect:    (slug: string) => void
  onToggleMulti:       (key: 'color' | 'brand' | 'subcategory', value: string) => void
  onSortChange:        (sort: string) => void
  onClearAll:          () => void
  onRemoveApplied:     (kind: 'query' | 'category' | 'subcategory' | 'color' | 'brand' | 'minPrice' | 'maxPrice', value?: string) => void
  onApplySuggested:    (patch: { category?: string; subcategory?: string[]; color?: string[]; brand?: string[] }) => void
  onSelectPriceFilter: (value: string | null) => void
  onPriceRangeChange:  (min: number | null, max: number | null) => void
}

const SORT_OPTIONS: { label: string; value: SearchSort }[] = [
  { label: 'Newest',    value: 'newest'     },
  { label: 'Relevance', value: 'relevance'  },
  { label: 'Price ↑',   value: 'price_asc'  },
  { label: 'Price ↓',   value: 'price_desc' },
  { label: 'Popular',   value: 'popularity' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-sans)', fontSize: '0.625rem',
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'var(--color-muted)',
}

const BTN_RESET: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  label, onRemove, suggested, onClick,
}: {
  label: ReactNode
  onRemove?: () => void
  suggested?: boolean
  onClick?: () => void
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        fontFamily: 'var(--font-sans)', fontSize: '0.68rem',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        padding: '0.35rem 0.65rem',
        border: suggested ? '1px dashed var(--color-border-mid)' : '1px solid var(--color-black)',
        color: suggested ? 'var(--color-muted)' : 'var(--color-black)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button" onClick={e => { e.stopPropagation(); onRemove() }}
          aria-label="Remove filter"
          style={{ ...BTN_RESET, color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1 }}
        >×</button>
      )}
    </span>
  )
}

// ─── RefineGroup ─────────────────────────────────────────────────────────────

const SHOW_INITIAL = 6

function RefineGroup({
  title, items, selected, onToggle,
}: {
  title: string
  items: FilterOption[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  const [open, setOpen]       = useState(true)
  const [showAll, setShowAll] = useState(false)

  const selectedSet = new Set(selected)
  const byName      = new Map(items.map(i => [i.name, i]))
  const selectedRows = selected.map(n => byName.get(n) ?? { name: n, count: 0 })
  const rest         = items.filter(i => !selectedSet.has(i.name))
  const all          = [...selectedRows, ...rest]
  if (all.length === 0) return null

  const visible = showAll ? all : all.slice(0, SHOW_INITIAL)

  return (
    <div style={{ borderTop: '1px solid var(--color-border)' }}>
      <button
        type="button" onClick={() => setOpen(o => !o)}
        style={{
          ...BTN_RESET, ...LABEL,
          color: 'var(--color-black)', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.9rem 0',
        }}
      >
        <span>
          {title}
          {selected.length > 0 && (
            <span style={{ marginLeft: '0.35rem', color: 'var(--color-muted)' }}>({selected.length})</span>
          )}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}>▾</span>
      </button>

      {open && (
        <div style={{ paddingBottom: '0.75rem', display: 'flex', flexDirection: 'column' }}>
          {visible.map(item => {
            const active = selectedSet.has(item.name)
            return (
              <button
                key={item.name} type="button" onClick={() => onToggle(item.name)}
                style={{
                  ...BTN_RESET,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0', textAlign: 'left',
                  fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                  color: active ? 'var(--color-black)' : 'var(--color-muted-dark, #616161)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <span style={{
                    width: 12, height: 12, flexShrink: 0,
                    border: '1px solid var(--color-black)',
                    background: active ? 'var(--color-black)' : 'transparent',
                  }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', flexShrink: 0 }}>
                  {item.count > 0 ? item.count : '—'}
                </span>
              </button>
            )
          })}
          {all.length > SHOW_INITIAL && (
            <button
              type="button" onClick={() => setShowAll(s => !s)}
              style={{
                ...BTN_RESET, marginTop: '0.4rem', padding: '0.3rem 0', textAlign: 'left',
                fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--color-muted)', textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              {showAll ? 'Show less' : `+${all.length - SHOW_INITIAL} more`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PriceGroup ───────────────────────────────────────────────────────────────

function PriceGroup({
  avail, selectedPreset, minPrice, maxPrice, onPreset, onRange,
}: {
  avail:          SearchFilters
  selectedPreset: string | null
  minPrice:       string
  maxPrice:       string
  onPreset:       (v: string | null) => void
  onRange:        (min: number | null, max: number | null) => void
}) {
  const [open, setOpen] = useState(true)
  const [lo, setLo]     = useState(minPrice)
  const [hi, setHi]     = useState(maxPrice)
  useEffect(() => setLo(minPrice), [minPrice])
  useEffect(() => setHi(maxPrice), [maxPrice])

  const apply = () => {
    const min = lo === '' ? null : Number(lo)
    const max = hi === '' ? null : Number(hi)
    onRange(Number.isFinite(min as number) ? min as number : null, Number.isFinite(max as number) ? max as number : null)
  }

  const hasActive = !!selectedPreset || !!minPrice || !!maxPrice
  const presets   = avail.priceFilters ?? []
  const range     = avail.priceRange

  return (
    <div style={{ borderTop: '1px solid var(--color-border)' }}>
      <button
        type="button" onClick={() => setOpen(o => !o)}
        style={{
          ...BTN_RESET, ...LABEL,
          color: 'var(--color-black)', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.9rem 0',
        }}
      >
        <span>
          Price{hasActive && <span style={{ marginLeft: '0.35rem', color: 'var(--color-muted)' }}>(1)</span>}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}>▾</span>
      </button>

      {open && (
        <div style={{ paddingBottom: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {presets.map(p => {
            const checked = selectedPreset === p.value
            return (
              <button key={p.value} type="button" onClick={() => onPreset(checked ? null : p.value)}
                style={{
                  ...BTN_RESET,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0', textAlign: 'left',
                  fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                  color: checked ? 'var(--color-black)' : 'var(--color-muted-dark, #616161)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    border: '1px solid var(--color-black)',
                    background: checked ? 'var(--color-black)' : 'transparent',
                  }} />
                  {p.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{p.count}</span>
              </button>
            )
          })}

          {range && (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input
                type="number" inputMode="numeric"
                placeholder={String(range.min ?? 0)} value={lo}
                onChange={e => setLo(e.target.value)}
                style={{
                  flex: 1, padding: '0.45rem 0.5rem', fontSize: '0.75rem', minWidth: 0,
                  border: '1px solid var(--color-border-mid)', fontFamily: 'var(--font-sans)',
                }}
              />
              <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>–</span>
              <input
                type="number" inputMode="numeric"
                placeholder={String(range.max ?? '')} value={hi}
                onChange={e => setHi(e.target.value)}
                style={{
                  flex: 1, padding: '0.45rem 0.5rem', fontSize: '0.75rem', minWidth: 0,
                  border: '1px solid var(--color-border-mid)', fontFamily: 'var(--font-sans)',
                }}
              />
              <button type="button" onClick={apply} style={{
                ...BTN_RESET,
                fontFamily: 'var(--font-sans)', fontSize: '0.65rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.5rem 0.75rem',
                background: 'var(--color-black)', color: 'var(--color-white)',
              }}>Go</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── SortMenu ─────────────────────────────────────────────────────────────────

function SortMenu({ value, defaultSort, onChange }: {
  value: string; defaultSort: SearchSort; onChange: (s: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref             = useRef<HTMLDivElement>(null)
  const active          = (value || defaultSort) as SearchSort
  const label           = SORT_OPTIONS.find(o => o.value === active)?.label ?? 'Sort'

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        background: 'none', border: '1px solid var(--color-black)',
        padding: '0.5rem 0.875rem', cursor: 'pointer', color: 'var(--color-black)',
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      }}>
        {label} <span style={{ fontSize: '0.6rem' }}>▾</span>
      </button>

      {open && (
        <ul style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60,
          background: 'var(--color-white)', border: '1px solid var(--color-border)',
          listStyle: 'none', minWidth: 160, padding: 0, margin: 0,
          boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
        }}>
          {SORT_OPTIONS.map(o => (
            <li key={o.value}>
              <button type="button" onClick={() => { onChange(o.value); setOpen(false) }} style={{
                width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem',
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: o.value === active ? 'var(--color-gray-50)' : 'none',
                border: 'none', cursor: 'pointer', color: 'var(--color-black)',
              }}>{o.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Sheet (mobile) ───────────────────────────────────────────────────────────

function Sheet({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode
}) {
  return (
    <>
      <div aria-hidden="true" onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 399,
        background: 'rgba(0,0,0,0.32)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.22s',
      }} />
      <div role="dialog" aria-modal aria-label={title} style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 400,
        background: 'var(--color-white)', maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.76,0,0.24,1)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ ...LABEL, color: 'var(--color-black)' }}>{title}</span>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            ...BTN_RESET, fontSize: '1rem', color: 'var(--color-muted)', padding: '0.25rem',
          }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.25rem' }}>{children}</div>
        {footer && (
          <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </>
  )
}

// ─── SearchLayout ─────────────────────────────────────────────────────────────

export default function SearchLayout({
  title, products, total, loading, hasMore, sentinel,
  categories, categoriesLoading,
  filters, availableFilters,
  appliedFilters, suggestedFilters, banners, searchMode, defaultSort,
  onCategorySelect, onToggleMulti, onSortChange, onClearAll,
  onRemoveApplied, onApplySuggested,
  onSelectPriceFilter, onPriceRangeChange,
}: SearchLayoutProps) {
  const [catOpen, setCatOpen] = useState(false)
  const [filOpen, setFilOpen] = useState(false)
  const [showMbar, setShowMbar] = useState(true)

  // Auto-hide mobile bar on scroll down, show when scroll stops
  useEffect(() => {
    let lastY = window.scrollY
    let scrollTimeout: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      const y = window.scrollY
      if (y > lastY && y > 100) {
        setShowMbar(false) // scrolling down
      } else if (y < lastY) {
        setShowMbar(true) // scrolling up
      }
      lastY = y

      // Show bar when scrolling stops
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setShowMbar(true)
      }, 150)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCatOpen(false); setFilOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const af = availableFilters

  const activeCount =
    (filters.category ? 1 : 0) +
    filters.subcategories.length +
    filters.colors.length +
    filters.brands.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.sort && filters.sort !== defaultSort ? 1 : 0)

  const selectedPreset = af?.priceFilters?.find(p => filters.maxPrice === p.value)?.value ?? null

  const priceChipLabel = (() => {
    const pf = af?.priceFilters?.find(p => p.value === filters.maxPrice)
    if (pf)                                  return pf.label
    if (filters.minPrice && filters.maxPrice) return `Rs ${filters.minPrice}–Rs ${filters.maxPrice}`
    if (filters.maxPrice)                     return `Up to Rs ${filters.maxPrice}`
    if (filters.minPrice)                     return `From Rs ${filters.minPrice}`
    return null
  })()

  const isLanding = searchMode === 'empty' && activeCount === 0 && !appliedFilters?.query

  const hasChips =
    !!appliedFilters?.query || !!filters.category ||
    filters.subcategories.length > 0 || filters.colors.length > 0 ||
    filters.brands.length > 0 || !!(filters.minPrice || filters.maxPrice)

  const hasSuggested =
    !!suggestedFilters?.category ||
    (suggestedFilters?.subcategory?.length ?? 0) > 0 ||
    (suggestedFilters?.colors?.length ?? 0) > 0 ||
    (suggestedFilters?.brands?.length ?? 0) > 0

  // Bubble subcategories that match the search query to the top
  const queryLower = (appliedFilters?.query ?? '').toLowerCase().trim()
  const sortedSubs = (() => {
    const items = af?.subcategories ?? []
    if (!queryLower) return items
    const match = items.filter(i => i.name.toLowerCase().includes(queryLower))
    const rest   = items.filter(i => !i.name.toLowerCase().includes(queryLower))
    return [...match, ...rest]
  })()

  const v = af?.visibility

  const refineSection = (
    <>
      {(!v || v.showSubcategories) && (
        <RefineGroup title="Subcategory" items={sortedSubs} selected={filters.subcategories}
          onToggle={val => onToggleMulti('subcategory', val)} />
      )}
      {(!v || v.showColors) && (
        <RefineGroup title="Colour" items={af?.colors ?? []} selected={filters.colors}
          onToggle={val => onToggleMulti('color', val)} />
      )}
      {(!v || v.showBrands) && (
        <RefineGroup title="Brand" items={af?.brands ?? []} selected={filters.brands}
          onToggle={val => onToggleMulti('brand', val)} />
      )}
      {af && (af.priceFilters?.length > 0 || af.priceRange) && (
        <PriceGroup
          avail={af} selectedPreset={selectedPreset}
          minPrice={filters.minPrice} maxPrice={filters.maxPrice}
          onPreset={onSelectPriceFilter} onRange={onPriceRangeChange}
        />
      )}
    </>
  )

  const renderCategories = (onPick?: () => void) => {
    if (categoriesLoading) {
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} style={{ marginBottom: '0.65rem' }}>
              <span style={{ display: 'block', height: 12, width: `${60 + (i % 4) * 10}%`, background: 'var(--color-gray-100)' }} />
            </li>
          ))}
        </ul>
      )
    }
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {categories.map((cat, i) => {
          const active = cat.slug === '' ? !filters.category : filters.category === cat.slug
          return (
            <li key={cat.slug || '__all__'} style={{ marginBottom: '0.5rem' }}>
              <button type="button" onClick={() => { onCategorySelect(cat.slug); onPick?.() }} style={{
                ...BTN_RESET,
                display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: active ? 'var(--color-black)' : 'var(--color-muted-dark, #616161)',
                fontWeight: active ? 500 : 400, width: '100%', textAlign: 'left',
              }}>
                {cat.slug !== '' && (
                  <span style={{ color: 'var(--color-muted)', fontSize: '0.6rem' }}>
                    |{String(i).padStart(2, '0')}|
                  </span>
                )}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.label}
                </span>
                {cat.count != null && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 400, flexShrink: 0 }}>
                    {cat.count}
                  </span>
                )}
                {active && <span style={{ fontSize: '0.7rem' }}>●</span>}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <style>{`
        .srch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 1.5rem 1.5rem 5rem;
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .srch-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; padding: 1rem; }
        }
        @media (max-width: 600px) {
          .srch-grid { gap: 0.5rem; padding: 0.75rem 0.5rem 6rem; }
          .srch-sidebar { display: none !important; }
          .srch-mbar    { display: flex !important; }
          .srch-sort    { display: none !important; }
        }
        .srch-mbar { display: none; }
        .srch-sort { display: inline-flex; }
      `}</style>

      {/* Sidebar */}
      <aside className="srch-sidebar" style={{
        width: 240, flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        padding: '1.75rem 1.25rem 4rem',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 'var(--header-height)',
        maxHeight: 'calc(100vh - var(--header-height))',
        overflowY: 'auto', alignSelf: 'flex-start',
      }}>
        {(categoriesLoading || categories.length > 0) && (
          <>
            <div style={{ ...LABEL, marginBottom: '0.85rem' }}>Category</div>
            {renderCategories()}
          </>
        )}

        {af && (
          <>
            <div style={{ ...LABEL, marginTop: '2rem', marginBottom: '0.5rem' }}>Refine</div>
            {refineSection}
          </>
        )}

        {activeCount > 0 && (
          <button type="button" onClick={onClearAll} style={{
            ...BTN_RESET, marginTop: '1.5rem', textAlign: 'left',
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--color-muted)', textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Clear all ({activeCount})
          </button>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', gap: '1rem',
        }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-serif)', fontWeight: 300,
              fontSize: 'clamp(1.1rem, 2vw, 1.75rem)', letterSpacing: '-0.02em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{title}</h1>
            <p style={{ ...LABEL, marginTop: '0.25rem' }}>
              {loading && total === 0 ? '—' : `${total.toLocaleString()} items`}
            </p>
          </div>
          <div className="srch-sort">
            <SortMenu value={filters.sort} defaultSort={defaultSort} onChange={onSortChange} />
          </div>
        </div>

        {/* Hero banner */}
        {isLanding && banners?.[0] && (
          <div style={{ padding: '1.5rem 1.5rem 0' }}>
            {banners[0].link
              ? <a href={banners[0].link}><BannerImg banner={banners[0]} /></a>
              : <BannerImg banner={banners[0]} />
            }
          </div>
        )}

        {/* Filter chips */}
        {(hasChips || hasSuggested) && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
            padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--color-border)',
          }}>
            {appliedFilters?.query && (
              <Chip label={`"${appliedFilters.query}"`} onRemove={() => onRemoveApplied('query')} />
            )}
            {filters.category && (
              <Chip label={filters.category} onRemove={() => onRemoveApplied('category')} />
            )}
            {filters.subcategories.map(v => (
              <Chip key={v} label={v} onRemove={() => onRemoveApplied('subcategory', v)} />
            ))}
            {filters.colors.map(v => (
              <Chip key={v} label={v} onRemove={() => onRemoveApplied('color', v)} />
            ))}
            {filters.brands.map(v => (
              <Chip key={v} label={v} onRemove={() => onRemoveApplied('brand', v)} />
            ))}
            {priceChipLabel && (
              <Chip
                label={priceChipLabel}
                onRemove={() => { onRemoveApplied('minPrice'); onRemoveApplied('maxPrice') }}
              />
            )}

            {hasChips && hasSuggested && (
              <span style={{ width: 1, height: 16, background: 'var(--color-border)', flexShrink: 0, alignSelf: 'center' }} />
            )}

            {suggestedFilters && (
              <SuggestedChips
                suggested={suggestedFilters}
                applied={appliedFilters}
                onApply={onApplySuggested}
              />
            )}
          </div>
        )}

        {/* Product grid */}
        <div className="srch-grid">
          {loading && products.length === 0
            ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
          {loading && products.length > 0 &&
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={`t${i}`} />)
          }
        </div>

        {/* Empty states */}
        {!loading && products.length === 0 && isLanding && (
          <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, opacity: 0.6, marginBottom: '0.5rem' }}>
              Pick a category to begin
            </p>
            <p style={LABEL}>Or use the search in the header</p>
          </div>
        )}
        {!loading && products.length === 0 && !isLanding && (
          <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, opacity: 0.4, marginBottom: '1rem' }}>
              No products match your filters
            </p>
            <button type="button" onClick={onClearAll} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'none', border: '1px solid var(--color-black)',
              padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--color-black)',
            }}>Clear filters</button>
          </div>
        )}

        <div ref={sentinel} aria-hidden="true" style={{ height: 1 }} />
        <div style={{ padding: '0 1.5rem 5rem' }}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
        </div>
      </div>

      <div className="srch-mbar" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 200,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-border)',
        padding: '0.6rem 0.75rem', gap: '0.5rem',
        transform: showMbar ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
      }}>
        {(categoriesLoading || categories.length > 0) && (
          <button type="button" onClick={() => setCatOpen(true)} style={{
            flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'none', border: '1px solid var(--color-black)',
            padding: '0.7rem 0', cursor: 'pointer', color: 'var(--color-black)',
          }}>
            Category{filters.category ? `: ${filters.category}` : ''}
          </button>
        )}
        <button type="button" onClick={() => setFilOpen(true)} style={{
          flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'var(--color-black)', border: '1px solid var(--color-black)',
          padding: '0.7rem 0', cursor: 'pointer', color: 'var(--color-white)',
        }}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>

      {/* Mobile category sheet */}
      <Sheet open={catOpen} onClose={() => setCatOpen(false)} title="Category">
        {renderCategories(() => setCatOpen(false))}
      </Sheet>

      {/* Mobile filter sheet */}
      <Sheet
        open={filOpen}
        onClose={() => setFilOpen(false)}
        title={`Filters${activeCount > 0 ? ` (${activeCount})` : ''}`}
        footer={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activeCount > 0 && (
              <button type="button" onClick={onClearAll} style={{
                flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'none', border: '1px solid var(--color-border-mid)',
                padding: '0.85rem 0', cursor: 'pointer', color: 'var(--color-muted)',
              }}>Clear</button>
            )}
            <button type="button" onClick={() => setFilOpen(false)} style={{
              flex: 2, fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'var(--color-black)', border: 'none',
              padding: '0.85rem 0', cursor: 'pointer', color: 'var(--color-white)',
            }}>
              View {total.toLocaleString()} results
            </button>
          </div>
        }
      >
        <div style={{ ...LABEL, marginTop: '0.5rem', marginBottom: '0.5rem' }}>Sort by</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          {SORT_OPTIONS.map(o => {
            const isActive = (filters.sort || defaultSort) === o.value
            return (
              <button key={o.value} type="button" onClick={() => onSortChange(o.value)} style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0.4rem 0.7rem', cursor: 'pointer',
                background: isActive ? 'var(--color-black)' : 'none',
                color:      isActive ? 'var(--color-white)' : 'var(--color-black)',
                border: '1px solid var(--color-black)',
              }}>{o.label}</button>
            )
          })}
        </div>
        {refineSection}
      </Sheet>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function BannerImg({ banner }: { banner: SearchBanner }) {
  return (
    <div style={{ width: '100%', aspectRatio: '21/7', overflow: 'hidden', background: 'var(--color-gray-100)' }}>
      {banner.banner_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={banner.banner_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  )
}

function SuggestedChips({ suggested, applied, onApply }: {
  suggested: SuggestedFilters
  applied:   AppliedFilters | null
  onApply:   SearchLayoutProps['onApplySuggested']
}) {
  const appliedSubs   = new Set(applied?.subcategories ?? [])
  const appliedColors = new Set(applied?.colors        ?? [])
  const appliedBrands = new Set(applied?.brands        ?? [])
  const appliedCat    = applied?.category ?? null

  const chips: ReactNode[] = []
  if (suggested.category && suggested.category !== appliedCat) chips.push(
    <Chip key={`s-cat`} suggested label={`+ ${suggested.category}`}
      onClick={() => onApply({ category: suggested.category })} />
  )
  const subs = Array.isArray(suggested.subcategory) ? suggested.subcategory : suggested.subcategory ? [suggested.subcategory] : []
  const cols = Array.isArray(suggested.colors)      ? suggested.colors      : suggested.colors      ? [suggested.colors]      : []
  const brds = Array.isArray(suggested.brands)      ? suggested.brands      : suggested.brands      ? [suggested.brands]      : []
  subs.filter(s => !appliedSubs.has(s)).forEach(s => chips.push(
    <Chip key={`s-sc-${s}`} suggested label={`+ ${s}`} onClick={() => onApply({ subcategory: [s] })} />
  ))
  cols.filter(c => !appliedColors.has(c)).forEach(c => chips.push(
    <Chip key={`s-co-${c}`} suggested label={`+ ${c}`} onClick={() => onApply({ color: [c] })} />
  ))
  brds.filter(b => !appliedBrands.has(b)).forEach(b => chips.push(
    <Chip key={`s-br-${b}`} suggested label={`+ ${b}`} onClick={() => onApply({ brand: [b] })} />
  ))
  return chips.length ? <>{chips}</> : null
}
