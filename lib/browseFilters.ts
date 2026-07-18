import type { SortOption } from '@/lib/api'

// ─── Browse filter state ─────────────────────────────────────────────────────

export interface BrowseFilters {
  subcategory: string
  category: string
  color: string
  brand: string
  sort: SortOption | 'relevance' | ''
  maxPrice: number | null
}

export const BROWSE_EMPTY: BrowseFilters = {
  subcategory: '',
  category: '',
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

// ─── sessionStorage persistence ─────────────────────────────────────────────
// Stores the entire browse snapshot (products + filters + paging + scrollY)
// under a per-route key so the page can fully restore itself on Back/Forward.

interface BrowseSnapshot {
  products: import('@/lib/api').Product[]
  total: number
  hasMore: boolean
  page: number
  filters: BrowseFilters
  avail: import('@/lib/api').AvailableFilters
  scrollY: number
}

function storageKey(key: string, pathname: string, search: string) {
  return `browse:${key}:${pathname}?${search}`
}

export function readBrowseCache(
  key: string,
  pathname: string,
  search: string,
): BrowseSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(storageKey(key, pathname, search))
    return raw ? (JSON.parse(raw) as BrowseSnapshot) : null
  } catch {
    return null
  }
}

export function writeBrowseCache(
  key: string,
  pathname: string,
  search: string,
  snapshot: BrowseSnapshot,
): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(storageKey(key, pathname, search), JSON.stringify(snapshot))
  } catch {
    /* quota / private mode — ignore */
  }
}

export type { BrowseSnapshot }
