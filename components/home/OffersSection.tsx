'use client'

import { useEffect, useRef, useState } from 'react'
import { getOffers, type Offer } from '@/lib/api'

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {})
  }, [])

  // sync dot indicator with scroll position on mobile
  const handleScroll = () => {
    const el = carouselRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIdx(idx)
  }

  if (offers.length === 0) return null

  return (
    <section
      style={{
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
      }}
    >
      <style>{`
        .offer-img { transition: transform 0.55s ease; }
        .offer-card:hover .offer-img { transform: scale(1.03); }
      `}</style>

      {/* Section header */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <span className="text-label" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Don&apos;t miss out
        </span>
        <h2 className="text-section">Ongoing Offers</h2>
      </div>

      {/* Cards */}
      <style>{`
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          padding: 0 var(--container-px);
          max-width: var(--container-max);
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .offers-grid { grid-template-columns: repeat(3, 1fr); }
        }
        /* mobile carousel overrides */
        @media (max-width: 767px) {
          .offers-grid {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            gap: 0;
            padding: 0;
            max-width: 100%;
          }
          .offers-grid::-webkit-scrollbar { display: none; }
          .offer-card-wrap {
            flex-shrink: 0;
            width: 100vw;
            padding: 0 var(--container-px);
            scroll-snap-align: start;
            box-sizing: border-box;
          }
        }
      `}</style>
      <div className="offers-grid" ref={carouselRef} onScroll={handleScroll}>
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card-wrap">
            <a
              href={offer.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="offer-card"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  background: 'var(--color-surface)',
                }}
              >
                {offer.banner_image && (
                  <img
                    src={offer.banner_image}
                    alt={offer.title}
                    className="offer-img"
                    loading="lazy"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                )}
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Dot indicators — mobile only */}
      <style>{`
        .offers-dots {
          display: none;
        }
        @media (max-width: 767px) {
          .offers-dots {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-top: 0.75rem;
          }
        }
      `}</style>
      <div className="offers-dots">
        {offers.map((_, i) => (
          <div
            key={i}
            style={{
              height: '3px',
              width: i === activeIdx ? '16px' : '4px',
              borderRadius: '999px',
              background: 'var(--color-black)',
              opacity: i === activeIdx ? 0.75 : 0.25,
              transition: 'width 200ms ease, opacity 200ms ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
