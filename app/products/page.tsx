import type { Metadata } from 'next'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse curated fashion on MEGG.',
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
