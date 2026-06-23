'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'

interface ReelData {
  id: string
  category: string
  videoUrl: string
  thumbnailUrl: string
  views: number
  likes: number
}

interface MobileProduct {
  id: string
  name: string
  brand?: string
  price: number
  image: string
  affiliate_link?: string
}

interface ReelPlayerProps {
  reel: ReelData
  products: Product[]
  mobileProducts: MobileProduct[]
}

const API_BASE = 'https://edge.meggfashion.in'

const trackView = async (reelId: string) => {
  try {
    await fetch(`${API_BASE}/api/reels/${reelId}/view`, { method: 'POST' })
  } catch { /* ignore */ }
}

const toggleLikeApi = async (reelId: string, like: boolean) => {
  try {
    await fetch(`${API_BASE}/api/reels/${reelId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like }),
    })
  } catch { /* ignore */ }
}

export default function ReelPlayer({ reel, products, mobileProducts }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showPauseIcon, setShowPauseIcon] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes)
  const [progress, setProgress] = useState(0)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewTrackedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || viewTrackedRef.current) return
    const onPlay = () => {
      viewTrackedRef.current = true
      trackView(reel.id)
    }
    video.addEventListener('play', onPlay)
    return () => video.removeEventListener('play', onPlay)
  }, [reel.id])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setIsPaused(false)
    } else {
      video.pause()
      setIsPaused(true)
    }
    setShowPauseIcon(true)
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => setShowPauseIcon(false), 800)
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted((m) => !m)
  }, [])

  const toggleLike = useCallback(() => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    toggleLikeApi(reel.id, newLiked)
  }, [liked])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Style Reel — ${reel.category}`,
          text: `Check out this style reel on MEGG`,
          url: window.location.href,
        })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }, [reel.category])

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  /* ── Shared: progress bar ── */
  const progressBar = (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 20 }}>
      <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-white)', transition: 'width 0.1s linear' }} />
    </div>
  )

  /* ── Shared: pause icon ── */
  const pauseIcon = showPauseIcon && (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 8, opacity: isPaused ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.35)" />
        <polygon points="26,20 26,44 44,32" fill="white" />
      </svg>
    </div>
  )

  /* ── Shared: tap area ── */
  const tapArea = (
    <button
      onClick={togglePlay}
      aria-label={isPaused ? 'Play' : 'Pause'}
      style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
    />
  )

  /* ── Mobile: compact product card ── */
  const mobileProductCard = (p: MobileProduct) => (
    <a
      key={p.id}
      href={p.affiliate_link || `/product/${p.id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flexShrink: 0,
        width: 'clamp(260px, 72vw, 320px)',
        scrollSnapAlign: 'start',
        display: 'flex',
        height: '88px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflow: 'hidden',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ width: '88px', height: '100%', flexShrink: 0, background: 'var(--color-gray-50)', overflow: 'hidden' }}>
        <img src={p.image} alt={p.name} loading="lazy" decoding="async" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.3rem', minWidth: 0, color: 'var(--color-black)' }}>
        {p.brand && <span style={{ fontSize: '0.55rem', letterSpacing: '0.14em', color: 'var(--color-muted)', fontWeight: 500, lineHeight: 1.2 }}>{p.brand}</span>}
        <h3 style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.06em', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.name}</h3>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em' }}>Rs {p.price.toLocaleString('en-IN')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem', color: 'var(--color-black)', opacity: 0.3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polyline points="9 18 15 12 9 6" /></svg>
      </div>
    </a>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     MOBILE — immersive full-screen reel with bottom carousel
     ═══════════════════════════════════════════════════════════════════════════ */
  const mobileView = (
    <div style={{ position: 'relative', width: '100%', height: '100dvh', background: 'var(--color-black)', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        autoPlay
        loop
        muted
        playsInline
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 18%, transparent 35%, transparent 55%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.65) 100%)', pointerEvents: 'none' }} />
      {tapArea}
      {pauseIcon}
      {progressBar}

      {/* Mobile header */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, padding: 'env(safe-area-inset-top, 0px) 1.25rem 0', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" className="reel-action-btn" aria-label="Back to home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: 'var(--color-white)', opacity: 0.9 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{reel.category}</span>
        <button className="reel-action-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: 'var(--color-white)', opacity: 0.9 }}>
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          )}
        </button>
      </header>

      {/* Mobile right-side actions */}
      <div style={{ position: 'absolute', right: '0.75rem', bottom: '12rem', zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <button className="reel-action-btn" onClick={toggleLike} aria-label="Like" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? 'var(--color-white)' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 500 }}>{formatCount(likeCount)}</span>
        </button>
        <button className="reel-action-btn" onClick={handleShare} aria-label="Share" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 500 }}>{formatCount(reel.views)}</span>
        </div>
      </div>

      {/* Mobile bottom product carousel */}
      {mobileProducts.length > 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{mobileProducts.length} {mobileProducts.length === 1 ? 'product' : 'products'}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div className="reel-product-scroll" style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingBottom: '1rem' }}>
            {mobileProducts.map((p) => mobileProductCard(p))}
          </div>
        </div>
      )}
    </div>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     DESKTOP — split view: video left, product panel right
     ═══════════════════════════════════════════════════════════════════════════ */
  const desktopView = (
    <div style={{ display: 'flex', width: '100%', height: '100dvh', background: 'var(--color-black)', overflow: 'hidden' }}>
      {/* ── Left: Video ── */}
      <div style={{ flex: '1 1 30%', position: 'relative', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ position: 'relative', height: '100%', aspectRatio: '9 / 16', maxHeight: '100%', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            autoPlay
            loop
            muted
            playsInline
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
          {tapArea}
          {pauseIcon}
          {progressBar}

          {/* Desktop header inside video */}
          <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, padding: '1.25rem 1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" className="reel-action-btn" aria-label="Back to home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: 'var(--color-white)', opacity: 0.9 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="m15 18-6-6 6-6" /></svg>
            </Link>
            <button className="reel-action-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: 'var(--color-white)', opacity: 0.9 }}>
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
              )}
            </button>
          </header>

          {/* Actions overlay on video for desktop */}
          <div style={{ position: 'absolute', right: '1rem', bottom: '6rem', zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <button className="reel-action-btn" onClick={toggleLike} aria-label="Like" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? 'var(--color-white)' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 500 }}>{formatCount(likeCount)}</span>
            </button>
            <button className="reel-action-btn" onClick={handleShare} aria-label="Share" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: 'var(--color-white)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 500 }}>{formatCount(reel.views)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Product panel ── */}
      <div style={{ flex: '1 1 70%', height: '100dvh', background: 'var(--color-white)', color: 'var(--color-black)', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: '1px solid var(--color-border)' }}>
        {/* Panel header */}
        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: 'var(--color-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Shop the reel</span>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>{reel.category}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.875rem' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              {formatCount(reel.views)}
            </span>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'var(--color-black)' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {formatCount(likeCount)}
            </span>
          </div>
        </div>

        {/* Product grid using ProductCard */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .reel-desktop-products::-webkit-scrollbar { display: none; }
            .reel-desktop-products .reel-card-compact { width: 100%; }
            .reel-desktop-products .reel-card-compact > div:first-child { aspect-ratio: 1 / 1 !important; }
            .reel-desktop-products .reel-card-compact [style*="padding-top"] { padding-top: 0.35rem !important; }
          `}</style>
          <div className="reel-desktop-products" style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', alignContent: 'start' }}>
            {products.map((product) => (
              <div key={product.id} className="reel-card-compact" style={{ position: 'relative' }}>
                <ProductCard product={product} />
                <a
                  href={`/product/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                  aria-label={`Open ${product.name} in new tab`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase', userSelect: 'none', WebkitUserSelect: 'none', color: 'var(--color-white)' }}>
      <style>{`
        .reel-product-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .reel-product-scroll::-webkit-scrollbar { display: none; }
        .reel-action-btn { transition: transform 0.15s ease, opacity 0.2s; }
        .reel-action-btn:active { transform: scale(0.88); }
        @media (max-width: 767px) { .reel-desktop-view { display: none !important; } .reel-mobile-view { display: block !important; } }
        @media (min-width: 768px) { .reel-mobile-view { display: none !important; } .reel-desktop-view { display: flex !important; } }
      `}</style>
      <div className="reel-mobile-view">{mobileView}</div>
      <div className="reel-desktop-view" style={{ display: 'none' }}>{desktopView}</div>
    </div>
  )
}
