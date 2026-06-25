import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const fontData = readFileSync(join(process.cwd(), 'public', 'FuturaCyrillicBook.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"FuturaCyrillic"',
            fontSize: 20,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-1px',
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
