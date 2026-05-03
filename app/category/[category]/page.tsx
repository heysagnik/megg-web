import type { Metadata } from 'next'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import CategoryPageClient from './CategoryPageClient'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const url = `https://www.meggfashion.in/category/${encodeURIComponent(slug)}`
  return {
    title: `${name} — Shop Online | MEGG`,
    description: `Shop curated ${name} for men on MEGG. Trending styles, top brands, affordable prices.`,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${name} — MEGG`, description: `Shop curated ${name} for men on MEGG.` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)

  const data = await listProducts({ category: slug, page: 1, limit: 20 }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${name} — MEGG`,
        url: `https://www.meggfashion.in/category/${encodeURIComponent(slug)}`,
        description: `Shop curated ${name} for men on MEGG.`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.meggfashion.in' },
          { '@type': 'ListItem', position: 2, name, item: `https://www.meggfashion.in/category/${encodeURIComponent(slug)}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryPageClient
        category={slug}
        displayName={name}
        initialProducts={data.products ?? []}
        total={data.total ?? 0}
        availableFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
      />
    </>
  )
}
