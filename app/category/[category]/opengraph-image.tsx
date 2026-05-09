import { ImageResponse } from 'next/og'
import { getCategoryDisplay } from '@/lib/utils'

export const alt = 'Category'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'
export const revalidate = 86400

type Props = { params: Promise<{ category: string }> }

export default async function Image({ params }: Props) {
  const { category } = await params
  const name = getCategoryDisplay(decodeURIComponent(category))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#666666',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          MEGG
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#888888',
            marginTop: 20,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Curated Men&apos;s Fashion
        </div>
      </div>
    ),
    { ...size },
  )
}
