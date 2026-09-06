'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { genderPath } from '@/lib/genderPath'
import type { Gender } from '@/lib/api'

/* ─── Types ──────────────────────────────────────────── */
interface NavSidebarProps {
  id?: string
  gender: Gender
  isOpen: boolean
  onClose: () => void
}

/* ─── Data ───────────────────────────────────────────── */
const MEN_CATEGORY_ITEMS = [
  { label: 'Shirts',           slug: 'Shirt' },
  { label: 'T-Shirts',         slug: 'Tshirt' },
  { label: 'Jeans',            slug: 'Jeans' },
  { label: 'Shoes',            slug: 'Shoes' },
  { label: 'Jackets',          slug: 'Jacket' },
  { label: 'Hoodies',          slug: 'Hoodies' },
  { label: 'Sweatshirts',      slug: 'Sweatshirt' },
  { label: 'Sweaters',         slug: 'Sweater' },
  { label: 'Track Pants',      slug: 'Trackpants' },
  { label: 'Accessories',      slug: 'Mens Accessories' },
  { label: 'Innerwear',        slug: 'Innerwear' },
  { label: 'Traditional',      slug: 'Traditional' },
  { label: 'Perfume',          slug: 'Perfume' },
  { label: 'Body Care',        slug: 'Body Care' },
  { label: 'Daily Essentials', slug: 'Daily Essentials' },
]

const WOMEN_CATEGORY_ITEMS = [
  { label: 'Co-ord Sets',        slug: 'Co-ord Sets' },
  { label: 'Dresses',            slug: 'Dresses' },
  { label: 'Footwear',           slug: 'Footwear' },
  { label: 'Jeans',              slug: 'Jeans' },
  { label: 'Kurtas & Ethnic Wear', slug: 'Kurtas & Ethnic Wear' },
  { label: 'Perfume',            slug: 'Perfume' },
  { label: 'Shirts',             slug: 'Shirts' },
  { label: 'Shorts',             slug: 'Shorts' },
  { label: 'Skirts',             slug: 'Skirts' },
  { label: 'T-Shirts',           slug: 'T-Shirts' },
  { label: 'Trousers & Bottoms', slug: 'Trousers & Bottoms' },
]

export default function NavSidebar({ id, gender, isOpen, onClose }: NavSidebarProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname() ?? ''

  const SHOP_ITEMS = [
    { label: 'New Arrivals',  to: `${genderPath(gender)}#new-arrivals` },
    { label: 'All Products',  to: genderPath(gender, '/products') },
    { label: 'Under Rs. 699', to: genderPath(gender, '/under699') },
  ]

  const CATEGORY_ITEMS = (gender === 'women' ? WOMEN_CATEGORY_ITEMS : MEN_CATEGORY_ITEMS)
    .map(c => ({ label: c.label, to: genderPath(gender, `/category/${encodeURIComponent(c.slug)}`) }))

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

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed left-0 top-0 bottom-0 z-[9999] bg-white text-black flex flex-col will-change-transform transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] w-full sm:w-[400px] h-screen shadow-[8px_0_40px_rgba(0,0,0,0.12)]"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Top bar — wordmark + close */}
        <div className="flex items-center justify-between shrink-0 px-6 md:px-8 h-[var(--header-height)] border-b border-border-mid">
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

        {/* Gender switch — mobile only; on larger screens it lives in the header */}
        <div className="sm:hidden shrink-0 px-6 md:px-8 py-4 border-b border-border-mid">
          <div className="relative grid grid-cols-2 bg-neutral-100 rounded-full p-1">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-black rounded-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{ transform: gender === 'women' ? 'translateX(100%)' : 'translateX(0%)' }}
            />
            <Link
              href={genderPath('men')}
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
              aria-current={gender === 'men' ? 'page' : undefined}
              className={`relative z-10 flex items-center justify-center py-2 text-label no-underline transition-colors duration-300 ${gender === 'men' ? 'text-white' : 'text-neutral-500'}`}
            >
              Men
            </Link>
            <Link
              href={genderPath('women')}
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
              aria-current={gender === 'women' ? 'page' : undefined}
              className={`relative z-10 flex items-center justify-center py-2 text-label no-underline transition-colors duration-300 ${gender === 'women' ? 'text-white' : 'text-neutral-500'}`}
            >
              Women
            </Link>
          </div>
        </div>

        {/* Scrollable body */}
        <nav aria-label="Main navigation" className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">

          {/* Shop utility strip */}
          <div className="px-6 md:px-8 pt-4 pb-1 border-b border-border">
            <ul>
              {SHOP_ITEMS.map((item) => (
                <li key={item.label} className="border-b border-border last:border-b-0">
                  <Link
                    href={item.to}
                    onClick={onClose}
                    tabIndex={isOpen ? 0 : -1}
                    className="text-label group flex items-center justify-between py-3.5 text-black no-underline"
                  >
                    <span>{item.label}</span>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                      className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true">
                      <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Category index — the drawer's editorial centerpiece */}
          <div className="px-6 md:px-8 pt-6 pb-8">
            <p className="text-caption mb-2">Shop by Category</p>
            <ul>
              {CATEGORY_ITEMS.map((item, i) => {
                const isActive = pathname === item.to
                return (
                  <li
                    key={item.label}
                    className={`border-b border-border first:border-t ${isOpen ? 'nav-row-in' : ''}`}
                    style={isOpen ? { animationDelay: `${40 + i * 22}ms` } : undefined}
                  >
                    <Link
                      href={item.to}
                      onClick={onClose}
                      tabIndex={isOpen ? 0 : -1}
                      aria-current={isActive ? 'page' : undefined}
                      className="text-section group flex items-baseline justify-between py-2.5 no-underline"
                      style={{ fontSize: 'clamp(1.15rem, 4vw, 1.5rem)' }}
                    >
                      <span
                        className="relative text-black transition-opacity duration-200 group-hover:opacity-60"
                      >
                        {item.label}
                        <span
                          className="absolute left-0 -bottom-0.5 h-px bg-black transition-all duration-300 ease-out"
                          style={{ width: isActive ? '100%' : '0%' }}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* App banner */}
        <div className="shrink-0 p-6 md:p-8 pt-0 border-t border-border">
          <a
            href="/download"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            className="flex flex-col items-center justify-center gap-2.5 bg-black text-white px-5 py-7 mt-6 no-underline text-center"
          >
            <span className="font-serif text-[1.05rem] font-normal tracking-tight uppercase text-white leading-none select-none">
              MEGG
            </span>
            <p className="text-label text-white">Get the MEGG App</p>
          </a>
        </div>
      </div>
    </>
  )
}
