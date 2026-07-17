import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api'
import ProductPageClient from '@/components/product/ProductPageClient'

type Props = { params: Promise<{ productId: string }> }

export const revalidate = 3600
export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const url = `https://www.meggfashion.in/product/${productId}`
  const product = await getProduct(productId).catch(() => null)
  if (!product) {
    return {
      title: 'Product',
      alternates: { canonical: url },
      robots: { index: true, follow: true },
    }
  }

  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price))
  const priceStr = !isNaN(price) ? `Rs ${price.toLocaleString('en-IN')}` : ''
  const brand = product.brand as string | undefined
  const cat = (product.category as string | undefined)?.toLowerCase() ?? 'clothing'

  // Full description for <meta name="description">
  const description = product.description?.trim()
    || `Buy ${product.name} by ${brand ?? ''}${priceStr ? ` at ${priceStr}` : ''} online India. Shop ${cat} for men on MEGG — curated fashion, top brands, fast delivery.`

  // Short punchy summary for OG/social sharing (always includes price)
  const ogDescription = [
    brand,
    priceStr,
    product.category,
  ].filter(Boolean).join(' · ')
    || description.slice(0, 150)

  const ogImageUrl = `${url}/opengraph-image`

  const subcat = (product.subcategory as string | undefined)?.toLowerCase() ?? ''
  const keywords = [
    product.name,
    ...(brand ? [
      `${brand} ${cat} India`, `buy ${brand} ${cat}`, `${brand} India`,
      `${brand} ${cat} online`, `${brand} men ${cat}`,
    ] : []),
    `buy ${product.name} online`, `buy ${product.name} online India`,
    `${cat} for men India`, `${cat} for men online India`,
    `men ${cat} online India`, `best ${cat} for men India`,
    ...(subcat ? [`men ${subcat} India`, `${subcat} for men online`] : []),
    ...(product.color ? [`${product.color} ${cat} for men`] : []),
    'curated men fashion MEGG', 'MEGG fashion',
  ].filter(Boolean) as string[]

  return {
    title: `${product.name} by ${product.brand}`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${product.name} by ${product.brand} — MEGG`,
      description: ogDescription,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: product.name as string }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@meggfashion',
      title: `${product.name} by ${product.brand} — MEGG`,
      description: ogDescription,
      images: [ogImageUrl],
    },
    other: {
      'product:price:amount': String(price),
      'product:price:currency': 'INR',
      'product:brand': brand ?? '',
      'product:availability': 'in stock',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params

  let product
  try {
    product = await getProduct(productId)
  } catch {
    notFound()
  }

  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price))
  const priceStr = !isNaN(price) ? ` at Rs ${price.toLocaleString('en-IN')}` : ''

  const canonicalUrl = `https://www.meggfashion.in/product/${productId}`
  const description = product.description?.trim()
    || `Buy ${product.name} by ${product.brand}${priceStr}. Curated men's fashion on MEGG — fast delivery.`

  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        description,
        sku: productId,
        brand: { '@type': 'Brand', name: product.brand },
        image: product.images,
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: product.affiliate_link ?? canonicalUrl,
          priceValidUntil,
          seller: { '@type': 'Organization', name: 'MEGG', url: 'https://www.meggfashion.in' },
        },
        category: product.category,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.meggfashion.in' },
          { '@type': 'ListItem', position: 2, name: product.category, item: `https://www.meggfashion.in/category/${encodeURIComponent(product.category)}` },
          { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  )
}
