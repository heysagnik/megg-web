import { ImageResponse } from 'next/og'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

export const alt = 'MEGG — Curated Men\'s Fashion India'
export const size = { width: 1200, height: 1200 }
export const contentType = 'image/jpeg'
export const revalidate = 86400

export default async function Image() {
  const fontData = fs.readFileSync(fileURLToPath(new URL('../public/FuturaCyrillicBook.ttf', import.meta.url)))

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
