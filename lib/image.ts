const MEDIA_BASE = 'https://media.meggfashion.in'

export function resolveMediaUrl(src: string): string {
  if (!src) return src
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return `${MEDIA_BASE}${src}`
  return `${MEDIA_BASE}/${src}`
}

export function getCdnImageUrl(src: string): string {
  return resolveMediaUrl(src)
}

const PRODUCT_WIDTHS = [320, 480, 800, 1200, 1600] as const

export function getProductSrcSet(src: string): string {
  const full = resolveMediaUrl(src)
  return PRODUCT_WIDTHS
    .map(w => `${full} ${w}w`)
    .join(', ')
}

/**
 * Server-side resized/cropped variant of a CDN image, via /api/offer-banner
 * (a WASM-based image endpoint — see that route for why: sharp can't run on
 * this app's Cloudflare Workers deploy target). Crops to the target aspect
 * ratio (centered, like CSS `object-fit: cover`) and resizes to those exact
 * pixels, so the browser downloads only what it needs instead of the full
 * original banner asset.
 */
export function getResizedOfferBanner(src: string, width: number, height: number): string {
  const full = resolveMediaUrl(src)
  const params = new URLSearchParams({ url: full, w: String(Math.round(width)), h: String(Math.round(height)) })
  return `/api/offer-banner?${params.toString()}`
}

const VIDEO_CDN = 'https://media.meggfashion.in'

export function getCdnVideoUrl(src: string): string {
  if (!src) return src
  if (src.startsWith(VIDEO_CDN)) return src
  if (src.startsWith('/')) return `${VIDEO_CDN}${src}`
  return src
}
