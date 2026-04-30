'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'megg_app_sheet_dismissed'

export default function AppBottomSheet() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // only on mobile, only once per session
    const isMobile = window.innerWidth < 768
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (isMobile && !dismissed) {
      // slight delay so the page renders first
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 500,
          animation: 'fade-in 200ms ease both',
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Open in app"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 501,
          background: 'var(--color-white)',
          padding: '1.5rem 1.25rem 2rem',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          animation: 'sheet-up 300ms cubic-bezier(0.32,0.72,0,1) both',
        }}
      >
        <style>{`
          @keyframes sheet-up {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>

        {/* Drag handle */}
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          background: 'var(--color-border-mid)',
          margin: '0 auto 1.25rem',
        }} />

        {/* Icon + copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <img
            src="/logo.png"
            alt="Megg"
            style={{ width: '48px', height: '48px', flexShrink: 0, objectFit: 'contain', borderRadius: '10px' }}
          />
          <div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--color-black)', fontWeight: 500, marginBottom: '0.2rem',
            }}>
              Open in Megg App
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
              color: 'var(--color-muted)', letterSpacing: '0.02em',
            }}>
              Faster browsing &amp; exclusive app deals
            </p>
          </div>
        </div>

        {/* Actions */}
        <a
          href="https://play.google.com/store/apps/details?id=com.megg.megg"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'var(--color-black)', color: '#ffffff',
            padding: '0.875rem', marginBottom: '0.625rem',
          }}
          onClick={dismiss}
        >
          <span style={{ color: '#ffffff', display: 'block' }}>Download App</span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'none', border: '1px solid var(--color-border-mid)',
            color: '#767676', padding: '0.875rem', cursor: 'pointer',
          }}
        >
          Continue Here
        </button>
      </div>
    </>
  )
}
