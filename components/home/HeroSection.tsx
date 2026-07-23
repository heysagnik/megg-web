'use client'

import { useEffect, useRef, useCallback } from 'react'
import { getCdnVideoUrl } from '@/lib/image'

// q_auto:low — reduces bitrate ~60-70% vs original; vc_auto serves WebM to Chrome
const PANELS = [
  'https://media.meggfashion.in/web_hero/hero1',
  'https://media.meggfashion.in/web_hero/hero2',
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
    const el = logo as HTMLDivElement

    const vh = window.innerHeight
    const THRESHOLD = vh * 0.85

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

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div className="relative w-full overflow-hidden flex h-[100svh] min-h-[600px]">
        {PANELS.map((src, idx) => (
          <div
            key={src}
            className={`relative flex-1 overflow-hidden max-[600px]:hidden ${idx === 0 ? '' : 'max-[600px]:hidden'}`}
            onMouseEnter={() => handleEnter(idx)}
            onMouseLeave={() => handleLeave(idx)}
          >
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              muted
              loop
              playsInline
              preload="none"
              poster={`https://media.meggfashion.in/${src}.jpg`}
              aria-label={`MEGG curated fashion editorial ${idx === 0 ? 'left' : 'right'} panel`}
              className="absolute inset-0 w-full h-full object-cover block"
            >
              <source src={getCdnVideoUrl(`${src}.webm`)} type="video/webm" />
            </video>
          </div>
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 100%)',
          }}
        />
      </div>

      {/* Logo — manipulated via ref, no React state/re-renders */}
      <div
        ref={logoRef}
        aria-hidden="true"
        className="fixed left-1/2 z-[110] pointer-events-none font-serif font-light tracking-tight uppercase leading-none whitespace-nowrap text-white"
        style={{
          top:        '50%',
          transform:  'translateX(-50%) translateY(-50%)',
          willChange: 'top, font-size, color',
        }}
      >
        MEGG
      </div>
    </>
  )
}
