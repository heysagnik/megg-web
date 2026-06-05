import type { Metadata } from 'next'
import CollectionDetailClient from './CollectionDetailClient'

type Props = { params: Promise<{ collectionId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionId } = await params
  return {
    title: 'Collection',
    description: 'A curated product collection on MEGG.',
    alternates: { canonical: `https://www.meggfashion.in/collection/${collectionId}` },
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { collectionId } = await params
  return <CollectionDetailClient collectionId={collectionId} />
}
