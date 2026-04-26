import type { Metadata } from 'next'
import { browseCategory, getCategorySubcategories } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import CategoryPageClient from './CategoryPageClient'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const name = getCategoryDisplay(decodeURIComponent(category))
  return {
    title: name,
    description: `Shop curated ${name} on MEGG.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)

  const [data, subcategories] = await Promise.all([
    browseCategory(slug, 1, 20).catch(() => ({ products: [], total: 0 })),
    getCategorySubcategories(slug).catch(() => []),
  ])

  return (
    <CategoryPageClient
      category={slug}
      displayName={name}
      initialProducts={data.products ?? []}
      total={data.total ?? 0}
      subcategories={subcategories}
    />
  )
}
