import { ImageResponse } from 'next/og'

import { getProduct } from '@/lib/api'

import { getOptimizedImageUrl } from '@/lib/image'

export const alt = 'Product image'
export const size = { width: 1200, height: 900 }
export const contentType = 'image/jpeg'
export const revalidate = 86400

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params

  const product = await getProduct(productId).catch(() => null)
  const imageUrl = product?.images?.[0] ?? null

  const imgSrc = imageUrl
    ? getOptimizedImageUrl(imageUrl, { width: 1200, quality: 82, format: 'jpeg' })
    : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#F3F3F3' }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={product?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: 64, margin: 'auto', letterSpacing: '-2px' }}>MEGG</div>
        )}
      </div>
    ),
    { ...size },
  )
}
