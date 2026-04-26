'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

// ─── Shared text style base ────────────────────────────────────────────────────

const T: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

// ─── Accordion ─────────────────────────────────────────────────────────────────

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          ...T,
          fontSize: '0.75rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '3rem',
          padding: '0.6rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-black)',
          textTransform: 'uppercase',
          transform: pressed ? 'scale(0.99)' : 'scale(1)',
          transition: 'transform 150ms ease-out',
        }}
      >
        <span style={{ letterSpacing: 'var(--tracking-wider)' }}>{label}</span>
        <span
          style={{
            fontSize: '1.1rem',
            lineHeight: 1,
            fontWeight: 300,
            color: 'var(--color-muted)',
            display: 'inline-block',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-out',
            textTransform: 'none',
          }}
        >
          +
        </span>
      </button>

      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '600px' : '0',
          transition: 'max-height 220ms ease-out',
        }}
      >
        <div
          style={{
            ...T,
            paddingBottom: '1.25rem',
            textTransform: 'none',
            letterSpacing: '0.01em',
            color: 'var(--color-gray-600)',
            lineHeight: 1.7,
            fontSize: '0.78rem',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Row (detail label / value pair) ──────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <span
        style={{
          color: 'var(--color-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: '0.65rem',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: 'var(--color-black)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {value}
      </span>
    </p>
  )
}

// ─── Buy Button ────────────────────────────────────────────────────────────────

function BuyButton({ href }: { href?: string }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      type="button"
      onClick={() => href && window.open(href, '_blank', 'noopener,noreferrer')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-widest)',
        textTransform: 'uppercase',
        WebkitFontSmoothing: 'antialiased',
        width: '100%',
        minHeight: '3.25rem',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-white)',
        background: hovered
          ? 'linear-gradient(to bottom, #2a2a2a, #111)'
          : 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
        boxShadow: `
          0 0 0 0.5px rgba(0,0,0,0.4),
          inset 0 0 0 1px rgba(255,255,255,0.04),
          inset 0 1px 0 rgba(255,255,255,0.07),
          0 1px 2px rgba(0,0,0,0.18),
          0 2px 6px rgba(0,0,0,0.10),
          0 4px 12px rgba(0,0,0,0.06)
        `,
        textShadow: '0 1px 1px rgba(0,0,0,0.2)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 150ms ease-out, background 150ms ease-out',
      }}
    >
      Visit Brand Store
    </button>
  )
}

// ─── Horizontal Scroll Shelf ───────────────────────────────────────────────────

function HScrollShelf({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string
  title: string
  products: Product[]
}) {
  return (
    <Section style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <div style={{ padding: '0 var(--container-px)' }}>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: '0.5rem',
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{ flexShrink: 0, width: '260px', scrollSnapAlign: 'start' }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Vertical Grid Shelf ───────────────────────────────────────────────────────

function VGridShelf({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string
  title: string
  products: Product[]
}) {
  return (
    <Section style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <div style={{ padding: '0 var(--container-px)' }}>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Scroll Progress Strip ─────────────────────────────────────────────────────

function ScrollProgressStrip({
  count,
  progress,
}: {
  count: number
  progress: number
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: '100svh',
        width: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        zIndex: 5,
        pointerEvents: 'none',
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, progress - i))
        return (
          <div
            key={i}
            style={{
              width: '2px',
              height: '2rem',
              background: 'var(--color-border-mid)',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${fill * 100}%`,
                background: 'var(--color-black)',
                transition: 'height 80ms linear',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ProductPageClientProps {
  product: Product
  related: Product[]
  brandProducts: Product[]
}

// ─── ProductPageClient ─────────────────────────────────────────────────────────

export default function ProductPageClient({
  product,
  related,
  brandProducts,
}: ProductPageClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])

  const images = product.images.filter(Boolean)
  const hasColor =
    product.color &&
    product.color !== 'NA' &&
    product.color !== 'N/A' &&
    product.color.trim().toLowerCase() !== 'none'
  const hasFabric = Array.isArray(product.fabric) && product.fabric.length > 0

  // ── Reset scroll on product change ──

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrollProgress(0)
  }, [product.id])

  // ── Stable ref setter ──

  const setImgRef = useCallback((el: HTMLDivElement | null, i: number) => {
    imgRefs.current[i] = el
  }, [])

  // ── Scroll progress tracker ──

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

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Two-column product layout ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          background: 'var(--color-white)',
        }}
      >
        {/* ── LEFT: image stack + scroll strip ── */}
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {/* Scroll progress strip */}
          <ScrollProgressStrip count={images.length} progress={scrollProgress} />

          {/* Stacked images */}
          <div style={{ flex: 1 }}>
            {images.map((img, i) => (
              <div
                key={i}
                ref={(el) => setImgRef(el, i)}
                style={{
                  height: '100svh',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--color-surface-2)',
                }}
              >
                <Image
                  src={img}
                  alt={`${product.name} — view ${i + 1}`}
                  fill
                  sizes="50vw"
                  priority={i === 0}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    userSelect: 'none',
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: sticky info panel ── */}
        <div
          style={{
            width: '50%',
            position: 'sticky',
            top: 0,
            height: '100svh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid var(--color-border)',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: '72%', padding: '2rem 0' }}>
            {/* Brand */}
            <p
              style={{
                ...T,
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              {product.brand}
            </p>

            {/* Name */}
            <p
              style={{
                ...T,
                fontSize: '1.4rem',
                fontWeight: 400,
                color: 'var(--color-black)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              } as CSSProperties}
            >
              {product.name}
            </p>

            {/* Price */}
            <p
              style={
                {
                  ...T,
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'var(--color-black)',
                  marginBottom: 'var(--space-md)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.01em',
                  textTransform: 'none',
                } as CSSProperties
              }
            >
              {formatPrice(product.price)}
            </p>

            {/* Spacer */}
            <div style={{ height: 'var(--space-md)' }} />

            {/* Accordions */}
            {product.description && (
              <Accordion label="Description">
                <p style={{ textTransform: 'none' }}>{product.description}</p>
              </Accordion>
            )}

            {(hasColor || hasFabric) && (
              <Accordion label="Composition & Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {hasColor && <Row label="Colour" value={product.color!} />}
                  {hasFabric && <Row label="Fabric" value={product.fabric!.join(', ')} />}
                  {product.subcategory && <Row label="Category" value={product.subcategory} />}
                </div>
              </Accordion>
            )}

            <Accordion label="Delivery & Returns">
              <p>Complimentary shipping on all orders. Returns accepted within 30 days.</p>
            </Accordion>

            {/* Hairline above buy button */}
            <div style={{ borderTop: '1px solid var(--color-border-mid)' }} />

            {/* Buy button */}
            <BuyButton href={product.affiliate_link} />

            {/* Redirect caption */}
            <p
              style={{
                ...T,
                color: 'var(--color-muted)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                marginTop: '0.6rem',
                textTransform: 'none',
                letterSpacing: '0.01em',
                lineHeight: 1.5,
              }}
            >
              You&apos;ll be redirected to the brand&apos;s website
            </p>
          </div>
        </div>
      </div>

      {/* ── Below-fold shelves ── */}
      {brandProducts.length > 0 && (
        <HScrollShelf
          eyebrow="Same brand"
          title={`More from ${product.brand}`}
          products={brandProducts}
        />
      )}

      {related.length > 0 && (
        <VGridShelf
          eyebrow="Picked for you"
          title="You May Also Like"
          products={related}
        />
      )}
    </>
  )
}
