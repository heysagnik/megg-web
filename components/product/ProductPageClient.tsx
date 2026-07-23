'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ProductDetail, ProductVariant } from '@/lib/api'
import { cn } from '@/lib/utils'
import { getCdnImageUrl } from '@/lib/image'
import { trackProductClick } from '@/lib/trackClick'

import MobileCarousel from './MobileCarousel'
import ScrollProgressStrip from './ScrollProgressStrip'
import VariantSelector from './VariantSelector'
import BuyButton from './BuyButton'
import Accordion from './Accordion'
import DetailRow from './DetailRow'
import { InlineShareButton } from './ShareButton'
import { HScrollShelf, GridShelf } from './ProductShelves'

// ── Layout class constants (kept here, not in lib, because they only apply
//    to this component's specific 2-column / sticky / carousel arrangement).
const LAYOUT_CLASS          = 'flex flex-col md:flex-row md:items-start bg-white'
const IMAGES_DESKTOP_CLASS  = 'hidden md:flex md:w-1/2 md:flex-row'
const IMAGES_MOBILE_CLASS   = 'flex flex-row overflow-x-auto hide-scrollbar snap-x snap-mandatory w-full'
const INFO_PANEL_CLASS       = 'w-full md:w-1/2 md:sticky md:top-0 md:h-[100svh] md:flex md:items-center md:justify-center md:border-l md:border-border md:overflow-y-auto border-t md:border-t-0 border-border'
const INFO_INNER_CLASS       = 'w-full md:w-[72%] py-0 md:py-lg px-[var(--container-px)] md:px-0 mt-lg md:mt-0 lg:max-w-[90%]'

export interface ProductPageClientProps {
  product: ProductDetail
}

