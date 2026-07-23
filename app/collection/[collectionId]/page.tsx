import type { Metadata } from 'next'
import { getPublicCollection } from '@/lib/api'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import CollectionDetailClient from './CollectionDetailClient'

const BASE_URL = SITE_URL

type Props = { params: Promise<{ collectionId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionId } = await params
  const url = `${BASE_URL}/collection/${collectionId}`
  const collection = await getPublicCollection(collectionId).catch(() => null)

  if (!collection) {
    return {
      title: 'Collection',
      description: 'A curated product collection on MEGG.',
      alternates: { canonical: url },
    }
  }

  const itemCount = collection.item_count ?? collection.items?.length ?? 0
  const brands = [...new Set((collection.items ?? []).map(i => i.brand).filter(Boolean))].slice(0, 3)
  const brandsStr = brands.length ? ` featuring ${brands.join(', ')}` : ''
  const description = collection.description?.trim()
    || `${collection.name} — a curated men's fashion collection${brandsStr} on MEGG. ${itemCount} handpicked styles.`

  return {
    title: collection.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${collection.name} — MEGG`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@meggfashion',
      title: `${collection.name} — MEGG`,
      description,
    },
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { collectionId } = await params
  const url = `${BASE_URL}/collection/${collectionId}`
  const collection = await getPublicCollection(collectionId).catch(() => null)

  const jsonLd = collection
    ? collectionPageLd({
        url,
        name: `${collection.name} — MEGG`,
        description: collection.description || `${collection.name} — curated men's fashion collection on MEGG.`,
        products: (collection.items ?? []).map(i => ({ id: i.id, name: i.name })),
        breadcrumb: [
          { name: 'Home', url: BASE_URL },
          { name: collection.name, url },
        ],
      })
    : null

  return (
    <>
      <JsonLd data={jsonLd} />
      <CollectionDetailClient collectionId={collectionId} />
    </>
  )
}
