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

  const p = new URLSearchParams({
    url: fullUrl,
    w: String(width),
    q: String(quality),
  })
  if (height) p.set('h', String(height))
  if (format) p.set('f', format)
  if (forceOptimization) p.set('o', '1')

  return `https://edge.meggfashion.in/api/optimize?${p}`
}

export function getProductSrcSet(src: string, quality = 90): string {
  return [320, 480, 640, 800]
    .map(w => `${getCdnImageUrl(src, { width: w, quality })} ${w}w`)
    .join(', ')
}

const VIDEO_CDN = 'https://media.meggfashion.in'

export function getCdnVideoUrl(src: string): string {
  if (!src) return src
  if (src.startsWith(VIDEO_CDN)) return src
  if (src.startsWith('/')) return `${VIDEO_CDN}${src}`
  return src
}
