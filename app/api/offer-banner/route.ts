import { type NextRequest } from 'next/server'
import type { PhotonImage as PhotonImageType } from '@cf-wasm/photon/workerd'

export const runtime = 'edge'

const ALLOWED_HOST = 'media.meggfashion.in'
const MAX_DIMENSION = 2000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const src = searchParams.get('url')
  const w = Number(searchParams.get('w'))
  const h = Number(searchParams.get('h'))

  if (!src || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return new Response('Missing or invalid url/w/h', { status: 400 })
  }
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    return new Response('Requested dimensions too large', { status: 400 })
  }

  let sourceUrl: URL
  try {
    sourceUrl = new URL(src)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }
  if (sourceUrl.hostname !== ALLOWED_HOST) {
    return new Response('Source host not allowed', { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(sourceUrl.toString())
  } catch (err) {
    return new Response(`Upstream fetch threw: ${errMessage(err)}`, { status: 502 })
  }
  if (!upstream.ok) {
    return new Response(`Failed to fetch source image (status ${upstream.status})`, { status: 502 })
  }
  const inputBytes = new Uint8Array(await upstream.arrayBuffer())

  const targetW = Math.round(w)
  const targetH = Math.round(h)

  let PhotonImage: typeof PhotonImageType, SamplingFilter: typeof import('@cf-wasm/photon/workerd').SamplingFilter,
    crop: typeof import('@cf-wasm/photon/workerd').crop, resize: typeof import('@cf-wasm/photon/workerd').resize
  try {
    ;({ PhotonImage, SamplingFilter, crop, resize } = await import('@cf-wasm/photon/workerd'))
  } catch (err) {
    return new Response(`@cf-wasm/photon failed to load: ${errMessage(err)}`, { status: 500 })
  }

  let input: PhotonImageType | null = null
  let cropped: PhotonImageType | null = null
  let output: PhotonImageType | null = null

  try {
    input = PhotonImage.new_from_byteslice(inputBytes)
    const srcW = input.get_width()
    const srcH = input.get_height()

    const targetRatio = targetW / targetH
    const srcRatio = srcW / srcH

    let cropW = srcW
    let cropH = srcH
    if (srcRatio > targetRatio) {
      cropW = Math.round(srcH * targetRatio)
    } else {
      cropH = Math.round(srcW / targetRatio)
    }
    const x1 = Math.floor((srcW - cropW) / 2)
    const y1 = Math.floor((srcH - cropH) / 2)

    cropped = crop(input, x1, y1, x1 + cropW, y1 + cropH)
    output = resize(cropped, targetW, targetH, SamplingFilter.Lanczos3)

    const outBytes = Uint8Array.from(output.get_bytes_webp())

    return new Response(new Blob([outBytes], { type: 'image/webp' }), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    return new Response(`Photon processing failed: ${errMessage(err)}`, { status: 500 })
  } finally {
    input?.free()
    cropped?.free()
    output?.free()
  }
}

function errMessage(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}
