import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const fontData = readFileSync(join(process.cwd(), 'public', 'FuturaCyrillicBook.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"FuturaCyrillic"',
            fontSize: 110,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          M
        </span>
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
