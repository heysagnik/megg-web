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

const VIDEO_CDN = 'https://media.meggfashion.in'

export function getCdnVideoUrl(src: string): string {
  if (!src) return src
  if (src.startsWith(VIDEO_CDN)) return src
  if (src.startsWith('/')) return `${VIDEO_CDN}${src}`
  return src
}
