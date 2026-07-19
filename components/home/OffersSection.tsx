'use client'

import { useEffect, useState } from 'react'
import { getOffers, type Offer } from '@/lib/api'
import { motion, AnimatePresence } from 'motion/react'

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {})
  }, [])



  if (offers.length === 0) return null



  return (
    <section style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-xl)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 var(--container-px)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
        <span className="text-label" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Exclusive Perks
        </span>
        <h2 className="text-section">Offers</h2>
      </div>

      {/* 3D Stage */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '1200px', 
          margin: '0 auto',
          height: 'min(60vw, 450px)',
          perspective: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Spotlight / Stage Floor */}
        <div style={{
          position: 'absolute',
          bottom: '-5%',
          width: '70%',
          height: '30%',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotateX(75deg)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transformStyle: 'preserve-3d' }}>
          <AnimatePresence initial={false}>
            {offers.map((offer, index) => {
              // Calculate relative position with wrap-around
              let offset = index - activeIdx
              if (offset > Math.floor(offers.length / 2)) offset -= offers.length
              if (offset < -Math.floor(offers.length / 2)) offset += offers.length

              const isActive = offset === 0
              const isVisible = Math.abs(offset) <= 2 // Show up to 5 cards

              if (!isVisible) return null

              // Calculate transforms based on offset
              const x = offset * 55 // Percentage offset
              const z = isActive ? 0 : -Math.abs(offset) * 150
              const rotateY = offset * -25
              const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.1
              const opacity = isActive ? 1 : 1 - Math.abs(offset) * 0.4

              return (
                <motion.div
                  key={offer.id}
                  initial={false}
                  animate={{
                    x: `${x}%`,
                    z,
                    rotateY,
                    scale,
                    opacity
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20
                  }}
                  style={{
                    position: 'absolute',
                    width: 'min(75vw, 650px)',
                    aspectRatio: '16/9',
                    zIndex: offers.length - Math.abs(offset),
                    cursor: isActive ? 'default' : 'pointer'
                  }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIdx(index)
                    }
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden',
                    // Box reflection for the glass stage effect (works in Webkit)
                    WebkitBoxReflect: 'below 8px linear-gradient(transparent 70%, rgba(255,255,255,0.4))'
                  }}>
                    <img 
                      src={offer.banner_image} 
                      alt={offer.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      draggable={false}
                    />
                    
                    {/* Light overlay for inactive cards to increase depth */}
                    {!isActive && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(245,245,245,0.3)',
                        backdropFilter: 'blur(2px)'
                      }} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>


      </div>

      {/* Dots Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem' }}>
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              position: 'relative',
              width: i === activeIdx ? '48px' : '16px',
              height: '20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label={`Go to offer ${i + 1}`}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '2px',
              transform: 'translateY(-50%)',
              background: 'var(--color-black)',
              opacity: i === activeIdx ? 1 : 0.2,
              transition: 'opacity 0.4s ease'
            }} />
          </button>
        ))}
      </div>
    </section>
  )
}
