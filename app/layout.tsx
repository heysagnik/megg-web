import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/layout/ProgressBar'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font handles subsetting, self-hosting, and zero layout shift automatically.

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

const BASE_URL = 'https://meggfashion.in'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'MEGG — Curated Fashion',
    template: '%s — MEGG',
  },
  description:
    'Curated fashion picks, outfits, and trending products for men. Quality over quantity.',

  keywords: ['fashion', 'men fashion', 'curated clothing', 'trending outfits', 'affordable fashion India'],

  authors: [{ name: 'MEGG', url: BASE_URL }],
  creator: 'MEGG',

  // Canonical
  alternates: { canonical: BASE_URL },

  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'MEGG',
    url: BASE_URL,
    title: 'MEGG — Curated Fashion',
    description: 'Curated fashion picks, outfits, and trending products for men.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEGG — Curated Fashion',
      },
    ],
    locale: 'en_IN',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'MEGG — Curated Fashion',
    description: 'Curated fashion picks, outfits, and trending products for men.',
    images: ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${geist.variable}`}>
      <body>
        <ProgressBar />
        <Header />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
