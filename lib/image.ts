export interface CdnImageOptions {
  width: number
  height?: number
  quality?: number
}

export function getCdnImageUrl(
  src: string,
  { width, height, quality = 90 }: CdnImageOptions,
): string {
  if (!src) return src
  const p = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
  })
  if (height) p.set('h', String(height))
  return `https://api.megg.workers.dev/api/optimize?${p}`
}

export function getProductSrcSet(src: string, quality = 90): string {
  return [320, 480, 640, 800]
    .map(w => `${getCdnImageUrl(src, { width: w, quality })} ${w}w`)
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
