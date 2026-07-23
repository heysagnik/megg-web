'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getReels, genderFromSearchParams, type Reel } from '@/lib/api'
import { getCdnImageUrl, getCdnVideoUrl } from '@/lib/image'

export default function ReelsSection() {
  const router = useRouter()
  const gender = genderFromSearchParams(useSearchParams())
  const [reels, setReels] = useState<Reel[]>([])
  const [playing, setPlaying] = useState<string | null>(null)
  const [loadedReels, setLoadedReels] = useState<Set<string>>(new Set())
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    setReels([])
    getReels(10, { gender }).then(setReels).catch(() => {})
  }, [gender])

  if (reels.length === 0) return null

  const handlePlay = (id: string) => {
    setLoadedReels((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })

    if (playing && playing !== id) {
      const prev = videoRefs.current[playing]
      if (prev) { prev.pause(); prev.currentTime = 0 }
    }

    const vid = videoRefs.current[id]
    if (vid) vid.play().catch(() => {})
    setPlaying(id)
  }

  const handlePause = (id: string) => {
    const vid = videoRefs.current[id]
    if (vid) { vid.pause(); vid.currentTime = 0 }
    if (playing === id) setPlaying(null)
  }

  return (
    <section className="pt-lg pb-md overflow-hidden">
      {/* Section header */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)] mb-lg flex items-end justify-between gap-sm">
        <div className="flex flex-col gap-1">
          <span className="text-label text-muted">Style inspiration</span>
          <h2 className="text-section">Reels</h2>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        className="hide-scrollbar flex gap-[0.75rem] overflow-x-auto [scroll-snap-type:x_mandatory] py-[4px]"
        style={{
          paddingLeft:        'var(--container-px)',
          paddingRight:       'var(--container-px)',
        }}
      >
        {reels.map((reel) => {
          const isPlaying = playing === reel.id
          return (
            <div
              key={reel.id}
              className="group relative cursor-pointer shrink-0 [scroll-snap-align:start]"
              style={{
                width:           'clamp(150px, 22vw, 240px)',
              }}
              onMouseEnter={() => handlePlay(reel.id)}
              onMouseLeave={() => handlePause(reel.id)}
              onClick={() => router.push(`/reel/${reel.id}`)}
            >
              <div className="relative overflow-hidden bg-black aspect-[9/16]">
                {/* Thumbnail shown when not playing */}
                {reel.thumbnail_url && (
                  <img
                    src={getCdnImageUrl(reel.thumbnail_url)}
                    srcSet={`${getCdnImageUrl(reel.thumbnail_url)} 240w, ${getCdnImageUrl(reel.thumbnail_url)} 300w, ${getCdnImageUrl(reel.thumbnail_url)} 480w`}
                    sizes="clamp(150px, 22vw, 240px)"
                    alt={`Style reel — ${reel.category}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{
                      opacity:    isPlaying ? 0 : 1,
                    }}
                  />
                )}

                {/* Video — autoplay on hover */}
                {loadedReels.has(reel.id) && (
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el
                      if (el && isPlaying) el.play().catch(() => {})
                    }}
                    src={getCdnVideoUrl(reel.video_url)}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity:    isPlaying ? 1 : 0,
                    }}
                  />
                )}

                {/* Play icon overlay (hidden on hover) */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.45)" />
                      <polygon points="16,13 30,20 16,27" fill="white" />
                    </svg>
                  </div>
                )}

                {/* Bottom gradient + category label */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                  }}
                >
                  <p className="font-sans text-[0.6rem] tracking-wider uppercase text-white/80">
                    {reel.category}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
