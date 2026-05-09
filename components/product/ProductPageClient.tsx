'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'
import type { ProductDetail, Product, ProductVariant } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { getCdnImageUrl } from '@/lib/image'
import ProductCard from '@/components/product/ProductCard'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

const T: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

// ─── Accordion ─────────────────────────────────────────────────────────────────

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          ...T, fontSize: '0.75rem', width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          minHeight: '3rem', padding: '0.6rem 0', background: 'none',
          border: 'none', cursor: 'pointer', color: 'var(--color-black)',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ letterSpacing: 'var(--tracking-wider)' }}>{label}</span>
        <span style={{
          fontSize: '1.1rem', lineHeight: 1, fontWeight: 300,
          color: 'var(--color-muted)', display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease-out', textTransform: 'uppercase',
        }}>+</span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? '800px' : '0', transition: 'max-height 220ms ease-out' }}>
        <div style={{ ...T, paddingBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.01em', color: 'var(--color-gray-600)', lineHeight: 1.7, fontSize: '0.8rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Detail row ────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--font-sans)', fontSize: '0.75rem' }}>
      <span style={{ color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</span>
      <span style={{ color: 'var(--color-black)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{value}</span>
    </p>
  )
}

// ─── Share icon SVG ────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function useShareHandler({ name, brand, price }: { name: string; brand: string; price: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    const text = `${name} by ${brand} — ${price}`
    if (navigator.share) {
      try { await navigator.share({ title: `${name} — MEGG`, text, url }) } catch { /* dismissed */ }
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return { copied, handleShare }
}

// Absolute inside image slide — used on both mobile and desktop
function DesktopShareButton({ name, brand, price }: { name: string; brand: string; price: string }) {
  const { copied, handleShare } = useShareHandler({ name, brand, price })
  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share product"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
        width: '2.25rem',
        height: '2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(0,0,0,0.10)',
        cursor: 'pointer',
        color: 'var(--color-black)',
        transition: 'background 150ms ease-out',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,1)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.88)')}
    >
      {copied
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        : <ShareIcon />
      }
    </button>
  )
}

function InlineShareButton({ name, brand, price }: { name: string; brand: string; price: string }) {
  const { copied, handleShare } = useShareHandler({ name, brand, price })
  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share product"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        height: '2.25rem',
        background: 'none',
        border: '1px solid var(--color-border-mid)',
        cursor: 'pointer',
        color: 'var(--color-black)',
        flexShrink: 0,
        transition: 'background 150ms ease-out',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-gray-50)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {copied
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        : <ShareIcon />
      }
    </button>
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
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        ...T, fontSize: '0.75rem', fontWeight: 600,
        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
        width: '100%', minHeight: '3.25rem', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-white)',
        background: hovered ? '#2a2a2a' : '#0a0a0a',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 150ms ease-out, background 150ms ease-out',
        marginTop: '1.25rem',
      }}
    >
      Buy Now
    </button>
  )
}

// ─── Variant Selector ──────────────────────────────────────────────────────────

