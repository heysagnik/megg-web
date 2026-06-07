import type { Metadata } from 'next'
import { getPublicCollection } from '@/lib/api'
import CollectionDetailClient from './CollectionDetailClient'

const BASE_URL = 'https://www.meggfashion.in'

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

  const jsonLd = collection ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${collection.name} — MEGG`,
        url,
        description: collection.description || `${collection.name} — curated men's fashion collection on MEGG.`,
        mainEntity: {
          '@type': 'ItemList',
          name: collection.name,
          itemListElement: (collection.items ?? []).slice(0, 10).map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BASE_URL}/product/${item.id}`,
            name: item.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: collection.name, item: url },
        ],
      },
    ],
  } : null

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <CollectionDetailClient collectionId={collectionId} />
    </>
  )
}
