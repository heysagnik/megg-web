'use client'

import { useState } from 'react'

/**
 * Native share / clipboard wrapper. Tries `navigator.share` first
 * (mobile + desktop Safari), falls back to `clipboard.writeText`
 * and exposes a 2s "copied" flag for visual feedback.
 */
export interface ShareState {
  copied: boolean
  handleShare: () => Promise<void>
}

export function useShareHandler({
  name,
  brand,
  price,
}: {
  name: string
  brand: string
  price: string
}): ShareState {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    const text = `${name} by ${brand} — ${price}`
    if (navigator.share) {
      try { await navigator.share({ title: `${name} — MEGG`, text, url }) } catch { /* dismissed */ }
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return { copied, handleShare }
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export interface ShareButtonProps {
  name: string
  brand: string
  price: string
}

/**
 * Floating share button in the top-right corner of the mobile
 * image carousel. White pill on a translucent dark backdrop.
 */
export function DesktopShareButton({ name, brand, price }: ShareButtonProps) {
  const { copied, handleShare } = useShareHandler({ name, brand, price })
  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share product"
      className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/88 backdrop-blur-sm border border-black/10 cursor-pointer text-black transition-colors hover:bg-white"
    >
      {copied ? <CheckIcon /> : <ShareIcon />}
    </button>
  )
}

/**
 * Inline square share button used in the sticky info panel
 * next to the price.
 */
export function InlineShareButton({ name, brand, price }: ShareButtonProps) {
  const { copied, handleShare } = useShareHandler({ name, brand, price })
  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share product"
      className="flex items-center justify-center w-9 h-9 bg-transparent border border-border-mid cursor-pointer text-black shrink-0 hover:bg-gray-50"
    >
      {copied ? <CheckIcon /> : <ShareIcon />}
    </button>
  )
}
