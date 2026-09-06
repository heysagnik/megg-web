import { getCategories, listProducts, type Gender, type ProductsResponse } from '@/lib/api'
import { genderPath } from '@/lib/genderPath'

const BASE = 'https://www.meggfashion.in'
const GENDERS: Gender[] = ['men', 'women']

const TODAY = new Date().toISOString().split('T')[0]

const STATIC = [
  { url: `${BASE}/about`,   priority: '0.4', changefreq: 'monthly', lastmod: TODAY },
  { url: `${BASE}/privacy`, priority: '0.2', changefreq: 'yearly',  lastmod: TODAY },
  { url: `${BASE}/terms`,   priority: '0.2', changefreq: 'yearly',  lastmod: TODAY },
]

function genderStatic(gender: Gender) {
  return [
    { url: `${BASE}${genderPath(gender)}`,             priority: '1.0', changefreq: 'daily', lastmod: TODAY },
    { url: `${BASE}${genderPath(gender, '/products')}`, priority: '0.9', changefreq: 'daily', lastmod: TODAY },
    { url: `${BASE}${genderPath(gender, '/under699')}`, priority: '0.8', changefreq: 'daily', lastmod: TODAY },
  ]
}

async function getAllProducts(gender: Gender): Promise<Array<ProductsResponse['products'][number]>> {
  const products: Array<ProductsResponse['products'][number]> = []
  let page = 1
  while (true) {
    const res = await listProducts({ page, limit: 100, gender }).catch(() => null)
    if (!res?.products || res.products.length === 0) break
    products.push(...res.products)
    if (products.length >= (res.total ?? products.length)) break
    page++
  }
  return products
}

export const dynamic = 'force-static'
export const revalidate = 86400

export async function GET() {
  const perGender = await Promise.all(
    GENDERS.map(async (gender) => {
      const [categories, products] = await Promise.all([
        getCategories({ gender }).catch(() => []),
        getAllProducts(gender),
      ])

      const catUrls = categories.map(c => {
        const name = typeof c === 'string' ? c : (c as unknown as { category: string }).category
        return {
          url: `${BASE}${genderPath(gender, `/category/${encodeURIComponent(name)}`)}`,
          priority: '0.8',
          changefreq: 'daily',
          lastmod: TODAY,
        }
      })

      const productUrls = products.map(p => ({
        url: `${BASE}/product/${p.id}`,
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: TODAY,
      }))

      return [...genderStatic(gender), ...catUrls, ...productUrls]
    }),
  )

  // Product URLs aren't gender-nested, so de-dupe across the two passes.
  const seen = new Set<string>()
  const all = [...STATIC, ...perGender.flat()].filter(u => {
    if (seen.has(u.url)) return false
    seen.add(u.url)
    return true
  })

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
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
