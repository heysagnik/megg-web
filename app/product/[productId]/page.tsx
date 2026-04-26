import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, getRelatedProducts, getProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import ProductPageClient from '@/components/product/ProductPageClient'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ productId: string }>
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const product = await getProduct(productId).catch(() => null)

  if (!product) {
    return {
      title: 'Product — MEGG',
      description: 'Shop curated fashion on MEGG.',
    }
  }

  return {
    title: `${product.name} — MEGG`,
    description:
      product.description ??
      `Shop ${product.name} by ${product.brand} on MEGG.`,
    openGraph: {
      title: `${product.name} — MEGG`,
      description:
        product.description ??
        `Shop ${product.name} by ${product.brand} on MEGG.`,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { productId } = await params

  // Primary fetch — hard error becomes a 404
  let product: Product
  try {
    product = await getProduct(productId)
  } catch {
    notFound()
  }

  // Parallel secondary fetches — both are optional
  const [relatedResult, brandResult] = await Promise.all([
    getRelatedProducts(productId).catch((): Product[] => []),
    getProducts(1, 20, product.category).catch(
      (): { products: Product[] } => ({ products: [] }),
    ),
  ])

  // Deduplicate and trim brand products
  const brandProducts = (brandResult as { products: Product[] }).products
    .filter((bp) => bp.id !== product.id)
    .slice(0, 12)

  // Build the final related list; fall back to brand products when empty
  const relatedFiltered = (relatedResult as Product[]).filter(
    (p) => p.id !== product.id,
  )
  const relatedFinal =
    relatedFiltered.length > 0
      ? relatedFiltered.slice(0, 8)
      : brandProducts.slice(0, 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? `${product.name} by ${product.brand}`,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: parseFloat(product.price),
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
      <ProductPageClient
        product={product}
        related={relatedFinal}
        brandProducts={brandProducts}
      />
    </>
  )
}
