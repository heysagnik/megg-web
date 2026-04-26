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
    remotePatterns: [
      { protocol: 'https', hostname: 'media.meggfashion.in', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com',   pathname: '/**' },
    ],
    // Serve modern formats — reduces image payload significantly
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching
    minimumCacheTTL: 86400,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Compress responses
  compress: true,
}

export default nextConfig
