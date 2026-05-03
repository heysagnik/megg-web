import { ImageResponse } from 'next/og'
import { getCdnImageUrl } from '@/lib/image'

export const alt = 'Product image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'
export const revalidate = 86400

type Props = { params: Promise<{ productId: string }> }

export default async function Image({ params }: Props) {
  const { productId } = await params

  const product = await fetch(`https://api.megg.workers.dev/api/products/${productId}`)
    .then(r => r.json())
    .then((d: { product?: { images?: string[]; name?: string; brand?: string; price?: number | string } }) => d.product ?? null)
    .catch(() => null)

  const imageUrl = product?.images?.[0] ?? null

  // Force JPEG + exact 1200×630 crop so OG scrapers (WhatsApp, Facebook, iMessage)
  // get a universally compatible image without any post-processing.
  const imgSrc = imageUrl
    ? getCdnImageUrl(imageUrl, { width: 1200, height: 630, quality: 90, fit: 'cover', format: 'jpeg' })
    : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0a0a0a' }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={product?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: 64, margin: 'auto', letterSpacing: '-2px' }}>MEGG</div>
        )}

        {/* Branding strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 28px',
            background: 'rgba(0,0,0,0.55)',
          }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '820px', overflow: 'hidden' }}>
            <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product?.name ?? ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {product?.brand ? (
                <span style={{ color: '#cccccc', fontSize: 16, fontWeight: 400 }}>
                  {product.brand}
                </span>
              ) : null}
              {product?.price ? (
                <span style={{ color: '#ffffff', fontSize: 16, fontWeight: 700 }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              ) : null}
            </div>
          </div>
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', opacity: 0.9, flexShrink: 0 }}>
            MEGG
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
