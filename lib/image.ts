export type CdnImageOptions = {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  forceOptimization?: boolean
}

export function getCdnImageUrl(
  src: string,
  { width = 1080, height, quality = 90, format, forceOptimization }: CdnImageOptions = {},
): string {
  if (!src) return src
  let fullUrl = src
  if (src.startsWith('/')) fullUrl = `https://media.meggfashion.in${src}`
  else if (!src.startsWith('http')) fullUrl = `https://media.meggfashion.in/${src}`
  
  // The custom worker is slow, so we only use it if format conversion is strictly required (e.g. Satori)
  if (forceOptimization || format) {
    const p = new URLSearchParams({
      url: fullUrl,
      w: String(width),
      q: String(quality),
    })
    if (format) p.set('f', format)
    return `https://edge.meggfashion.in/api/optimize?${p}`
  }

  // Otherwise, serve the direct R2 URL (blazing fast)
  return fullUrl
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
