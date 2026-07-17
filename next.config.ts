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
      // Long-cache assets so they rarely reach origin
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
      {
        source: '/:path*\\.(png|jpg|jpeg|webp|avif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Static public assets — cache 1 year at the edge, no origin revalidation
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // All GETs to public, non-API pages — edge caches for 1 day, browsers for
      // 60s. max-age=0 previously forced the browser to revalidate against the
      // edge on every navigation (back/forward, internal clicks); a 60s browser
      // cache keeps in-session navigation off the network while staying fresh.
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=86400, stale-while-revalidate=31536000' },
        ],
      },
      // API responses — short edge cache so identical calls don't re-hit origin
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' },
        ],
      },
    ]
  },

  // Compress responses
  compress: true,

  // Power-optimal: turn off Image Optimization data cache (origin hits avoided
  // for /next/image when unoptimized=true above is set; this also prevents the
  // optimizer from triggering extra origin fetches via Fast Origin Transfer).
  poweredByHeader: false,
}

export default nextConfig
