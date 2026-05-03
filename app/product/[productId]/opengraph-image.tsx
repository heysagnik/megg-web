import { ImageResponse } from 'next/og'

export const alt = 'Product image'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params

  const product = await fetch(`https://api.megg.workers.dev/api/products/${productId}`)
    .then(r => r.json())
    .then((d: { product?: { images?: string[]; name?: string } }) => d.product ?? null)
    .catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  // ImageResponse can't render webp — proxy through Next.js image optimizer which outputs jpeg
  const displayUrl = imageUrl
    ? `https://www.meggfashion.in/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=90`
    : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a0a0a' }}>
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt={product?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: 48, margin: 'auto' }}>MEGG</div>
        )}
      </div>
    ),
    { ...size },
  )
}
