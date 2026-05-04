import { ImageResponse } from 'next/og'
import { getCdnImageUrl } from '@/lib/image'
import { getProduct } from '@/lib/api'

export const alt = 'Product image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'
export const revalidate = 86400

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params

  const product = await getProduct(productId).catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  const imgSrc = imageUrl
    ? getCdnImageUrl(imageUrl, { width: 1200, height: 630, quality: 90, fit: 'cover', format: 'jpeg' })
    : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a0a0a' }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={product?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: 64, margin: 'auto', letterSpacing: '-2px' }}>MEGG</div>
        )}
      </div>
    ),
    { ...size },
  )
}
