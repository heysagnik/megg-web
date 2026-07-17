// IndexNow: supported by Bing, Yandex, and other IndexNow-compatible engines.
// The key must match the content of /meggfashion-indexnow.txt at the site root.
const INDEXNOW_KEY = 'meggfashion-indexnow-2026'
const HOST = 'www.meggfashion.in'
const BASE_URL = `https://${HOST}`
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`

// Static URLs to submit — dynamic pages (products, categories) come via the sitemap
const PRIORITY_URLS = [
  BASE_URL,
  `${BASE_URL}/products`,
  `${BASE_URL}/under699`,
  `${BASE_URL}/about`,
]

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

export const revalidate = 3600

export async function GET() {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: PRIORITY_URLS,
  }

  const results = await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map(endpoint =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      })
    )
  )

  const summary = results.map((r, i) => ({
    engine: INDEXNOW_ENDPOINTS[i],
    status: r.status === 'fulfilled' ? r.value.status : 'error',
    ok: r.status === 'fulfilled' && (r.value.status === 200 || r.value.status === 202),
  }))

  return Response.json({
    submitted: PRIORITY_URLS,
    engines: summary,
    note: 'For Google, submit the sitemap manually via Google Search Console: https://search.google.com/search-console',
    sitemap: `${BASE_URL}/sitemap.xml`,
  }, {
    // Explicit edge cache so identical /api/reindex calls don't reach origin.
    // (Vercel's default for route handlers is unreliable; we pin it here.)
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
