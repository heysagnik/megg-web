'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import NavSidebar from './NavSidebar'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerVisible, setHeaderVisible] = useState(true)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const isHomePage = pathname === '/'

  /* ── Close sidebar on route change ─────────────────── */
  useEffect(() => {
    setSidebarOpen(false)
    setSearchOpen(false)
  }, [pathname])

  /* ── Homepage scroll-hide behaviour ────────────────── */
  useEffect(() => {
    if (!isHomePage) {
      setHeaderVisible(true)
      return
    }

    const onScroll = () => {
      const threshold = window.innerHeight * 0.8
      setHeaderVisible(window.scrollY >= threshold)
    }

    // Set initial state without waiting for scroll
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  /* ── Auto-focus search input when panel opens ───────── */
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  /* ── Search submit ──────────────────────────────────── */
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (!q) return
      router.push(`/search?q=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery('')
    },
    [router, searchQuery],
  )

  const toggleSearch = () => setSearchOpen((prev) => !prev)

  return (
    <>
      {/* ── Header shell ─────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          /* Visibility driven by scroll (homepage) or always visible (other pages) */
          opacity: headerVisible ? 1 : 0,
          pointerEvents: headerVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          /* Frosted glass */
          backgroundColor: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
        aria-hidden={!headerVisible}
      >
        {/* ── Three-zone bar ─────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'var(--header-height)',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
          }}
        >
          {/* LEFT — Hamburger ─────────────────────────────── */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="nav-sidebar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '5px',
              width: '28px',
              height: '28px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '3px 0',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: 'var(--color-black)',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: 'var(--color-black)',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: 'var(--color-black)',
              }}
            />
          </button>

          {/* CENTER — Logo (absolute so it's truly centred) ── */}
          <Link
            href="/"
            aria-label="MEGG — go to homepage"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            MEGG
          </Link>

          {/* RIGHT — Search toggle ────────────────────────── */}
          <button
            type="button"
            onClick={toggleSearch}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              color: 'var(--color-black)',
              opacity: searchOpen ? 0.45 : 1,
              transition: 'opacity 0.2s ease',
              padding: 0,
            }}
          >
            {/* Magnifying glass */}
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* ── Animated search panel ──────────────────────── */}
        <div
          id="header-search-panel"
          role="search"
          aria-label="Site search"
          style={{
            overflow: 'hidden',
            maxHeight: searchOpen ? '72px' : '0',
            transition: 'max-height 0.38s cubic-bezier(0.76,0,0.24,1)',
            borderTop: searchOpen ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              height: '72px',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
            }}
          >
            {/* Small search icon inside input row */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
              style={{ color: 'var(--color-muted)', flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              tabIndex={searchOpen ? 0 : -1}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-black)',
                caretColor: 'var(--color-black)',
              }}
              aria-label="Search products"
            />

            <button
              type="submit"
              tabIndex={searchOpen ? 0 : -1}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-black)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: searchQuery.trim() ? 0.85 : 0.35,
                transition: 'opacity 0.2s',
                flexShrink: 0,
                padding: '0.25rem 0',
              }}
            >
              Search
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
              }}
              tabIndex={searchOpen ? 0 : -1}
              aria-label="Close search"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.625rem',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '0.25rem 0',
                transition: 'opacity 0.2s',
              }}
            >
              ✕
            </button>
          </form>
        </div>
      </header>

      {/* ── Nav sidebar (rendered outside <header>) ──────── */}
      <NavSidebar
        id="nav-sidebar"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  )
}
