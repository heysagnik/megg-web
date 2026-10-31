'use client'

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent as ReactPointerEvent } from 'react'

import type { Product } from '@/lib/api'
import { cn, formatPrice } from '@/lib/utils'
import { getCdnImageUrl } from '@/lib/image'

export interface ProductCardProps {
  product: Product
  fetchPriority?: 'high' | 'low' | 'auto'
  cardBgClass?: string
  aspectClass?: string
  /** Retained for call-site compatibility; image gestures are handled by the image viewport. */
  inStrip?: boolean
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

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const imageViewportRef = useRef<HTMLDivElement | null>(null)
  const mouseDragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })
  const hasSwiped = useRef(false)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current)
      }
    }
  }, [])
  const isHigh = fetchPriority === 'high'

  const handleImageScroll = () => {
    const viewport = imageViewportRef.current
    if (!viewport || viewport.clientWidth === 0 || images.length === 0) return

    const nextIndex = Math.max(
      0,
      Math.min(
        images.length - 1,
        Math.round(viewport.scrollLeft / viewport.clientWidth)
      )
    )

    setImgIdx((current) => (current === nextIndex ? current : nextIndex))
  }

  const handleImagePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Touch uses native browser scrolling; only handle mouse dragging here.
    if (e.pointerType !== 'mouse' || e.button !== 0 || !hasMultiple) return

    const viewport = imageViewportRef.current
    if (!viewport) return

    mouseDragRef.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: viewport.scrollLeft,
      moved: false,
    }

    hasSwiped.current = false
    setIsInteracting(true)

    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    viewport.setPointerCapture(e.pointerId)
  }

  const handleImagePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = mouseDragRef.current
    const viewport = imageViewportRef.current
    if (!drag.active || !viewport) return

    const deltaX = e.clientX - drag.startX
    if (Math.abs(deltaX) > 5) drag.moved = true

    if (drag.moved) {
      e.preventDefault()
      viewport.scrollLeft = drag.startScrollLeft - deltaX
    }
  }

  const finishImageDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = mouseDragRef.current
    const viewport = imageViewportRef.current
    if (!drag.active) return

    drag.active = false
    hasSwiped.current = drag.moved

    if (viewport?.hasPointerCapture(e.pointerId)) {
      viewport.releasePointerCapture(e.pointerId)
    }

    if (viewport && drag.moved && viewport.clientWidth > 0) {
      const index = Math.max(
        0,
        Math.min(
          images.length - 1,
          Math.round(viewport.scrollLeft / viewport.clientWidth)
        )
      )

      viewport.scrollTo({
        left: index * viewport.clientWidth,
        behavior: 'smooth',
      })
      setImgIdx(index)
    }

    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    touchTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
      hasSwiped.current = false
    }, 600)
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!hasSwiped.current) return
    e.preventDefault()
    e.stopPropagation()
    hasSwiped.current = false
  }

  const goToImage = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const viewport = imageViewportRef.current
    if (!viewport) return

    viewport.scrollTo({
      left: index * viewport.clientWidth,
      behavior: 'smooth',
    })
    setImgIdx(index)
  }

  return (
    <a
      href={`/product/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full cursor-pointer select-none uppercase tracking-normal text-black outline-none no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* Keep the original single image box; make that same box the horizontal viewport. */}
      {/* Preserve the original image box dimensions and clip slide overflow */}
<div
  className={cn(
    'relative w-full overflow-hidden',
    aspectClass,
    cardBgClass
  )}
>
  {/* 1. Scroller: slides only */}
  <div
    ref={imageViewportRef}
    onScroll={handleImageScroll}
    onPointerDown={handleImagePointerDown}
    onPointerMove={handleImagePointerMove}
    onPointerUp={finishImageDrag}
    onPointerCancel={finishImageDrag}
    className={cn(
      'absolute inset-y-0 left-0 -right-px flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain [&::-webkit-scrollbar]:hidden',
      hasMultiple && 'cursor-grab active:cursor-grabbing'
    )}
    style={{ scrollbarWidth: 'none' }}
  >
    {(images.length > 0 ? images : ['']).map((img, i) => {
      const isEager = isHigh && i === 0

      return (
        <div
          key={i}
          className="relative h-full shrink-0 snap-start overflow-hidden"
          style={{ flex: '0 0 100%' }}
        >
          {img ? (
            <img
              src={getCdnImageUrl(img)}
              alt={`${product.brand} ${product.name}`}
              width={800}
              height={1066}
              loading={isEager ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isHigh && i === 0 ? 'high' : 'auto'}
              className="pointer-events-none block h-full w-full object-cover"
              draggable={false}
            />
          ) : null}
        </div>
      )
    })}
  </div>

  {/* 2. Dash indicators: outside the scroller, so they stay in place */}
  {hasMultiple && (
    <div
      className={cn(
        'absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2 py-1 transition-opacity duration-300',
        hovered || isInteracting
          ? 'opacity-100'
          : 'pointer-events-none opacity-0'
      )}
    >
      {images.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to image ${i + 1}`}
          onClick={(e) => goToImage(i, e)}
          className="flex cursor-pointer items-center border-none bg-transparent p-0.5"
        >
          <span
            className={cn(
              'block h-[2px] rounded-full transition-all duration-300',
              i === imgIdx
                ? 'w-4 bg-black'
                : 'w-1.5 bg-black/35 hover:bg-black/60'
            )}
          />
        </button>
      ))}
    </div>
  )}
</div>

      {/* Product Details */}
      <div className="mt-2.5 w-full font-sans">
        <p className="mb-1 truncate text-[0.625rem] leading-none font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {product.brand}
        </p>

        <h3
          className="block w-full truncate text-[0.725rem] leading-[1.25] font-normal tracking-normal text-black uppercase md:text-[0.75rem]"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-1.5 overflow-hidden whitespace-nowrap">
          <span className="shrink-0 text-[0.725rem] leading-none font-medium tracking-normal text-black tabular-nums normal-case md:text-[0.75rem]">
            {formatPrice(product.price)}
          </span>
          {product.mrp && Number(product.mrp) > Number(product.price) && (
            <span className="shrink-0 text-[0.65rem] leading-none font-normal tracking-normal text-neutral-400 line-through tabular-nums">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
