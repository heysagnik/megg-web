import type { Metadata } from 'next'
import { Suspense } from 'react'
import { listProducts, type Gender } from '@/lib/api'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'
import { getCategoryDisplay } from '@/lib/utils'
import { CATEGORY_KEYWORDS, FALLBACK_KEYWORDS, FALLBACK_KEYWORDS_WOMEN } from '@/lib/seo/categoryKeywords'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import { genderPath } from '@/lib/genderPath'
import JsonLd from '@/components/seo/JsonLd'
import BrowseRoute from '@/components/product/BrowseRoute'

const GENDER_NOUN: Record<Gender, string> = { men: 'men', women: 'women' }
const GENDER_LABEL: Record<Gender, string> = { men: 'Men', women: 'Women' }

export async function categoryMetadata(gender: Gender, category: string): Promise<Metadata> {
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const url = `https://www.meggfashion.in${genderPath(gender, `/category/${encodeURIComponent(slug)}`)}`
  const noun = GENDER_NOUN[gender]
  const label = GENDER_LABEL[gender]

  const data = await listProducts({ category: slug, page: 1, limit: 6, gender }).catch(() => ({
    products: [],
    total: 0,
  }))

  const products = data.products ?? []
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].slice(0, 3)
  const prices = products.map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price))).filter(n => !isNaN(n))
  const minPrice = prices.length ? Math.min(...prices) : null

  let description = `Shop curated ${name} for ${noun} online India on MEGG. Browse trending styles, top brands, new arrivals. Quality over quantity.`
  if (brands.length && minPrice !== null) {
    description = `Buy ${name} for ${noun} online India from ${brands.join(', ')} & more on MEGG. Starting Rs ${minPrice.toLocaleString('en-IN')}. Trending styles, new arrivals daily, fast delivery.`
  } else if (brands.length) {
    description = `Shop ${name} for ${noun} online India from ${brands.join(', ')} & more on MEGG. Curated picks, trending styles, new arrivals daily.`
  }

  const keywords = [
    ...(gender === 'men'
      ? (CATEGORY_KEYWORDS[slug] ?? FALLBACK_KEYWORDS(name))
      : FALLBACK_KEYWORDS_WOMEN(name)),
    ...brands.map(b => `${b} ${name.toLowerCase()} India`),
  ]

  return {
    title: `${name} for ${label} — Shop Online`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${name} for ${label} — Shop Online | MEGG`, description },
  }
}

export default async function CategoryContent({ gender, category }: { gender: Gender; category: string }) {
  const label = GENDER_LABEL[gender]
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)

  const data = await listProducts({ category: slug, page: 1, limit: BROWSE_PAGE_SIZE, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const categoryUrl = `${SITE_URL}${genderPath(gender, `/category/${encodeURIComponent(slug)}`)}`

  const jsonLd = collectionPageLd({
    url: categoryUrl,
    name: `${name} for ${label} — MEGG`,
    description: `Shop curated ${name} for ${GENDER_NOUN[gender]} on MEGG.`,
    products,
    breadcrumb: [
      { name: 'Home', url: `${SITE_URL}${genderPath(gender)}` },
      { name, url: categoryUrl },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <BrowseRoute
          kind="category"
          gender={gender}
          categorySlug={slug}
          pageTitle={`${name} for ${label} — Shop Online in India`}
          initialProducts={data.products ?? []}
          initialTotal={data.total ?? 0}
          initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
        />
      </Suspense>
    </>
  )
}
