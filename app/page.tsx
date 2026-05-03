import type { Metadata } from 'next'
import { getTrendingProducts } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryRow from '@/components/home/CategoryRow'
import Under699Banner from '@/components/home/Under699Banner'
import ReelsSection from '@/components/home/ReelsSection'
import OffersSection from '@/components/home/OffersSection'
import TrendingStrip from '@/components/home/TrendingStrip'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'

export const metadata: Metadata = {
  title: 'MEGG — Curated Men\'s Fashion India',
  description: 'Shop curated men\'s fashion on MEGG — T-shirts, shirts, jeans, shoes & more. Hand-picked styles from top brands. New arrivals daily.',
  keywords: ['men fashion India', 'curated men clothing', 'buy men t-shirts online India', 'affordable men fashion', 'trending outfits for men', 'men clothing online India', 'MEGG fashion'],
  openGraph: {
    title: 'MEGG — Curated Men\'s Fashion India',
    description: 'Shop curated men\'s fashion on MEGG — T-shirts, shirts, jeans, shoes & more. Hand-picked styles from top brands. New arrivals daily.',
    type: 'website',
  },
}

export default async function HomePage() {
  const trending = await getTrendingProducts().catch(() => [])

  return (
    <main>
      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        MEGG — Curated Men&apos;s Fashion India
      </h1>
      <div style={{ marginTop: 'calc(-1 * var(--header-height))' }}>
        <HeroSection />
      </div>
      <CategoryRow />
      <Under699Banner />
      <ReelsSection />
      <OffersSection />
      <TrendingStrip products={trending} />
      <section
        id="new-arrivals"
        style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-3xl)' }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
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
