'use client'

import { Suspense, useCallback, useEffect, useRef } from 'react'
import { useSearch } from '@/hooks/useSearch'
import SearchLayout from '@/components/search/SearchLayout'

export default function SearchClient() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  )
}

function SearchInner() {
  const {
    data, loading, filters, hasMore, defaultSort, availableFilters,
    update, toggleMulti, addMulti, clearAll, loadMore,
  } = useSearch()

  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasMore || loading) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) loadMore() },
      { rootMargin: '400px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, loadMore])

  const onCategory = useCallback((slug: string) => {
    update({ category: slug || null })
  }, [update])

  const onSort = useCallback((sort: string) => {
    update({ sort: sort === defaultSort ? null : sort })
  }, [update, defaultSort])

  const onRemove = useCallback((
    kind: 'query' | 'category' | 'subcategory' | 'color' | 'brand' | 'minPrice' | 'maxPrice',
    value?: string,
  ) => {
    if (kind === 'query' || kind === 'category' || kind === 'minPrice' || kind === 'maxPrice') {
      update({ [kind]: null })
    } else if (value != null) {
      toggleMulti(kind, value)
    }
  }, [update, toggleMulti])

  const onSuggest = useCallback((patch: {
    category?: string; subcategory?: string[]; color?: string[]; brand?: string[]
  }) => {
    if (patch.category) update({ category: patch.category })
    patch.subcategory?.forEach(v => addMulti('subcategory', v))
    patch.color?.forEach(v       => addMulti('color', v))
    patch.brand?.forEach(v       => addMulti('brand', v))
  }, [update, addMulti])

  const categories = (() => {
    const cats = (data?.availableFilters?.categories ?? []).map(c => ({
      label: c.name, slug: c.name, count: c.count,
    }))
    return cats.length ? [{ label: 'All', slug: '' } as typeof cats[number], ...cats] : cats
  })()

  const title = filters.query ? `"${filters.query}"` : filters.category || 'Browse'

  return (
    <SearchLayout
      title={title}
      products={data?.products ?? []}
      total={data?.total ?? 0}
      loading={loading}
      hasMore={hasMore}
      sentinel={sentinel}
      categories={categories}
      categoriesLoading={!data && loading}
      filters={filters}
      availableFilters={availableFilters}
      appliedFilters={data?.appliedFilters ?? null}
      suggestedFilters={data?.suggestedFilters ?? null}
      banners={data?.banners ?? []}
      searchMode={data?.searchMode ?? null}
      defaultSort={defaultSort}
      onCategorySelect={onCategory}
      onToggleMulti={(key, value) => toggleMulti(key, value)}
      onSortChange={onSort}
      onClearAll={() => clearAll({ keepQuery: true })}
      onRemoveApplied={onRemove}
      onApplySuggested={onSuggest}
      onSelectPriceFilter={v => update({ maxPrice: v, minPrice: null })}
      onPriceRangeChange={(min, max) => update({
        minPrice: min == null ? null : String(min),
        maxPrice: max == null ? null : String(max),
      })}
    />
  )
}
