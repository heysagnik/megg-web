'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useFocusTrap } from '@/hooks/useFocusTrap'

/* ─── Types ──────────────────────────────────────────── */
interface NavSidebarProps {
  id?: string
  isOpen: boolean
  onClose: () => void
}

/* ─── Data ───────────────────────────────────────────── */
const SHOP_ITEMS = [
  { label: 'NEW ARRIVALS',  to: '/#new-arrivals' },
  { label: 'ALL PRODUCTS',  to: '/products' },
  { label: 'UNDER RS. 699', to: '/under699' },
]

const CATEGORY_ITEMS = [
  { label: 'SHIRTS',           to: '/category/Shirt' },
  { label: 'T-SHIRTS',         to: '/category/Tshirt' },
  { label: 'JEANS',            to: '/category/Jeans' },
  { label: 'SHOES',            to: '/category/Shoes' },
  { label: 'JACKETS',          to: '/category/Jacket' },
  { label: 'HOODIES',          to: '/category/Hoodies' },
  { label: 'SWEATSHIRTS',      to: '/category/Sweatshirt' },
  { label: 'SWEATERS',         to: '/category/Sweater' },
  { label: 'TRACK PANTS',      to: '/category/Trackpants' },
  { label: 'ACCESSORIES',      to: '/category/Mens Accessories' },
  { label: 'INNERWEAR',        to: '/category/Innerwear' },
  { label: 'TRADITIONAL',      to: '/category/Traditional' },
  { label: 'PERFUME',          to: '/category/Perfume' },
  { label: 'BODY CARE',        to: '/category/Body Care' },
  { label: 'DAILY ESSENTIALS', to: '/category/Daily Essentials' },
]

export default function NavSidebar({ id, isOpen, onClose }: NavSidebarProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useFocusTrap({ active: isOpen, containerRef: drawerRef, onEscape: onClose })

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer panel — Modern White Zara Aesthetic */}
      <div
        ref={drawerRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed left-0 top-0 bottom-0 z-[9999] bg-white text-black flex flex-col justify-between will-change-transform transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] w-full sm:w-[360px] h-screen p-6 md:p-8"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Top Header — wordmark + close */}
        <div className="flex items-center justify-between shrink-0 mb-8 pb-4 border-b border-border">
          <span className="font-serif text-[1.1rem] font-normal tracking-tight uppercase text-black leading-none select-none">
            MEGG
          </span>
          <button
            type="button"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-7 h-7 bg-transparent border-none cursor-pointer text-black hover:opacity-60 transition-opacity p-0 shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" focusable="false">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto pr-2 hide-scrollbar space-y-8 font-sans">

          {/* Shop Highlight Section */}
          <div className="space-y-1">
            {SHOP_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.to}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                className="group flex items-center justify-between py-2 font-sans text-[0.825rem] font-medium tracking-[0.14em] uppercase text-black no-underline"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.label}
                </span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                  className="shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>

          <div className="border-t border-border" />

          {/* Categories List */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-neutral-400 font-normal mb-4">
              CATEGORIES
            </p>
            <div className="space-y-0.5">
              {CATEGORY_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                  className="block py-1.5 font-sans text-[0.775rem] font-normal tracking-[0.12em] uppercase text-neutral-600 hover:text-black hover:translate-x-0.5 transition-all no-underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer — Ultra-Luxury App Banner Card */}
        <div className="pt-6 shrink-0 border-t border-border">
          <a
            href="/download"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            className="group relative block bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white p-5 border border-neutral-800/80 hover:border-neutral-700 shadow-md transition-all duration-300 no-underline overflow-hidden"
          >
            {/* Ambient glow and subtle luxury gradient shine */}
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/[0.04] blur-xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="flex items-center justify-between relative z-10 mb-3.5">
              <img src="/logo.png" alt="Megg" className="h-7 w-auto object-contain shrink-0" />

              {/* Minimal CTA arrow button */}
              <div className="w-7 h-7 bg-white text-black flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:bg-neutral-100">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <p className="font-sans text-[0.75rem] font-light tracking-[0.06em] text-neutral-200 uppercase leading-snug relative z-10">
              EXPERIENCE MEGG ON MOBILE APP
            </p>
          </a>
        </div>
      </div>
    </>
  )
}
