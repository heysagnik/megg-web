import type { NextConfig } from 'next'

const securityHeaders = [
  // Strict-Transport-Security — forces HTTPS for 1 year
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Cross-Origin-Opener-Policy — prevents cross-origin window attacks
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  // X-Frame-Options — prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // X-Content-Type-Options — prevent MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer-Policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Permissions-Policy
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Fonts in public/ — immutable, 1-year cache + CORS so browsers can load cross-origin
      {
        source: '/:path*\\.ttf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/:path*\\.woff2',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      // Static images in public/ — 7-day cache
      {
        source: '/:path*\\.(png|jpg|jpeg|webp|avif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  // Compress responses
  compress: true,
}

export default nextConfig
