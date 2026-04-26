import type { ReactNode } from 'react'
import type { Product } from '@/lib/api'
import CardSkeleton from '@/components/ui/CardSkeleton'
import ProductCard from './ProductCard'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProductGridProps {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  columns?: 2 | 3 | 4
  children?: ReactNode
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  columns = 3,
  children,
}: ProductGridProps) {
  // Map column count to a responsive CSS class defined in globals.css
  // 2 → product-grid-2  (2-col mobile → 3-col desktop)
  // 3 → product-grid-3  (2-col mobile → 3-col desktop)
  // 4 → product-grid-3  (same responsive behaviour, no 4-col on small screens)
  const gridClass = columns === 2 ? 'product-grid-2' : 'product-grid-3'

  // ── Loading state: no products yet → fill grid with shimmer skeletons ──
  if (loading && products.length === 0) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // ── Empty state: not loading, nothing to show → yield children slot ──
  if (products.length === 0 && !loading) {
    return <>{children}</>
  }

  // ── Populated grid ──
  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
