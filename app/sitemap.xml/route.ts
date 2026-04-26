import { getCategories } from '@/lib/api'

const BASE = 'https://meggfashion.in'

const STATIC = [
  { url: BASE,               priority: '1.0', changefreq: 'daily'   },
  { url: `${BASE}/products`, priority: '0.9', changefreq: 'daily'   },
  { url: `${BASE}/search`,   priority: '0.7', changefreq: 'weekly'  },
  { url: `${BASE}/under699`, priority: '0.8', changefreq: 'daily'   },
  { url: `${BASE}/about`,    priority: '0.4', changefreq: 'monthly' },
]

export async function GET() {
  const categories = await getCategories().catch(() => [])

  const catUrls = categories.map(c => ({
    url: `${BASE}/category/${encodeURIComponent(c.category)}`,
    priority: '0.8',
    changefreq: 'daily',
  }))

  const all = [...STATIC, ...catUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url>
    <loc>${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
  })
}
