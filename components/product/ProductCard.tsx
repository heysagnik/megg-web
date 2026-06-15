'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { CSSProperties, MouseEvent, UIEvent } from 'react'
import type { Product } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { getCdnImageUrl, getProductSrcSet } from '@/lib/image'

// ─── Internal: Chevron Button ──────────────────────────────────────────────────

const CAROUSEL_GAP = 2;


interface ChevronButtonProps {
  dir: 'left' | 'right'
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function ChevronButton({ dir, onClick }: ChevronButtonProps) {
  const style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    [dir]: '10px',
    transform: 'translateY(-50%)',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    color: 'var(--color-black)',
    animation: 'card-fade-in 180ms ease both',
    backdropFilter: 'none',
  }

  return (
    <button
      type="button"
      aria-label={dir === 'left' ? 'Previous image' : 'Next image'}
      onClick={onClick}
      style={style}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {dir === 'left' ? (
          <polyline
            points="13 4 7 10 13 16"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points="7 4 13 10 7 16"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

// ─── Internal: Dot Indicators ──────────────────────────────────────────────────

interface DotIndicatorsProps {
  count: number
  active: number
}

function DotIndicators({ count, active }: DotIndicatorsProps) {
  const wrapStyle: CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 2,
    animation: 'card-fade-in 180ms ease both',
  }

  return (
    <div style={wrapStyle} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '3px',
            width: i === active ? '12px' : '3px',
            borderRadius: '999px',
            background: 'var(--color-black)',
            opacity: i === active ? 0.75 : 0.35,
            transition: 'width 200ms ease, opacity 200ms ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── ProductCard ───────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product
  fetchPriority?: 'high' | 'low' | 'auto'
}

export default function ProductCard({ product, fetchPriority = 'auto' }: ProductCardProps) {
  const router = useRouter()
  const isHigh = fetchPriority === 'high'
  const [hovered, setHovered] = useState(false)
  const isTouchRef = useRef(false)
  
  const [imgIdx, setImgIdx] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const extendedImages = hasMultiple ? [images[images.length - 1], ...images, images[0]] : images

  useEffect(() => {
    if (hasMultiple && scrollContainerRef.current) {
      const el = scrollContainerRef.current
      el.scrollLeft = el.clientWidth + CAROUSEL_GAP
    }
  }, [hasMultiple])

  // ── Handlers ──

  const handleClick = useCallback(() => {
    router.push(`/product/${product.id}`)
  }, [router, product.id])

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current) return
    setHovered(true)
    if (images.length > 1 && images[1]) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = getCdnImageUrl(images[1], { width: 480, quality: 95 })
      link.setAttribute('imagesrcset', getProductSrcSet(images[1]))
      link.setAttribute('imagesizes', '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw')
      document.head.appendChild(link)
    }
  }, [images])

  const [isResetting, setIsResetting] = useState(false)

