/**
 * App-wide constants. Single source of truth — names here must
 * remain self-explanatory so a grep finds the one canonical value.
 */

/** Page size for every catalog browse API request. */
export const BROWSE_PAGE_SIZE = 20

/** Default touch swipe delta (px) for carousels. */
export const SWIPE_THRESHOLD_PX = 50

/** Truncate the visible list of filter options per group (6 lines default). */
export const FILTER_GROUP_VISIBLE_LIMIT = 6

/** Truncate the visible list of filter options in the search panel. */
export const SEARCH_FILTER_VISIBLE_LIMIT = 5

/** ScrollRoot margin (px) used by IntersectionObserver for infinite scroll. */
export const INFINITE_SCROLL_PRECEDENCE_PX = 600

/** ScrollY threshold (px) past which the mobile sticky bar starts auto-hiding. */
export const MOBILE_BAR_MIN_SCROLL_Y = 100

/** Idle ms after last scroll before re-showing the mobile bar. */
export const MOBILE_BAR_IDLE_SHOW_MS = 150

/**
 * Shared 2/3-col product grid sizing — single source of truth so BrowseLayout
 * (catalog pages) and the PDP's "You May Also Like" shelf never drift apart.
 */
export const PRODUCT_GRID_CLASS =
  'grid grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-8 md:gap-x-12 lg:gap-x-14 gap-y-12 sm:gap-y-16 md:gap-y-24 lg:gap-y-28'
