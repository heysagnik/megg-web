export type CdnImageOptions = {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  forceOptimization?: boolean
}

const MEDIA_BASE   = 'https://media.meggfashion.in'
const OPTIMIZE_URL = 'https://edge.meggfashion.in/api/optimize'

export function resolveMediaUrl(src: string): string {
  if (!src) return src
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return `${MEDIA_BASE}${src}`
  return `${MEDIA_BASE}/${src}`
}

export function getCdnImageUrl(src: string, _opts?: CdnImageOptions): string {
  return resolveMediaUrl(src)
}

/**
 * Routes through the optimize worker at edge.meggfashion.in.
 * Use ONLY for non-display contexts (e.g. opengraph-image generation)
 * where you need a specific width/quality/format for composition.
 * For product cards, use getCdnImageUrl (direct CDN).
 */
export function getOptimizedImageUrl(src: string, opts: CdnImageOptions = {}): string {
  if (!src) return src
  const fullUrl = resolveMediaUrl(src)
  const { width = 1080, height, quality = 80, format = 'webp', forceOptimization } = opts
  const p = new URLSearchParams({
    url: fullUrl,
    w: String(width),
    q: String(quality),
    f: format,
  })
  if (height) p.set('h', String(height))
  if (forceOptimization) p.set('o', '1')
  return `${OPTIMIZE_URL}?${p}`
}

const PRODUCT_WIDTHS = [320, 480, 800, 1200, 1600] as const

export function getProductSrcSet(src: string): string {
  const full = resolveMediaUrl(src)
  return PRODUCT_WIDTHS
    .map(w => `${full} ${w}w`)
    .join(', ')
}

const VIDEO_CDN = 'https://media.meggfashion.in'

export function getCdnVideoUrl(src: string): string {
  if (!src) return src
  if (src.startsWith(VIDEO_CDN)) return src
  if (src.startsWith('/')) return `${VIDEO_CDN}${src}`
  return src
}