  const resetCard = useCallback(() => {
    setHovered(false)
    isTouchRef.current = false
    setImgIdx(0)
    setIsResetting(true)
    
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        const targetScroll = hasMultiple ? scrollContainerRef.current.clientWidth + CAROUSEL_GAP : 0
        scrollContainerRef.current.style.scrollSnapType = 'none'
        scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'instant' } as ScrollToOptions)
        scrollContainerRef.current.scrollLeft = targetScroll
      }
      setTimeout(() => setIsResetting(false), 50)
    })
  }, [hasMultiple])

  const handleMouseLeave = useCallback(() => {
    resetCard()
  }, [resetCard])

  useEffect(() => {
    const handleOutsideTouch = (e: TouchEvent) => {
      if (scrollContainerRef.current && !scrollContainerRef.current.contains(e.target as Node)) {
        const targetScroll = hasMultiple ? scrollContainerRef.current.clientWidth + CAROUSEL_GAP : 0
        if (isTouchRef.current || scrollContainerRef.current.scrollLeft !== targetScroll) {
          resetCard()
        }
      }
    }
    document.addEventListener('touchstart', handleOutsideTouch, { passive: true })
    return () => document.removeEventListener('touchstart', handleOutsideTouch)
  }, [hasMultiple, resetCard])

  const handleLeft = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth + CAROUSEL_GAP
      scrollContainerRef.current.scrollBy({ left: -width, behavior: 'smooth' })
    }
  }, [])

  const handleRight = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth + CAROUSEL_GAP
      scrollContainerRef.current.scrollBy({ left: width, behavior: 'smooth' })
    }
  }, [])

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const width = el.clientWidth
    const snapWidth = width + CAROUSEL_GAP
    const scrollLeft = el.scrollLeft
    
    if (!hasMultiple || width === 0) return

    let realIdx = Math.round(scrollLeft / snapWidth) - 1
    if (realIdx < 0) realIdx = images.length - 1
    if (realIdx >= images.length) realIdx = 0

    if (realIdx !== imgIdx) {
      setImgIdx(realIdx)
    }

    if (scrollLeft <= 1) {
      el.style.scrollSnapType = 'none'
      el.scrollLeft = images.length * snapWidth
      void el.offsetHeight // force reflow
      if (!isResetting) el.style.scrollSnapType = 'x mandatory'
    } else if (scrollLeft >= (extendedImages.length - 1) * snapWidth - 1) {
      el.style.scrollSnapType = 'none'
      el.scrollLeft = snapWidth
      void el.offsetHeight // force reflow
      if (!isResetting) el.style.scrollSnapType = 'x mandatory'
    }
  }, [images.length, extendedImages.length, imgIdx, hasMultiple, isResetting])

  const handleTouchStart = useCallback(() => {
    isTouchRef.current = true
  }, [])

  // ── Styles ──

  const wrapperStyle: CSSProperties = {
    cursor: 'pointer',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: 'normal',
    color: 'var(--color-black)',
    outline: 'none',
  }

  const imageWrapperStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '3 / 4',
    overflow: 'hidden',
  }

  const imageAreaStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: isResetting ? 'none' : 'x mandatory',
    scrollbarWidth: 'none',
    display: 'flex',
    flexDirection: 'row',
    gap: `${CAROUSEL_GAP}px`,
  }

  // ── Render ──

  return (
    <div
      role="button"
      tabIndex={0}
      style={wrapperStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          router.push(`/product/${product.id}`)
        }
      }}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* ── Image Area Wrapper ── */}
      <div style={imageWrapperStyle}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={imageAreaStyle}
          className="hide-scrollbar"
        >
          <style dangerouslySetInnerHTML={{ __html: '.hide-scrollbar::-webkit-scrollbar { display: none; }' }} />
          {extendedImages.map((img, i) => {
            const isClone = hasMultiple && (i === 0 || i === extendedImages.length - 1)
            return (
              <div key={i} style={{ width: '100%', height: '100%', flexShrink: 0, scrollSnapAlign: 'start', position: 'relative', background: 'var(--color-gray-50)' }}>
                <img
                  src={getCdnImageUrl(img, { width: 480, quality: 95 })}
                  srcSet={getProductSrcSet(img)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt={`${product.brand} ${product.name}`}
                  width={480}
                  height={640}
                  loading={isHigh && !isClone && i === 1 ? 'eager' : 'lazy'}
                  decoding={isHigh && !isClone && i === 1 ? 'sync' : 'async'}
                  fetchPriority={!isClone && i === 1 ? fetchPriority : 'auto'}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  draggable={false}
                />
              </div>
            )
          })}
        </div>

        {/* Carousel controls — chevrons on hover, dots on touch or hover */}
        {hasMultiple && (
          <>
            {hovered && (
              <>
                <ChevronButton dir="left" onClick={handleLeft} />
                <ChevronButton dir="right" onClick={handleRight} />
              </>
            )}
            {(hovered || isTouchRef.current) && (
              <DotIndicators count={images.length} active={imgIdx} />
            )}
          </>
        )}
      </div>

      {/* ── Meta — flush, no horizontal padding ── */}
      <div style={{ paddingTop: '0.5rem' }}>
        <p
          aria-label="Brand"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            marginBottom: '2px',
            lineHeight: 1,
          }}
        >
          {product.brand}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            fontWeight: 400,
            lineHeight: 1.3,
            color: 'var(--color-black)',
            textTransform: 'uppercase',
            letterSpacing: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </p>

        <p
          style={{
            marginTop: '0.25rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--color-black)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 0,
            textTransform: 'none',
          }}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  )
}
