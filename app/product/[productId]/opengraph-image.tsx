import { ImageResponse } from 'next/og'

export const alt = 'Product image'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'
export const revalidate = 86400 // cache for 24h — only generated once per product per day

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params

  const product = await fetch(`https://api.megg.workers.dev/api/products/${productId}`)
    .then(r => r.json())
    .then((d: { product?: { images?: string[]; name?: string } }) => d.product ?? null)
    .catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  let imgSrc: string | null = null
  if (imageUrl) {
    try {
      const sharp = (await import('sharp')).default
      const buf = await fetch(imageUrl).then(r => r.arrayBuffer())
      const jpeg = await sharp(Buffer.from(buf)).jpeg({ quality: 85 }).toBuffer()
      imgSrc = `data:image/jpeg;base64,${jpeg.toString('base64')}`
    } catch {
      imgSrc = null
    }
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a0a0a' }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={product?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: 48, margin: 'auto' }}>MEGG</div>
        )}
      </div>
    ),
    { ...size },
  )
}
