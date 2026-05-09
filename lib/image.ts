/**
 * Cloudflare Image Resizing helper
 *
 * Rewrites a media.meggfashion.in URL to go through Cloudflare's
 * Image Resizing endpoint (/cdn-cgi/image/...) so the CDN:
 *   - resizes the image to exactly the requested pixel width
 *   - converts to WebP/AVIF automatically (format=auto)
 *   - applies quality compression
 *
 * Requires "Image Resizing" to be enabled on the Cloudflare zone.
 * If the origin URL is not from the CDN, it is returned unchanged.
 */

const CDN_HOST = 'https://media.meggfashion.in'

export interface CdnImageOptions {
  width: number
  height?: number
  quality?: number
  /** 'cover' crops to fill, 'contain' letterboxes — default 'cover' */
  fit?: 'cover' | 'contain' | 'scale-down'
  /** Override output format — default 'auto' (WebP/AVIF). Use 'jpeg' for OG images. */
  format?: 'auto' | 'jpeg' | 'webp' | 'avif' | 'png'
}

export function getCdnImageUrl(
  src: string,
  { width, height, quality = 95, fit = 'cover', format = 'auto' }: CdnImageOptions,
): string {
  if (!src || !src.startsWith(CDN_HOST)) return src

  const imagePath = src.slice(CDN_HOST.length) // e.g. /products/uuid/filename.webp
  const heightParam = height ? `,height=${height}` : ''
  return `${CDN_HOST}/cdn-cgi/image/width=${width}${heightParam},quality=${quality},format=${format},fit=${fit}${imagePath}`
}

/**
 * Returns a ready-made srcset string for typical product card sizes.
 * Usage:  <img srcSet={getProductSrcSet(url)} sizes="..." />
 */
export function getProductSrcSet(src: string, quality = 95): string {
  const widths = [320, 480, 640, 800]
  return widths
    .map((w) => `${getCdnImageUrl(src, { width: w, quality })} ${w}w`)
    .join(', ')
}
