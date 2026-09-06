import type { Metadata } from 'next'
import { getCategories } from '@/lib/api'
import CategoryContent, { categoryMetadata } from '@/app/_gender/category'

export const revalidate = 600
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const categories = await getCategories({ gender: 'women' }).catch(() => [])
  return categories
    .map(c => {
      const name = typeof c === 'string' ? c : (c as unknown as { category: string }).category
      return name ? { category: encodeURIComponent(name) } : null
    })
    .filter((item): item is { category: string } => item !== null)
}

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  return categoryMetadata('women', category)
}

export default async function WomenCategoryPage({ params }: Props) {
  const { category } = await params
  return <CategoryContent gender="women" category={category} />
}
