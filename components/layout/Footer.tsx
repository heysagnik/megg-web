'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { genderPath } from '@/lib/genderPath'
import { useGender } from '@/lib/useGender'

export default function Footer() {
  const pathname = usePathname()
  const gender = useGender()
  if (pathname.startsWith('/reel')) return null

  return (
    <footer className="bg-black text-white font-sans border-t border-neutral-900 pt-16 pb-12">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 md:px-12 flex flex-col justify-between min-h-[220px]">
        
        {/* Top Header Row — Brand & Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-neutral-900/80">
          
          {/* Brand */}
          <div className="space-y-1">
            <Link
              href={genderPath(gender)}
              className="font-sans text-2xl font-light tracking-[0.2em] uppercase text-white no-underline block"
            >
              MEGG
            </Link>
            <p className="font-sans text-[0.625rem] tracking-[0.18em] uppercase text-neutral-500 font-normal">
              CURATED FASHION & ESSENTIALS
            </p>
          </div>

          {/* Minimal Navigation links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[0.725rem] font-normal tracking-[0.14em] uppercase text-neutral-400">
            <Link href={genderPath(gender, '/products')} className="hover:text-white transition-colors duration-200 no-underline">
              ALL PRODUCTS
            </Link>
            <Link href={genderPath(gender, '/under699')} className="hover:text-white transition-colors duration-200 no-underline">
              UNDER RS. 699
            </Link>
            <Link href="/download" className="hover:text-white transition-colors duration-200 no-underline">
              APP
            </Link>
            <Link href="/about" className="hover:text-white transition-colors duration-200 no-underline">
              ABOUT
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-200 no-underline">
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200 no-underline">
              TERMS
            </Link>
            <a
              href="https://www.instagram.com/meghansh07"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200 no-underline inline-flex items-center gap-1.5"
            >
              <span>INSTAGRAM</span>
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Strip — Copyright & Slogan */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-center sm:text-left font-sans text-[0.625rem] tracking-[0.18em] uppercase text-neutral-500 font-normal">
          <p>© {new Date().getFullYear()} MEGG. ALL RIGHTS RESERVED.</p>
          <p>QUALITY OVER QUANTITY — ALWAYS</p>
        </div>

      </div>
    </footer>
  )
}
