import { notFound } from 'next/navigation'
import { getReel, getProductsByIds } from '@/lib/api'
import { getCdnVideoUrl, getCdnImageUrl } from '@/lib/image'
import type { Metadata } from 'next'
import ReelPlayer from './ReelPlayer'

interface ReelPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReelPageProps): Promise<Metadata> {
  const { id } = await params
  const reel = await getReel(id)
  if (!reel) return { title: 'Reel Not Found' }

  return {
    title: `Style Reel — ${reel.category} | MEGG`,
    description: `Watch this style reel featuring the latest trends in ${reel.category}. Shop the look at MEGG.`,
    openGraph: {
      images: [reel.thumbnail_url],
    },
  }
}

export default async function ReelPage({ params }: ReelPageProps) {
  const { id } = await params
  const reel = await getReel(id)

  if (!reel) {
    notFound()
  }

  const products = await getProductsByIds(reel.product_ids || [])

  return (
    <ReelPlayer
      reel={{
        id: reel.id,
        category: reel.category,
        videoUrl: getCdnVideoUrl(reel.video_url),
        thumbnailUrl: getCdnImageUrl(reel.thumbnail_url, { width: 600 }),
        views: reel.views,
        likes: reel.likes,
      }}
      products={products}
      mobileProducts={products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        image: getCdnImageUrl(p.images?.[0] || '', { width: 200 }),
      }))}
    />
  )
}
