'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { Product } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

// ─── Internal: Chevron Button ──────────────────────────────────────────────────

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
    // Subtle frosted backing so the icon is readable over light images
    // but kept minimal so it doesn't clash with the card background
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right')

  const images = product.images ?? []
  const hasMultiple = images.length > 1
  const currentSrc = images[imgIdx] ?? null

  // ── Handlers ──

  const handleClick = useCallback(() => {
    router.push(`/product/${product.id}`)
  }, [router, product.id])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setSlideDir('right')
    setImgIdx(0)
  }, [])

  const handleLeft = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setSlideDir('left')
      setImgIdx((i) => (i - 1 + images.length) % images.length)
    },
    [images.length],
  )

  const handleRight = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setSlideDir('right')
      setImgIdx((i) => (i + 1) % images.length)
    },
    [images.length],
  )

  // ── Styles ──

  const wrapperStyle: CSSProperties = {
    cursor: 'pointer',
    width: '100%',
    // Reset body-level uppercase / spacing so children can override cleanly
    textTransform: 'none',
    letterSpacing: 'normal',
  }

  const imageAreaStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '3 / 4',
    background: 'var(--color-gray-50)',
    overflow: 'hidden',
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          router.push(`/product/${product.id}`)
        }
      }}
      aria-label={`${product.brand} — ${product.name}`}
    >
      {/* ── Image Area ── */}
      <div style={imageAreaStyle}>
        {currentSrc && (
          <Image
            key={imgIdx}
            src={currentSrc}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{
              objectFit: 'cover',
              animation: `${slideDir === 'right' ? 'card-img-in' : 'card-img-in-left'} 280ms cubic-bezier(0.25,0.46,0.45,0.94) both`,
            }}
            draggable={false}
          />
        )}

        {/* Carousel controls — only when hovered and multi-image */}
        {hovered && hasMultiple && (
          <>
            <ChevronButton dir="left" onClick={handleLeft} />
            <ChevronButton dir="right" onClick={handleRight} />
            <DotIndicators count={images.length} active={imgIdx} />
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
            textTransform: 'none',
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
          }}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  )
}
