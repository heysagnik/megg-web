import { getCategories, listProducts, type ProductsResponse, type ScopeParams } from '@/lib/api'

const BASE = 'https://www.meggfashion.in'

const TODAY = new Date().toISOString().split('T')[0]

const SCOPE: ScopeParams = { gender: 'men' }

const STATIC = [
  { url: BASE,               priority: '1.0', changefreq: 'daily',   lastmod: TODAY },
  { url: `${BASE}/products`, priority: '0.9', changefreq: 'daily',   lastmod: TODAY },
  { url: `${BASE}/under699`, priority: '0.8', changefreq: 'daily',   lastmod: TODAY },
  { url: `${BASE}/about`,    priority: '0.4', changefreq: 'monthly', lastmod: TODAY },
  { url: `${BASE}/privacy`,  priority: '0.2', changefreq: 'yearly',  lastmod: TODAY },
  { url: `${BASE}/terms`,    priority: '0.2', changefreq: 'yearly',  lastmod: TODAY },
]

async function getAllProducts(): Promise<Array<ProductsResponse['products'][number]>> {
  const products: Array<ProductsResponse['products'][number]> = []
  let page = 1
  while (true) {
    const res = await listProducts({ page, limit: 100, gender: 'men' }).catch(() => null)
    if (!res?.products || res.products.length === 0) break
    products.push(...res.products)
    if (products.length >= (res.total ?? products.length)) break
    page++
  }
  return products
}

export async function GET() {
  const [categories, products] = await Promise.all([
    getCategories(SCOPE).catch(() => []),
    getAllProducts(),
  ])

  const catUrls = categories.map(c => ({
    url: `${BASE}/category/${encodeURIComponent(c.category)}`,
    priority: '0.8',
    changefreq: 'daily',
    lastmod: TODAY,
  }))

  const productUrls = products.map(p => ({
    url: `${BASE}/product/${p.id}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: TODAY,
  }))

  const all = [...STATIC, ...catUrls, ...productUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
  })
}
