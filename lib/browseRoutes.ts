
import type { AvailableFilters, Product, ScopeParams } from '@/lib/api'
import { listProducts, getUnder699 } from '@/lib/api'
import {
  BROWSE_EMPTY,
  toApiSort,
  type BrowseFilters,
  type BrowseNavOption,
} from '@/lib/browseFilters'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'

/**
 * Single source of truth for each catalog browse route.
 * Each entry owns:
 *   - its data fetcher
 *   - how to derive the left-rail nav from the current filter state + available facets
 *
 * Pages only ever call `<BrowseRoute kind="…" />`; no bespoke hooks per page.
 */
export type BrowseKind = 'products' | 'category' | 'under699'

export interface BrowseRouteConfig {
  /** Build the API request for (page, UI filters). */
  fetch: (
    page: number,
    filters: BrowseFilters,
    scope: ScopeParams,
  ) => Promise<{ products: Product[]; total?: number; availableFilters?: AvailableFilters }>

  /**
   * Compute the sidebar/tab nav. Returned refs MUST include all
   * deps so the caller can memoize.
   */
  resolveNav: (
    filters: BrowseFilters,
    avail: AvailableFilters,
  ) => ReadonlyArray<BrowseNavOption>

  /**
   * Which `BrowseFilters` field the sidebar/mobile-tab nav writes to.
   * `products`/`under699` list top-level categories, so selecting one sets
   * `category`. `category` (`/category/[slug]`) lists the fixed category's
   * subcategories, so selecting one sets `subcategory`.
   */
  navFilterKey: 'category' | 'subcategory'

  /**
   * Whether the SSR initial page is already filter-narrowed.
   * Used so the client's first fetch doesn't double-fetch the same data.
   */
  initialPageIsFiltered?: (
    url: URLSearchParams | null,
  ) => boolean
}

export const BROWSE_ROUTES: Partial<Record<BrowseKind, BrowseRouteConfig>> = {
  /**
   * `/products?category=X` — list everything, optionally narrowed to one
   * category and/or a subcategory within it. The sidebar always shows the
   * full top-level category list (it never swaps to a subcategory list —
   * that's what FilterPanel's TYPE section is for), so picking a category
   * never makes the other categories disappear from the rail.
   */
  products: {
    fetch: (page, f, scope) =>
      listProducts({
        page,
        limit: BROWSE_PAGE_SIZE,
        category: f.category || undefined,
        subcategory: f.subcategory || undefined,
        color: f.color || undefined,
        brand: f.brand || undefined,
        sort: toApiSort(f.sort),
        maxPrice: f.maxPrice ?? undefined,
        gender: scope.gender,
      }),
    resolveNav: (_filters, avail) => avail.categories ?? [],
    navFilterKey: 'category',
    initialPageIsFiltered: (url) =>
      !!(
        url?.get('category') ||
        url?.get('subcategory') ||
        url?.get('color') ||
        url?.get('brand') ||
        url?.get('sort') ||
        url?.get('maxPrice')
      ),
  },

  /**
   * `/under699` — budget bucket. Sidebar shows top-level categories so
   * users can drill into the budget slice of any category.
   */
  under699: {
    fetch: (page, f, scope) =>
      getUnder699({
        page,
        limit: BROWSE_PAGE_SIZE,
        category: f.category || undefined,
        subcategory: f.subcategory || undefined,
        sort: toApiSort(f.sort),
        color: f.color || undefined,
        brand: f.brand || undefined,
        maxPrice: f.maxPrice ?? undefined,
        gender: scope.gender,
      }),
    resolveNav: (_filters, avail) => avail.categories ?? [],
    navFilterKey: 'category',
    initialPageIsFiltered: (url) =>
      !!(
        url?.get('category') ||
        url?.get('subcategory') ||
        url?.get('color') ||
        url?.get('brand') ||
        url?.get('sort') ||
        url?.get('maxPrice')
      ),
  },
  // 'category' is intentionally absent — it injects the slug via `overrideFetch`
  // on BrowseRoute because the slug comes from the dynamic-route param.
}

/**
 * Build the initial UI filter object for the route from URL search params.
 * `category` and `subcategory` are independent fields/params across every
 * browse route now, so this needs no per-kind mapping.
 */
export function initialBrowseFilters(url: URLSearchParams | null): BrowseFilters {
  if (!url) return BROWSE_EMPTY

  const category = (url.get('category') || '').trim()
  const subcategory = (url.get('subcategory') || '').trim()
  const color = (url.get('color') || '').trim()
  const brand = (url.get('brand') || '').trim()
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

/* The `category` route's fetcher needs the URL slug threaded through.
   To keep the config map above symmetric, the category page constructs
   its own and merges via `makeCategoryFetcher` below. */
export function makeCategoryFetcher(slug: string): BrowseRouteConfig['fetch'] {
  return (page, f, scope) =>
    listProducts({
      page,
      limit: BROWSE_PAGE_SIZE,
      category: slug,
      subcategory: f.subcategory || undefined,
      color: f.color || undefined,
      brand: f.brand || undefined,
      sort: toApiSort(f.sort),
      maxPrice: f.maxPrice ?? undefined,
      gender: scope.gender,
    })
}
