import type { CSSProperties, ReactNode } from 'react'
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

// ─── Constants ─────────────────────────────────────────────────────────────────

const GRID_TEMPLATES: Record<2 | 3 | 4, string> = {
  2: 'repeat(2, 1fr)',
  3: 'repeat(3, 1fr)',
  4: 'repeat(4, 1fr)',
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  columns = 3,
  children,
}: ProductGridProps) {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: GRID_TEMPLATES[columns],
    gap: '1rem',
    width: '100%',
  }

  // ── Loading state: no products yet → fill grid with shimmer skeletons ──
  if (loading && products.length === 0) {
    return (
      <div style={gridStyle} aria-busy="true" aria-label="Loading products">
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
    <div style={gridStyle}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
