'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Video panels ─────────────────────────────────────────────────────────────

const PANELS = [
  'https://res.cloudinary.com/dlnf84fzs/video/upload/v1774763266/1_sbvyts.mp4',
  'https://res.cloudinary.com/dlnf84fzs/video/upload/v1774763250/2_zpezta.mp4',
]

// ─── HeroSection ─────────────────────────────────────────────────────────────
//
// Video logic:
//   • Both videos play by default (muted autoplay).
//   • When the cursor enters panel B, panel A pauses (remembers position).
//   • When the cursor leaves panel B (to anywhere — including the other panel
//     or outside the hero entirely), panel A resumes from where it paused.
//   • Entering panel A pauses panel B; leaving panel A resumes panel B.
//   • In short: the panel the cursor is NOT hovering over always plays.

export default function HeroSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null])

  // ── Start both videos as soon as they're ready ───────────────────────────
  const tryPlay = useCallback((idx: number) => {
    const v = videoRefs.current[idx]
    if (!v) return
    v.play().catch(() => {})
  }, [])

  useEffect(() => {
    tryPlay(0)
    tryPlay(1)
  }, [tryPlay])

  // ── Hover handlers ────────────────────────────────────────────────────────
  // hoveredIdx: which panel the cursor is currently over (-1 = neither)

  const handleEnter = useCallback((hoveredIdx: number) => {
    const otherIdx = hoveredIdx === 0 ? 1 : 0
    videoRefs.current[otherIdx]?.pause()
    // Hovered panel resumes (it may have been paused by previous hover)
    tryPlay(hoveredIdx)
  }, [tryPlay])

  const handleLeave = useCallback((leftIdx: number) => {
    const otherIdx = leftIdx === 0 ? 1 : 0
    // Resume the other panel from wherever it paused
    tryPlay(otherIdx)
  }, [tryPlay])

  // ── Logo scroll animation ──────────────────────────────────────────────────
  const [scrollY, setScrollY] = useState(0)
  const [viewH,   setViewH]   = useState<number | null>(null)

  useEffect(() => {
    setViewH(window.innerHeight)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const THRESHOLD = viewH != null ? viewH * 0.85 : 1
  const t  = viewH != null ? Math.min(Math.max(scrollY / THRESHOLD, 0), 1) : 0
  const te = 1 - Math.pow(1 - t, 3) // ease-out cubic

  const fontSizePx = 80 + (24 - 80) * te
  const topStart   = viewH != null ? viewH / 2 : 0
  const topPx      = topStart + (26 - topStart) * te
  const ch         = Math.round(255 + (10 - 255) * te)
  const colour     = `rgb(${ch},${ch},${ch})`
  const logoVisible = viewH != null && t < 1

  return (
    <>
      {/* ── Hero viewport ────────────────────────────────────────────────── */}
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
            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={() => handleEnter(idx)}
            onMouseLeave={() => handleLeave(idx)}
          >
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              src={src}
              muted
              loop
              playsInline
              preload="none"
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
              <track kind="captions" srcLang="en" label="English" />
            </video>
          </div>
        ))}

        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Scroll-morphing MEGG logotype ────────────────────────────────── */}
      {logoVisible && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '50%',
            top: topPx,
            transform: 'translate(-50%, -50%)',
            zIndex: 110,
            pointerEvents: 'none',
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: fontSizePx,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: colour,
            willChange: 'top, font-size, color',
          }}
        >
          MEGG
        </div>
      )}
    </>
  )
}
