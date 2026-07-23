'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import NavSidebar from './NavSidebar'
import { cn as CN } from '@/lib/utils'

export default function Header() {
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)

  const isHomePage = pathname === '/'

  /* ── Close sidebar on route change ─────────────────── */
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  /* ── Homepage scroll-hide behaviour ────────────────── */
  useEffect(() => {
    if (!isHomePage) {
      setHeaderVisible(true)
      return
    }

    const sentinel = document.createElement('div')
    sentinel.className = 'absolute top-[80vh] h-px w-px pointer-events-none'
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

  if (pathname.startsWith('/reel')) return null;

  return (
    <>
      {/* ── Header shell ─────────────────────────────────── */}
      <header
        className={CN(
          'sticky top-0 z-[100] transition-opacity duration-400',
          'bg-white/97 backdrop-blur-md border-b border-border',
          headerVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!headerVisible}
        {...(!headerVisible ? { inert: true } : {}) as React.HTMLAttributes<HTMLElement>}
      >
        {/* ── Three-zone bar ─────────────────────────────── */}
        <div className="relative flex items-center justify-between h-[var(--header-height)] pl-5 pr-5">
          {/* LEFT — Hamburger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="nav-sidebar"
            className="flex flex-col justify-center items-start gap-[5px] w-7 h-7 bg-transparent border-none cursor-pointer py-[3px] shrink-0"
          >
            <span className="block w-[22px] h-px bg-black" />
            <span className="block w-[22px] h-px bg-black" />
            <span className="block w-[22px] h-px bg-black" />
          </button>

          {/* CENTER — Logo */}
          <Link
            href="/"
            aria-label="MEGG — go to homepage"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-[1.5rem] font-normal tracking-tight uppercase text-black leading-none whitespace-nowrap select-none"
          >
            MEGG
          </Link>

          {/* RIGHT — Dedicated Search Page Link */}
          <Link
            href="/search"
            aria-label="Search"
            className="flex items-center justify-center w-7 h-7 bg-transparent border-none cursor-pointer shrink-0 text-black hover:opacity-75 transition-opacity p-0"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
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
