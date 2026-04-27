import type { Metadata } from 'next'
import { getUnder699 } from '@/lib/api'
import Under699Client from './Under699Client'

export const metadata: Metadata = {
  title: 'Shop Under Rs. 699',
  description: 'Curated fashion picks under Rs. 699. New styles added daily on MEGG.',
  alternates: { canonical: 'https://meggfashion.in/under699' },
  openGraph: {
    title: 'Shop Under Rs. 699 — MEGG',
    description: 'Curated fashion picks under Rs. 699. New styles added daily.',
    url: 'https://meggfashion.in/under699',
  },
}

export default async function Under699Page() {
  const data = await getUnder699(1, 20).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  return (
    <Under699Client
      initialProducts={data.products ?? []}
      total={data.total ?? 0}
      availableFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
    />
  )
}