function VariantSelector({
  variants,
  activeId,
  onSelect,
}: {
  variants: ProductVariant[]
  activeId: string | null
  onSelect: (v: ProductVariant) => void
}) {
  if (!variants.length) return null
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ ...T, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.6rem' }}>
        More styles
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Base product thumbnail */}
        {variants.map(v => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v)}
            style={{
              width: '52px', height: '52px', padding: 0, border: 'none',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              outline: activeId === v.id ? '2px solid var(--color-black)' : '1px solid var(--color-border-mid)',
              outlineOffset: '1px',
              background: 'var(--color-surface)',
              flexShrink: 0,
            }}
            aria-label={`${v.color} variant`}
          >
            {v.images[0] && (
              <img
                src={getCdnImageUrl(v.images[0], { width: 80, quality: 95 })}
                alt={v.color}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Scroll Progress Strip ─────────────────────────────────────────────────────

function ScrollProgressStrip({ count, progress }: { count: number; progress: number }) {
  return (
    <div style={{
      position: 'sticky', top: 0, height: '100svh', width: '1.25rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '5px', zIndex: 5,
      pointerEvents: 'none', flexShrink: 0,
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, progress - i))
        return (
          <div key={i} style={{ width: '2px', height: '2rem', background: 'var(--color-border-mid)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${fill * 100}%`, background: 'var(--color-black)', transition: 'height 80ms linear' }} />
          </div>
        )
      })}
    </div>
  )
}

// ─── Horizontal scroll shelf ───────────────────────────────────────────────────

function HScrollShelf({ eyebrow, title, products }: { eyebrow: string; title: string; products: Product[] }) {
  if (!products.length) return null
  return (
    <Section style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <div style={{ padding: '0 var(--container-px)' }}>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div style={{
          display: 'flex', gap: '1rem', overflowX: 'auto',
          scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingBottom: '0.5rem',
        }}>
          {products.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: 'clamp(160px, 42vw, 300px)', scrollSnapAlign: 'start' }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Grid shelf ────────────────────────────────────────────────────────────────

function GridShelf({ eyebrow, title, products }: { eyebrow: string; title: string; products: Product[] }) {
  if (!products.length) return null
  return (
    <Section style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <div style={{ padding: '0 var(--container-px)' }}>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className="product-grid-shelf">
          {products.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </Section>
  )
}

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ProductPageClientProps {
  product: ProductDetail
}

// ─── ProductPageClient ─────────────────────────────────────────────────────────

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])

  // Active images: variant override or base product
  const activeImages = activeVariant ? activeVariant.images : product.images
  const images = activeImages.filter(Boolean)

  const hasFabric = Array.isArray(product.fabric) && product.fabric.length > 0
  const variants = product.variants ?? []
  const moreFromBrand = product.more_from_brand ?? []
  const recommended = product.recommended ?? []

  const price = typeof product.price === 'number'
    ? `Rs. ${product.price.toLocaleString('en-IN')}`
    : formatPrice(product.price)

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrollProgress(0)
    setActiveVariant(null)
  }, [product.id])

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
      {/* ── Responsive styles ── */}
      <style>{`
        .pdp-layout {
          display: flex;
          align-items: flex-start;
          background: var(--color-white);
        }
        .pdp-images {
          width: 50%;
          display: flex;
          flex-direction: row;
        }
        .pdp-info-panel {
          width: 50%;
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid var(--color-border);
          overflow-y: auto;
        }
        .pdp-info-inner {
          width: 72%;
          padding: 2rem 0;
        }
        .pdp-mobile-images-wrap {
          display: none;
        }
        .pdp-mobile-images {
          display: none;
        }
        .pdp-scroll-strip {
          display: flex;
        }
        .product-grid-shelf {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .pdp-layout {
            flex-direction: column;
          }
          .pdp-images {
            display: none;
          }
          .pdp-mobile-images-wrap {
            display: block;
            position: relative;
            width: 100%;
          }
          .pdp-mobile-images {
            display: flex;
            width: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            flex-direction: row;
          }
          .pdp-mobile-images::-webkit-scrollbar { display: none; }
          .pdp-mobile-img-slide {
            flex-shrink: 0;
            width: 100vw;
            aspect-ratio: 3 / 4;
            position: relative;
            scroll-snap-align: start;
            background: var(--color-surface-2);
          }
          .pdp-scroll-strip {
            display: none;
          }
          .pdp-info-panel {
            width: 100%;
            position: static;
            height: auto;
            border-left: none;
            border-top: 1px solid var(--color-border);
            align-items: flex-start;
          }
          .pdp-info-inner {
            width: 100%;
            padding: 1.5rem var(--container-px) 2rem;
          }
          .product-grid-shelf {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.875rem;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .pdp-info-inner {
            width: 84%;
            padding: 1.5rem 0;
          }
          .product-grid-shelf {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* ── Two-column layout ── */}
      <article className="pdp-layout">

        {/* MOBILE: horizontal swipeable image strip */}
        <div className="pdp-mobile-images-wrap">
          <div className="pdp-mobile-images">
            {images.map((img, i) => (
              <div key={`m-${activeVariant?.id ?? 'base'}-${i}`} className="pdp-mobile-img-slide">
                <img
                  src={img}
                  alt={`${product.name} — view ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', userSelect: 'none' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: LEFT image stack */}
        <div className="pdp-images">
          <div className="pdp-scroll-strip">
            <ScrollProgressStrip count={images.length} progress={scrollProgress} />
          </div>
          <div style={{ flex: 1 }}>
            {images.map((img, i) => (
              <div
                key={`${activeVariant?.id ?? 'base'}-${i}`}
                ref={el => setImgRef(el, i)}
                style={{ height: '100svh', position: 'relative', overflow: 'hidden', background: 'var(--color-surface-2)' }}
              >
                <img
                  src={img}
                  alt={`${product.name} — view ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', userSelect: 'none' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: sticky info panel */}
        <div className="pdp-info-panel">
          <div className="pdp-info-inner">

            {/* Brand */}
            <p style={{ ...T, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {product.brand}
            </p>

            {/* Name */}
            <h1 style={{ ...T, fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', fontWeight: 400, color: 'var(--color-black)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '0.75rem', textTransform: 'uppercase' } as CSSProperties}>
              {product.name}
            </h1>

            {/* Price + Share */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <p style={{ ...T, fontSize: '1.4rem', fontWeight: 500, color: 'var(--color-black)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', textTransform: 'none' } as CSSProperties}>
                {price}
              </p>
              <InlineShareButton name={product.name as string} brand={product.brand as string} price={price} />
            </div>

            {/* Category / subcategory tags */}
            {(product.category || product.subcategory) && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                {[product.category, product.subcategory].filter(Boolean).map(tag => (
                  <span key={tag} style={{ ...T, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', border: '1px solid var(--color-border-mid)', padding: '0.2rem 0.6rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Variant selector */}
            <VariantSelector
              variants={variants}
              activeId={activeVariant?.id ?? null}
              onSelect={v => setActiveVariant(prev => prev?.id === v.id ? null : v)}
            />

            {/* Accordions */}
            {product.description && (
              <Accordion label="Description">
                <p style={{ textTransform: 'uppercase' }}>{product.description}</p>
              </Accordion>
            )}

            {(hasFabric || product.color) && (
              <Accordion label="Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {product.color && <Row label="Colour" value={product.color} />}
                  {hasFabric && <Row label="Fabric" value={product.fabric!.join(', ')} />}
                  {product.subcategory && <Row label="Style" value={product.subcategory} />}
                </div>
              </Accordion>
            )}

            <Accordion label="Delivery & Returns">
              <p>Delivery and returns are managed by the respective store. Megg is not responsible for shipping, returns, or any related issues.</p>
            </Accordion>

            <div style={{ borderTop: '1px solid var(--color-border-mid)' }} />

            <BuyButton href={product.affiliate_link} />

            <p style={{ ...T, color: 'var(--color-muted)', textAlign: 'center', fontSize: '0.75rem', marginTop: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1.5 }}>
              You&apos;ll be redirected to the brand&apos;s website
            </p>
          </div>
        </div>
      </article>

      {/* ── Below-fold shelves — using API data directly ── */}
      <HScrollShelf eyebrow="Same brand" title={`More from ${product.brand}`} products={moreFromBrand} />
      <GridShelf eyebrow="Picked for you" title="You May Also Like" products={recommended} />
    </>
  )
}
