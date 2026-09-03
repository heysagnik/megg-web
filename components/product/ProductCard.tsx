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
  const [dragOffset, setDragOffset] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isHorizontalSwipe = useRef<boolean | null>(null)
  const hasSwiped = useRef(false)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const isHigh = fetchPriority === 'high'

  // Preload all images for this card once the user interacts with it
  const shouldPreloadAll = hovered || isTouching

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
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    isHorizontalSwipe.current = null
    hasSwiped.current = false
    setDragOffset(0)
    setIsTouching(true)
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!hasMultiple) return

    const deltaX = e.touches[0].clientX - touchStartPos.current.x
    const deltaY = e.touches[0].clientY - touchStartPos.current.y

    // Determine direction on first move
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) >= Math.abs(deltaX)) {
        // Vertical scroll — allow native browser scroll
        isHorizontalSwipe.current = false
        return
      }
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal image swipe
        isHorizontalSwipe.current = true
      }
    }

    if (isHorizontalSwipe.current === true) {
      hasSwiped.current = true
      // Rubber-band resistance at track boundaries
      const isAtFirst = imgIdx === 0 && deltaX > 0
      const isAtLast = imgIdx === images.length - 1 && deltaX < 0
      const damping = isAtFirst || isAtLast ? 0.3 : 1
      setDragOffset(deltaX * damping)
    }
  }

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current === true) {
      const threshold = 40
      if (dragOffset < -threshold) {
        // Swiped left -> next
        setImgIdx(prev => (prev === images.length - 1 ? prev : prev + 1))
      } else if (dragOffset > threshold) {
        // Swiped right -> prev
        setImgIdx(prev => (prev === 0 ? prev : prev - 1))
      }
    }

    setDragOffset(0)
    isHorizontalSwipe.current = null
    touchTimerRef.current = setTimeout(() => {
      setIsTouching(false)
      hasSwiped.current = false
    }, 1200)
  }

  const handleClick = (e: MouseEvent) => {
    if (hasSwiped.current) {
      e.preventDefault()
      e.stopPropagation()
      hasSwiped.current = false
    }
  }

  const showControls = hasMultiple && (hovered || isTouching)
  const isDragging = isHorizontalSwipe.current === true && dragOffset !== 0

  return (
    <a
      href={`/product/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full cursor-pointer uppercase tracking-normal text-black outline-none no-underline select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* Image container */}
      <div
        ref={containerRef}
        className={cn('relative w-full overflow-hidden', aspectClass, cardBgClass)}
      >
        {/* Sliding image track with GPU acceleration */}
        <div
          className={cn(
            'flex flex-row w-full h-full will-change-transform',
            isDragging
              ? 'transition-none'
              : 'transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
          )}
          style={{
            transform: `translate3d(calc(-${imgIdx * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {(images.length > 0 ? images : ['']).map((img, i) => {
            // Eagerly load primary image only for above-the-fold cards (isHigh)
            // Preload remaining images for this card once hovered or touched
            const isEager = (isHigh && i === 0) || shouldPreloadAll

            return (
              <div key={i} className="w-full h-full shrink-0 relative [contain:paint]">
                <img
                  src={getCdnImageUrl(img)}
                  alt={`${product.brand} ${product.name}`}
                  width={800}
                  height={1066}
                  loading={isEager ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={isHigh && i === 0 ? 'high' : 'auto'}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            )
          })}
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
                'absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 text-black/75 hover:text-black bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90',
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Minimal Right Chevron */}
            <button
              type="button"
              aria-label="Next image"
              onClick={handleNext}
              className={cn(
                'absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 text-black/75 hover:text-black bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90',
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Minimal Dash Indicators — Black, auto-hides when idle, tap/click jumps to slide */}
            <div
              className={cn(
                'absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 transition-opacity duration-300 py-1 px-2 rounded-full',
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImgIdx(i)
                  }}
                  className="p-0.5 bg-transparent border-none cursor-pointer flex items-center"
                >
                  <span
                    className={cn(
                      'block h-[2px] rounded-full transition-all duration-300',
                      i === imgIdx ? 'w-4 bg-black' : 'w-1.5 bg-black/35 hover:bg-black/60'
                    )}
                  />
                </button>
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
