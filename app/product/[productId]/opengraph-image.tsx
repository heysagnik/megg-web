import { ImageResponse } from 'next/og'
import { getProduct } from '@/lib/api'

export const runtime = 'nodejs'
export const alt = 'Product image'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params
  const product = await getProduct(productId).catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  let imageData: ArrayBuffer | null = null
  let imageMime = 'image/webp'
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl)
      imageData = await res.arrayBuffer()
      imageMime = res.headers.get('content-type') ?? 'image/webp'
    } catch {
      imageData = null
    }
  }

  const imageSrc = imageData
    ? `data:${imageMime};base64,${Buffer.from(imageData).toString('base64')}`
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product?.name ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ color: '#fff', fontSize: 48 }}>MEGG</div>
        )}
      </div>
    ),
    { ...size },
  )
}
