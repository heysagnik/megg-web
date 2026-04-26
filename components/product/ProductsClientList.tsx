'use client'

import { useCallback } from 'react'
import { getProducts, type Product } from '@/lib/api'
import InfiniteProducts from './InfiniteProducts'
import { Container } from '@/components/ui'

const PAGE_SIZE = 20

interface ProductsClientListProps {
  category: string
  initialProducts: Product[]
}

export default function ProductsClientList({
  category,
  initialProducts,
}: ProductsClientListProps) {
  const fetchMore = useCallback(
    async (page: number) => {
      const res = await getProducts(page, PAGE_SIZE, category || undefined)
      const products = res.products ?? []
      return {
        products,
        hasMore: products.length === PAGE_SIZE,
      }
    },
    [category],
  )

  return (
    <Container
      style={{
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-3xl)',
      }}
    >
      <InfiniteProducts
        initialProducts={initialProducts}
        fetchMore={fetchMore}
        pageSize={PAGE_SIZE}
        columns={3}
      />
    </Container>
  )
}
