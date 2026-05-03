import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api'
import ProductPageClient from '@/components/product/ProductPageClient'

type Props = { params: Promise<{ productId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const product = await getProduct(productId).catch(() => null)
  if (!product) return { title: 'Product — MEGG' }

  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price))
  const priceStr = !isNaN(price) ? ` at ₹${price.toLocaleString('en-IN')}` : ''
  const description = product.description?.trim()
    || `Buy ${product.name} by ${product.brand}${priceStr}. Curated men's fashion on MEGG — fast delivery.`

  const url = `https://www.meggfashion.in/product/${productId}`
  return {
    title: `${product.name} by ${product.brand} | MEGG`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${product.name} by ${product.brand} | MEGG`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} by ${product.brand} | MEGG`,
      description,
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
  const priceStr = !isNaN(price) ? ` at ₹${price.toLocaleString('en-IN')}` : ''

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
