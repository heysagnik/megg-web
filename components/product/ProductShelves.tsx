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
}

/**
 * Horizontal scroll-snap shelf of ProductCards.
 * Used below the fold for "More from {brand}". Bleeds past the container
 * padding the same way the homepage's TrendingStrip does, so cards don't
 * feel clipped against the page edge.
 */
export function HScrollShelf({ eyebrow, title, products }: ProductShelfProps) {
  if (!products.length) return null
  return (
    <Section className="border-t border-border-mid overflow-hidden">
      <div className="px-[var(--container-px)] max-w-[1280px] mx-auto">
        <SectionHeader eyebrow={eyebrow} title={title} />
      </div>
      <div
        className="hide-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-1 [scroll-snap-type:x_mandatory]"
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
            <ProductCard product={p} />
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
    <Section className="border-t border-border-mid">
      <div className="px-[var(--container-px)] max-w-[1280px] mx-auto">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className={PRODUCT_GRID_CLASS}>
          {products.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </Section>
  )
}
