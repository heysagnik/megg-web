
import type { Metadata } from 'next'
import SearchClient from './SearchClient'
import { getTrendingProducts } from '@/lib/api'
import type { Gender } from '@/lib/api'


interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    query?: string
    gender?: string
  }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams
  const query = (sp.query ?? sp.q)?.trim()
  const gender: Gender = sp.gender === 'women' ? 'women' : 'men'

  const url = 'https://www.meggfashion.in/search'
  const fashionType = gender === 'women' ? "Women's" : "Men's"

  if (query) {
    return {
      title: `${query} — Search ${fashionType} Fashion`,
      description: `Search results for "${query}" on MEGG.`,
      alternates: { canonical: url },
      openGraph: {
        title: `${query} — Search ${fashionType} Fashion | MEGG`,
        description: `Search results for "${query}" on MEGG.`,
        url: `${url}?query=${encodeURIComponent(query)}&gender=${gender}`,
      },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: `Search ${fashionType} Fashion`,
    description: `Search ${fashionType.toLowerCase()} clothing, styles, brands and more on MEGG.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Search ${fashionType} Fashion — MEGG`,
      description: `Search ${fashionType.toLowerCase()} clothing, styles, brands and more on MEGG.`,
      url,
    },
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const sp = await searchParams
  const gender = sp.gender === 'women' ? 'women' : 'men'

  const trendingProducts = await getTrendingProducts({
    gender,
  }).catch(() => [])

  return (
    <SearchClient
      trendingProducts={trendingProducts}
      gender={gender}
    />
  )
}
