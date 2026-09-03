'use client'

import { useState, useRef } from 'react'
import type { MouseEvent, PointerEvent as ReactPointerEvent } from 'react'
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
  const [isInteracting, setIsInteracting] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const pointerStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isPointerDown = useRef(false)
  const maxDragDist = useRef(0)
  const isHorizontalSwipe = useRef<boolean | null>(null)
  const hasSwiped = useRef(false)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const isHigh = fetchPriority === 'high'

  // Preload all images for this card once the user interacts with it
  const shouldPreloadAll = hovered || isInteracting

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

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // Only primary mouse button (0) or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) return

    pointerStartPos.current = { x: e.clientX, y: e.clientY }
    maxDragDist.current = 0
    isPointerDown.current = true
    isHorizontalSwipe.current = null
    hasSwiped.current = false
    setDragOffset(0)
    setIsInteracting(true)
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDown.current || !hasMultiple) return

    const deltaX = e.clientX - pointerStartPos.current.x
    const deltaY = e.clientY - pointerStartPos.current.y
    const dist = Math.hypot(deltaX, deltaY)
    if (dist > maxDragDist.current) {
      maxDragDist.current = dist
    }

    // Determine direction on first move with 8px threshold
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) >= Math.abs(deltaX)) {
        // Vertical scroll — allow native browser scroll (for touch)
        isHorizontalSwipe.current = false
        return
      }
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal image swipe
        isHorizontalSwipe.current = true
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // ignore
        }
      }
    }

    if (isHorizontalSwipe.current === true) {
      // Rubber-band resistance at track boundaries
      const isAtFirst = imgIdx === 0 && deltaX > 0
      const isAtLast = imgIdx === images.length - 1 && deltaX < 0
      const damping = isAtFirst || isAtLast ? 0.3 : 1
      setDragOffset(deltaX * damping)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDown.current) return
    isPointerDown.current = false

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }

    if (isHorizontalSwipe.current === true) {
      const threshold = 35
      if (dragOffset < -threshold) {
        // Swiped left -> next
        setImgIdx(prev => (prev === images.length - 1 ? prev : prev + 1))
        hasSwiped.current = true
      } else if (dragOffset > threshold) {
        // Swiped right -> prev
        setImgIdx(prev => (prev === 0 ? prev : prev - 1))
        hasSwiped.current = true
      } else if (maxDragDist.current > 15) {
        // Noticeable drag that didn't cross threshold -> prevent accidental click
        hasSwiped.current = true
      } else {
        // Micro-movement (<15px) -> intentional click/tap
        hasSwiped.current = false
      }
    } else {
      hasSwiped.current = false
    }

    setDragOffset(0)
    isHorizontalSwipe.current = null
    touchTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
      hasSwiped.current = false
    }, 600)
  }

  const handleClick = (e: MouseEvent) => {
    if (hasSwiped.current) {
      e.preventDefault()
      e.stopPropagation()
      hasSwiped.current = false
    }
  }

  const showControls = hasMultiple && (hovered || isInteracting)
  const isDragging = isHorizontalSwipe.current === true && dragOffset !== 0

  return (
    <a
      href={`/product/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block w-full uppercase tracking-normal text-black outline-none no-underline select-none touch-pan-y',
        hasMultiple ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* Image container */}
      <div className={cn('relative w-full overflow-hidden', aspectClass, cardBgClass)}>
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

        <h3 className="text-[0.725rem] md:text-[0.75rem] font-normal leading-[1.3] text-black uppercase tracking-normal line-clamp-2 block w-full">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[0.725rem] md:text-[0.75rem] font-medium text-black tracking-normal normal-case tabular-nums leading-none">
            {formatPrice(product.price)}
          </span>
          {product.mrp && Number(product.mrp) > Number(product.price) && (
            <>
              <span className="text-[0.65rem] text-neutral-400 font-normal line-through tracking-normal tabular-nums leading-none">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-[0.625rem] text-[#ff3e6c] font-semibold tracking-normal uppercase leading-none">
                {Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  )
}
