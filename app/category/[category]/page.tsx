import type { Metadata } from 'next'
import { getCategories, listProducts, type Gender } from '@/lib/api'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'
import { getCategoryDisplay } from '@/lib/utils'
import { CATEGORY_KEYWORDS, FALLBACK_KEYWORDS } from '@/lib/seo/categoryKeywords'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import BrowseRoute from '@/components/product/BrowseRoute'

export const revalidate = 600
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const categories = await getCategories({ gender: 'men' }).catch(() => [])
  return categories
    .map(c => {
      const name = typeof c === 'string' ? c : (c as unknown as { category: string }).category
      return name ? { category: encodeURIComponent(name) } : null
    })
    .filter((item): item is { category: string } => item !== null)
}

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const url = `https://www.meggfashion.in/category/${encodeURIComponent(slug)}`

  const data = await listProducts({ category: slug, page: 1, limit: 6 }).catch(() => ({
    products: [],
    total: 0,
  }))

  const products = data.products ?? []
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].slice(0, 3)
  const prices = products.map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price))).filter(n => !isNaN(n))
  const minPrice = prices.length ? Math.min(...prices) : null

  let description = `Shop curated ${name} for men online India on MEGG. Browse trending styles, top brands, new arrivals. Quality over quantity.`
  if (brands.length && minPrice !== null) {
    description = `Buy ${name} for men online India from ${brands.join(', ')} & more on MEGG. Starting Rs ${minPrice.toLocaleString('en-IN')}. Trending styles, new arrivals daily, fast delivery.`
  } else if (brands.length) {
    description = `Shop ${name} for men online India from ${brands.join(', ')} & more on MEGG. Curated picks, trending styles, new arrivals daily.`
  }

  const keywords = [
    ...(CATEGORY_KEYWORDS[slug] ?? FALLBACK_KEYWORDS(name)),
    ...brands.map(b => `${b} ${name.toLowerCase()} India`),
  ]

  return {
    title: `${name} for Men — Shop Online`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${name} for Men — Shop Online | MEGG`, description },
  }
}

import { Suspense } from 'react'

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const sp = await searchParams;
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const gender: Gender = 'men';

  const data = await listProducts({ category: slug, page: 1, limit: BROWSE_PAGE_SIZE, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const categoryUrl = `${SITE_URL}/category/${encodeURIComponent(slug)}`

  const jsonLd = collectionPageLd({
    url: categoryUrl,
    name: `${name} for Men — MEGG`,
    description: `Shop curated ${name} for men on MEGG.`,
    products,
    breadcrumb: [
      { name: 'Home', url: SITE_URL },
      { name, url: categoryUrl },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <BrowseRoute
          kind="category"
          categorySlug={slug}
          initialProducts={data.products ?? []}
          initialTotal={data.total ?? 0}
          initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
        />
      </Suspense>
    </>
  )
}
