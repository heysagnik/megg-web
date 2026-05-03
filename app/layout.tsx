import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/layout/ProgressBar'
import AppBottomSheet from '@/components/layout/AppBottomSheet'

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
    'Curated fashion picks, outfits, and trending products for men. Quality over quantity.',

  keywords: [
    // Brand
    'MEGG', 'MEGG fashion', 'meggfashion',
    // Category — head terms
    'men fashion India', 'men clothing online India', 'men T-shirts online India',
    'men shirts online India', 'men jeans online India', 'men shoes online India',
    'men jackets online India', 'men hoodies online India', 'men sweatshirts India',
    'men accessories India', 'men innerwear India', 'men track pants India',
    'men perfume India', 'men ethnic wear India',
    // Intent-based
    'buy men clothes online India', 'affordable men fashion India',
    'curated men clothing India', 'best men fashion site India',
    'men fashion under 699', 'men clothing under 1000 India',
    'trending men outfits India', 'men casual wear India',
    // Long-tail
    'best men T-shirts online India', 'buy men polo T-shirts India',
    'men cotton shirts online', 'men slim fit jeans India',
    'men sneakers online India', 'men formal shoes India',
    'men winter jackets India', 'men bomber jacket India',
    'men gym innerwear India', 'men ethnic kurta online',
  ],

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
    locale: 'en_IN',
    images: [
      {
        url: `${BASE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'MEGG — Curated Men\'s Fashion India',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'MEGG — Curated Fashion',
    description: 'Curated fashion picks, outfits, and trending products for men.',
    images: [`${BASE_URL}/og.png`],
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
        <Header />
        <div id="page-wrapper" style={{ minHeight: '100vh' }}>{children}</div>
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
