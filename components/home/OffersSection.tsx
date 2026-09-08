'use client'

import { useEffect, useState, useRef } from 'react'
import { getOffers, type Offer } from '@/lib/api'
import { getResizedOfferBanner } from '@/lib/image'

// Matches the banner's own h-[…] breakpoints below — each candidate is
// server-cropped/resized to these exact pixels via /api/offer-banner, so
// the browser only ever downloads an already-correctly-sized image instead
// of the full original asset scaled down by CSS.
const BANNER_SIZES = [
  { w: 480,  h: 260 },
  { w: 768,  h: 340 },
  { w: 1024, h: 420 },
  { w: 1280, h: 480 },
] as const

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const touchStartRef = useRef<number | null>(null)

  useEffect(() => {
    getOffers().then(setOffers).catch(() => { })
  }, [])

  // Auto-play carousel every 5 seconds when not hovered
  useEffect(() => {
    if (offers.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % offers.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [offers.length, isHovered])

  if (offers.length === 0) return null

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIdx((prev) => (prev + 1) % offers.length)
      } else {
        setActiveIdx((prev) => (prev - 1 + offers.length) % offers.length)
      }
    }
    touchStartRef.current = null
  }

  return (
    <section className="pt-0 pb-8 overflow-hidden font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="mb-lg flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-label text-muted">Exclusive Perks</span>
            <h2 className="text-section">Special Offers</h2>
          </div>
          {offers.length > 1 && (
            <span className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-muted font-mono shrink-0 pb-0.5">
              0{activeIdx + 1} / 0{offers.length}
            </span>
          )}
        </div>

        {/* Minimal Widescreen Offer Banner Display — full container width,
            fixed (shorter-than-native) height. object-cover only trims the
            sides to fill that wider aspect; centered content (logo/CTA
            text) stays intact since crop is horizontal, not vertical. */}
        <div
          className="relative w-full overflow-hidden bg-neutral-900 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slide Track */}
          <div
            className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {offers.map((offer) => (
              <a
                key={offer.id}
                href={offer.affiliate_link || '#'}
                target={offer.affiliate_link ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="relative flex-none w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] block overflow-hidden no-underline"
              >
                <img
                  src={getResizedOfferBanner(offer.banner_image, 1280, 480)}
                  srcSet={BANNER_SIZES
                    .map(({ w, h }) => `${getResizedOfferBanner(offer.banner_image, w, h)} ${w}w`)
                    .join(', ')}
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  alt={offer.title || 'Offer'}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  draggable={false}
                />

                {/* Minimal Luxury Scrim & Text Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
                  {offer.affiliate_link && (
                    <div className="mt-4 flex items-center gap-2 font-sans text-[0.675rem] tracking-[0.2em] uppercase text-white font-medium group-hover:underline">
                      <span>DISCOVER OFFER</span>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Minimal Controls — Pure black chevrons with auto-hide */}
          {offers.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIdx((prev) => (prev - 1 + offers.length) % offers.length)
                }}
                aria-label="Previous offer"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/60 text-white backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIdx((prev) => (prev + 1) % offers.length)
                }}
                aria-label="Next offer"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/60 text-white backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Minimal Dash Indicators */}
        {offers.length > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {offers.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to offer slide ${i + 1}`}
                className="h-6 py-2.5 bg-transparent border-none cursor-pointer p-0 group/indicator"
              >
                <div
                  className="h-[1.5px] bg-black transition-all duration-300"
                  style={{
                    width: i === activeIdx ? '28px' : '12px',
                    opacity: i === activeIdx ? 1 : 0.25,
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
