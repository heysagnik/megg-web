import type { Metadata } from 'next'
import { Suspense } from 'react'
import { listProducts, type Gender } from '@/lib/api'
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
}> = {
  men: {
    title: 'Shop All Men\'s Fashion — T-Shirts, Shirts, Jeans, Shoes & More Online India',
    description: 'Browse & buy curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets, hoodies, track pants, perfume & more. Filter by brand, color, price. Top brands, new arrivals daily.',
    keywords: [
      'shop men clothes online India', 'buy men fashion online India',
      'men fashion collection India', 'all men clothing India',
      'curated men fashion India', 'best men clothing site India',
      'men T-shirts shirts jeans shoes India', 'men clothing brands India',
      'affordable men fashion India', 'new men fashion arrivals India',
      'trending men clothing India', 'buy men outfits online India',
      'men fashion online shopping India', 'men clothing store online India',
    ],
    ogTitle: 'Shop Men\'s Fashion — MEGG',
    ogDescription: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more.',
    pageTitle: "Shop All Men's Fashion — T-Shirts, Shirts, Jeans, Shoes & More",
    collectionName: 'All Products — MEGG',
  },
  women: {
    title: 'Shop All Women\'s Fashion — Dresses, Co-ord Sets, Jeans, Kurtas & More Online India',
    description: 'Browse & buy curated women\'s clothing on MEGG — dresses, co-ord sets, jeans, kurtas & ethnic wear, skirts, footwear, perfume & more. Filter by brand, color, price. Top brands, new arrivals daily.',
    keywords: [
      'shop women clothes online India', 'buy women fashion online India',
      'women fashion collection India', 'all women clothing India',
      'curated women fashion India', 'best women clothing site India',
      'women dresses jeans kurtas India', 'women clothing brands India',
      'affordable women fashion India', 'new women fashion arrivals India',
      'trending women clothing India', 'buy women outfits online India',
      'women fashion online shopping India', 'women clothing store online India',
    ],
    ogTitle: 'Shop Women\'s Fashion — MEGG',
    ogDescription: 'Browse curated women\'s clothing on MEGG — dresses, co-ord sets, jeans, kurtas and more.',
    pageTitle: "Shop All Women's Fashion — Dresses, Co-ord Sets, Jeans & More",
    collectionName: 'All Products — MEGG',
  },
}

export function productsMetadata(gender: Gender): Metadata {
  const c = COPY[gender]
  const url = `https://www.meggfashion.in${genderPath(gender, '/products')}`
  return {
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: c.ogTitle,
      description: c.ogDescription,
    },
  }
}

export default async function ProductsContent({ gender }: { gender: Gender }) {
  const c = COPY[gender]

  const data = await listProducts({ page: 1, limit: BROWSE_PAGE_SIZE, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const jsonLd = collectionPageLd({
    url: `${SITE_URL}${genderPath(gender, '/products')}`,
    name: c.collectionName,
    products,
    breadcrumb: [
      { name: 'Home', url: `${SITE_URL}${genderPath(gender)}` },
      { name: 'All Products', url: `${SITE_URL}${genderPath(gender, '/products')}` },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <Suspense fallback={null}>
        <BrowseRoute
          kind="products"
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
