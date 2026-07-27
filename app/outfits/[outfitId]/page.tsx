import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOutfit, getProductsByIds } from '@/lib/api'
import { collectionPageLd, SITE_URL } from '@/lib/seo/jsonld'
import JsonLd from '@/components/seo/JsonLd'
import { getCdnImageUrl } from '@/lib/image'
import ProductCard from '@/components/product/ProductCard'

type Props = { params: Promise<{ outfitId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { outfitId } = await params
  const url = `${SITE_URL}/outfits/${outfitId}`
  const outfit = await getOutfit(outfitId).catch(() => null)

  if (!outfit) {
    return {
      title: 'Outfit',
      description: 'A curated outfit look on MEGG.',
      alternates: { canonical: url },
    }
  }

  const description = `${outfit.name} — a curated men's fashion outfit on MEGG featuring ${outfit.product_ids?.length ?? 0} handpicked pieces.`
  const ogImage = outfit.model_image ? getCdnImageUrl(outfit.model_image) : `${SITE_URL}/opengraph-image`

  return {
    title: outfit.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${outfit.name} — MEGG`,
      description,
      images: [{ url: ogImage, width: 1200, height: 1500, alt: outfit.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@meggfashion',
      title: `${outfit.name} — MEGG`,
      description,
      images: [ogImage],
    },
  }
}

export default async function OutfitPage({ params }: Props) {
  const { outfitId } = await params
  const url = `${SITE_URL}/outfits/${outfitId}`

  let outfit
  try {
    outfit = await getOutfit(outfitId)
  } catch {
    notFound()
  }
  if (!outfit) notFound()

  const products = outfit.products?.length
    ? outfit.products
    : await getProductsByIds(outfit.product_ids || [])

  const jsonLd = collectionPageLd({
    url,
    name: `${outfit.name} — MEGG`,
    description: `${outfit.name} — a curated men's fashion outfit on MEGG.`,
    products: products.map(p => ({ id: p.id, name: p.name })),
    breadcrumb: [
      { name: 'Home', url: SITE_URL },
      { name: outfit.name, url },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="bg-white md:flex md:items-start">

        {/* Outfit banner — full-bleed on mobile, sticky column on desktop */}
        <div className="w-full md:w-[34%] lg:w-[32%] shrink-0 md:sticky md:top-0 md:h-screen">
          <div className="relative w-full h-full overflow-hidden bg-[#f2efea] aspect-[2/3] sm:aspect-[4/3] md:aspect-auto">
            {outfit.model_image ? (
              <img
                src={outfit.model_image}
                alt={outfit.name}
                width={1600}
                height={900}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover md:object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
                Image not available
              </div>
            )}
            {/* Subtle gradient for text legibility if overlaying elements later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Shop the look */}
        <div className="w-full md:w-[66%] lg:w-[68%] px-[var(--container-px)] py-12 md:py-16 lg:py-20 md:px-2xl">
          
          <p className="text-label text-muted uppercase tracking-[0.1em] mb-2">
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </p>
          <h1 className="text-section text-neutral-900 mb-lg">Shop This Look</h1>

          {products.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-200 rounded-sm">
              <p className="font-sans text-[0.85rem] text-muted tracking-[0.05em] uppercase">
                No products found for this outfit
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-10 sm:gap-y-14 md:gap-y-16">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} fetchPriority={i < 3 ? 'high' : 'auto'} />
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  )
}