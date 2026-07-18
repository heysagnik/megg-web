import type { Metadata } from 'next'
import { listProducts, type Gender } from '@/lib/api'
import ProductsClient from './ProductsClient'

export const revalidate = 600
export const dynamic = 'force-static'

// NOTE: This page is intentionally static (force-static + revalidate). It does
// NOT read `searchParams` on the server — that would opt the route out of the
// edge cache and force every /products?category=… visit through the origin
// function. Category/filter state lives entirely in the client via
// `useSearchParams()` in ProductsClient, which fetches fresh data through the
// already-cached /api endpoints. The server renders a single canonical HTML
// payload for `/products` that the edge serves indefinitely (24h s-maxage,
// 1y stale-while-revalidate — see next.config.ts).

export const metadata: Metadata = {
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
  alternates: { canonical: 'https://www.meggfashion.in/products' },
  openGraph: {
    type: 'website',
    url: 'https://www.meggfashion.in/products',
    title: 'Shop Men\'s Fashion — MEGG',
    description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more.',
  },
}

export default async function ProductsPage() {
  const gender: Gender = 'men';
  // No server-side searchParams access → route stays static and edge-cacheable.
  // The client hydrates from /products (no category) and re-fetches with the
  // category param when the URL changes.
  const data = await listProducts({ page: 1, limit: 20, gender }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Products — MEGG',
    url: 'https://www.meggfashion.in/products',
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
      <ProductsClient
        initialProducts={products}
        initialTotal={data.total ?? 0}
        initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
      />
    </>
  )
}
