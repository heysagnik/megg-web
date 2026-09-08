import Link from 'next/link'
import type { Gender, Product } from '@/lib/api'
import { genderPath } from '@/lib/genderPath'
import ProductCard from '@/components/product/ProductCard'

interface TrendingStripProps {
  products: Product[]
  gender: Gender
}

/**
 * Homepage "Trending Now" strip. Same scroll-snap track and card treatment
 * as the PDP's "More from {brand}" shelf, but with its own header at the
 * page's standard section-heading size — homepage sections are peers, with
 * no dominant element (like a PDP's product title) for this one to defer to.
 */
export default function TrendingStrip({ products, gender }: TrendingStripProps) {
  if (!products.length) return null
  return (
    <section className="pt-xl pb-xl overflow-hidden">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)]">
        <div className="flex items-end justify-between mb-lg gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-label text-muted">What Everyone&apos;s Wearing</span>
            <h2 className="text-section">Trending Now</h2>
          </div>
          <Link
            href={`${genderPath(gender, '/products')}?sort=popular`}
            className="text-label text-muted hover:text-black transition-colors whitespace-nowrap pb-0.5"
          >
            View All
          </Link>
        </div>

        <div
          data-h-scroll
          className="hide-scrollbar flex gap-3 sm:gap-6 overflow-x-auto touch-pan-x snap-x snap-mandatory py-1 -mx-[var(--container-px)] px-[var(--container-px)]"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[150px] xs:w-[165px] sm:w-[220px] md:w-[250px] lg:w-[270px] shrink-0 snap-start"
            >
              <ProductCard product={product} fetchPriority="auto" inStrip />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
