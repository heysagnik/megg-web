import type { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
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
      <JsonLd data={aboutJsonLd} />
      <div className="max-w-[680px] mx-auto px-[var(--container-px)] pt-xl pb-3xl">
        <p className="text-label text-muted mb-[0.75rem]">
          About
        </p>
        <h1 className="text-section mb-lg">
          Quality over quantity.
        </h1>

        <p className="font-sans text-base leading-[1.8] text-muted-dark uppercase tracking-[0.02em] mb-md">
          MEGG is a curated fashion discovery platform built for people who care about what they wear. We handpick products from trusted brands — no noise, no clutter. Just the best.
        </p>
        <p className="font-sans text-base leading-[1.8] text-muted-dark uppercase tracking-[0.02em] mb-lg">
          New arrivals are added daily. Every product is vetted for quality, style, and value.
        </p>

        <div className="border-t border-border pt-lg">
          <p className="text-label text-muted mb-sm">Get in touch</p>
          <a
            href="https://www.instagram.com/meghansh07"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition bg-transparent text-black underline decoration-1 underline-offset-[3px] hover:opacity-60"
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </>
  )
}
