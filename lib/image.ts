export interface CdnImageOptions {
  width: number
  height?: number
  quality?: number
}

export function getCdnImageUrl(
  src: string,
  _options?: CdnImageOptions,
): string {
  if (!src) return src
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return `https://media.meggfashion.in${src}`
  return `https://media.meggfashion.in/${src}`
}

export function getProductSrcSet(src: string, quality = 90): string {
  const url = getCdnImageUrl(src)
  return [320, 480, 640, 800]
    .map(w => `${url} ${w}w`)
    .join(', ')
}

const VIDEO_CDN = 'https://media.meggfashion.in'

export function getCdnVideoUrl(src: string): string {
  if (!src) return src
  // Already on the video CDN — return as-is
  if (src.startsWith(VIDEO_CDN)) return src
  // Relative path — prefix with CDN host
  if (src.startsWith('/')) return `${VIDEO_CDN}${src}`
  return src
}
