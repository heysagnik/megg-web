'use client'

import { useEffect, useRef, useCallback } from 'react'

// q_auto:low — reduces bitrate ~60-70% vs original; vc_auto serves WebM to Chrome
const PANELS = [
  'https://res.cloudinary.com/dlnf84fzs/video/upload/q_auto:low,vc_auto/v1774763266/1_sbvyts',
  'https://res.cloudinary.com/dlnf84fzs/video/upload/q_auto:low,vc_auto/v1774763250/2_zpezta',
]

export default function HeroSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null])
  const logoRef   = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number | null>(null)

  // ── Video play/pause ──────────────────────────────────────────────────────
  const tryPlay = useCallback((idx: number) => {
    videoRefs.current[idx]?.play().catch(() => {})
  }, [])

  useEffect(() => {
    tryPlay(0)
    tryPlay(1)
  }, [tryPlay])

  const handleEnter = useCallback((idx: number) => {
    videoRefs.current[idx === 0 ? 1 : 0]?.pause()
    tryPlay(idx)
  }, [tryPlay])

  const handleLeave = useCallback((idx: number) => {
    tryPlay(idx === 0 ? 1 : 0)
  }, [tryPlay])

  // ── Logo morph on scroll — rAF throttled, zero React state ───────────────
  useEffect(() => {
    const logo = logoRef.current
    if (!logo) return
    // After the null-guard above, TS still considers logo possibly-null inside
    // the nested `update` closure. Cast once here.
    const el = logo as HTMLDivElement

    const vh = window.innerHeight
    const THRESHOLD = vh * 0.85

    // Start values
    const FONT_START = Math.min(80, vh * 0.08)
    const FONT_END   = 24
    const TOP_START  = vh / 2
    const TOP_END    = 26

    function update() {
      rafRef.current = null
      const t  = Math.min(Math.max(window.scrollY / THRESHOLD, 0), 1)
      const te = 1 - Math.pow(1 - t, 3) // ease-out cubic

      if (t >= 1) {
        el.style.display = 'none'
        return
      }
      el.style.display = ''
      el.style.fontSize = `${FONT_START + (FONT_END - FONT_START) * te}px`
      el.style.top      = `${TOP_START + (TOP_END - TOP_START) * te}px`
      const ch = Math.round(255 + (10 - 255) * te)
      el.style.color = `rgb(${ch},${ch},${ch})`
    }

    function onScroll() {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    // Initial paint
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100svh',
          minHeight: '600px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {PANELS.map((src, idx) => (
          <div
            key={src}
            className={idx === 0 ? 'hero-panel-left' : 'hero-panel-right'}
            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={() => handleEnter(idx)}
            onMouseLeave={() => handleLeave(idx)}
          >
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Fashion editorial video"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            >
              <source src={`${src}.webm`} type="video/webm" />
              <source src={`${src}.mp4`} type="video/mp4" />
            </video>
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Logo — manipulated via ref, no React state/re-renders */}
      <div
        ref={logoRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          zIndex: 110,
          pointerEvents: 'none',
          fontFamily: 'var(--font-serif)',
          fontWeight: 300,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          color: 'white',
          willChange: 'top, font-size, color',
        }}
      >
        MEGG
      </div>
    </>
  )
}