export interface ProductPageClientProps {
  product: ProductDetail
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null)
  const [activeSize, setActiveSize]       = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])

  const images = (activeVariant ? activeVariant.images : product.images).filter(Boolean)
  const variants        = product.variants        ?? []
  const moreFromBrand   = product.more_from_brand ?? []
  const recommended     = product.recommended     ?? []

  // Price/discount maths — kept inline for readability (3 lines > a helper).
  const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0))
  const numericMrp   = product.mrp ? (typeof product.mrp === 'number' ? product.mrp : parseFloat(String(product.mrp))) : 0
  const hasDiscount  = numericMrp > numericPrice
  const discountPct  = hasDiscount ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100) : 0
  const price   = `Rs. ${numericPrice.toLocaleString('en-IN')}`
  const mrpStr  = hasDiscount ? `Rs. ${numericMrp.toLocaleString('en-IN')}` : ''

  // Reset state + track view on product change.
  useEffect(() => {
    window.scrollTo(0, 0)
    setScrollProgress(0)
    setActiveVariant(null)
    setActiveSize(null)
    void trackProductClick(product.id, { source: 'web-direct' })
  }, [product.id])

  // Preload non-first images for snappier carousel/scroll.
  useEffect(() => {
    images.forEach((src: string, i: number) => {
      if (i === 0) return
      const link = document.createElement('link')
      link.rel  = 'preload'
      link.as   = 'image'
      link.href = getCdnImageUrl(src)
      document.head.appendChild(link)
    })
  }, [images])

  // Desktop scroll progress strip mapping.
  const setImgRef = useCallback((el: HTMLDivElement | null, i: number) => {
    imgRefs.current[i] = el
  }, [])

  useEffect(() => {
    const n = images.length
    const handleScroll = () => {
      const first = imgRefs.current[0]
      if (!first) return
      const containerTop = first.getBoundingClientRect().top + window.scrollY
      const progress = (window.scrollY - containerTop) / window.innerHeight
      setScrollProgress(Math.max(0, Math.min(n, progress)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [product.id, images.length])

  return (
    <>
      <article className={LAYOUT_CLASS}>

        {/* MOBILE: swipeable image carousel */}
        <MobileCarousel
          images={images}
          productName={product.name as string}
          productBrand={product.brand as string}
          price={price}
          activeVariantId={activeVariant?.id ?? null}
          imagesMobileClasses={IMAGES_MOBILE_CLASS}
        />

        {/* DESKTOP: left image stack + progress strip */}
        <div className={IMAGES_DESKTOP_CLASS}>
          <div className="hidden md:flex">
            <ScrollProgressStrip count={images.length} progress={scrollProgress} />
          </div>
          <div className="flex-1">
            {images.map((img: string, i: number) => (
              <div
                key={`${activeVariant?.id ?? 'base'}-${i}`}
                ref={el => setImgRef(el, i)}
                className="h-[100svh] relative overflow-hidden bg-surface-2"
              >
                <img
                  src={getCdnImageUrl(img)}
                  alt={`${product.name} — view ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: sticky info panel */}
        <div className={INFO_PANEL_CLASS}>
          <div className={INFO_INNER_CLASS}>

            <p className="font-sans text-xs font-semibold tracking-widest text-muted uppercase mb-1">
              {product.brand}
            </p>

            <h1 className="font-sans font-normal text-black leading-[1.25] tracking-tight uppercase mb-[0.75rem] text-[clamp(1.1rem,1.5vw,1.4rem)]">
              {product.name}
            </h1>

            {/* Price + inline share */}
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-baseline gap-sm flex-wrap">
                <p className="font-sans text-[1.4rem] font-medium text-black -tracking-[0.01em] tabular-nums">
                  {price}
                </p>
                {hasDiscount && (
                  <>
                    <div className="relative inline-block">
                      <p className="font-sans text-base text-muted -tracking-[0.01em] tabular-nums">{mrpStr}</p>
                      <div className="absolute top-1/2 left-[-5%] w-[110%] h-[1.5px] -rotate-12 text-muted bg-current" />
                    </div>
                    <p className="font-sans text-[0.875rem] text-[#ff3e6c] font-semibold tracking-[0.02em] uppercase">
                      ({discountPct}% OFF)
                    </p>
                  </>
                )}
              </div>
              <div className="hidden md:block">
                <InlineShareButton name={product.name as string} brand={product.brand as string} price={price} />
              </div>
            </div>

            {/* Category/subcategory tags */}
            {(product.category || product.subcategory) && (
              <div className="flex gap-[0.4rem] flex-wrap mb-sm">
                {[product.category, product.subcategory].filter(Boolean).map(tag => (
                  <span
                    key={tag}
                    className="font-sans text-[0.7rem] tracking-[0.1em] uppercase text-muted border border-border-mid py-[0.2rem] px-[0.6rem]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <VariantSelector
              variants={variants}
              activeId={activeVariant?.id ?? null}
              onSelect={v => setActiveVariant(prev => (prev?.id === v.id ? null : v))}
            />

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-sm">
                <div className="flex justify-between items-center mb-[0.6rem]">
                  <p className="font-sans text-[0.7rem] tracking-wider uppercase text-muted">Sizes</p>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {product.sizes.map((size: { label: string; available?: boolean }, i: number) => {
                    const isSelected = activeSize === size.label
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => size.available && setActiveSize(size.label)}
                        className={cn(
                          'flex items-center justify-center min-w-10 py-[0.4rem] px-[0.8rem]',
                          'font-sans text-xs transition-all border',
                          isSelected
                            ? 'border-black text-white bg-black font-medium'
                            : size.available
                              ? 'border-border-mid text-black bg-surface font-medium'
                              : 'border-dashed border-muted text-muted bg-surface-2 font-normal opacity-60',
                          size.available ? 'cursor-pointer' : 'cursor-not-allowed',
                        )}
                        title={size.available ? `Size ${size.label} is available` : `Size ${size.label} is out of stock`}
                      >
                        {size.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Accordions */}
            {product.description && (
              <Accordion label="Description">
                <p className="uppercase">{product.description}</p>
              </Accordion>
            )}

            {(Array.isArray(product.fabric) && product.fabric.length > 0 || product.color) && (
              <Accordion label="Details">
                <div className="flex flex-col gap-1">
                  {product.color && <DetailRow label="Colour" value={product.color} />}
                  {Array.isArray(product.fabric) && product.fabric.length > 0 && (
                    <DetailRow label="Fabric" value={product.fabric!.join(', ')} />
                  )}
                  {product.subcategory && <DetailRow label="Style" value={product.subcategory} />}
                </div>
              </Accordion>
            )}

            <Accordion label="Delivery & Returns">
              <p>Delivery and returns are managed by the respective store. Megg is not responsible for shipping, returns, or any related issues.</p>
            </Accordion>

            <div className="border-t border-border-mid" />

            <BuyButton
              href={product.affiliate_link}
              onClick={() => void trackProductClick(product.id, { source: 'web-pdp', affiliateClicked: true })}
            />

            <p className="font-sans text-muted text-center text-xs mt-[0.6rem] uppercase tracking-wide leading-[1.5]">
              You'll be redirected to the brand's website
            </p>
          </div>
        </div>
      </article>

      {/* Below-fold shelves */}
      <HScrollShelf eyebrow="Same brand" title={`More from ${product.brand}`} products={moreFromBrand} />
      <GridShelf eyebrow="Picked for you" title="You May Also Like" products={recommended} />
    </>
  )
}
