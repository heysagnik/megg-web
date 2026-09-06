import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getUnder699, type Gender } from '@/lib/api'
import { BROWSE_PAGE_SIZE } from '@/lib/constants'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import { genderPath } from '@/lib/genderPath'
import JsonLd from '@/components/seo/JsonLd'
import BrowseRoute from '@/components/product/BrowseRoute'

const COPY: Record<Gender, {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  pageTitle: string
  collectionName: string
  collectionDescription: string
}> = {
  men: {
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
    ogTitle: 'Men\'s Fashion Under Rs 699 — MEGG',
    ogDescription: 'Shop curated men\'s T-shirts, shirts, jeans & accessories under Rs 699 on MEGG. New styles added daily.',
    pageTitle: "Men's Fashion Under ₹699 — Budget Clothing & Accessories",
    collectionName: "Men's Fashion Under Rs 699 — MEGG",
    collectionDescription: "Shop curated men's fashion under Rs 699 on MEGG.",
  },
  women: {
    title: 'Women\'s Fashion Under Rs 699 — Buy Dresses, Kurtas, Tops & More',
    description: 'Shop women\'s dresses, kurtas, tops, co-ord sets & accessories under Rs 699 on MEGG. Best budget women\'s fashion online India — top brands, trending styles, new arrivals daily.',
    keywords: [
      'women fashion under 699', 'women clothes under 699 India', 'women dresses under 699',
      'women kurtas under 699 India', 'women tops under 699', 'women footwear under 699',
      'budget women fashion India', 'cheap women clothes online India', 'affordable women clothing India',
      'women clothing under 500 India', 'women clothing under 1000 India',
      'best budget women fashion India', 'women fashion deals India', 'women fashion sale India',
      'low price women clothes India', 'women outfits under 699 India',
      'affordable dresses for women India', 'affordable kurtas for women India',
      'affordable jeans for women India', 'affordable footwear for women India',
      'sasta kapda online India', 'women clothes sale India',
    ],
    ogTitle: 'Women\'s Fashion Under Rs 699 — MEGG',
    ogDescription: 'Shop curated women\'s dresses, kurtas, tops & accessories under Rs 699 on MEGG. New styles added daily.',
    pageTitle: "Women's Fashion Under ₹699 — Budget Clothing & Accessories",
    collectionName: "Women's Fashion Under Rs 699 — MEGG",
    collectionDescription: "Shop curated women's fashion under Rs 699 on MEGG.",
  },
}

export function under699Metadata(gender: Gender): Metadata {
  const c = COPY[gender]
  const url = `https://www.meggfashion.in${genderPath(gender, '/under699')}`
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: c.ogTitle,
      description: c.ogDescription,
      url,
    },
  }
}

export default async function Under699Content({ gender }: { gender: Gender }) {
  const c = COPY[gender]

  const data = await getUnder699({ page: 1, limit: BROWSE_PAGE_SIZE, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const jsonLd = collectionPageLd({
    url: `${SITE_URL}${genderPath(gender, '/under699')}`,
    name: c.collectionName,
    description: c.collectionDescription,
    products,
    breadcrumb: [
      { name: 'Home', url: `${SITE_URL}${genderPath(gender)}` },
      { name: 'Under ₹699', url: `${SITE_URL}${genderPath(gender, '/under699')}` },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <BrowseRoute
          kind="under699"
          gender={gender}
          pageTitle={c.pageTitle}
          initialProducts={products}
          initialTotal={data.total ?? 0}
          initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
        />
      </Suspense>
    </>
  )
}
