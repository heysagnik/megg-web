import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
            fontFamily: 'serif',
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
    { ...size },
  )
}
