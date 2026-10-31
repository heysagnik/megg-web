
'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'

const PANELS = [
  {
    desktopSrc:
      'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner1-1080p.mp4',
    mobileSrc:
      'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner1-720p.mp4',
    poster: '/images/hero-men-poster.webp',
    label: 'Men',
    href: '/',
  },
  {
    desktopSrc:
      'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner3-1080p.mp4',
    mobileSrc:
      'https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner3-720p.mp4',
    poster: '/images/hero-women-poster.webp',
    label: 'Women',
    href: '/women',
  },
]

export default function HeroSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null])
  const logoRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const [activePanel, setActivePanel] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  // Select the appropriate video resolution for the viewport.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1200px)')

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches)
    }

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  // Attempt playback; browsers may restrict autoplay.
  const tryPlay = useCallback((idx: number) => {
    const video = videoRefs.current[idx]
    if (!video) return

    video.play().catch(() => {
      // Keep the poster visible if playback is blocked.
    })
  }, [])

  // Start both videos automatically on mobile.
  useEffect(() => {
    if (isDesktop !== false) return
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Browser may restrict autoplay.
        })
      }
    })
  }, [isDesktop])

  // Preserve existing hover behavior: play the active panel
  // and pause the other video.
  const handleEnter = useCallback(
    (idx: number) => {
      setActivePanel(idx)

      const otherVideo = videoRefs.current[idx === 0 ? 1 : 0]
      otherVideo?.pause()

      tryPlay(idx)
    },
    [tryPlay]
  )

  const handleBannerLeave = useCallback((idx: number) => {
    videoRefs.current[idx]?.pause()

    setActivePanel((current) => (current === idx ? null : current))
  }, [])

  // Logo morph on scroll, throttled with requestAnimationFrame.
  useEffect(() => {
    const logo = logoRef.current
    if (!logo) return

    const el = logo

    function update() {
      rafRef.current = null

      const vh = window.innerHeight
      const vw = window.innerWidth
      const threshold = vh * 0.85
      const t = Math.min(Math.max(window.scrollY / threshold, 0), 1)

      // Keep MEGG at the top on phones.
      if (vw < 640) {
        if (t >= 1) {
          el.style.display = 'none'
          return
        }

        el.style.display = 'block'
        el.style.fontSize = '28px'
        el.style.top = '24px'
        el.style.color = 'rgb(255, 255, 255)'
        return
      }

      const fontStart =
        vw < 1200
          ? Math.min(48, vh * 0.05)
          : Math.min(80, vh * 0.08)

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
      <div className="relative flex h-[100svh] min-h-0 w-full flex-col overflow-hidden min-[1200px]:flex-row">
        {PANELS.map(
          ({ desktopSrc, mobileSrc, poster, label, href }, idx) => {
            const src =
              isDesktop === null
                ? null
                : isDesktop
                  ? desktopSrc
                  : mobileSrc

            return (
              <div
                key={desktopSrc}
                className="relative h-1/2 min-h-0 w-full flex-1 overflow-hidden min-[1200px]:h-full min-[1200px]:w-1/2 min-[1200px]:flex-none"
                onMouseEnter={
                  isDesktop === true ? () => handleEnter(idx) : undefined
                }
                onMouseLeave={
                  isDesktop === true ? () => handleBannerLeave(idx) : undefined
                }
                onFocusCapture={
                  isDesktop === true ? () => handleEnter(idx) : undefined
                }
                onClick={
                  isDesktop === false ? () => handleEnter(idx) : undefined
                }
              >
                {src !== null && (
                  <video
                    key={src}
                    ref={(el) => {
                      videoRefs.current[idx] = el
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={poster}
                    aria-label={`MEGG curated fashion editorial ${
                      idx === 0 ? 'left' : 'right'
                    } panel`}
                    className="absolute inset-0 block h-full w-full object-cover"
                  >
                    <source src={src} type="video/mp4" />
                  </video>
                )}

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ${
                    activePanel !== null && activePanel !== idx
                      ? 'opacity-25'
                      : 'opacity-0'
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
            )
          }
        )}
      </div>

      <div
        ref={logoRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 z-[110] whitespace-nowrap font-serif font-light uppercase leading-none tracking-tight text-white"
        style={{
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        MEGG
      </div>
    </>
  )
}
