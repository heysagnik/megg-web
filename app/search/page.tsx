import type { Metadata } from 'next'
import SearchClient from './SearchClient'

interface Props {
  searchParams: Promise<{ q?: string; query?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const query = (sp.query ?? sp.q)?.trim()
  const url = 'https://www.meggfashion.in/search'

  if (query) {
    return {
      title: `${query} — Search Men's Fashion`,
      description: `Search results for "${query}" on MEGG — curated men's fashion India. Find T-shirts, shirts, jeans, shoes & more.`,
      alternates: { canonical: url },
      openGraph: {
        title: `${query} — Search Men's Fashion | MEGG`,
        description: `Search results for "${query}" on MEGG.`,
        url: `${url}?query=${encodeURIComponent(query)}`,
      },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: 'Search Men\'s Fashion',
    description: 'Search men\'s T-shirts, shirts, jeans, shoes, brands, and styles on MEGG.',
    alternates: { canonical: url },
    openGraph: {
      title: 'Search Men\'s Fashion — MEGG',
      description: 'Search men\'s T-shirts, shirts, jeans, shoes, brands, and styles on MEGG.',
      url,
    },
    robots: { index: false, follow: true },
  }
}

export default function SearchPage() {
  return <SearchClient />
}
