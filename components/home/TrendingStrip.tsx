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
    <section
      style={{
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
        overflow: 'hidden',
      }}
    >
      {/* ── Hide scrollbar cross-browser ── */}
      <style>{`
        .trending-scroll-row {
          scrollbar-width: none;
        }
        .trending-scroll-row::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ── Container ── */}
      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '0 var(--container-px)',
        }}
      >
        <SectionHeader
          eyebrow="What everyone's wearing"
          title="Trending Now"
        />
      </div>

      {/* ── Scroll strip — bleeds past the container padding ── */}
      <div
        className="trending-scroll-row"
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          /*
           * We deliberately go full-bleed so the strip feels editorial rather
           * than boxed. paddingLeft aligns the first card with the content grid.
           */
          paddingLeft: 'max(var(--container-px), calc((100vw - 980px) / 2 + var(--container-px)))',
          paddingRight: 'var(--container-px)',
          paddingBottom: '4px', /* tiny room so card box-shadows aren't clipped */
        }}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            style={{
              flexShrink: 0,
              width: 'clamp(140px, 45vw, 280px)',
              scrollSnapAlign: 'start',
            }}
          >
            <ProductCard product={product} fetchPriority={i < 4 ? 'high' : 'auto'} />
          </div>
        ))}
      </div>
    </section>
  )
}
