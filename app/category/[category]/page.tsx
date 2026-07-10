import type { Metadata } from 'next'
import { listProducts, genderFromSearchParams, type Gender } from '@/lib/api'
import { getCategoryDisplay } from '@/lib/utils'
import CategoryPageClient from './CategoryPageClient'

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Tshirt: [
    'men T-shirts online India', 'buy men T-shirts India', 'T-shirt for men',
    'men polo T-shirts India', 'men round neck T-shirts India', 'men V-neck T-shirts',
    'men cotton T-shirts online', 'best T-shirts for men India', 'men oversized T-shirts India',
    'affordable men T-shirts India', 'men graphic T-shirts India', 'men printed T-shirts India',
    'men T-shirts under 699', 'men T-shirts under 500', 'men plain T-shirts India',
    'men full sleeve T-shirts India', 'men half sleeve T-shirts India',
    'branded T-shirts for men India', 'men T-shirt new arrival India',
    'tshirt for men', 'mens tshirt online', 'boys T-shirt India',
  ],
  Shirt: [
    'men shirts online India', 'buy men shirts India', 'shirt for men',
    'men casual shirts online', 'men formal shirts India', 'men cotton shirts online',
    'men linen shirts India', 'men slim fit shirts India', 'men check shirts India',
    'men printed shirts India', 'men plain shirts India', 'men party wear shirts India',
    'affordable men shirts India', 'men shirts under 1000', 'men shirts under 699',
    'branded shirts for men India', 'men half sleeve shirts India',
    'men full sleeve shirts India', 'men denim shirts India',
    'shirt for boys India', 'mens shirt new arrival',
  ],
  Jeans: [
    'men jeans online India', 'buy men jeans India', 'jeans for men',
    'men slim fit jeans India', 'men skinny jeans India', 'men straight fit jeans India',
    'men stretch jeans online', 'best men jeans India', 'men ripped jeans India',
    'men blue jeans online', 'men black jeans India', 'men white jeans India',
    'affordable men jeans India', 'men jeans under 1000', 'men jeans under 699',
    'branded jeans for men India', 'men cargo jeans India', 'men baggy jeans India',
    'denim jeans for men India', 'boys jeans online India',
  ],
  Shoes: [
    'men shoes online India', 'buy men shoes India', 'shoes for men',
    'men sneakers online India', 'men casual shoes India', 'men formal shoes online',
    'men running shoes India', 'men white sneakers India', 'men sports shoes India',
    'best men shoes India', 'affordable men shoes India', 'men shoes under 1000',
    'men shoes under 699', 'men loafers India', 'men boots India',
    'branded shoes for men India', 'men shoes new arrival India',
    'mens footwear online India', 'boys shoes online India',
  ],
  Jacket: [
    'men jackets online India', 'buy men jackets India', 'jacket for men',
    'men bomber jacket India', 'men winter jackets India', 'men denim jacket India',
    'men windbreaker jacket India', 'men puffer jacket India', 'men leather jacket India',
    'best men jackets India', 'affordable men jackets India', 'men jackets under 1000',
    'men lightweight jacket India', 'men rain jacket India',
    'branded jackets for men India', 'boys jacket online India',
  ],
  Hoodies: [
    'men hoodies online India', 'buy men hoodies India', 'hoodie for men',
    'men pullover hoodies India', 'men zip hoodies India', 'men winter hoodies India',
    'best men hoodies India', 'affordable men hoodies India', 'men hoodies under 699',
    'men oversized hoodie India', 'men printed hoodies India', 'men plain hoodies India',
    'branded hoodies for men India', 'boys hoodies online India',
    'men hoodies under 1000', 'men hoodies new arrival',
  ],
  Sweatshirt: [
    'men sweatshirts online India', 'buy men sweatshirts India', 'sweatshirt for men',
    'men crew neck sweatshirts', 'men printed sweatshirts India', 'men plain sweatshirts India',
    'affordable men sweatshirts India', 'men sweatshirts under 699', 'men sweatshirts under 1000',
    'men oversized sweatshirts India', 'branded sweatshirts for men India',
  ],
  Sweater: [
    'men sweaters online India', 'buy men sweaters India', 'sweater for men',
    'men woollen sweaters India', 'men winter sweaters India', 'men knit sweaters online',
    'affordable men sweaters India', 'men sweaters under 1000', 'men cardigan India',
    'branded sweaters for men India',
  ],
  Trackpants: [
    'men track pants online India', 'buy men track pants India', 'track pants for men',
    'men joggers online India', 'men gym track pants India', 'men cotton track pants India',
    'affordable men joggers India', 'men joggers under 699', 'men track pants under 500',
    'men slim fit joggers India', 'branded track pants for men India',
    'boys joggers online India', 'men lower online India',
  ],
  'Mens Accessories': [
    'men accessories online India', 'buy men accessories India', 'accessories for men',
    'men belts online India', 'men wallets online India', 'men sunglasses India',
    'men caps online India', 'men watches India', 'men bracelets India',
    'affordable men accessories India', 'branded accessories for men India',
  ],
  Innerwear: [
    'men innerwear online India', 'buy men innerwear India', 'innerwear for men',
    'men briefs online India', 'men boxers online India', 'men trunks online India',
    'men gym innerwear India', 'affordable men underwear India', 'men vests online India',
    'branded innerwear for men India', 'men innerwear under 500',
  ],
  Perfume: [
    'men perfume online India', 'buy men perfume India', 'perfume for men',
    'men cologne India', 'best men fragrance India', 'affordable men perfume India',
    'men body spray India', 'men deodorant India', 'men perfume under 500',
    'branded perfume for men India', 'long lasting perfume for men India',
  ],
  Traditional: [
    'men ethnic wear online India', 'buy men kurta online India', 'kurta for men',
    'men traditional wear India', 'men kurta pyjama India', 'men sherwani online India',
    'men festive wear India', 'men wedding wear India', 'men pathani suit India',
    'branded kurta for men India', 'men ethnic wear under 1000',
  ],
  'Body Care': [
    'men body care products India', 'men grooming products online India', 'body care for men',
    'men moisturizer India', 'men face wash online India', 'affordable men body care India',
    'men skincare products India', 'men body lotion India', 'men grooming kit India',
    'best body care for men India',
  ],
  'Daily Essentials': [
    'men daily essentials online India', 'men grooming essentials India', 'daily essentials for men',
    'men everyday products India', 'affordable men essentials India',
    'men hygiene products India', 'men lifestyle products India',
  ],
}

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

  let description = `Shop curated ${name} for men online India on MEGG. Browse trending styles, top brands, new arrivals. Quality over quantity.`
  if (brands.length && minPrice !== null) {
    description = `Buy ${name} for men online India from ${brands.join(', ')} & more on MEGG. Starting Rs ${minPrice.toLocaleString('en-IN')}. Trending styles, new arrivals daily, fast delivery.`
  } else if (brands.length) {
    description = `Shop ${name} for men online India from ${brands.join(', ')} & more on MEGG. Curated picks, trending styles, new arrivals daily.`
  }

  const keywords = [
    ...(CATEGORY_KEYWORDS[slug] ?? [`men ${name.toLowerCase()} online India`, `buy ${name.toLowerCase()} India`]),
    ...brands.map(b => `${b} ${name.toLowerCase()} India`),
  ]

  return {
    title: `${name} for Men — Shop Online`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${name} for Men — Shop Online | MEGG`, description },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const sp = await searchParams;
  const slug = decodeURIComponent(category)
  const name = getCategoryDisplay(slug)
  const gender: Gender = genderFromSearchParams(sp);

  const data = await listProducts({ category: slug, page: 1, limit: 20, gender }).catch(() => ({
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
