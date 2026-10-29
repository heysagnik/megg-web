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
 * page's standard section-heading size â€” homepage sections are peers, with
 * no dominant element (like a PDP's product title) for this one to defer to.
 */
export default function TrendingStrip({ products, gender }: TrendingStripProps) {
  if (!products.length) return null
  return (
    <section className="w-full min-w-0 overflow-hidden pt-xl pb-xl">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="relative mb-lg px-[var(--container-px)]">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-label text-muted">
              What Everyone&apos;s Wearing
            </span>
            <h2 className="text-section">Trending Now</h2>
          </div>
          <Link
            href={`${genderPath(gender, '/products')}?sort=popular`}
            className="hidden sm:inline-block absolute right-[var(--container-px)] top-1/2 -translate-y-1/2 text-label text-muted transition-colors hover:text-black whitespace-nowrap"
          >
            View All
          </Link>
        </div>


        <div className="px-[calc(var(--container-px)_+_0.5rem)] md:mx-[25px] md:px-2">
          <div
            data-h-scroll
            className="hide-scrollbar flex min-w-0 gap-3 sm:gap-6 overflow-x-auto touch-pan-x snap-x snap-mandatory py-1"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[150px] xs:w-[165px] sm:w-[220px] md:w-[calc((100%_-_6rem)_/_5)] shrink-0 snap-start"
              >
                <ProductCard product={product} fetchPriority="auto" inStrip />
              </div>
            ))}
            <Link
              href={`${genderPath(gender, '/products')}?sort=popular`}
              aria-label="Explore all trending products"
              className="group flex w-12 shrink-0 snap-start items-center justify-center self-stretch sm:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-black transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
