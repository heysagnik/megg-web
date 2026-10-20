import type { SortOption } from '@/lib/api'

// ─── Browse filter state ─────────────────────────────────────────────────────

export interface BrowseFilters {
  category: string
  subcategory: string[]
  color: string[]
  brand: string[]
  sort: SortOption | 'relevance' | ''
  maxPrice: number | null
}

export const BROWSE_EMPTY: BrowseFilters = {
  category: '',
  subcategory: [],
  color: [],
  brand: [],
  sort: '',
  maxPrice: null,
}

export const PRICE_OPTIONS: { label: string; value: number }[] = [
  { label: 'Under Rs 499', value: 499 },
  { label: 'Under Rs 699', value: 699 },
  { label: 'Under Rs 999', value: 999 },
  { label: 'Under Rs 1499', value: 1499 },
  { label: 'Under Rs 1999', value: 1999 },
]

export const SORT_OPTIONS: { label: string; value: BrowseFilters['sort'] }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' },
]

/**
 * Map a UI sort value → the API sort param.
 * `''` and `'relevance'` both mean the server default (relevance),
 * which the API expects as no explicit `sort` param — hence → undefined.
 * Centralised so every browse page applies the rule identically
 * (and loses the `as SortOption` cast the raw ternary required).
 */
export function toApiSort(sort: BrowseFilters['sort']): SortOption | undefined {
  return sort && sort !== 'relevance' ? sort : undefined
}

/**
 * Convert a BrowseFilters object to URLSearchParams.
 * Omits empty fields so the URL query string stays clean.
 * `category` and `subcategory` are independent fields/params now — no more
 * overloading one field to mean different things per route.
 */
export function browseFiltersToSearchParams(f: BrowseFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (f.category) params.set('category', f.category)
  f.subcategory.forEach(value => params.append('subcategory', value))
  f.color.forEach(value => params.append('color', value))
  f.brand.forEach(value => params.append('brand', value))
  if (f.sort && f.sort !== 'relevance') params.set('sort', f.sort)
  if (f.maxPrice != null) params.set('maxPrice', String(f.maxPrice))
  return params
}

/**
 * Build the UI filter state represented by a browse URL.
 * Repeated values and comma-delimited values are both accepted so links
 * created by older versions remain usable.
 */
export function browseFiltersFromSearchParams(url: URLSearchParams | null): BrowseFilters {
  if (!url) return BROWSE_EMPTY

  const category = (url.get('category') || '').trim()
  const values = (key: string) => url.getAll(key)
    .flatMap(value => value.split(','))
    .map(value => value.trim())
    .filter(Boolean)
  const subcategory = values('subcategory')
  const color = values('color')
  const brand = values('brand')
  const sortRaw = (url.get('sort') || '').trim()
  const maxPriceRaw = url.get('maxPrice')

  const validSorts = ['relevance', 'price_asc', 'price_desc', 'newest', 'popular', 'popularity']
  const sort = validSorts.includes(sortRaw) ? (sortRaw as BrowseFilters['sort']) : ''
  const maxPrice = maxPriceRaw && !isNaN(Number(maxPriceRaw)) ? Number(maxPriceRaw) : null

  return {
    category,
    subcategory,
    color,
    brand,
    sort,
    maxPrice,
  }
}

export function hasBrowseFilterSelections(filters: BrowseFilters): boolean {
  return Boolean(
    filters.category ||
    filters.subcategory.length ||
    filters.color.length ||
    filters.brand.length ||
    filters.sort ||
    filters.maxPrice != null,
  )
}

// ─── Derived selectors ───────────────────────────────────────────────────────
// Pure helpers shared by every browse page. Computing these once per render
// in the page component would re-inline the same logic three times; keep it
// here so the client files stay thin.

/**
 * Count of selected category, type, colour, brand, and price filters.
 * Shown as `Filters (n)` on the mobile bar / sidebar trigger.
 */
export function countVisibleFilters(f: BrowseFilters): number {
  return Number(!!f.category) + f.subcategory.length + f.color.length + f.brand.length + Number(f.maxPrice != null)
}

/**
 * Active sub-tab label — used by nav lists that show either categories
 * (when no category is set) or subcategories (once a category is picked).
 */
export interface BrowseNavOption {
  name: string
  count?: number
}
