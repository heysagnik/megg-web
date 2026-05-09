import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/layout/ProgressBar'
import AppBottomSheet from '@/components/layout/AppBottomSheet'
import ScrollRestoration from '@/components/layout/ScrollRestoration'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font handles subsetting, self-hosting, and zero layout shift automatically.

// ─── Metadata ─────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.meggfashion.in'

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
    'MEGG is India\'s curated men\'s fashion platform — handpicked T-shirts, shirts, jeans, shoes, jackets & more from top brands. Quality over quantity, always.',

  keywords: [
    'MEGG', 'MEGG fashion', 'meggfashion', 'MEGG app',
    'men fashion India', 'men clothing online India',
    'curated men fashion India', 'best men fashion site India',
    'trending men outfits India', 'men outfit ideas India',
    'men fashion trends India', 'new arrivals men fashion India',
    'men wardrobe essentials India',
  ],

  authors: [{ name: 'MEGG', url: BASE_URL }],
  creator: 'MEGG',

  // Canonical + hreflang
  alternates: {
    canonical: BASE_URL,
    languages: { 'en-IN': BASE_URL, 'x-default': BASE_URL },
  },

  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'MEGG',
    url: BASE_URL,
    title: 'MEGG — Curated Fashion',
    description: 'Curated fashion picks, outfits, and trending products for men.',
    locale: 'en_IN',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    site: '@meggfashion',
    title: 'MEGG — Curated Fashion',
    description: 'Curated fashion picks, outfits, and trending products for men.',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const GA_ID = 'G-P61VDHTVEG'

const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'MEGG',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'MEGG',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload the custom font — eliminates FOUT and helps CLS score */}
        <link
          rel="preload"
          href="/FuturaCyrillicBook.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Preconnect to CDNs — saves 100–200ms per origin */}
        <link rel="preconnect" href="https://media.meggfashion.in" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
      </head>
      <body>
        {/* JSON-LD — lives in <head> via next/script, never blocks body parsing */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ProgressBar />
        <AppBottomSheet />
        <ScrollRestoration />
        <Header />
        <div id="page-wrapper" style={{ minHeight: '100vh', textTransform: 'uppercase' }}>{children}</div>
        <Footer />
        {/* GA — afterInteractive: injected after hydration, never blocks navigationStart */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
        </Script>
        {/* Umami — lazyOnload: runs during browser idle time */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="37fe1a13-6bcf-448a-b7f6-fa147cd4080b"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
