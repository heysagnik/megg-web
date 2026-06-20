'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getReels, type Reel } from '@/lib/api'
import { getCdnImageUrl, getCdnVideoUrl } from '@/lib/image'

export default function ReelsSection() {
  const router = useRouter()
  const [reels, setReels] = useState<Reel[]>([])
  const [playing, setPlaying] = useState<string | null>(null)
  const [loadedReels, setLoadedReels] = useState<Set<string>>(new Set())
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    getReels(10).then(setReels).catch(() => {})
  }, [])

  if (reels.length === 0) return null

  const handlePlay = (id: string) => {
    setLoadedReels((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })

    // pause any currently playing reel
    if (playing && playing !== id) {
      const prev = videoRefs.current[playing]
      if (prev) { prev.pause(); prev.currentTime = 0 }
    }
    
    // Play the current one. Note: if it's the first time hovering, 
    // the video element might not be in the DOM yet, so we also auto-play it in its ref callback.
    const vid = videoRefs.current[id]
    if (vid) {
      vid.play().catch(() => {})
    }
    setPlaying(id)
  }

  const handlePause = (id: string) => {
    const vid = videoRefs.current[id]
    if (vid) { vid.pause(); vid.currentTime = 0 }
    if (playing === id) setPlaying(null)
  }

  return (
    <section
      style={{
        paddingTop: 'var(--space-lg)',
        paddingBottom: 'var(--space-md)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .reels-row { scrollbar-width: none; }
        .reels-row::-webkit-scrollbar { display: none; }
        .reel-thumb { transition: transform 0.55s ease; }
        .reel-card:hover .reel-thumb { transform: scale(1.04); }
        .reel-play-btn { transition: opacity 0.2s; }
        .reel-card:hover .reel-play-btn { opacity: 1; }
      `}</style>

      {/* Section header */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)' }}>
            Style inspiration
          </span>
          <h2 className="text-section">Reels</h2>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        className="reels-row"
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingLeft: 'var(--container-px)',
          paddingRight: 'var(--container-px)',
          paddingBottom: '4px',
        }}
      >
        {reels.map((reel) => {
          const isPlaying = playing === reel.id
          return (
            <div
              key={reel.id}
              className="reel-card"
              style={{
                flexShrink: 0,
                width: 'clamp(150px, 22vw, 240px)',
                scrollSnapAlign: 'start',
                position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={() => handlePlay(reel.id)}
              onMouseLeave={() => handlePause(reel.id)}
              onClick={() => router.push(`/reel/${reel.id}`)}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '9 / 16',
                  overflow: 'hidden',
                  background: 'var(--color-black)',
                }}
              >
                {/* Thumbnail shown when not playing */}
                {reel.thumbnail_url && (
                  <img
                    src={getCdnImageUrl(reel.thumbnail_url, { width: 300, quality: 95 })}
                    srcSet={`${getCdnImageUrl(reel.thumbnail_url, { width: 240, quality: 95 })} 240w, ${getCdnImageUrl(reel.thumbnail_url, { width: 300, quality: 95 })} 300w, ${getCdnImageUrl(reel.thumbnail_url, { width: 480, quality: 95 })} 480w`}
                    sizes="clamp(150px, 22vw, 240px)"
                    alt={`Style reel — ${reel.category}`}
                    className="reel-thumb"
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: isPlaying ? 0 : 1,
                      transition: 'opacity 0.3s',
                    }}
                    draggable={false}
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
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: isPlaying ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                  />
                )}

                {/* Play icon overlay (hidden on hover) */}
                {!isPlaying && (
                  <div
                    className="reel-play-btn"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      background: 'rgba(0,0,0,0.15)',
                    }}
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.45)" />
                      <polygon points="16,13 30,20 16,27" fill="white" />
                    </svg>
                  </div>
                )}

                {/* Bottom gradient + category label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '0.75rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
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
