'use client'

import type { AvailableFilters, Product } from '@/lib/api'
import { BROWSE_EMPTY, SORT_OPTIONS, type BrowseFilters, type BrowseNavOption, countVisibleFilters } from '@/lib/browseFilters'
import { PRODUCT_GRID_CLASS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import ProductCard from './ProductCard'
import FilterPanel from './FilterPanel'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { EndOfFeed } from '@/components/ui'

const GRID_CLASS =
  `w-full ${PRODUCT_GRID_CLASS} max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 transition-all duration-300`

const SIDEBAR_CLASS =
  'font-sans hidden md:flex flex-col justify-center w-[160px] xl:w-[180px] shrink-0 px-4 py-8 sticky top-[var(--header-height,52px)] h-[calc(100vh-var(--header-height,52px))] self-start overflow-y-auto hide-scrollbar'

const MOBILE_TAB_BAR_CLASS =
  'md:hidden sticky top-[var(--header-height,52px)] z-[90] bg-white/97 backdrop-blur-md px-4 pt-1 pb-1 border-b border-neutral-200'

const MOBILE_BOTTOM_BAR_CLASS =
  'md:hidden fixed left-0 right-0 bottom-0 z-[200] bg-black text-white py-3.5 px-4 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex items-center justify-center'

const NAV_LIST_CLASS =
  'list-none space-y-2.5 font-sans text-[0.725rem] tracking-wider uppercase text-left'

const navBtnClass = (active: boolean) => cn(
  'bg-transparent border-none p-0 cursor-pointer text-left uppercase transition-colors',
  active ? 'font-bold text-black' : 'text-neutral-400 hover:text-black font-normal',
)

const mobileTabBtnClass = (active: boolean) => cn(
  'font-sans text-[0.7rem] tracking-wider uppercase bg-transparent border-none shrink-0 whitespace-nowrap cursor-pointer p-0 transition-colors',
  active ? 'font-bold text-black' : 'text-neutral-500 font-normal',
)

export interface BrowseLayoutProps {
  products: Product[]
  total: number
  loading: boolean
  hasMore: boolean
  filters: BrowseFilters
  avail: AvailableFilters
  filterOpen: boolean
  showMbar: boolean
  footerIntersecting: boolean
  sentinelRef: React.RefObject<HTMLDivElement | null>
  /** Ordered list of options for left sidebar / mobile tabs. */
  navOptions: ReadonlyArray<BrowseNavOption>
  /** Which `filters` field the sidebar/mobile-tab nav reads/writes. */
  navFilterKey: 'category' | 'subcategory'
  onFilterChange: (next: BrowseFilters) => void
  onOpenFilterPanel: () => void
  onCloseFilterPanel: () => void
}

/**
 * Shared shell for every browse-style catalog page. Owns the left sidebar,
 * right spacer, mobile tab strip, mobile bottom filter bar, the product
 * grid (with skeletons + empty state), and the slide-over FilterPanel.
 */
export default function BrowseLayout({
  products, total, loading, hasMore,
  filters, avail,
  filterOpen, showMbar, footerIntersecting,
  sentinelRef, navOptions, navFilterKey,
  onFilterChange, onOpenFilterPanel, onCloseFilterPanel,
}: BrowseLayoutProps) {
  const filterCount = countVisibleFilters(filters)
  const activeNavValue = filters[navFilterKey]

  const sidebarNav = (
    <div className="flex flex-col justify-center my-auto w-full py-6">
      <ul className={NAV_LIST_CLASS}>
        <li>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, [navFilterKey]: '' })}
            className={navBtnClass(!activeNavValue)}
          >
            VIEW ALL
          </button>
        </li>
        {navOptions.map((opt) => {
          const isActive = activeNavValue === opt.name
          return (
            <li key={opt.name}>
              <button
                type="button"
                onClick={() => onFilterChange({
                  ...filters,
                  [navFilterKey]: isActive ? '' : opt.name,
                })}
                className={navBtnClass(isActive)}
              >
                {opt.name}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-8">
        <button
          type="button"
          onClick={onOpenFilterPanel}
          className="font-sans text-[0.725rem] tracking-widest uppercase bg-transparent border-none cursor-pointer text-black hover:opacity-75 p-0 text-left flex items-center gap-1.5"
        >
          FILTERS
          {filterCount > 0 && (
            <span className="text-[0.65rem] font-medium text-neutral-400">
              ({filterCount})
            </span>
          )}
        </button>
      </div>
    </div>
  )

  const rightSidebarNav = (
    <div className="flex flex-col justify-center my-auto w-full py-6">
      <p className="font-sans text-[0.625rem] tracking-[0.16em] uppercase text-neutral-400 mb-3 font-medium text-left">
        SORT BY
      </p>
      <ul className={NAV_LIST_CLASS}>
        {SORT_OPTIONS.map(o => {
          const isActive = (filters.sort || 'relevance') === o.value
          return (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, sort: o.value })}
                className={navBtnClass(isActive)}
              >
                {o.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className="flex min-h-[100vh] w-full">
      {/* ── Left sidebar ── */}
      <aside className={SIDEBAR_CLASS}>
        {sidebarNav}
      </aside>

      {/* ── Main catalog ── */}
      <div className="flex-1 min-w-0 py-2 md:py-4">
        {/* Mobile tab strip */}
        <div className={MOBILE_TAB_BAR_CLASS}>
          <div className="hide-scrollbar flex overflow-x-auto gap-5 py-2">
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, [navFilterKey]: '' })}
              className={mobileTabBtnClass(!activeNavValue)}
            >
              ALL
            </button>
            {navOptions.map(opt => (
              <button
                key={opt.name}
                type="button"
                onClick={() => onFilterChange({
                  ...filters,
                  [navFilterKey]: activeNavValue === opt.name ? '' : opt.name,
                })}
                className={mobileTabBtnClass(activeNavValue === opt.name)}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className={GRID_CLASS}>
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

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif text-[1.5rem] font-light opacity-25 mb-sm">No products found</p>
            <button
              type="button"
              onClick={() => onFilterChange(BROWSE_EMPTY)}
              className="inline-flex items-center justify-center border border-black text-black font-sans text-xs font-medium tracking-wider uppercase px-[2.25rem] py-[0.875rem] hover:bg-black hover:text-white transition"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="px-4 md:px-0">
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} />
        </div>

        {/* Semantic SEO & Discovery Footer Section */}
        {!hasMore && products.length > 0 && (
          <section className="px-4 py-12 mt-12 border-t border-neutral-200 text-neutral-600 max-w-4xl mx-auto normal-case">
            <h2 className="font-serif text-lg font-normal text-black uppercase tracking-wider mb-3">
              Curated Men's Fashion — Quality Over Quantity
            </h2>
            <p className="font-sans text-xs leading-relaxed text-neutral-600 mb-4">
              MEGG is India's dedicated fashion discovery platform for modern menswear. Every item in our catalog — from oversized T-shirts, premium linen shirts, and baggy denim jeans to chunky sneakers and urban outerwear — is handpicked daily from top Indian D2C brands, national labels, and international fashion houses.
            </p>
            <p className="font-sans text-xs leading-relaxed text-neutral-600 mb-6">
              Unlike generic marketplaces with unverified duplicate listings, MEGG organizes trending styles with transparent pricing and direct redirection to official brand stores. Explore budget-friendly picks starting under ₹699 or discover daily new arrivals tailored for Indian streetwear, formalwear, and casual wardrobe essentials.
            </p>

            <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-x-6 gap-y-2 text-[0.725rem] font-sans tracking-wide uppercase text-neutral-500">
              <span className="font-medium text-black">Popular Categories:</span>
              <a href="/category/Tshirt" className="hover:text-black transition-colors">Men's T-Shirts</a>
              <a href="/category/Shirt" className="hover:text-black transition-colors">Men's Shirts</a>
              <a href="/category/Jeans" className="hover:text-black transition-colors">Men's Jeans</a>
              <a href="/category/Shoes" className="hover:text-black transition-colors">Men's Shoes</a>
              <a href="/category/Jacket" className="hover:text-black transition-colors">Men's Jackets</a>
              <a href="/under699" className="hover:text-black transition-colors font-medium text-black">Under ₹699 Store</a>
            </div>
          </section>
        )}
      </div>

      {/* Mobile bottom bar */}
      <div
        className={MOBILE_BOTTOM_BAR_CLASS}
        style={{
          transform: (showMbar && !footerIntersecting) ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <button
          type="button"
          onClick={onOpenFilterPanel}
          className="w-full font-sans text-[0.725rem] tracking-widest uppercase bg-transparent border-none cursor-pointer text-white font-medium text-center"
        >
          FILTERS{filterCount > 0 ? ` (${filterCount})` : ''}
        </button>
      </div>

      {/* Right sidebar with SORT BY */}
      <aside className={SIDEBAR_CLASS}>
        {rightSidebarNav}
      </aside>

      <FilterPanel
        open={filterOpen}
        onClose={onCloseFilterPanel}
        filters={filters}
        avail={avail}
        total={total}
        onChange={onFilterChange}
      />
    </div>
  )
}
