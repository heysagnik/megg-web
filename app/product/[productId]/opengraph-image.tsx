import { ImageResponse } from 'next/og'
import { getProduct } from '@/lib/api'

export const runtime = 'edge'
export const alt = 'Product image'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params
  const product = await getProduct(productId).catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  // Fetch the image and convert to a data URI so the edge runtime
  // can embed it directly — edge functions can't load arbitrary external
  // URLs inside ImageResponse without this.
  let imageSrc: string | null = null
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl)
      const buf = await res.arrayBuffer()
      const mime = res.headers.get('content-type') ?? 'image/webp'
      const bytes = new Uint8Array(buf)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      imageSrc = `data:${mime};base64,${btoa(binary)}`
    } catch {
      imageSrc = null
    }
  }

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
