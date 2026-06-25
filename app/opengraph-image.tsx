import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'MEGG — Curated Men\'s Fashion India'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/jpeg'

export default async function Image() {
  const fontData = readFileSync(join(process.cwd(), 'public', 'FuturaCyrillicBook.ttf'))

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
          fontFamily: '"FuturaCyrillic"',
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 400,
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
    {
      ...size,
      fonts: [
        {
          name: 'FuturaCyrillic',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
