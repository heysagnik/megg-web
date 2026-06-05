'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import NavSidebar from './NavSidebar'
import { getSearchSuggestions, type SearchSuggestion } from '@/lib/api'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isHomePage = pathname === '/'

  // Reset keyboard focus when suggestion list changes
  useEffect(() => { setFocusedIdx(-1) }, [suggestions])

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

    const sentinel = document.createElement('div')
    sentinel.style.cssText = 'position:absolute;top:80vh;height:1px;width:1px;pointer-events:none'
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
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
      setShowSuggestions(false)
      router.push(`/search?query=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery('')
    },
    [router, searchQuery],
  )

  const handleSearchInputChange = useCallback((val: string) => {
    setSearchQuery(val)
    if (suggestTimer.current) clearTimeout(suggestTimer.current)
    if (val.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    suggestTimer.current = setTimeout(async () => {
      try {
        const s = await getSearchSuggestions(val.trim())
        setSuggestions(s)
        setShowSuggestions(s.length > 0)
      } catch { setSuggestions([]) }
    }, 300)
  }, [])

  const handleSuggestionClick = useCallback((s: SearchSuggestion) => {
    setShowSuggestions(false)
    setFocusedIdx(-1)
    setSearchQuery('')
    setSearchOpen(false)
    if (s.filters && Object.keys(s.filters).length > 0) {
      const p = new URLSearchParams()
      for (const [k, v] of Object.entries(s.filters)) {
        if (v) p.set(k, v)
      }
      router.push(`/search?${p.toString()}`)
    } else {
      router.push(`/search?query=${encodeURIComponent(s.value)}`)
    }
  }, [router])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[focusedIdx])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setFocusedIdx(-1)
    }
  }, [showSuggestions, suggestions, focusedIdx, handleSuggestionClick])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchQuery('')
    setShowSuggestions(false)
    setFocusedIdx(-1)
  }, [])

  const toggleSearch = () => setSearchOpen((prev) => !prev)

  return (
    <>
      {/* ── Header shell ─────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          opacity: headerVisible ? 1 : 0,
          pointerEvents: headerVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          backgroundColor: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
        aria-hidden={!headerVisible}
        {...(!headerVisible ? { inert: true } : {}) as React.HTMLAttributes<HTMLElement>}
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
          {/* LEFT — Hamburger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="nav-sidebar"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'flex-start', gap: '5px', width: '28px', height: '28px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '3px 0', flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '1px', backgroundColor: 'var(--color-black)' }} />
            <span style={{ display: 'block', width: '22px', height: '1px', backgroundColor: 'var(--color-black)' }} />
            <span style={{ display: 'block', width: '22px', height: '1px', backgroundColor: 'var(--color-black)' }} />
          </button>

          {/* CENTER — Logo */}
          <Link
            href="/"
            aria-label="MEGG — go to homepage"
            style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400,
              letterSpacing: '-0.04em', textTransform: 'uppercase',
              color: 'var(--color-black)', lineHeight: 1, whiteSpace: 'nowrap', userSelect: 'none',
            }}
          >
            MEGG
          </Link>

          {/* RIGHT — Search toggle */}
          <button
            type="button"
            onClick={toggleSearch}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', background: 'none', border: 'none',
              cursor: 'pointer', flexShrink: 0, color: 'var(--color-black)',
              opacity: searchOpen ? 0.45 : 1, transition: 'opacity 0.2s ease', padding: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" focusable="false">
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
            overflow: searchOpen ? 'visible' : 'hidden',
            maxHeight: searchOpen ? '72px' : '0',
            transition: 'max-height 0.38s cubic-bezier(0.76,0,0.24,1)',
            borderTop: searchOpen ? '1px solid var(--color-border)' : '1px solid transparent',
            position: 'relative',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              height: '72px', paddingLeft: '1.25rem', paddingRight: '1.25rem',
              visibility: searchOpen ? 'visible' : 'hidden',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" focusable="false"
              style={{ color: 'var(--color-muted)', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setFocusedIdx(-1) }, 150)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search products…"
              tabIndex={searchOpen ? 0 : -1}
              autoComplete="off"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 400,
                letterSpacing: '0.04em', color: 'var(--color-black)', caretColor: 'var(--color-black)',
              }}
              aria-label="Search products"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
            />

            {/* Clear input */}
            {searchQuery && (
              <button
                type="button"
                tabIndex={searchOpen ? 0 : -1}
                onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); searchInputRef.current?.focus() }}
                aria-label="Clear search"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                  color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1, flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >×</button>
            )}

            <button
              type="submit"
              tabIndex={searchOpen ? 0 : -1}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500,
                letterSpacing: '0.13em', textTransform: 'uppercase',
                color: 'var(--color-black)', background: 'none', border: 'none',
                cursor: 'pointer', opacity: searchQuery.trim() ? 0.85 : 0.35,
                transition: 'opacity 0.2s', flexShrink: 0, padding: '0.25rem 0',
              }}
            >Search</button>

            <button
              type="button"
              onClick={closeSearch}
              tabIndex={searchOpen ? 0 : -1}
              aria-label="Close search"
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 400,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-muted)', background: 'none', border: 'none',
                cursor: 'pointer', flexShrink: 0, padding: '0.25rem 0',
              }}
            >✕</button>
          </form>

          {/* Suggestions dropdown */}
          {searchOpen && showSuggestions && suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Search suggestions"
              style={{
                position: 'absolute', top: '72px', left: 0, right: 0, zIndex: 101,
                background: 'var(--color-white)', borderBottom: '1px solid var(--color-border)',
                listStyle: 'none', maxHeight: '240px', overflowY: 'auto', padding: 0, margin: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {suggestions.map((s, i) => (
                <li key={`${s.value}-${i}`} role="option" aria-selected={i === focusedIdx}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.65rem 1.25rem',
                      fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                      letterSpacing: '0.06em',
                      background: i === focusedIdx ? 'var(--color-gray-50, #f5f5f5)' : 'none',
                      border: 'none', borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer', color: 'var(--color-black)',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    {s.value}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* ── Nav sidebar ──────────────────────────────────── */}
      <NavSidebar
        id="nav-sidebar"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  )
}
