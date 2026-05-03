import type { Metadata } from 'next'
import { listProducts } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import CategoryPageClient from './CategoryPageClient'

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Tshirt: [
    'men T-shirts online India', 'buy men T-shirts India', 'men polo T-shirts India',
    'men round neck T-shirts India', 'men cotton T-shirts online', 'best T-shirts for men India',
    'affordable men T-shirts India', 'men graphic T-shirts India', 'men T-shirts under 699',
  ],
  Shirt: [
    'men shirts online India', 'buy men shirts India', 'men casual shirts online',
    'men formal shirts India', 'men cotton shirts online', 'men linen shirts India',
    'men slim fit shirts India', 'affordable men shirts India', 'men shirts under 1000',
  ],
  Jeans: [
    'men jeans online India', 'buy men jeans India', 'men slim fit jeans India',
    'men skinny jeans India', 'men stretch jeans online', 'best men jeans India',
    'men blue jeans online', 'men black jeans India', 'affordable men jeans India',
  ],
  Shoes: [
    'men shoes online India', 'buy men shoes India', 'men sneakers online India',
    'men casual shoes India', 'men formal shoes online', 'men running shoes India',
    'best men shoes India', 'affordable men shoes India', 'men white sneakers India',
  ],
  Jacket: [
    'men jackets online India', 'buy men jackets India', 'men bomber jacket India',
    'men winter jackets India', 'men denim jacket India', 'men windbreaker jacket India',
    'best men jackets India', 'affordable men jackets India', 'men lightweight jacket India',
  ],
  Hoodies: [
    'men hoodies online India', 'buy men hoodies India', 'men pullover hoodies India',
    'men zip hoodies India', 'men winter hoodies India', 'best men hoodies India',
    'affordable men hoodies India', 'men oversized hoodie India', 'men hoodies under 699',
  ],
  Sweatshirt: [
    'men sweatshirts online India', 'buy men sweatshirts India', 'men crew neck sweatshirts',
    'men printed sweatshirts India', 'affordable men sweatshirts India', 'men sweatshirts under 699',
  ],
  Sweater: [
    'men sweaters online India', 'buy men sweaters India', 'men woollen sweaters India',
    'men winter sweaters India', 'men knit sweaters online', 'affordable men sweaters India',
  ],
  Trackpants: [
    'men track pants online India', 'buy men track pants India', 'men joggers online India',
    'men gym track pants India', 'men cotton track pants India', 'affordable men joggers India',
  ],
  'Mens Accessories': [
    'men accessories online India', 'buy men accessories India', 'men belts online India',
    'men wallets online India', 'men sunglasses India', 'men caps online India',
    'affordable men accessories India',
  ],
  Innerwear: [
    'men innerwear online India', 'buy men innerwear India', 'men briefs online India',
    'men boxers online India', 'men gym innerwear India', 'affordable men underwear India',
  ],
  Perfume: [
    'men perfume online India', 'buy men perfume India', 'men cologne India',
    'best men fragrance India', 'affordable men perfume India', 'men body spray India',
  ],
  Traditional: [
    'men ethnic wear online India', 'buy men kurta online India', 'men traditional wear India',
    'men kurta pyjama India', 'men sherwani online India', 'men festive wear India',
  ],
  'Body Care': [
    'men body care products India', 'men grooming products online India',
    'men moisturizer India', 'men face wash online India', 'affordable men body care India',
  ],
  'Daily Essentials': [
    'men daily essentials online India', 'men grooming essentials India',
    'men everyday products India', 'affordable men essentials India',
  ],
}

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const url = `https://www.meggfashion.in/category/${encodeURIComponent(slug)}`

  const data = await listProducts({ category: slug, page: 1, limit: 6 }).catch(() => ({
    products: [],
    total: 0,
  }))

  const products = data.products ?? []
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].slice(0, 3)
  const prices = products.map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price))).filter(n => !isNaN(n))
  const minPrice = prices.length ? Math.min(...prices) : null

  let description = `Shop curated ${name} for men on MEGG.`
  if (brands.length && minPrice !== null) {
    description = `Shop ${name} from ${brands.join(', ')} and more. Starting at ₹${minPrice.toLocaleString('en-IN')}. Trending styles, fast delivery.`
  } else if (brands.length) {
    description = `Shop ${name} from ${brands.join(', ')} and more on MEGG. Curated picks, trending styles.`
  }

  const keywords = [
    ...(CATEGORY_KEYWORDS[slug] ?? [`men ${name.toLowerCase()} online India`, `buy ${name.toLowerCase()} India`]),
    ...brands.map(b => `${b} ${name.toLowerCase()} India`),
  ]

  return {
    title: `${name} for Men — Shop Online | MEGG`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${name} for Men — MEGG`, description },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)

  const data = await listProducts({ category: slug, page: 1, limit: 20 }).catch(() => ({
    products: [],
    total: 0,
    availableFilters: { subcategories: [], colors: [], brands: [], categories: [] },
  }))

  const products = data.products ?? []
  const categoryUrl = `https://www.meggfashion.in/category/${encodeURIComponent(slug)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${name} for Men — MEGG`,
        url: categoryUrl,
        description: `Shop curated ${name} for men on MEGG.`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.slice(0, 10).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.meggfashion.in/product/${p.id}`,
            name: p.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.meggfashion.in' },
          { '@type': 'ListItem', position: 2, name, item: categoryUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryPageClient
        category={slug}
        displayName={name}
        initialProducts={data.products ?? []}
        total={data.total ?? 0}
        availableFilters={data.availableFilters ?? { subcategories: [], colors: [], brands: [], categories: [] }}
      />
    </>
  )
}
