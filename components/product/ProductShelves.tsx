'use client'

import type { Product } from '@/lib/api'
import { PRODUCT_GRID_CLASS } from '@/lib/constants'
import ProductCard from './ProductCard'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

export interface ProductShelfProps {
  eyebrow: string
  title: string
  products: Product[]
  cta?: string
  ctaTo?: string
}

/**
 * Horizontal scroll-snap shelf of ProductCards.
 * Used below the fold for "More from {brand}". Bleeds past the container
 * padding the same way the homepage's TrendingStrip does, so cards don't
 * feel clipped against the page edge. `compact` on the header keeps this
 * shelf visually secondary to the PDP's own product title above it.
 */
export function HScrollShelf({ eyebrow, title, products, cta, ctaTo }: ProductShelfProps) {
  if (!products.length) return null
  return (
    <Section className="overflow-hidden">
      <div className="px-[var(--container-px)] max-w-[1280px] mx-auto">
        <SectionHeader eyebrow={eyebrow} title={title} cta={cta} ctaTo={ctaTo} compact />
      </div>
      <div
        data-h-scroll
        className="hide-scrollbar flex gap-4 sm:gap-5 overflow-x-auto touch-pan-x pb-1 [scroll-snap-type:x_mandatory]"
        style={{
          paddingLeft:  'max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))',
          paddingRight: 'var(--container-px)',
        }}
      >
        {products.map(p => (
          <div
            key={p.id}
            className="shrink-0 [scroll-snap-align:start]"
            style={{ width: 'clamp(160px, 42vw, 300px)' }}
          >
            <ProductCard product={p} inStrip />
          </div>
        ))}
      </div>
    </Section>
  )
}

/**
 * 2/3-column grid shelf of ProductCards (max 12).
 * Used below the fold for "You May Also Like" recommendations. Shares
 * PRODUCT_GRID_CLASS with BrowseLayout so card size and gaps match exactly.
 */
export function GridShelf({ eyebrow, title, products }: ProductShelfProps) {
  if (!products.length) return null
  return (
    <Section>
      <div className="px-[var(--container-px)] max-w-[1280px] mx-auto">
        <SectionHeader eyebrow={eyebrow} title={title} compact />
        <div className={PRODUCT_GRID_CLASS}>
          {products.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </Section>
  )
}
