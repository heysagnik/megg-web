import type { Metadata } from 'next'
import { getUnder699 } from '@/lib/api'
import Under699Client from './Under699Client'

export const metadata: Metadata = {
  title: 'Men\'s Fashion Under ₹699 — Budget Picks',
  description: 'Shop curated men\'s T-shirts, shirts, jeans, hoodies & accessories under ₹699 on MEGG. Best budget men\'s fashion India — new styles added daily.',
  keywords: [
    'men fashion under 699', 'men clothes under 699 India',
    'budget men fashion India', 'cheap men clothes online India',
    'affordable men clothing India', 'men T-shirts under 699',
    'men shirts under 699 India', 'men fashion deals India',
    'men clothing under 500 India', 'men clothing under 1000 India',
    'best budget men fashion India', 'men fashion sale India',
    'curated budget men fashion', 'low price men clothes India',
    'men outfits under 699 India',
  ],
  alternates: { canonical: 'https://www.meggfashion.in/under699' },
  openGraph: {
    type: 'website',
    title: 'Men\'s Fashion Under ₹699 — MEGG',
    description: 'Shop curated men\'s T-shirts, shirts, jeans & accessories under ₹699 on MEGG. New styles added daily.',
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
