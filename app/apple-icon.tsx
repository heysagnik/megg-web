import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
            fontFamily: 'serif',
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
    { ...size },
  )
}
