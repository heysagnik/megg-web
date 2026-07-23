'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import { PRODUCT_GRID_CLASS } from '@/lib/constants'
import { cn as CN } from '@/lib/utils'

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
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileProgressRef = useRef<HTMLDivElement>(null)
  const desktopProgressRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showPauseIcon, setShowPauseIcon] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewTrackedRef = useRef(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const touchStartYRef = useRef(0)
  const touchStartXRef = useRef(0)
  const sheetTouchStartYRef = useRef(0)
  const sheetTouchStartXRef = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
    touchStartXRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY
    const deltaX = Math.abs(touchStartXRef.current - e.changedTouches[0].clientX)
    if (deltaY > 50 && deltaY > deltaX) setIsBottomSheetOpen(true)
  }, [])

  const handleSheetTouchStart = useCallback((e: React.TouchEvent) => {
    sheetTouchStartYRef.current = e.touches[0].clientY
    sheetTouchStartXRef.current = e.touches[0].clientX
  }, [])

  const handleSheetTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - sheetTouchStartYRef.current
    const deltaX = Math.abs(e.changedTouches[0].clientX - sheetTouchStartXRef.current)
    if (deltaY > 50 && deltaY > deltaX) setIsBottomSheetOpen(false)
  }, [])

  useEffect(() => {
    const onTimeUpdateMobile = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      if (video.duration && mobileProgressRef.current) {
        mobileProgressRef.current.style.width = `${(video.currentTime / video.duration) * 100}%`
      }
    }
    const onTimeUpdateDesktop = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      if (video.duration && desktopProgressRef.current) {
        desktopProgressRef.current.style.width = `${(video.currentTime / video.duration) * 100}%`
      }
    }
    const mVideo = mobileVideoRef.current
    const dVideo = desktopVideoRef.current
    if (mVideo) mVideo.addEventListener('timeupdate', onTimeUpdateMobile)
    if (dVideo) dVideo.addEventListener('timeupdate', onTimeUpdateDesktop)
    return () => {
      if (mVideo) mVideo.removeEventListener('timeupdate', onTimeUpdateMobile)
      if (dVideo) dVideo.removeEventListener('timeupdate', onTimeUpdateDesktop)
    }
  }, [])

  useEffect(() => {
    const onPlay = () => {
      if (viewTrackedRef.current) return
      viewTrackedRef.current = true
      trackView(reel.id)
    }
    const mVideo = mobileVideoRef.current
    const dVideo = desktopVideoRef.current
    if (mVideo) mVideo.addEventListener('play', onPlay)
    if (dVideo) dVideo.addEventListener('play', onPlay)
    return () => {
      if (mVideo) mVideo.removeEventListener('play', onPlay)
      if (dVideo) dVideo.removeEventListener('play', onPlay)
    }
  }, [reel.id])

  const togglePlay = useCallback(() => {
    const mVideo = mobileVideoRef.current
    const dVideo = desktopVideoRef.current
    const isCurrentlyPaused = (window.innerWidth < 768 ? mVideo : dVideo)?.paused
    
    if (isCurrentlyPaused) {
      if (mVideo) mVideo.play().catch(() => {})
      if (dVideo) dVideo.play().catch(() => {})
      setIsPaused(false)
    } else {
      if (mVideo) mVideo.pause()
      if (dVideo) dVideo.pause()
      setIsPaused(true)
    }
    setShowPauseIcon(true)
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => setShowPauseIcon(false), 800)
  }, [])

  const toggleMute = useCallback(() => {
    const mVideo = mobileVideoRef.current
    const dVideo = desktopVideoRef.current
    const newMuted = !isMuted
    if (mVideo) mVideo.muted = newMuted
    if (dVideo) dVideo.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

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

  /* ── Progress bars ── */
  const progressBar = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20 z-20">
      <div ref={ref} className="h-full w-0 bg-white transition-[width] duration-100 ease-linear" />
    </div>
  )

  const pauseIcon = showPauseIcon && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[8] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isPaused ? 1 : 0 }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.35)" />
        <polygon points="26,20 26,44 44,32" fill="white" />
      </svg>
    </div>
  )

  const tapArea = (
    <button
      onClick={togglePlay}
      aria-label={isPaused ? 'Play' : 'Pause'}
      className="absolute inset-0 z-5 bg-transparent border-none cursor-pointer [-webkit-tap-highlight-color:transparent]"
    />
  )

  /* ── Mobile: compact product card ── */
  const mobileProductCard = (p: MobileProduct) => (
    <a
      key={p.id}
      href={p.affiliate_link || `/product/${p.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={CN(
        'shrink-0 flex h-[96px] bg-white/98 overflow-hidden',
        'border border-white/70 shadow-lg',
        'transition-transform shadow duration-200',
        'active:scale-96 active:shadow-md',
        '[scroll-snap-align:start]',
        'w-[clamp(260px,72vw,320px)]',
      )}
    >
      <div className="w-[96px] h-full shrink-0 bg-gray-50 overflow-hidden relative">
        <img src={p.image} alt={p.name} loading="lazy" decoding="async" draggable={false}
          className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 py-[0.65rem] px-[0.875rem] flex flex-col justify-center gap-[0.2rem] min-w-0 text-black">
        {p.brand && <span className="text-[0.625rem] tracking-wider text-muted font-semibold leading-[1.2]">{p.brand}</span>}
        <h3 className="text-xs font-medium tracking-wider leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap m-0">{p.name}</h3>
        <span className="text-[0.8rem] font-semibold tracking-wide text-black">Rs {p.price.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex items-center pr-[0.875rem] text-black opacity-60">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </div>
    </a>
  )

  // Action button (reusable)
  const ActionBtn = ({ onClick, ariaLabel, children }: { onClick: () => void; ariaLabel: string; children: React.ReactNode }) => (
    <button
      className="flex flex-col items-center gap-[0.25rem] text-white transition-transform"
      onClick={onClick}
      aria-label={ariaLabel}
    >{children}</button>
  )

  const actionClasses = 'flex flex-col items-center gap-[0.25rem] text-white'

  /* ═══════════════════════════════════════════════════════════════
     MOBILE
     ═══════════════════════════════════════════════════════════════ */
  const mobileView = (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      <video ref={mobileVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={reel.videoUrl} poster={reel.thumbnailUrl}
        autoPlay loop muted playsInline />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 18%, transparent 35%, transparent 55%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.65) 100%)',
      }} />
      {tapArea}
      {pauseIcon}
      {progressBar(mobileProgressRef)}

      {/* Mobile header */}
      <header className="absolute top-0 left-0 right-0 z-[15] px-5 flex items-center justify-between pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <Link href="/" aria-label="Back to home" className="flex items-center justify-center w-10 h-10 text-white opacity-90">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <span className="text-[0.6rem] tracking-wide text-white/7 font-medium">{reel.category}</span>
        <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="flex items-center justify-center w-10 h-10 text-white opacity-90">
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          )}
        </button>
      </header>

      {/* Mobile right-side actions */}
      <div className="absolute right-3 bottom-48 z-15 flex flex-col items-center gap-6">
        <button onClick={toggleLike} aria-label="Like" className={actionClasses}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? 'var(--color-white)' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <span className="text-[0.55rem] tracking-[0.08em] opacity-85 font-medium">{formatCount(likeCount)}</span>
        </button>
        <button onClick={handleShare} aria-label="Share" className={actionClasses}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
        </button>
        <div className={actionClasses}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          <span className="text-[0.55rem] tracking-[0.08em] opacity-85 font-medium">{formatCount(reel.views)}</span>
        </div>
      </div>

      {/* Mobile bottom product carousel */}
      {mobileProducts.length > 0 && (
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
          className="absolute bottom-0 left-0 right-0 z-15 pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div onClick={() => setIsBottomSheetOpen(true)}
            className="py-1 px-5 pb-3 flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-9 h-1 rounded-[2px] bg-white/40 mb-[0.25rem]" />
            <div className="flex items-center gap-1 w-full">
              <span className="text-[0.55rem] font-medium tracking-widest text-white/60">{mobileProducts.length} {mobileProducts.length === 1 ? 'product' : 'products'}</span>
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-[0.55rem] text-white/50 flex items-center gap-[0.25rem]">
                Swipe up for more
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
              </span>
            </div>
          </div>
          <div className="hide-scrollbar flex gap-[0.625rem] overflow-x-auto py-1 px-5 pb-4 [scroll-snap-type:x_mandatory]">
            {mobileProducts.map((p) => mobileProductCard(p))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Overlay */}
      {isBottomSheetOpen && (
        <div onClick={() => setIsBottomSheetOpen(false)}
          className="absolute inset-0 z-30 bg-black/50 animate-fade-in backdrop-blur-sm"
        />
      )}

      {/* Mobile Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-xl h-[70vh] flex flex-col shadow-lg overflow-hidden shadow-black/30 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform:  isBottomSheetOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div
          onTouchStart={handleSheetTouchStart} onTouchEnd={handleSheetTouchEnd}
          onClick={() => setIsBottomSheetOpen(false)}
          className="shrink-0 flex flex-col items-center py-3 px-5 pb-4 border-b border-border cursor-pointer"
        >
          <div className="w-10 h-1 rounded-[2px] bg-gray-200 mb-[0.75rem]" />
          <div className="flex w-full justify-center items-center">
            <span className="text-xs tracking-wider text-muted font-semibold">Shop the reel</span>
          </div>
        </div>

        <div className="flex-1 hide-scrollbar overflow-y-auto p-5">
          <div className={PRODUCT_GRID_CLASS}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════════════════════
     DESKTOP
     ═══════════════════════════════════════════════════════════════ */
  const desktopView = (
    <div className="flex w-full h-dvh bg-black overflow-hidden">
      {/* ── Left: Video ── */}
      <div className="flex-[3] min-w-0 relative flex items-center justify-center bg-black">
        <div className="relative w-full h-full overflow-hidden">
          <video ref={desktopVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={reel.videoUrl} poster={reel.thumbnailUrl} autoPlay loop muted playsInline />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)',
          }} />
          {tapArea}
          {pauseIcon}
          {progressBar(desktopProgressRef)}

          <header className="absolute top-0 left-0 right-0 z-15 p-[1.25rem] pb-0 flex items-center justify-between">
            <Link href="/" className="flex items-center justify-center w-10 h-10 text-white opacity-90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="m15 18-6-6 6-6" /></svg>
            </Link>
            <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="flex items-center justify-center w-10 h-10 text-white opacity-90">
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
              )}
            </button>
          </header>

          <div className="absolute right-4 bottom-20 z-15 flex flex-col items-center gap-[1.25rem]">
            <button onClick={toggleLike} className={actionClasses}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? 'white' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <span className="text-[0.55rem] font-medium tracking-wider opacity-85">{formatCount(likeCount)}</span>
            </button>
            <button onClick={handleShare} className={actionClasses}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
            </button>
            <div className={actionClasses}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              <span className="text-[0.55rem] font-medium tracking-wider opacity-85">{formatCount(reel.views)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Product panel ── */}
      <div className="flex-[7] flex flex-col h-dvh bg-white text-black overflow-hidden border-l border-border">
        <div className="px-lg py-lg pb-md border-b border-border shrink-0">
          <span className="text-[0.55rem] font-medium tracking-widest text-muted block mb-1">Shop the reel</span>
          <h2 className="font-light tracking-tight uppercase leading-[1.1] m-0 text-[clamp(1.2rem,2vw,1.6rem)]">{reel.category}</h2>
          <div className="flex items-center gap-1 mt-[0.875rem]">
            <span className="text-[0.6rem] text-muted flex items-center gap-[0.35rem]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              {formatCount(reel.views)}
            </span>
            <span className="text-[0.6rem] text-muted flex items-center gap-[0.35rem]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'black' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {formatCount(likeCount)}
            </span>
          </div>
        </div>

        <div className="flex-1 hide-scrollbar overflow-y-auto p-4">
          <div className={PRODUCT_GRID_CLASS}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="font-sans uppercase select-none text-white">
      <div className="block md:hidden">{mobileView}</div>
      <div className="hidden md:flex">{desktopView}</div>
    </div>
  )
}