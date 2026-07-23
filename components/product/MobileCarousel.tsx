'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getCdnImageUrl } from '@/lib/image'
import { DesktopShareButton } from './ShareButton'

export interface MobileCarouselProps {
  images: string[]
  productName: string
  productBrand: string
  price: string
  activeVariantId: string | null
  imagesMobileClasses: string
}

/**
 * Mobile-only horizontal swipe image carousel for the PDP.
 * - Uses CSS scroll-snap (no JS positioning math).
 * - Syncs index via scroll position; syncs back to top on variant change.
 * - Reuses the desktop share button in the top-right corner.
 */
export default function MobileCarousel({
  images,
  productName,
  productBrand,
  price,
  activeVariantId,
  imagesMobileClasses,
}: MobileCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIdx(idx)
  }, [])

  useEffect(() => {
    setActiveIdx(0)
    const el = scrollRef.current
    if (el) el.scrollLeft = 0
  }, [activeVariantId])

  if (!images.length) return null

  return (
    <div className="md:hidden relative w-full">
      <div
        ref={scrollRef}
        className={imagesMobileClasses}
        onScroll={handleScroll}
      >
        {images.map((img, i) => (
          <div
            key={`m-${activeVariantId ?? 'base'}-${i}`}
            className="w-full shrink-0 relative bg-surface-2 aspect-[3/4] [scroll-snap-align:start]"
          >
            <img
              src={getCdnImageUrl(img)}
              alt={`${productName} — view ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="absolute inset-0 w-full h-full object-cover object-[center_top] select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Ultra-minimal Zara-style image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white font-mono text-[0.625rem] tracking-[0.16em] uppercase pointer-events-none select-none">
          {activeIdx + 1} / {images.length}
        </div>
      )}

      <DesktopShareButton name={productName} brand={productBrand} price={price} />
    </div>
  )
}
