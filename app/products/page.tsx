import type { Metadata } from 'next'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: 'Shop Men\'s Fashion — T-Shirts, Shirts, Jeans & More',
  description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more. Filter by brand, color, and price. New arrivals daily.',
  keywords: [
    'shop men clothes online India', 'men fashion collection India',
    'men T-shirts shirts jeans shoes India', 'men clothing brands India',
    'curated men fashion India', 'best men clothing site India',
    'men fashion under 699', 'men clothing under 1000 India',
    'affordable men fashion India', 'new men fashion arrivals India',
    'trending men clothing India', 'buy men outfits online India',
    'men casual streetwear India', 'men office casual wear India',
    'men gym wear online India', 'men ethnic clothing India',
    'filter men clothes by brand India', 'discounted men fashion India',
  ],
  alternates: { canonical: 'https://www.meggfashion.in/products' },
  openGraph: {
    type: 'website',
    url: 'https://www.meggfashion.in/products',
    title: 'Shop Men\'s Fashion — MEGG',
    description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more.',
  },
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category = '' } = await searchParams

  const data = await listProducts({ page: 1, limit: 20, category: category || undefined }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  return (
    <ProductsClient
      initialCategory={category}
      initialProducts={data.products ?? []}
      initialTotal={data.total ?? 0}
      initialFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
    />
  )
}
