import type { Metadata } from 'next'
import { getUnder699, type Gender } from '@/lib/api'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import BrowseRoute from '@/components/product/BrowseRoute'

export const revalidate = 600
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Men\'s Fashion Under Rs 699 — Buy T-Shirts, Shirts, Jeans & More',
  description: 'Shop men\'s T-shirts, shirts, jeans, shoes, hoodies, track pants & accessories under Rs 699 on MEGG. Best budget men\'s fashion online India — top brands, trending styles, new arrivals daily.',
  keywords: [
    'men fashion under 699', 'men clothes under 699 India', 'men T-shirts under 699',
    'men shirts under 699 India', 'men jeans under 699', 'men shoes under 699',
    'men hoodies under 699', 'men joggers under 699', 'men track pants under 699',
    'budget men fashion India', 'cheap men clothes online India', 'affordable men clothing India',
    'men clothing under 500 India', 'men clothing under 1000 India',
    'best budget men fashion India', 'men fashion deals India', 'men fashion sale India',
    'low price men clothes India', 'men outfits under 699 India',
    'affordable T-shirts for men India', 'affordable shirts for men India',
    'affordable jeans for men India', 'affordable shoes for men India',
    'sasta kapda online India', 'men clothes sale India',
  ],
  alternates: { canonical: 'https://www.meggfashion.in/under699' },
  openGraph: {
    type: 'website',
    title: 'Men\'s Fashion Under Rs 699 — MEGG',
    description: 'Shop curated men\'s T-shirts, shirts, jeans & accessories under Rs 699 on MEGG. New styles added daily.',
    url: 'https://www.meggfashion.in/under699',
  },
}

import { Suspense } from 'react'

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Under699Page(_: Props) {
  const gender: Gender = 'men';
  const data = await getUnder699({ page: 1, limit: BROWSE_PAGE_SIZE, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const jsonLd = collectionPageLd({
    url: `${SITE_URL}/under699`,
    name: "Men's Fashion Under Rs 699 — MEGG",
    description: "Shop curated men's fashion under Rs 699 on MEGG.",
    products,
    breadcrumb: [
      { name: 'Home', url: SITE_URL },
      { name: 'Under ₹699', url: `${SITE_URL}/under699` },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <BrowseRoute
          kind="under699"
          pageTitle="Men's Fashion Under ₹699 — Budget Clothing & Accessories"
          initialProducts={products}
          initialTotal={data.total ?? 0}
          initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
        />
      </Suspense>
    </>
  )
}
