'use client'

import { useEffect, useState } from 'react'
import { getCdnImageUrl } from '@/lib/image'

const STORAGE_KEY = 'megg_app_sheet_dismissed'
const trackDownloadClick = () => {
  if (typeof window === 'undefined') return
  try {
    if ((window as any).umami) {
      (window as any).umami.track('download_app_click', { source: 'bottom_sheet' })
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', 'download_app_click', {
        event_category: 'engagement',
        event_label: 'bottom_sheet'
      })
    }
  } catch { /* ignore */ }
}

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
        className="fixed inset-0 z-[500] bg-black/35 animate-fade-in"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Open in app"
        className="fixed bottom-0 left-0 right-0 z-[501] bg-white pt-md px-sm pb-lg animate-sheet-up"
      >
        {/* Drag handle */}
        <div className="bg-border-mid mx-auto mb-sm h-1 w-9" />

        {/* Icon + copy */}
        <div className="mb-sm flex items-center gap-[0.875rem]">
          <img
            src={getCdnImageUrl('https://meggfashion.in/logo.png')}
            alt="Megg"
            width={48}
            height={48}
            className="shrink-0 object-contain"
          />
          <div>
            <p className="font-sans text-[0.8rem] tracking-wide uppercase text-black font-medium mb-[0.2rem]">
              Open in Megg App
            </p>
            <p className="font-sans text-[0.7rem] text-muted tracking-[0.02em]">
              Faster browsing & exclusive app deals
            </p>
          </div>
        </div>

        {/* Actions */}
        <a
          href="/download"
          className="block w-full text-center font-sans text-xs tracking-wider uppercase bg-black text-white p-[0.875rem] mb-[0.625rem] hover:opacity-[0.82] transition"
          onClick={() => {
            trackDownloadClick()
            dismiss()
          }}
        >
          <span className="text-white block">Download App</span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="block w-full text-center font-sans text-xs tracking-wider uppercase bg-transparent border border-border-mid text-muted p-[0.875rem] cursor-pointer hover:text-black"
        >
          Continue Here
        </button>
      </div>
    </>
  )
}
