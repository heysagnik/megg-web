import type { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for fashion products, brands, and styles on MEGG.',
  alternates: { canonical: 'https://meggfashion.in/search' },
  openGraph: {
    title: 'Search — MEGG',
    description: 'Search for fashion products, brands, and styles on MEGG.',
    url: 'https://meggfashion.in/search',
  },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return <SearchClient />
}
