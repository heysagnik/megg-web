import type { Metadata } from 'next'
import { getTrendingProducts, type Gender } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryRow from '@/components/home/CategoryRow'
import Under699Banner from '@/components/home/Under699Banner'

import OffersSection from '@/components/home/OffersSection'
import TrendingStrip from '@/components/home/TrendingStrip'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'

export const revalidate = 600
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: { absolute: 'MEGG — Shop Men\'s T-Shirts, Shirts, Jeans, Shoes & More Online India' },
  description: 'Shop curated men\'s fashion on MEGG — buy T-shirts, shirts, jeans, shoes, jackets, hoodies, track pants, perfume & accessories online India. Top brands, trending styles, new arrivals daily. Starting Rs 299. Free fashion discovery.',
  keywords: [
    'shop men fashion India', 'buy men clothes online India', 'men clothing brands India',
    'men T-shirts online India', 'buy T-shirts for men India', 'men shirts online India',
    'men jeans online India', 'buy men jeans India', 'men shoes online India',
    'buy men shoes India', 'men sneakers online India', 'men jackets online India',
    'men hoodies online India', 'men track pants online India',
    'men perfume online India', 'men body care products India',
    'men casual wear India', 'men streetwear India', 'men office wear India',
    'men party wear India', 'men gym wear India', 'men ethnic wear India',
    'affordable men fashion India', 'men fashion under 699', 'budget men clothing India',
    'men clothing under 500 India', 'men clothing under 1000 India',
    'trending men outfits India', 'new arrivals men fashion India',
    'best men fashion app India', 'men fashion online shopping India',
    'curated men fashion India', 'men wardrobe essentials India',
    'men innerwear online India', 'men accessories online India',
    'men sweatshirts online India', 'men sweaters online India',
  ],
  openGraph: {
    title: 'MEGG — Shop Men\'s T-Shirts, Shirts, Jeans, Shoes & More Online India',
    description: 'Buy curated men\'s fashion on MEGG — T-shirts, shirts, jeans, shoes, jackets, hoodies & more. Top brands. New arrivals daily.',
    type: 'website',
  },
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage(_: PageProps) {
  const gender: Gender = 'men'
  const trending = await getTrendingProducts({ gender }).catch(() => [])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is MEGG?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG is India\'s curated men\'s fashion platform where you can discover handpicked T-shirts, shirts, jeans, shoes, jackets, hoodies, track pants, perfume, body care and more from top brands. We add new arrivals daily.' },
      },
      {
        '@type': 'Question',
        name: 'What categories does MEGG offer?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG offers T-shirts, shirts, jeans, shoes, jackets, hoodies, sweatshirts, sweaters, track pants, accessories, innerwear, traditional/ethnic wear, perfume, body care and daily essentials for men.' },
      },
      {
        '@type': 'Question',
        name: 'Is MEGG available as an app?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, MEGG is available as a free app on both Android and iOS. Download it for a better fashion discovery experience with style reels, outfit ideas and personalised recommendations.' },
      },
      {
        '@type': 'Question',
        name: 'Does MEGG deliver across India?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG is a fashion discovery platform. When you find a product you like, you\'re redirected to the brand\'s website to complete the purchase. Delivery is handled by the respective brand or retailer.' },
      },
      {
        '@type': 'Question',
        name: 'What is the price range on MEGG?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG features products across all price ranges — from budget picks under Rs 699 to premium fashion. We have a dedicated "Under Rs 699" section for affordable men\'s fashion.' },
      },
      {
        '@type': 'Question',
        name: 'Which brands are available on MEGG?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG curates products from a wide range of trusted Indian and international brands including popular streetwear, athleisure, and premium fashion labels. Every brand and product is handpicked for quality, style, and value.' },
      },
      {
        '@type': 'Question',
        name: 'How does MEGG work?',
        acceptedAnswer: { '@type': 'Answer', text: 'MEGG is a fashion discovery platform. You browse handpicked men\'s clothing and accessories on MEGG, and when you find something you like, you click through to the brand\'s official website or retailer to complete the purchase. MEGG curates — the brand delivers.' },
      },
      {
        '@type': 'Question',
        name: 'Does MEGG have a section for budget fashion?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. MEGG has a dedicated "Under Rs 699" section where you can find curated men\'s T-shirts, track pants, innerwear, accessories and more — all priced under Rs 699. New budget picks are added daily.' },
      },
    ],
  }

  const trendingJsonLd = trending.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trending Products on MEGG',
    itemListElement: trending.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.meggfashion.in/product/${p.id}`,
      name: p.name,
    })),
  } : null

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {trendingJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trendingJsonLd) }} />
      )}
      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        MEGG — Shop Men&apos;s T-Shirts, Shirts, Jeans, Shoes, Jackets &amp; More Online India
      </h1>
      <div style={{ marginTop: 'calc(-1 * var(--header-height))' }}>
        <HeroSection />
      </div>
      <CategoryRow />
      <Under699Banner />

      <TrendingStrip products={trending} />
      <OffersSection />
      <section
        id="new-arrivals"
        style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 var(--container-px)' }}>
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
