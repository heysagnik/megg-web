'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  genderFromSearchParams,
  type AvailableFilters,
  type Product,
} from '@/lib/api'
import { useBrowsePage } from '@/hooks/useBrowsePage'
import BrowseLayout from '@/components/product/BrowseLayout'
import {
  BROWSE_ROUTES,
  initialBrowseFilters,
  makeCategoryFetcher,
  type BrowseKind,
  type BrowseRouteConfig,
} from '@/lib/browseRoutes'

export interface BrowseRouteProps {
  kind: BrowseKind
  /** URL category slug for `kind === 'category'` (ignored otherwise). */
  categorySlug?: string
  /** Keyword-bearing page title rendered as a screen-reader-only `<h1>`. */
  pageTitle: string
  initialProducts: Product[]
  initialTotal: number
  initialFilters: AvailableFilters
}

/**
 * Single client component used by every catalog browse route page.
 * Resolves the route config from `BROWSE_ROUTES`, threads the URL
 * search-params + (for category routes) the slug, and renders
 * `<BrowseLayout>` exactly the same way across `/products`,
 * `/category/[slug]`, and `/under699`.
 *
 * Each route's server page is now a thin shell that does the SSR
 * fetch and passes initial data in.
 */
export default function BrowseRoute({
  kind,
  categorySlug,
  pageTitle,
  initialProducts,
  initialTotal,
  initialFilters,
}: BrowseRouteProps) {
  const searchParams = useSearchParams()
  const gender = genderFromSearchParams(searchParams)
  const scope = { gender }

  // Resolve the per-route config + slot in any runtime override (slug).
  const config = useMemo<BrowseRouteConfig>(
    () => {
      if (kind === 'category') {
        if (!categorySlug) {
          throw new Error('BrowseRoute kind="category" requires categorySlug')
        }
        return {
          fetch: makeCategoryFetcher(categorySlug),
          resolveNav: (_filters, avail) => avail.subcategories ?? [],
          navFilterKey: 'subcategory',
        }
      }
      const cfg = BROWSE_ROUTES[kind]
      if (!cfg) throw new Error(`Unknown browse kind: ${kind}`)
      return cfg
    },
    [kind, categorySlug],
  )

  const initialPageIsFiltered =
    config.initialPageIsFiltered?.(searchParams ?? null) ?? false

  const state = useBrowsePage({
    initialProducts,
    initialTotal,
    initialFilters,
    initialClientFilters: initialBrowseFilters(searchParams ?? null),
    initialPageIsFiltered,
    fetcher: (page, f) => config.fetch(page, f, scope),
  })

  const navOptions = useMemo(
    () => config.resolveNav(state.filters, state.avail),
    [config, state.filters, state.avail],
  )

  return (
    <BrowseLayout
      pageTitle={pageTitle}
      products={state.products}
      total={state.total}
      loading={state.loading}
      hasMore={state.hasMore}
      filters={state.filters}
      avail={state.avail}
      filterOpen={state.filterOpen}
      showMbar={state.showMbar}
      footerIntersecting={state.footerIntersecting}
      sentinelRef={state.sentinelRef}
      navOptions={navOptions}
      navFilterKey={config.navFilterKey}
      onFilterChange={state.changeFilters}
      onOpenFilterPanel={() => state.setFilterOpen(true)}
      onCloseFilterPanel={() => state.setFilterOpen(false)}
    />
  )
}
