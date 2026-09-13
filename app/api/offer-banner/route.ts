import { type NextRequest } from 'next/server'
import { PhotonImage, SamplingFilter, crop, resize } from '@cf-wasm/photon'

// Runs as an edge/Workers function — @cf-wasm/photon is a WASM port of the
// Rust `photon` image library, so it works on Cloudflare Workers where a
// native binary (e.g. sharp) cannot. See vite.config.ts, which explicitly
// stubs `sharp` out of the build for exactly this reason.
export const runtime = 'edge'

// This must never become an open image-fetching proxy — only ever resize
// banners we already serve from our own CDN.
const ALLOWED_HOST = 'media.meggfashion.in'

// Workers have a hard ~128MB memory ceiling; refuse anything that could get
// us anywhere near it.
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

  let input: PhotonImage | null = null
  let cropped: PhotonImage | null = null
  let output: PhotonImage | null = null

  try {
    input = PhotonImage.new_from_byteslice(inputBytes)
    const srcW = input.get_width()
    const srcH = input.get_height()

    // Centered crop matching the target aspect ratio, then resize to the
    // exact pixel size requested — the server-side equivalent of CSS
    // `object-fit: cover; object-position: center`, but shipped as real,
    // already-cropped pixels instead of a browser-side visual crop.
    const targetRatio = targetW / targetH
    const srcRatio = srcW / srcH

    let cropW = srcW
    let cropH = srcH
    if (srcRatio > targetRatio) {
      cropW = Math.round(srcH * targetRatio) // source relatively wider — trim the sides
    } else {
      cropH = Math.round(srcW / targetRatio) // source relatively taller — trim top/bottom
    }
    const x1 = Math.floor((srcW - cropW) / 2)
    const y1 = Math.floor((srcH - cropH) / 2)

    cropped = crop(input, x1, y1, x1 + cropW, y1 + cropH)
    output = resize(cropped, targetW, targetH, SamplingFilter.Lanczos3)

    // Copy into a plain ArrayBuffer-backed Uint8Array — the wasm-bindgen
    // output is typed against the wider ArrayBufferLike (which also covers
    // SharedArrayBuffer), which Response/Blob's stricter BodyInit typing
    // rejects.
    const outBytes = Uint8Array.from(output.get_bytes_webp())

    return new Response(new Blob([outBytes], { type: 'image/webp' }), {
      headers: {
        'Content-Type': 'image/webp',
        // Matches getOffers()'s own 600s revalidate — a changed banner
        // shows up within that window, cached hard at the edge otherwise.
        'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    // Surface the real failure instead of an opaque 500 — this endpoint has
    // no request body/PII to worry about leaking, so it's safe to return
    // the message directly and read it straight off the network tab.
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
