import type { Metadata } from 'next'
import { getTrendingProducts } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryRow from '@/components/home/CategoryRow'
import Under699Banner from '@/components/home/Under699Banner'
import ReelsSection from '@/components/home/ReelsSection'
import OffersSection from '@/components/home/OffersSection'
import TrendingStrip from '@/components/home/TrendingStrip'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'

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
      {/* 1. Pull hero flush under the sticky header so no white gap appears */}
      <div style={{ marginTop: 'calc(-1 * var(--header-height))' }}>
        <HeroSection />
      </div>

      {/* 2. Shop by Category — 4 cards visible at once, horizontal scroll */}
      <CategoryRow />

      {/* 3. Shop Under ₹699 dark promo banner */}
      <Under699Banner />

      {/* 4. Outfit Reels — tall portrait cards, horizontal scroll */}
      <ReelsSection />

      {/* 5. Ongoing Offers — 3-column editorial cards */}
      <OffersSection />

      {/* 6. Trending Now — horizontal snap-scroll strip */}
      <TrendingStrip products={trending} />

      {/* 7. New Arrivals — infinite-scroll 4-col grid */}
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
