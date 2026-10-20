'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import { getCdnVideoUrl } from '@/lib/image'

// q_auto:low — reduces bitrate ~60-70% vs original; vc_auto serves WebM to Chrome
const PANELS = [
  {
    src: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner1.MP4',
    label: 'Men',
    href: '/',
  },
  {
    src: 'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner3.mp4',
    label: 'Women',
    href: '/women',
  },
]

export default function HeroSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null])
  const logoRef   = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number | null>(null)
  const [activePanel, setActivePanel] = useState<number | null>(null)

  // ── Video play/pause ──────────────────────────────────────────────────────
  const tryPlay = useCallback((idx: number) => {
    videoRefs.current[idx]?.play().catch(() => {})
  }, [])

  useEffect(() => {
    tryPlay(0)
    tryPlay(1)
  }, [tryPlay])

  const handleEnter = useCallback((idx: number) => {
    setActivePanel(idx)
    videoRefs.current[idx === 0 ? 1 : 0]?.pause()
    tryPlay(idx)
  }, [tryPlay])

  const handleBannerLeave = useCallback(() => {
    setActivePanel(null)
    tryPlay(0)
    tryPlay(1)
  }, [tryPlay])

  // ── Logo morph on scroll — rAF throttled, zero React state ───────────────
  useEffect(() => {
  const logo = logoRef.current
  if (!logo) return

  const el = logo

  function update() {
    rafRef.current = null

    const vh = window.innerHeight
    const vw = window.innerWidth
    const threshold = vh * 0.85

    // Smaller logo on phones and tablets; preserve desktop sizing.
    const fontStart =
      vw < 640
        ? Math.min(36, vh * 0.045)
        : vw < 1200
          ? Math.min(48, vh * 0.05)
          : Math.min(80, vh * 0.08)

    const t = Math.min(
      Math.max(window.scrollY / threshold, 0),
      1
    )
    const eased = 1 - Math.pow(1 - t, 3)

    if (t >= 1) {
      el.style.display = 'none'
      return
    }

    el.style.display = 'block'
    el.style.fontSize = `${
      fontStart + (24 - fontStart) * eased
    }px`
    el.style.top = `${vh / 2 + (26 - vh / 2) * eased}px`

    const color = Math.round(255 + (10 - 255) * eased)
    el.style.color = `rgb(${color}, ${color}, ${color})`
  }

  function scheduleUpdate() {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(update)
    }
  }

   // Initialize immediately and update on scroll or viewport resize.
  update()
  window.addEventListener('scroll', scheduleUpdate, {
    passive: true,
  })
  window.addEventListener('resize', scheduleUpdate, {
    passive: true,
  })

  return () => {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }
}, [])

  return (
    <>
      <div
        className="relative flex h-[100svh] min-h-0 w-full flex-col overflow-hidden min-[1200px]:flex-row"        >
        {PANELS.map(({ src, label, href }, idx) => (
          <div
            key={src}
            className="relative h-1/2 min-h-0 w-full flex-1 overflow-hidden min-[1200px]:h-full min-[1200px]:w-1/2 min-[1200px]:flex-none" onMouseEnter={() => handleEnter(idx)}            >
            <video
              ref={(el) => { videoRefs.current[idx] = el }}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={`MEGG curated fashion editorial ${idx === 0 ? 'left' : 'right'} panel`}
              className="absolute inset-0 w-full h-full object-cover block"
            >
              <source src={getCdnVideoUrl(`${src}.webm`)} type="video/webm" />
              <source src={getCdnVideoUrl(`${src}`)} type="video/mp4" />
            </video>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ${
                activePanel !== null && activePanel !== idx ? 'opacity-25' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 px-4 pb-8 pt-12 text-center sm:pb-10">
              <h2 className="font-serif text-base font-normal leading-tight text-white sm:text-2xl">
                {label}
              </h2>
              <Link
                href={href}
                className="pointer-events-auto inline-flex min-h-8 items-center text-xs font-normal text-white underline-offset-4 hover:underline focus-visible:outline-black"
                aria-label={`Shop ${label.toLowerCase()} fashion`}
              >
                Shop now
              </Link>
            </div>
          </div>
        ))}

      </div>

      {/* Logo — manipulated via ref, no React state/re-renders */}
      <div
        ref={logoRef}
        aria-hidden="true"
        className="fixed left-1/2 z-[110] pointer-events-none font-serif font-light tracking-tight uppercase leading-none whitespace-nowrap text-white"
        style={{
          top:        '50%',
          transform:  'translateX(-50%) translateY(-50%)',
        }}
      >
        MEGG
      </div>
    </>
  )
}
