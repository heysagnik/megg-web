'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import {
  getSearchSuggestions,
  type AppliedFilters,
  type FilterOption,
  type SearchBanner,
  type SearchFilters,
  type SearchSort,
  type SearchSuggestion,
  type SuggestedFilters,
  type Product,
} from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'
import { cn as CN } from '@/lib/utils'
import { useScrollHideOnIdle } from '@/hooks/useScrollHideOnIdle'
import { useFooterVisibility } from '@/hooks/useFooterVisibility'

export interface ActiveFilters {
  category:      string
  subcategories: string[]
  colors:        string[]
  brands:        string[]
  minPrice:      string
  maxPrice:      string
  sort:          string
  query?:        string
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
  onQueryChange:       (query: string) => void
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
  { label: 'Relevance', value: 'relevance'  },
  { label: 'Newest',    value: 'newest'     },
  { label: 'Price ↑',   value: 'price_asc'  },
  { label: 'Price ↓',   value: 'price_desc' },
  { label: 'Popular',   value: 'popularity' },
]

const ITEM_LIMIT = 5

// ─── Dedicated Top Search Bar ──────────────────────────────────────────────────

function DedicatedSearchBar({
  query,
  hasSearch,
  onQueryChange,
  onClearAll,
}: {
  query: string
  hasSearch: boolean
  onQueryChange: (query: string) => void
  onClearAll: () => void
}) {
  const [inputVal, setInputVal] = useState(query || '')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    setInputVal(query || '')
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const queryTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleChange = (val: string) => {
    setInputVal(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (queryTimerRef.current) clearTimeout(queryTimerRef.current)

    queryTimerRef.current = setTimeout(() => {
      onQueryChange(val.trim())
    }, 500)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    timerRef.current = setTimeout(async () => {
      try {
        const s = await getSearchSuggestions(val.trim())
        setSuggestions(s)
        setShowSuggestions(s.length > 0)
      } catch {
        setSuggestions([])
      }
    }, 250)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (queryTimerRef.current) clearTimeout(queryTimerRef.current)
    setShowSuggestions(false)
    onQueryChange(inputVal.trim())
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 pt-4 pb-3 relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center border-b border-neutral-300 focus-within:border-black pb-2.5 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black shrink-0 mr-3">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => handleChange(e.target.value)}
          placeholder="SEARCH"
          autoComplete="off"
          style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
          className="flex-1 border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none bg-transparent font-sans text-sm sm:text-base tracking-[0.12em] uppercase text-black caret-black placeholder:text-neutral-400 font-medium py-0 m-0"
        />

        {inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal('')
              setSuggestions([])
              setShowSuggestions(false)
              onQueryChange('')
              onClearAll()
              inputRef.current?.focus()
            }}
            className="bg-transparent border-none cursor-pointer p-1 text-neutral-400 hover:text-black text-sm leading-none shrink-0"
          >✕</button>
        )}
      </form>

      {/* Quick tags */}
      {!hasSearch && !inputVal && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 justify-center sm:justify-start">
          {[
            { label: 'SHIRTS', query: 'shirt' },
            { label: 'T-SHIRTS', query: 'tshirt' },
            { label: 'OVERSIZED', query: 'oversized' },
            { label: 'DENIM', query: 'denim' },
            { label: 'JACKETS', query: 'jacket' },
            { label: 'CARGO', query: 'cargo' },
            { label: 'UNDER ₹699', query: 'under 699' },
          ].map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => {
                setInputVal(tag.query)
                onQueryChange(tag.query)
              }}
              className="font-sans text-[0.7rem] tracking-[0.1em] uppercase bg-transparent border-none text-neutral-400 hover:text-black p-0 cursor-pointer transition-colors font-normal"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* Auto suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-4 right-4 z-50 bg-white border-b border-neutral-200 shadow-lg mt-1 max-h-[220px] overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.value}-${i}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                setInputVal(s.value)
                setShowSuggestions(false)
                onQueryChange(s.value)
              }}
              className="w-full text-left py-2.5 px-4 font-sans text-[0.725rem] tracking-[0.08em] uppercase border-b border-neutral-100 cursor-pointer text-black hover:bg-neutral-50 flex items-center gap-3"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400 shrink-0">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span>{s.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Filter Tag / Chip ────────────────────────────────────────────────────────

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
      className={CN(
        'inline-flex items-center gap-1.5',
        'font-sans text-[0.68rem] tracking-wider uppercase',
        'py-1 px-2.5 transition-colors',
        'select-none whitespace-nowrap',
        suggested
          ? 'border border-dashed border-neutral-300 text-neutral-500 hover:text-black hover:border-black cursor-pointer'
          : 'border border-black text-black bg-neutral-50',
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button" onClick={e => { e.stopPropagation(); onRemove() }}
          aria-label="Remove filter"
          className="bg-transparent border-none cursor-pointer p-0 text-neutral-400 hover:text-black text-xs leading-none"
        >✕</button>
      )}
    </span>
  )
}

