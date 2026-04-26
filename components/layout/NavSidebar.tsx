'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Types ──────────────────────────────────────────── */
interface NavSidebarProps {
  id?: string
  isOpen: boolean
  onClose: () => void
}

/* ─── Data ───────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: 'Shop',
    items: [
      { label: 'New Arrivals',    to: '/#new-arrivals' },
      { label: 'All Products',    to: '/products' },
      { label: 'Under ₹699',      to: '/under699' },
    ],
  },
  {
    label: 'Categories',
    items: [
      { label: 'Shirts',          to: '/category/Shirt' },
      { label: 'T-Shirts',        to: '/category/Tshirt' },
      { label: 'Jeans',           to: '/category/Jeans' },
      { label: 'Shoes',           to: '/category/Shoes' },
      { label: 'Jackets',         to: '/category/Jacket' },
      { label: 'Hoodies',         to: '/category/Hoodies' },
      { label: 'Sweatshirts',     to: '/category/Sweatshirt' },
      { label: 'Sweaters',        to: '/category/Sweater' },
      { label: 'Track Pants',     to: '/category/Trackpants' },
      { label: 'Accessories',     to: '/category/Mens Accessories' },
      { label: 'Innerwear',       to: '/category/Innerwear' },
      { label: 'Traditional',     to: '/category/Traditional' },
    ],
  },
  {
    label: 'Beauty & Care',
    items: [
      { label: 'Perfume',         to: '/category/Perfume' },
      { label: 'Body Care',       to: '/category/Body Care' },
      { label: 'Daily Essentials',to: '/category/Daily Essentials' },
    ],
  },
]

const SECONDARY_ITEMS = [
  { label: 'Search',    to: '/search',    external: false },
  { label: 'Instagram ↗', to: 'https://www.instagram.com/meghansh07', external: true },
]

/* ─── Shared row style helpers ───────────────────────── */
const rowBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  transition: 'background-color 0.15s ease',
}

/* ─── Component ──────────────────────────────────────── */
export default function NavSidebar({ id, isOpen, onClose }: NavSidebarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  const drawerRef  = useRef<HTMLDivElement>(null)
  const closeRef   = useRef<HTMLButtonElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  /* ── Remember what had focus before the drawer opened ── */
  useEffect(() => {
    if (isOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  /* ── Body scroll lock ────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ── Focus the close button when drawer opens ─────────── */
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => closeRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [isOpen])

  /* ── Restore focus when drawer closes ─────────────────── */
  useEffect(() => {
    if (!isOpen && lastFocusRef.current) {
      const el = lastFocusRef.current
      // Slight delay so the element is truly interactive again
      const timer = setTimeout(() => {
        try { el.focus() } catch (_) { /* ignore */ }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  /* ── Keyboard: Escape + Tab trap ─────────────────────── */
  useEffect(() => {
    if (!isOpen) return

    const FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const drawer = drawerRef.current
        if (!drawer) return
        const focusable = Array.from(
          drawer.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null) // only visible

        if (focusable.length === 0) return

        const first = focusable[0]
        const last  = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  /* ── Nav item click ──────────────────────────────────── */
  const handleNavClick = () => onClose()

  /* ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          backgroundColor: 'rgba(0,0,0,0.2)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* ── Drawer panel ──────────────────────────────────── */}
      <div
        ref={drawerRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 200,
          width: 'var(--sidebar-width)',
          backgroundColor: '#F7F7F7',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform',
        }}
      >
        {/* ── Close button ────────────────────────────────── */}
        <div>
          <div style={{ padding: '1.5rem 1.5rem 1.375rem' }}>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
              aria-label="Close navigation menu"
              style={{
                ...rowBase,
                justifyContent: 'flex-start',
                gap: '0.5rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-black)',
                opacity: 0.65,
                padding: 0,
                width: 'auto',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1, fontWeight: 300 }}>✕</span>
              <span>Close</span>
            </button>
          </div>
          {/* Hairline separator */}
          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }} />
        </div>

        {/* ── Sectioned nav ─────────────────────────────────── */}
        <nav aria-label="Main navigation" style={{ flex: 1, paddingBottom: '2rem' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  padding: '1.25rem 1.5rem 0.5rem',
                }}
              >
                {section.label}
              </p>

              <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.to}
                      onClick={handleNavClick}
                      tabIndex={isOpen ? 0 : -1}
                      style={{
                        ...rowBase,
                        padding: '0.8rem 1.5rem',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        fontWeight: 400,
                        letterSpacing: '0.01em',
                        textTransform: 'none',
                        color: '#1a1a1a',
                        backgroundColor:
                          hoveredIndex === item.label
                            ? 'rgba(0,0,0,0.03)'
                            : 'transparent',
                      }}
                      onMouseEnter={() => setHoveredIndex(item.label)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <span>{item.label}</span>
                      <span style={{ fontSize: '1rem', color: '#bbb', fontWeight: 300 }}>›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Secondary links ─────────────────────────────── */}
          <div
            style={{
              marginTop: '1.5rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              paddingTop: '0.5rem',
            }}
          >
            {SECONDARY_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  style={{
                    ...rowBase,
                    padding: '0.75rem 1.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    textTransform: 'none',
                    color: 'var(--color-muted)',
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={handleNavClick}
                  tabIndex={isOpen ? 0 : -1}
                  style={{
                    ...rowBase,
                    padding: '0.75rem 1.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    textTransform: 'none',
                    color: 'var(--color-muted)',
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
