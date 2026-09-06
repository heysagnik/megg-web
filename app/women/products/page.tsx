import type { Metadata } from 'next'
import ProductsContent, { productsMetadata } from '@/app/_gender/products'

export const revalidate = 600
export const dynamic = 'force-static'

export const metadata: Metadata = productsMetadata('women')

export default function WomenProductsPage() {
  return <ProductsContent gender="women" />
}
