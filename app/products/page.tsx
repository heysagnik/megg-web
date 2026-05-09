import type { Metadata } from 'next'
import Script from 'next/script'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import ProductsClient from './ProductsClient'

interface Props {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category = '' } = await searchParams
  const url = 'https://www.meggfashion.in/products'

  if (category) {
    const name = getCategoryDisplay(category)
    return {
      title: `${name} — Shop Men's Fashion`,
      description: `Browse curated ${name.toLowerCase()} for men on MEGG. Filter by brand, color, and price. New arrivals daily.`,
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        url: `${url}?category=${encodeURIComponent(category)}`,
        title: `${name} — Shop Men's Fashion | MEGG`,
        description: `Browse curated ${name.toLowerCase()} for men on MEGG.`,
      },
    }
  }

  return {
    title: 'Shop Men\'s Fashion — T-Shirts, Shirts, Jeans & More',
    description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more. Filter by brand, color, and price. New arrivals daily.',
    keywords: [
      'shop men clothes online India', 'men fashion collection India',
      'curated men fashion India', 'best men clothing site India',
      'affordable men fashion India', 'new men fashion arrivals India',
      'trending men clothing India', 'buy men outfits online India',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: 'Shop Men\'s Fashion — MEGG',
      description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more.',
    },
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category = '' } = await searchParams

  const data = await listProducts({ page: 1, limit: 20, category: category || undefined }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const name = category ? getCategoryDisplay(category) : 'All Products'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} — MEGG`,
    url: `https://www.meggfashion.in/products${category ? `?category=${encodeURIComponent(category)}` : ''}`,
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
      <Script id="products-jsonld" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductsClient
        initialCategory={category}
        initialProducts={products}
        initialTotal={data.total ?? 0}
        initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
      />
    </>
  )
}
