import { ImageResponse } from 'next/og'

export const alt = 'MEGG — Curated Men\'s Fashion India'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

export default function Image() {
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
            fontSize: 128,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-6px',
            lineHeight: 1,
          }}
        >
          MEGG
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#888888',
            marginTop: 24,
            letterSpacing: '5px',
            textTransform: 'uppercase',
          }}
        >
          Curated Men&apos;s Fashion India
        </div>
      </div>
    ),
    { ...size },
  )
}
