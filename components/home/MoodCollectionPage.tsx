
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  listProducts,
  type AvailableFilters,
  type Gender,
  type Product,
} from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import FilterPanel from '@/components/product/FilterPanel'
import { Pagination } from '@/components/ui/Pagination'
import {
  BROWSE_EMPTY,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  browseFiltersFromSearchParams,
  browseFiltersToSearchParams,
  countVisibleFilters,
  toApiSort,
  type BrowseFilters,
} from '@/lib/browseFilters'
import {
  getMoodCollection,
  type MoodSlug,
  type MoodProductGroup,
} from '@/lib/moods/collections'

const MOOD_PAGE_SIZE = 12

interface GroupState {
  products: Product[]
  total: number
  totalPages: number
  page: number
  loading: boolean
  error: boolean
}

const EMPTY_GROUP_STATE: GroupState = {
  products: [],
  total: 0,
  totalPages: 0,
  page: 1,
  loading: true,
  error: false,
}

function groupKey(group: MoodProductGroup) {
  return `${group.category}:${group.title}`
}

function emptyAvailableFilters(): AvailableFilters {
  return {
    subcategories: [],
    colors: [],
    brands: [],
    categories: [],
  }
}

function mergeOptions(
  current: { name: string; count: number }[],
  incoming: { name: string; count: number }[],
) {
  const merged = new Map(current.map((option) => [option.name, option]))

  for (const option of incoming) {
    const previous = merged.get(option.name)
    merged.set(option.name, {
      name: option.name,
      count: (previous?.count ?? 0) + option.count,
    })
  }

  return [...merged.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export default function MoodCollectionPage({
  gender,
  slug,
}: {
  gender: Gender
  slug: MoodSlug
}) {
  const collection = useMemo(
    () => getMoodCollection(gender, slug),
    [gender, slug],
  )

  const groups = collection.groups

  const [filters, setFilters] = useState<BrowseFilters>(BROWSE_EMPTY)
  const [selectedGroupKeys, setSelectedGroupKeys] = useState<string[]>(
    () => groups.map(groupKey),
  )
  const [filterOpen, setFilterOpen] = useState(false)
  const [availableFilters, setAvailableFilters] =
    useState<AvailableFilters>(emptyAvailableFilters)
  const [groupsState, setGroupsState] =
  useState<Record<string, GroupState>>({})

  const [pages, setPages] = useState<Record<string, number>>({})
  const [filtersReady, setFiltersReady] = useState(false)
  const pendingScrollGroupRef = useRef<string | null>(null)

  const activeGroups = useMemo(
    () => groups.filter((group) => selectedGroupKeys.includes(groupKey(group))),
    [groups, selectedGroupKeys],
  )
  const moodGroupOptions = useMemo(
    () => groups.map((group) => ({
      value: groupKey(group),
      label: group.title,
    })),
    [groups],
  )

  const writeUrl = useCallback((nextFilters: BrowseFilters, nextGroupKeys: string[]) => {
    const params = browseFiltersToSearchParams(nextFilters)
    if (nextGroupKeys.length === 0) {
      params.set('moodGroup', 'none')
    } else if (nextGroupKeys.length !== groups.length) {
      nextGroupKeys.forEach((key) => params.append('moodGroup', key))
    }
    const query = params.toString()
    const path = window.location.pathname

    window.history.replaceState(
      window.history.state,
      '',
      query ? `${path}?${query}` : path,
    )
  }, [groups])

  // Restore user selections from the current URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const restored = browseFiltersFromSearchParams(params)
    const groupKeys = groups.map(groupKey)
    const selectedFromUrl = params.getAll('moodGroup')

    // Category is controlled by the mood definition, never by the URL.
    setFilters({ ...restored, category: '' })
    setSelectedGroupKeys(
      !params.has('moodGroup')
        ? groupKeys
        : selectedFromUrl.includes('none')
          ? []
          : selectedFromUrl.filter((key) => groupKeys.includes(key)),
    )

    const moodSection = params.get('moodSection')
    const moodPage = Number(params.get('moodPage'))

if (
  moodSection &&
  groupKeys.includes(moodSection) &&
  Number.isInteger(moodPage) &&
  moodPage > 0
) {
  setPages((current) => ({
    ...current,
    [moodSection]: moodPage,
  }))

  pendingScrollGroupRef.current = moodSection
}
  setFiltersReady(true)
  }, [gender, slug, groups])

  // Keep filter selections shareable and restorable on refresh.
  const updateFilters = useCallback((next: BrowseFilters, nextGroupKeys = selectedGroupKeys) => {
  const safeNext = { ...next, category: '' }

  setPages((current) => {
    const reset: Record<string, number> = {}

    for (const group of groups) {
      reset[groupKey(group)] = 1
    }

    return reset
  })

  setFilters(safeNext)

  writeUrl(safeNext, nextGroupKeys)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}, [groups, selectedGroupKeys, writeUrl])

  const clearFilters = useCallback(() => {
    const allGroupKeys = groups.map(groupKey)
    setSelectedGroupKeys(allGroupKeys)
    updateFilters(BROWSE_EMPTY, allGroupKeys)
  }, [groups, updateFilters])

  const toggleMoodGroup = useCallback((value: string) => {
    const nextGroupKeys = selectedGroupKeys.includes(value)
      ? selectedGroupKeys.filter((key) => key !== value)
      : [...selectedGroupKeys, value]

    setSelectedGroupKeys(nextGroupKeys)
    setPages(Object.fromEntries(groups.map((group) => [groupKey(group), 1])))
    writeUrl(filters, nextGroupKeys)
  }, [filters, groups, selectedGroupKeys, writeUrl])

  const changePage = useCallback(
    (group: MoodProductGroup, nextPage: number) => {
      const key = groupKey(group)

      // Remember the group to scroll to after its products load.
      pendingScrollGroupRef.current = key

      setPages((current) => ({
        ...current,
        [key]: nextPage,
      }))

      setGroupsState((current) => ({
        ...current,
        [key]: {
          ...(current[key] ?? EMPTY_GROUP_STATE),
          page: nextPage,
          loading: true,
          error: false,
        },
      }))

      // Preserve the current filters and selected groups.
      const params = new URLSearchParams(window.location.search)
      params.set('moodSection', key)
      params.set('moodPage', String(nextPage))

      const query = params.toString()
      window.history.replaceState(
        window.history.state,
        '',
        query
          ? `${window.location.pathname}?${query}`
          : window.location.pathname,
      )
    },
    [],
  )

  // Fetch products independently for each group, while sharing the filters.
  useEffect(() => {
    if (!filtersReady) return

    let cancelled = false

    async function loadGroups() {
      const requests = activeGroups.map(async (group) => {
        const key = groupKey(group)
        const page = pages[key] ?? 1

        const selectedSubcategories = filters.subcategory

        let subcategories: string[] | undefined

        if (selectedSubcategories.length > 0) {
          // Never allow a selection to escape a group's fixed scope.
          if (group.subcategories?.length) {
            subcategories = selectedSubcategories.filter((value) =>
              group.subcategories!.includes(value),
            )

            // This selection does not apply to this group.
            if (subcategories.length === 0) {
              return {
                key,
                state: {
                  products: [],
                  total: 0,
                  totalPages: 0,
                  page,
                  loading: false,
                  error: false,
                } satisfies GroupState,
              }
            }
          } else {
            subcategories = selectedSubcategories
          }
        } else {
          subcategories = group.subcategories
        }

        try {
          const result = await listProducts({
            page,
            limit: MOOD_PAGE_SIZE,
            category: group.category,
            subcategory: subcategories,
            color: filters.color.length ? filters.color : undefined,
            brand: filters.brand.length ? filters.brand : undefined,
            maxPrice: filters.maxPrice ?? undefined,
            sort: toApiSort(filters.sort),
            gender,
          })

          return {
            key,
            state: {
              products: result.products ?? [],
              total: result.total ?? 0,
              totalPages:
                result.totalPages ??
                Math.ceil((result.total ?? 0) / MOOD_PAGE_SIZE),
              page,
              loading: false,
              error: false,
            } satisfies GroupState,
            availableFilters: result.availableFilters,
          }
        } catch {
          return {
            key,
            state: {
              ...EMPTY_GROUP_STATE,
              page,
              loading: false,
              error: true,
            } satisfies GroupState,
          }
        }
      })

      const results = await Promise.all(requests)

      if (cancelled) return
      setGroupsState((current) => {
        const next = { ...current }
        for (const result of results) {
          next[result.key] = result.state
        }
        return next
      })


      // Build the available facet lists from the API responses.
      // Keep only options that belong to this mood's configured scope.
      const facets = results.flatMap((result) => {
        if (!('availableFilters' in result) || !result.availableFilters) {
          return []
        }

        const group = groups.find(
          (item) => groupKey(item) === result.key,
        )

        if (!group) return []

        const scopedSubcategories = group.subcategories?.length
          ? result.availableFilters.subcategories.filter((option) =>
              group.subcategories!.includes(option.name),
            )
          : result.availableFilters.subcategories

        return [{
          subcategories: scopedSubcategories,
          colors: result.availableFilters.colors,
          brands: result.availableFilters.brands,
        }]
      })

      setAvailableFilters({
        categories: [],
        subcategories: facets.reduce(
          (acc, facet) => mergeOptions(acc, facet.subcategories),
          [] as AvailableFilters['subcategories'],
        ),
        colors: facets.reduce(
          (acc, facet) => mergeOptions(acc, facet.colors),
          [] as AvailableFilters['colors'],
        ),
        brands: facets.reduce(
          (acc, facet) => mergeOptions(acc, facet.brands),
          [] as AvailableFilters['brands'],
        ),
      })
    }

    // Show loading state immediately for every group.
    setGroupsState((current) => {
      const next = { ...current }

      for (const group of activeGroups) {
        const key = groupKey(group)
        next[key] = {
          ...(current[key] ?? EMPTY_GROUP_STATE),
          loading: true,
          error: false,
          page: current[key]?.page ?? 1,
        }
      }

      return next
    })

    void loadGroups()

    return () => {
      cancelled = true
    }
    // The current page for each group is held in groupsState.
    // A successful filter change resets those pages below.
  }, [filters, filtersReady, gender, slug, groups, activeGroups, pages])
useEffect(() => {
  if (!filtersReady) return
  const key = pendingScrollGroupRef.current
  if (!key) return

  const isActive = activeGroups.some(
    (group) => groupKey(group) === key,
  )

  if (!isActive) {
    pendingScrollGroupRef.current = null
    return
  }

  const state = groupsState[key]
  if (!state || state.loading) return

  const heading = document.getElementById(
    `mood-section-${encodeURIComponent(key)}`,
  )

  if (!heading) return

  heading.scrollIntoView({
    behavior: 'auto',
    block: 'start',
  })

  pendingScrollGroupRef.current = null
}, [filtersReady, groupsState, activeGroups])

  // Close the panel with Escape.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFilterOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleFilterChange = useCallback(
  (next: BrowseFilters) => {
    updateFilters(next)
  },
  [updateFilters],
)

  const totalItems = activeGroups.reduce(
    (sum, group) =>
      sum + (groupsState[groupKey(group)]?.total ?? 0),
    0,
  )

  const categorySelectionActive = selectedGroupKeys.length !== groups.length
  const selectedCount = countVisibleFilters(filters) + Number(categorySelectionActive)

  return (
    <main className="mx-auto min-h-[50vh] max-w-[var(--container-max)] px-[var(--container-px)] pb-16 pt-10 sm:pt-14">
      <header className="border-b border-neutral-200 pb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          {gender === 'men' ? 'Men' : 'Women'} / Shop by mood
        </p>

        <h1 className="mt-3 font-serif text-3xl tracking-tight text-black sm:text-5xl">
          {collection.title}
        </h1>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wider text-black transition-colors hover:border-black"
          >
            Filters{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </button>

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-neutral-500 underline underline-offset-4 hover:text-black"
            >
              Clear all
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-neutral-600">
          Sort by
          <select
            aria-label="Sort products"
            value={filters.sort}
            onChange={(event) =>
              handleFilterChange({
                ...filters,
                sort: event.target.value as BrowseFilters['sort'],
              })
            }
            className="max-w-[190px] border-0 bg-transparent py-2 text-xs text-black outline-none focus:ring-1 focus:ring-neutral-400"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filters.maxPrice != null && (
        <p className="mt-3 text-xs text-neutral-500">
          Price limit: {PRICE_OPTIONS.find(
            (option) => option.value === filters.maxPrice,
          )?.label ?? `Rs ${filters.maxPrice}`}
        </p>
      )}

      {activeGroups.map((group) => {
        const key = groupKey(group)
        const state = groupsState[key] ?? EMPTY_GROUP_STATE

        return (
          <section
            key={`${gender}-${slug}-${key}`}
            id={`mood-section-${encodeURIComponent(key)}`}
            className="mt-12 sm:mt-16 scroll-mt-6"
            aria-label={group.title}
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl tracking-tight text-black sm:text-3xl">
                {group.title}
              </h2>

              {!state.loading && !state.error && state.total > 0 && (
                <p className="text-xs text-neutral-500">
                  {state.total} {state.total === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>

            {state.loading ? (
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                aria-busy="true"
                aria-label={`Loading ${group.title}`}
              >
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] animate-pulse bg-neutral-100"
                  />
                ))}
              </div>
            ) : state.error ? (
              <p className="py-8 text-center text-sm text-neutral-600">
                We couldn’t load these products. Please refresh and try again.
              </p>
            ) : state.products.length === 0 ? (
              <p className="py-8 text-sm text-neutral-500">
                No products match these filters in this section.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                  {state.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  page={state.page}
                  totalPages={state.totalPages}
                  loading={state.loading}
                  onPageChange={(page) => changePage(group, page)}
                />
              </>
            )}
          </section>
        )
      })}

      {totalItems === 0 &&
        activeGroups.every((group) => {
          const state = groupsState[groupKey(group)]
          return state && !state.loading && !state.error
        }) && (
          <p className="mt-10 text-center text-sm text-neutral-500">
            No products match your selected filters. Try changing or clearing them.
          </p>
        )}

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        avail={availableFilters}
        total={totalItems}
        onChange={handleFilterChange}
        onClearAll={clearFilters}
        showZeroCountOptions
        moodGroups={moodGroupOptions}
        selectedMoodGroups={selectedGroupKeys}
        onMoodGroupToggle={toggleMoodGroup}
        hasCustomSelection={categorySelectionActive}
      />
    </main>
  )
}
