import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
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

  keywords: ['men fashion India', 'curated men clothing', 'buy men shirts online', 'affordable fashion India', 'trending outfits for men', 'men t-shirts online', 'men casual wear', 'MEGG fashion'],

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
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
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
        {/* Preconnect to CDNs — saves 100–200ms per origin */}
        <link rel="preconnect" href="https://media.meggfashion.in" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ProgressBar />
        <AppBottomSheet />
        <Header />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
        {/* Analytics — deferred after body so they never block rendering */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`,
          }}
        />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="37fe1a13-6bcf-448a-b7f6-fa147cd4080b"
        />
      </body>
    </html>
  )
}
