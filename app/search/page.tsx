import type { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Men\'s Fashion',
  description: 'Search men\'s T-shirts, shirts, jeans, shoes, brands, and styles on MEGG.',
  alternates: { canonical: 'https://www.meggfashion.in/search' },
  openGraph: {
    title: 'Search Men\'s Fashion — MEGG',
    description: 'Search men\'s T-shirts, shirts, jeans, shoes, brands, and styles on MEGG.',
    url: 'https://www.meggfashion.in/search',
  },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return <SearchClient />
}
