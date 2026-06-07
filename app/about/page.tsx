import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'About MEGG — Curated Men\'s Fashion Platform India' },
  description: 'MEGG is India\'s curated men\'s fashion discovery platform. We handpick T-shirts, shirts, jeans, shoes & more from trusted brands — no noise, no clutter. Quality over quantity, always.',
  keywords: [
    'about MEGG', 'MEGG fashion India', 'meggfashion about',
    'curated men fashion platform India', 'men fashion discovery India',
    'best men fashion curation India', 'MEGG brand story',
    'handpicked men clothing India', 'quality men fashion India',
  ],
  alternates: { canonical: 'https://www.meggfashion.in/about' },
  openGraph: {
    type: 'website',
    url: 'https://www.meggfashion.in/about',
    title: 'About MEGG — Curated Men\'s Fashion Platform India',
    description: 'MEGG is India\'s curated men\'s fashion discovery platform. Handpicked styles from trusted brands. Quality over quantity.',
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://www.meggfashion.in/about#webpage',
      url: 'https://www.meggfashion.in/about',
      name: 'About MEGG — Curated Men\'s Fashion Platform India',
      description: 'MEGG is India\'s curated men\'s fashion discovery platform. We handpick T-shirts, shirts, jeans, shoes & more from trusted brands — no noise, no clutter.',
      inLanguage: 'en-IN',
      isPartOf: { '@id': 'https://www.meggfashion.in/#website' },
      about: { '@id': 'https://www.meggfashion.in/#organization' },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'p'],
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.meggfashion.in/#organization',
      name: 'MEGG',
      url: 'https://www.meggfashion.in',
      description: 'MEGG is India\'s curated men\'s fashion discovery platform. We handpick products from trusted brands — no noise, no clutter. Just the best. New arrivals are added daily. Every product is vetted for quality, style, and value.',
      email: 'meggxfashion@gmail.com',
      sameAs: ['https://www.instagram.com/meghansh07'],
      areaServed: { '@type': 'Country', name: 'India' },
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: 'var(--space-xl) var(--container-px) var(--space-3xl)',
      }}
    >
      <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
        About
      </p>
      <h1 className="text-section" style={{ marginBottom: 'var(--space-lg)' }}>
        Quality over quantity.
      </h1>

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--color-muted-dark)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '1.5rem' }}>
        MEGG is a curated fashion discovery platform built for people who care about what they wear. We handpick products from trusted brands — no noise, no clutter. Just the best.
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--color-muted-dark)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2.5rem' }}>
        New arrivals are added daily. Every product is vetted for quality, style, and value.
      </p>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
        <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>Get in touch</p>
        <a
          href="https://www.instagram.com/meghansh07"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-underline"
        >
          Instagram ↗
        </a>
      </div>
    </div>
    </>
  )
}
