'use client'

import type { Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import SectionHeader from '@/components/ui/SectionHeader'

interface TrendingStripProps {
  products: Product[]
}

export default function TrendingStrip({ products }: TrendingStripProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="pt-xl pb-xl overflow-hidden">
      {/* ── Container ── */}
      <div className="mx-auto max-w-[980px] px-[var(--container-px)]">
        <SectionHeader
          eyebrow="What everyone's wearing"
          title="Trending Now"
        />
      </div>

      {/* ── Scroll strip — bleeds past the container padding ── */}
      <div
        className="hide-scrollbar flex gap-[1rem] overflow-x-auto [scroll-snap-type:x_mandatory] py-[4px]"
        style={{
          paddingLeft:        'max(var(--container-px), calc((100vw - 980px) / 2 + var(--container-px)))',
          paddingRight:       'var(--container-px)',
        }}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="shrink-0 [scroll-snap-align:start]"
            style={{
              width:           'clamp(140px, 45vw, 280px)',
            }}
          >
            <ProductCard product={product} fetchPriority={i < 4 ? 'high' : 'auto'} />
          </div>
        ))}
      </div>
    </section>
  )
}
