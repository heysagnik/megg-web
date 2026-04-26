import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getTrendingProducts } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryRow from '@/components/home/CategoryRow'
import Under699Banner from '@/components/home/Under699Banner'

// Below-fold sections — loaded lazily to keep initial JS bundle small
const ReelsSection       = dynamic(() => import('@/components/home/ReelsSection'))
const OffersSection      = dynamic(() => import('@/components/home/OffersSection'))
const TrendingStrip      = dynamic(() => import('@/components/home/TrendingStrip'))
const NewArrivalsSection = dynamic(() => import('@/components/home/NewArrivalsSection'))

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'MEGG — Curated Fashion',
  description:
    'Curated fashion picks, outfits, and trending products. Quality over quantity.',
  openGraph: {
    title: 'MEGG — Curated Fashion',
    description:
      'Curated fashion picks, outfits, and trending products. Quality over quantity.',
    type: 'website',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const trending = await getTrendingProducts().catch(() => [])

  return (
    <main>
      {/* 1. Hero — above fold, loads immediately */}
      <div style={{ marginTop: 'calc(-1 * var(--header-height))' }}>
        <HeroSection />
      </div>

      {/* 2. Categories — just below fold, static images */}
      <CategoryRow />

      {/* 3. Under ₹699 banner — text only, no images */}
      <Under699Banner />

      {/* 4–7. Below fold — dynamically imported */}
      <ReelsSection />
      <OffersSection />
      <TrendingStrip products={trending} />

      <section
        style={{
          paddingTop: 'var(--space-xl)',
          paddingBottom: 'var(--space-3xl)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: '0 var(--container-px)',
          }}
        >
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <p
              className="text-label"
              style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}
            >
              Fresh drops, every day
            </p>
            <h2 className="text-section">New Arrivals</h2>
          </div>
          <NewArrivalsSection />
        </div>
      </section>
    </main>
  )
}
