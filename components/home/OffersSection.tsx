'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getOffers, type Offer } from '@/lib/api'

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {})
  }, [])

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

      {/* Cards — full-bleed horizontal strip */}
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
      `}</style>
      <div className="offers-grid">
        {offers.map((offer) => (
          <a
            key={offer.id}
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
                <Image
                  src={offer.banner_image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="offer-img"
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                />
              )}
              {/* invisible — kept for layout compat */}
              <div style={{ display: 'none' }}>
                <p
                  style={{
                    marginTop: '0.35rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Shop Now →
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
