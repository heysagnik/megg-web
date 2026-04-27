import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'MEGG is a curated fashion platform. Quality over quantity.',
}

export default function AboutPage() {
  return (
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
  )
}
