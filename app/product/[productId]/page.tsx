import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api'
import ProductPageClient from '@/components/product/ProductPageClient'

type Props = { params: Promise<{ productId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const product = await getProduct(productId).catch(() => null)
  if (!product) return { title: 'Product — MEGG' }

  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} by ${product.brand} on MEGG.`,
    openGraph: {
      type: 'website',
      url: `https://meggfashion.in/product/${productId}`,
      title: `${product.name} — MEGG`,
      description: product.description ?? `Shop ${product.name} by ${product.brand} on MEGG.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — MEGG`,
      description: product.description ?? `Shop ${product.name} by ${product.brand} on MEGG.`,
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

  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? `${product.name} by ${product.brand}`,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.images,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: product.affiliate_link,
    },
    category: product.category,
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
