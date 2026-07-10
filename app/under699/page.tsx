import type { Metadata } from 'next'
import { getUnder699, genderFromSearchParams, type Gender } from '@/lib/api'
import Under699Client from './Under699Client'

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

export default async function Under699Page({ searchParams }: Props) {
  const sp = await searchParams;
  const gender: Gender = genderFromSearchParams(sp);
  const data = await getUnder699(1, 20, undefined, undefined, { gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "Men's Fashion Under Rs 699 — MEGG",
    url: 'https://www.meggfashion.in/under699',
    description: "Shop curated men's fashion under Rs 699 on MEGG.",
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.meggfashion.in/product/${p.id}`,
        name: p.name,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <Under699Client
          initialProducts={products}
          total={data.total ?? 0}
          availableFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
        />
      </Suspense>
    </>
  )
}
