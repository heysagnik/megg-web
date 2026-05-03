import type { Metadata } from 'next'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: 'Shop Men\'s Fashion — T-Shirts, Shirts, Jeans & More | MEGG',
  description: 'Browse curated men\'s clothing on MEGG — T-shirts, shirts, jeans, shoes, jackets and more. Filter by brand, color, and price.',
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
