import type { Metadata } from 'next'
import { getUnder699 } from '@/lib/api'
import Under699Client from './Under699Client'

export const metadata: Metadata = {
  title: 'Men\'s Fashion Under ₹699 — Budget Picks | MEGG',
  description: 'Shop men\'s T-shirts, shirts, and accessories under ₹699 on MEGG. Curated budget fashion — new styles added daily.',
  alternates: { canonical: 'https://www.meggfashion.in/under699' },
  openGraph: {
    type: 'website',
    title: 'Men\'s Fashion Under ₹699 — MEGG',
    description: 'Shop men\'s T-shirts, shirts, and accessories under ₹699 on MEGG. New styles added daily.',
    url: 'https://www.meggfashion.in/under699',
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