// ─── Search Filter Drawer (Zara Luxury Style) ──────────────────────────────────

function SearchFilterDrawer({
  open,
  onClose,
  af,
  filters,
  defaultSort,
  activeCount,
  total,
  onToggleMulti,
  onSortChange,
  onClearAll,
  onSelectPriceFilter,
  onPriceRangeChange,
}: {
  open: boolean
  onClose: () => void
  af: SearchFilters | null
  filters: ActiveFilters
  defaultSort: SearchSort
  activeCount: number
  total: number
  onToggleMulti: (key: 'color' | 'brand' | 'subcategory', value: string) => void
  onSortChange: (sort: string) => void
  onClearAll: () => void
  onSelectPriceFilter: (v: string | null) => void
  onPriceRangeChange: (min: number | null, max: number | null) => void
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const subcats = af?.subcategories ?? []
  const colors = af?.colors ?? []
  const brands = af?.brands ?? []

  const visibleSubcats = expanded['subcategory'] ? subcats : subcats.slice(0, ITEM_LIMIT)
  const visibleColors = expanded['color'] ? colors : colors.slice(0, ITEM_LIMIT)
  const visibleBrands = expanded['brand'] ? brands : brands.slice(0, ITEM_LIMIT)

  const sectionLabelClasses = 'font-sans text-[0.625rem] tracking-[0.16em] uppercase text-neutral-400 mb-2 font-medium'
  const sectionClasses = 'mb-6'

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[299] bg-black/25 backdrop-blur-[2px] transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Side Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed inset-y-0 right-0 z-[300] bg-white border-l border-neutral-200 flex flex-col will-change-transform transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] w-full md:w-[380px] h-screen"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
          <span className="font-sans text-[0.725rem] tracking-[0.16em] uppercase font-medium text-black">
            FILTERS {activeCount > 0 && <span className="text-neutral-400 font-normal">({activeCount})</span>}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="font-sans text-base bg-transparent border-none cursor-pointer text-neutral-400 hover:text-black leading-none p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 hide-scrollbar">

          {/* Subcategory / Type */}
          {subcats.length > 0 && (
            <section className={sectionClasses}>
              <p className={sectionLabelClasses}>TYPE</p>
              <div className="flex flex-col">
                {visibleSubcats.map(s => {
                  const isActive = filters.subcategories.includes(s.name)
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => onToggleMulti('subcategory', s.name)}
                      className="font-sans text-[0.7rem] tracking-[0.05em] uppercase bg-transparent border-b border-neutral-100 py-2.5 cursor-pointer text-left w-full flex justify-between items-center transition-colors"
                    >
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {s.name}
                      </span>
                      <span className={CN('text-[0.65rem]', isActive ? 'font-bold text-black' : 'text-neutral-400 font-mono')}>
                        {s.count}
                      </span>
                    </button>
                  )
                })}
              </div>
              {subcats.length > ITEM_LIMIT && (
                <button
                  type="button"
                  onClick={() => toggleExpand('subcategory')}
                  className="font-sans text-[0.65rem] tracking-[0.14em] uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-2 text-left transition-colors font-medium"
                >
                  {expanded['subcategory'] ? '- VIEW LESS' : `+ VIEW MORE (${subcats.length - ITEM_LIMIT})`}
                </button>
              )}
            </section>
          )}

          {/* Colour */}
          {colors.length > 0 && (
            <section className={sectionClasses}>
              <p className={sectionLabelClasses}>COLOUR</p>
              <div className="flex flex-col">
                {visibleColors.map(c => {
                  const isActive = filters.colors.includes(c.name)
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => onToggleMulti('color', c.name)}
                      className="font-sans text-[0.7rem] tracking-[0.05em] uppercase bg-transparent border-b border-neutral-100 py-2.5 cursor-pointer text-left w-full flex justify-between items-center transition-colors"
                    >
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {c.name}
                      </span>
                      <span className={CN('text-[0.65rem]', isActive ? 'font-bold text-black' : 'text-neutral-400 font-mono')}>
                        {c.count}
                      </span>
                    </button>
                  )
                })}
              </div>
              {colors.length > ITEM_LIMIT && (
                <button
                  type="button"
                  onClick={() => toggleExpand('color')}
                  className="font-sans text-[0.65rem] tracking-[0.14em] uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-2 text-left transition-colors font-medium"
                >
                  {expanded['color'] ? '- VIEW LESS' : `+ VIEW MORE (${colors.length - ITEM_LIMIT})`}
                </button>
              )}
            </section>
          )}

          {/* Brand */}
          {brands.length > 0 && (
            <section className={sectionClasses}>
              <p className={sectionLabelClasses}>BRAND</p>
              <div className="flex flex-col">
                {visibleBrands.map(b => {
                  const isActive = filters.brands.includes(b.name)
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => onToggleMulti('brand', b.name)}
                      className="font-sans text-[0.7rem] tracking-[0.05em] uppercase bg-transparent border-b border-neutral-100 py-2.5 cursor-pointer text-left w-full flex justify-between items-center transition-colors"
                    >
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {b.name}
                      </span>
                      <span className={CN('text-[0.65rem]', isActive ? 'font-bold text-black' : 'text-neutral-400 font-mono')}>
                        {b.count}
                      </span>
                    </button>
                  )
                })}
              </div>
              {brands.length > ITEM_LIMIT && (
                <button
                  type="button"
                  onClick={() => toggleExpand('brand')}
                  className="font-sans text-[0.65rem] tracking-[0.14em] uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-2 text-left transition-colors font-medium"
                >
                  {expanded['brand'] ? '- VIEW LESS' : `+ VIEW MORE (${brands.length - ITEM_LIMIT})`}
                </button>
              )}
            </section>
          )}

          {/* Price Filters */}
          {af?.priceFilters && af.priceFilters.length > 0 && (
            <section className={sectionClasses}>
              <p className={sectionLabelClasses}>PRICE</p>
              <div className="flex flex-col">
                {af.priceFilters.map(p => {
                  const isActive = filters.maxPrice === p.value
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => onSelectPriceFilter(isActive ? null : p.value)}
                      className="font-sans text-[0.7rem] tracking-[0.05em] uppercase bg-transparent border-b border-neutral-100 py-2.5 cursor-pointer text-left w-full flex justify-between items-center transition-colors"
                    >
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {p.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-neutral-200 flex gap-3 shrink-0 bg-white">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 font-sans text-[0.675rem] tracking-[0.14em] uppercase bg-transparent border border-neutral-300 py-3 px-0 cursor-pointer text-neutral-600 hover:text-black hover:border-black transition-colors"
            >
              CLEAR ALL
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] font-sans text-[0.675rem] tracking-[0.14em] uppercase bg-black border border-black py-3 px-0 cursor-pointer text-white hover:opacity-90 transition-opacity font-medium"
          >
            SEE {total.toLocaleString()} RESULTS
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Mobile Sort Bottom Sheet ──────────────────────────────────────────────────

function SortBottomSheet({
  open,
  onClose,
  currentSort,
  defaultSort,
  onSortChange,
}: {
  open: boolean
  onClose: () => void
  currentSort: string
  defaultSort: SearchSort
  onSortChange: (sort: string) => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sort Options"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[300] bg-white px-6 pt-5 pb-8 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        <div className="w-12 h-1 bg-neutral-300 mx-auto mb-5" />
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-3">
          <span className="font-sans text-[0.75rem] tracking-[0.16em] uppercase font-bold text-black">
            SORT BY
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sort"
            className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-black p-1 text-sm leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col">
          {SORT_OPTIONS.map(o => {
            const isActive = (currentSort || defaultSort) === o.value
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onSortChange(o.value)
                  onClose()
                }}
                className="font-sans text-[0.75rem] tracking-[0.08em] uppercase bg-transparent border-b border-neutral-100 py-3.5 cursor-pointer text-left w-full flex justify-between items-center transition-colors"
              >
                <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 font-normal'}>
                  {o.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── SearchLayout Main Component ───────────────────────────────────────────────

export default function SearchLayout({
  title, products, total, loading, hasMore, sentinel,
  categories, categoriesLoading,
  filters, availableFilters,
  appliedFilters, suggestedFilters, banners, searchMode, defaultSort,
  onQueryChange, onCategorySelect, onToggleMulti, onSortChange, onClearAll,
  onRemoveApplied, onApplySuggested,
  onSelectPriceFilter, onPriceRangeChange,
}: SearchLayoutProps) {
  const [filOpen, setFilOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [showMbar] = useScrollHideOnIdle()
  const footerIntersecting = useFooterVisibility()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setFilOpen(false) }
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

  const hasSearch = Boolean(
    (appliedFilters?.query && appliedFilters.query.trim()) ||
    (filters.query && filters.query.trim()) ||
    filters.category ||
    filters.subcategories.length > 0 ||
    filters.colors.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice ||
    filters.maxPrice
  )

  const priceChipLabel = (() => {
    const pf = af?.priceFilters?.find(p => p.value === filters.maxPrice)
    if (pf)                                  return pf.label
    if (filters.minPrice && filters.maxPrice) return `Rs ${filters.minPrice}–Rs ${filters.maxPrice}`
    if (filters.maxPrice)                     return `Up to Rs ${filters.maxPrice}`
    if (filters.minPrice)                     return `From Rs ${filters.minPrice}`
    return null
  })()

  const hasChips =
    !!appliedFilters?.query || !!filters.category ||
    filters.subcategories.length > 0 || filters.colors.length > 0 ||
    filters.brands.length > 0 || !!(filters.minPrice || filters.maxPrice)

  const hasSuggested =
    !!suggestedFilters?.category ||
    (suggestedFilters?.subcategory?.length ?? 0) > 0 ||
    (suggestedFilters?.colors?.length ?? 0) > 0 ||
    (suggestedFilters?.brands?.length ?? 0) > 0

  const subcategories = af?.subcategories ?? []
  const hasSubcategories = subcategories.length > 0

  const handleCategoryClick = (slug: string) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onCategorySelect(slug)
  }

  const handleSubcategoryClick = (name: string) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (!name) {
      filters.subcategories.forEach(s => onToggleMulti('subcategory', s))
    } else {
      onToggleMulti('subcategory', name)
    }
  }

  // ── Desktop left sidebar navigation ──
  const sidebarNav = (
    <div className="flex flex-col justify-center my-auto w-full py-6">
      <ul className="list-none space-y-2.5 font-sans text-[0.725rem] tracking-wider uppercase text-left">
        {hasSubcategories ? (
          <>
            <li>
              <button
                type="button"
                onClick={() => handleSubcategoryClick('')}
                className={CN(
                  'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
                  filters.subcategories.length === 0 ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal',
                )}
              >
                VIEW ALL
              </button>
            </li>
            {subcategories.map((sub) => {
              const isActive = filters.subcategories.includes(sub.name)
              return (
                <li key={sub.name}>
                  <button
                    type="button"
                    onClick={() => handleSubcategoryClick(sub.name)}
                    className={CN(
                      'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
                      isActive ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal',
                    )}
                  >
                    {sub.name}
                  </button>
                </li>
              )
            })}
          </>
        ) : (
          <>
            <li>
              <button
                type="button"
                onClick={() => handleCategoryClick('')}
                className={CN(
                  'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
                  !filters.category ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal',
                )}
              >
                VIEW ALL
              </button>
            </li>
            {categories.map((cat) => {
              if (!cat.slug) return null
              const isActive = filters.category === cat.slug
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={CN(
                      'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
                      isActive ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal',
                    )}
                  >
                    {cat.label}
                  </button>
                </li>
              )
            })}
          </>
        )}
      </ul>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setFilOpen(true)}
          className="font-sans text-[0.725rem] tracking-widest uppercase bg-transparent border-none cursor-pointer text-black hover:opacity-75 p-0 text-left flex items-center gap-1.5"
        >
          FILTERS
          {activeCount > 0 && (
            <span className="text-[0.65rem] font-medium text-neutral-400">
              ({activeCount})
            </span>
          )}
        </button>
      </div>

    </div>
  )

  // ── Desktop right sidebar navigation for SORT BY ──
  const rightSidebarNav = (
    <div className="flex flex-col justify-center my-auto w-full py-6">
      <p className="font-sans text-[0.625rem] tracking-[0.16em] uppercase text-neutral-400 mb-3 font-medium text-left">
        SORT BY
      </p>
      <ul className="list-none space-y-2.5 font-sans text-[0.725rem] tracking-wider uppercase text-left">
        {SORT_OPTIONS.map(o => {
          const isActive = (filters.sort || defaultSort) === o.value
          return (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => onSortChange(o.value)}
                className={CN(
                  'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
                  isActive ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal'
                )}
              >
                {o.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const gridInnerClass =
    'grid w-full grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-8 md:gap-x-12 lg:gap-x-14 gap-y-10 md:gap-y-14 max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 transition-all duration-300'

  const activeSearchTerm =
    appliedFilters?.query ||
    filters.query ||
    (filters.subcategories && filters.subcategories.length > 0 ? filters.subcategories.join(', ') : '') ||
    filters.category ||
    ''

  return (
    <div className="flex min-h-[100vh] w-full flex-col">
      {/* ── Sticky Top Search Bar Section ── */}
      <div className="sticky top-[var(--header-height,52px)] z-[100] bg-white/97 backdrop-blur-md border-b border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <DedicatedSearchBar
          query={activeSearchTerm}
          hasSearch={hasSearch}
          onQueryChange={onQueryChange}
          onClearAll={onClearAll}
        />
      </div>

      <div className="flex flex-1 w-full">
        {/* ── Left sidebar (sticky & vertically centered) — ONLY show when search is active ── */}
        {hasSearch && (
          <aside className="font-sans hidden md:flex flex-col justify-center w-[160px] xl:w-[180px] shrink-0 px-4 py-8 sticky top-[var(--header-height,52px)] h-[calc(100vh-var(--header-height,52px))] self-start overflow-y-auto hide-scrollbar">
            {sidebarNav}
          </aside>
        )}

        {/* ── Main content section ── */}
        <div className="flex-1 min-w-0 py-2 md:py-4">
          {/* ── Mobile top category navigation strip (sticky) — ONLY show when search is active ── */}
          {hasSearch && (
            <div className="md:hidden sticky top-[var(--header-height,52px)] z-[90] bg-white/97 backdrop-blur-md px-4 pt-1 pb-1 border-b border-neutral-200">
              <div className="hide-scrollbar flex overflow-x-auto gap-5 py-2">
                {hasSubcategories ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubcategoryClick('')}
                      className={CN(
                        'font-sans text-[0.7rem] tracking-wider uppercase bg-transparent border-none shrink-0 whitespace-nowrap cursor-pointer p-0 transition-colors',
                        filters.subcategories.length === 0 ? 'font-bold text-black' : 'text-neutral-500 font-normal',
                      )}
                    >
                      VIEW ALL
                    </button>
                    {subcategories.map((sub) => {
                      const isActive = filters.subcategories.includes(sub.name)
                      return (
                        <button
                          key={sub.name}
                          type="button"
                          onClick={() => handleSubcategoryClick(sub.name)}
                          className={CN(
                            'font-sans text-[0.7rem] tracking-wider uppercase bg-transparent border-none shrink-0 whitespace-nowrap cursor-pointer p-0 transition-colors',
                            isActive ? 'font-bold text-black' : 'text-neutral-500 font-normal',
                          )}
                        >
                          {sub.name}
                        </button>
                      )
                    })}
                  </>
                ) : (
                  categories.map((c) => (
                    <button
                      key={c.slug || '__all__'}
                      type="button"
                      onClick={() => handleCategoryClick(c.slug)}
                      className={CN(
                        'font-sans text-[0.7rem] tracking-wider uppercase bg-transparent border-none shrink-0 whitespace-nowrap cursor-pointer p-0 transition-colors',
                        (c.slug === '' ? !filters.category : filters.category === c.slug) ? 'font-bold text-black' : 'text-neutral-500 font-normal',
                      )}
                    >
                      {c.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}



          {/* Product Grid */}
          {hasSearch && (
            <div className={gridInnerClass}>
              {loading && products.length === 0
                ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
                : products.map((p, i) => (
                    <ProductCard key={p.id} product={p} fetchPriority={i === 0 ? 'high' : 'auto'} />
                  ))
              }
              {loading && products.length > 0 &&
                Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={`t${i}`} />)
              }
            </div>
          )}

          {/* No products found matching query when search was executed */}
          {!loading && products.length === 0 && hasSearch && (
            <div className="text-center px-5 py-24">
              <p className="font-serif text-[1.5rem] font-light opacity-40 mb-4">No products match your search</p>
              <button type="button" onClick={onClearAll}
                className="inline-flex items-center justify-center border border-black text-black font-sans text-xs font-medium tracking-wider uppercase px-[2.25rem] py-[0.875rem] hover:bg-black hover:text-white transition"
              >Clear filters</button>
            </div>
          )}

          {hasSearch && (
            <>
              <div ref={sentinel} aria-hidden="true" className="h-px" />
              <div className="px-4 md:px-0">
                <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
              </div>
            </>
          )}
        </div>

        {/* ── Mobile floating bottom bar — ONLY show when search is active ── */}
        {hasSearch && (
          <div
            className="md:hidden fixed left-0 right-0 bottom-0 z-[200] bg-black text-white transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex items-center divide-x divide-neutral-800 shadow-2xl"
            style={{
              transform: (showMbar && !footerIntersecting) ? 'translateY(0)' : 'translateY(100%)',
            }}
          >
            <button
              type="button"
              onClick={() => setFilOpen(true)}
              className="flex-1 font-sans text-[0.725rem] tracking-widest uppercase bg-transparent border-none cursor-pointer text-white font-medium text-center py-3.5"
            >
              FILTERS{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setSortOpen(true)}
              className="flex-1 font-sans text-[0.725rem] tracking-widest uppercase bg-transparent border-none cursor-pointer text-white font-medium text-center py-3.5"
            >
              SORT BY
            </button>
          </div>
        )}

        {/* ── Right sidebar (sticky & vertically centered with SORT BY) — ONLY show when search is active ── */}
        {hasSearch && (
          <aside className="font-sans hidden md:flex flex-col justify-center w-[160px] xl:w-[180px] shrink-0 px-4 py-8 sticky top-[var(--header-height,52px)] h-[calc(100vh-var(--header-height,52px))] self-start overflow-y-auto hide-scrollbar">
            {rightSidebarNav}
          </aside>
        )}

        {/* Search Filter Panel Drawer */}
        <SearchFilterDrawer
          open={filOpen}
          onClose={() => setFilOpen(false)}
          af={af}
          filters={filters}
          defaultSort={defaultSort}
          activeCount={activeCount}
          total={total}
          onToggleMulti={onToggleMulti}
          onSortChange={onSortChange}
          onClearAll={onClearAll}
          onSelectPriceFilter={onSelectPriceFilter}
          onPriceRangeChange={onPriceRangeChange}
        />

        {/* Mobile Sort Bottom Sheet */}
        <SortBottomSheet
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          currentSort={filters.sort}
          defaultSort={defaultSort}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SuggestedChips({ suggested, applied, onApply }: {
  suggested: SuggestedFilters
  applied:   AppliedFilters | null
  onApply:   SearchLayoutProps['onApplySuggested']
}) {
  const appliedSubs   = new Set(applied?.subcategories ?? [])
  const appliedColors = new Set(applied?.colors ?? [])
  const appliedBrands = new Set(applied?.brands ?? [])
  const appliedCat    = applied?.category ?? null

  const chips: ReactNode[] = []
  if (suggested.category && suggested.category !== appliedCat) chips.push(
    <Chip key={`s-cat`} suggested label={`+ ${suggested.category}`}
      onClick={() => onApply({ category: suggested.category })} />
  )
  const subs = Array.isArray(suggested.subcategory) ? suggested.subcategory : suggested.subcategory ? [suggested.subcategory] : []
  const cols = Array.isArray(suggested.colors) ? suggested.colors : suggested.colors ? [suggested.colors] : []
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