'use client'

import { useState, useRef } from 'react'
import type { MouseEvent, TouchEvent } from 'react'
import type { Product } from '@/lib/api'
import { cn, formatPrice } from '@/lib/utils'
import { getCdnImageUrl } from '@/lib/image'

export interface ProductCardProps {
  product: Product
  fetchPriority?: 'high' | 'low' | 'auto'
  cardBgClass?: string
  aspectClass?: string
}

export default function ProductCard({
  product,
  fetchPriority = 'auto',
  cardBgClass = 'bg-[#f2efea]',
  aspectClass = 'aspect-[3/4]',
}: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const currentImage = images[imgIdx] || images[0] || ''
  const isHigh = fetchPriority === 'high'

  const handlePrev = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsTouching(true)
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        setImgIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))
      } else {
        setImgIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))
      }
    }
    touchTimerRef.current = setTimeout(() => setIsTouching(false), 1200)
  }

  const showControls = hasMultiple && (hovered || isTouching)

  return (
    <a
      href={`/product/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full cursor-pointer uppercase tracking-normal text-black outline-none no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* Image container */}
      <div className={cn('relative w-full overflow-hidden', aspectClass, cardBgClass)}>
        {/* Sliding image track */}
        <div
          className="flex flex-row w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${imgIdx * 100}%)` }}
        >
          {(images.length > 0 ? images : ['']).map((img, i) => (
            <div key={i} className="w-full h-full shrink-0 relative">
              <img
                src={getCdnImageUrl(img)}
                alt={`${product.brand} ${product.name}`}
                width={800}
                height={1066}
                loading={isHigh && i === 0 ? 'eager' : 'lazy'}
                decoding={isHigh && i === 0 ? 'sync' : 'async'}
                fetchPriority={isHigh && i === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Minimal Hover / Carousel Controls */}
        {hasMultiple && (
          <>
            {/* Minimal Left Chevron */}
            <button
              type="button"
              aria-label="Previous image"
              onClick={handlePrev}
              className={cn(
                'absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1 text-black bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95',
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-0',
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Minimal Right Chevron */}
            <button
              type="button"
              aria-label="Next image"
              onClick={handleNext}
              className={cn(
                'absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1 text-black bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95',
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-0',
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Minimal Dash Indicators — Black colored, auto-hides when mouse leaves */}
            <div
              className={cn(
                'absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 transition-opacity duration-300 pointer-events-none',
                showControls ? 'opacity-100' : 'opacity-0',
              )}
            >
              {images.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-[2px] transition-all duration-300',
                    i === imgIdx ? 'w-3.5 bg-black' : 'w-1 bg-black/35',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-2.5 w-full font-sans">
        <p className="text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-neutral-500 mb-1 leading-none">
          {product.brand}
        </p>

        <h3 className="text-[0.725rem] md:text-[0.75rem] font-normal leading-[1.25] text-black uppercase tracking-normal truncate block w-full">
          {product.name}
        </h3>

        <p className="mt-1 text-[0.725rem] md:text-[0.75rem] font-medium text-black tracking-normal normal-case tabular-nums">
          {formatPrice(product.price)}
        </p>
      </div>
    </a>
  )
}
