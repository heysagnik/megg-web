import type { SortOption } from '@/lib/api'

// ─── Browse filter state ─────────────────────────────────────────────────────

export interface BrowseFilters {
  category: string
  subcategory: string
  color: string
  brand: string
  sort: SortOption | 'relevance' | ''
  maxPrice: number | null
}

export const BROWSE_EMPTY: BrowseFilters = {
  category: '',
  subcategory: '',
  color: '',
  brand: '',
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
  if (f.subcategory) params.set('subcategory', f.subcategory)
  if (f.color) params.set('color', f.color)
  if (f.brand) params.set('brand', f.brand)
  if (f.sort && f.sort !== 'relevance') params.set('sort', f.sort)
  if (f.maxPrice != null) params.set('maxPrice', String(f.maxPrice))
  return params
}

// ─── Derived selectors ───────────────────────────────────────────────────────
// Pure helpers shared by every browse page. Computing these once per render
// in the page component would re-inline the same logic three times; keep it
// here so the client files stay thin.

/**
 * Count of "visible" (panel-only) filters: colour + brand.
 * Shown as `Filters (n)` on the mobile bar / sidebar trigger.
 */
export function countVisibleFilters(f: BrowseFilters): number {
  return [f.color, f.brand].filter(Boolean).length
}

/**
 * Active sub-tab label — used by nav lists that show either categories
 * (when no category is set) or subcategories (once a category is picked).
 */
export interface BrowseNavOption {
  name: string
  count?: number
}
