import type { Metadata } from 'next'
import { getTrendingProducts, type Gender } from '@/lib/api'
import JsonLd from '@/components/seo/JsonLd'
import HeroSection from '@/components/home/HeroSection'
import CategoryRow from '@/components/home/CategoryRow'
import Under699Banner from '@/components/home/Under699Banner'
import OffersSection from '@/components/home/OffersSection'
import TrendingStrip from '@/components/home/TrendingStrip'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'

const METADATA: Record<Gender, Metadata> = {
  men: {
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
      'curated men fashion discovery platform India', 'D2C men fashion brands India',
      'independent men clothing brands India', 'Myntra alternative men fashion',
      'unique streetwear brands India', 'boutique men fashion app India',
      'no clutter fashion shopping India', 'best app to discover men fashion India',
    ],
    openGraph: {
      title: 'MEGG — Shop Men\'s T-Shirts, Shirts, Jeans, Shoes & More Online India',
      description: 'Buy curated men\'s fashion on MEGG — T-shirts, shirts, jeans, shoes, jackets, hoodies & more. Top brands. New arrivals daily.',
      type: 'website',
    },
  },
  women: {
    title: { absolute: 'MEGG — Shop Women\'s Dresses, Co-ord Sets, Jeans, Kurtas & More Online India' },
    description: 'Shop curated women\'s fashion on MEGG — buy dresses, co-ord sets, jeans, kurtas & ethnic wear, skirts, tops, footwear & perfume online India. Top brands, trending styles, new arrivals daily. Starting Rs 299. Free fashion discovery.',
    keywords: [
      'shop women fashion India', 'buy women clothes online India', 'women clothing brands India',
      'women dresses online India', 'buy dresses for women India', 'women co-ord sets India',
      'women jeans online India', 'buy women jeans India', 'women kurtas online India',
      'women ethnic wear India', 'women skirts online India', 'women footwear online India',
      'women perfume online India', 'women tops online India',
      'women casual wear India', 'women ethnic wear online India', 'women office wear India',
      'women party wear India', 'women western wear India',
      'affordable women fashion India', 'women fashion under 699', 'budget women clothing India',
      'women clothing under 500 India', 'women clothing under 1000 India',
      'trending women outfits India', 'new arrivals women fashion India',
      'best women fashion app India', 'women fashion online shopping India',
      'curated women fashion India', 'women wardrobe essentials India',
      'women accessories online India',
      'curated women fashion discovery platform India', 'D2C women fashion brands India',
      'independent women clothing brands India', 'Myntra alternative women fashion',
      'unique women fashion brands India', 'boutique women fashion app India',
      'no clutter fashion shopping India', 'best app to discover women fashion India',
    ],
    openGraph: {
      title: 'MEGG — Shop Women\'s Dresses, Co-ord Sets, Jeans, Kurtas & More Online India',
      description: 'Buy curated women\'s fashion on MEGG — dresses, co-ord sets, jeans, kurtas, skirts and more. Top brands. New arrivals daily.',
      type: 'website',
    },
  },
}

export function homeMetadata(gender: Gender): Metadata {
  return METADATA[gender]
}

const FAQ: Record<Gender, { name: string; text: string }[]> = {
  men: [
    { name: 'What is MEGG?', text: 'MEGG is India\'s curated men\'s fashion platform where you can discover handpicked T-shirts, shirts, jeans, shoes, jackets, hoodies, track pants, perfume, body care and more from top brands. We add new arrivals daily.' },
    { name: 'What categories does MEGG offer?', text: 'MEGG offers T-shirts, shirts, jeans, shoes, jackets, hoodies, sweatshirts, sweaters, track pants, accessories, innerwear, traditional/ethnic wear, perfume, body care and daily essentials for men.' },
    { name: 'Is MEGG available as an app?', text: 'Yes, MEGG is available as a free app on both Android and iOS. Download it for a better fashion discovery experience with style reels, outfit ideas and personalised recommendations.' },
    { name: 'Does MEGG deliver across India?', text: 'MEGG is a fashion discovery platform. When you find a product you like, you\'re redirected to the brand\'s website to complete the purchase. Delivery is handled by the respective brand or retailer.' },
    { name: 'What is the price range on MEGG?', text: 'MEGG features products across all price ranges — from budget picks under Rs 699 to premium fashion. We have a dedicated "Under Rs 699" section for affordable men\'s fashion.' },
    { name: 'Which brands are available on MEGG?', text: 'MEGG curates products from a wide range of trusted Indian and international brands including popular streetwear, athleisure, and premium fashion labels. Every brand and product is handpicked for quality, style, and value.' },
    { name: 'How does MEGG work?', text: 'MEGG is a fashion discovery platform. You browse handpicked men\'s clothing and accessories on MEGG, and when you find something you like, you click through to the brand\'s official website or retailer to complete the purchase. MEGG curates — the brand delivers.' },
    { name: 'Does MEGG have a section for budget fashion?', text: 'Yes. MEGG has a dedicated "Under Rs 699" section where you can find curated men\'s T-shirts, track pants, innerwear, accessories and more — all priced under Rs 699. New budget picks are added daily.' },
  ],
  women: [
    { name: 'What is MEGG?', text: 'MEGG is India\'s curated women\'s fashion platform where you can discover handpicked dresses, co-ord sets, jeans, kurtas & ethnic wear, skirts, footwear, perfume and more from top brands. We add new arrivals daily.' },
    { name: 'What categories does MEGG offer?', text: 'MEGG offers dresses, co-ord sets, jeans, kurtas & ethnic wear, skirts, trousers & bottoms, shirts, T-shirts, shorts, footwear and perfume for women.' },
    { name: 'Is MEGG available as an app?', text: 'Yes, MEGG is available as a free app on both Android and iOS. Download it for a better fashion discovery experience with style reels, outfit ideas and personalised recommendations.' },
    { name: 'Does MEGG deliver across India?', text: 'MEGG is a fashion discovery platform. When you find a product you like, you\'re redirected to the brand\'s website to complete the purchase. Delivery is handled by the respective brand or retailer.' },
    { name: 'What is the price range on MEGG?', text: 'MEGG features products across all price ranges — from budget picks under Rs 699 to premium fashion. We have a dedicated "Under Rs 699" section for affordable women\'s fashion.' },
    { name: 'Which brands are available on MEGG?', text: 'MEGG curates products from a wide range of trusted Indian and international brands including popular ethnic wear, western wear, and premium fashion labels. Every brand and product is handpicked for quality, style, and value.' },
    { name: 'How does MEGG work?', text: 'MEGG is a fashion discovery platform. You browse handpicked women\'s clothing and accessories on MEGG, and when you find something you like, you click through to the brand\'s official website or retailer to complete the purchase. MEGG curates — the brand delivers.' },
    { name: 'Does MEGG have a section for budget fashion?', text: 'Yes. MEGG has a dedicated "Under Rs 699" section where you can find curated women\'s dresses, tops, kurtas, accessories and more — all priced under Rs 699. New budget picks are added daily.' },
  ],
}

const H1: Record<Gender, string> = {
  men: "MEGG — Shop Men's T-Shirts, Shirts, Jeans, Shoes, Jackets & More Online India",
  women: "MEGG — Shop Women's Dresses, Co-ord Sets, Jeans, Kurtas & More Online India",
}

export default async function HomeContent({ gender }: { gender: Gender }) {
  const trending = await getTrendingProducts({ gender }).catch(() => [])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ[gender].map(q => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: { '@type': 'Answer', text: q.text },
    })),
  }

  const trendingJsonLd = trending.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: gender === 'women' ? "Trending Women's Products on MEGG" : "Trending Men's Products on MEGG",
    itemListElement: trending.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.meggfashion.in/product/${p.id}`,
      name: p.name,
    })),
  } : null

  return (
    <main>
      <JsonLd data={faqJsonLd} />
      {trendingJsonLd && (
        <JsonLd data={trendingJsonLd} />
      )}
      <h1 className="sr-only">
        {H1[gender]}
      </h1>
      <div className="mt-[calc(-1*var(--header-height))]">
        <HeroSection />
      </div>
      <CategoryRow gender={gender} />
      <Under699Banner gender={gender} />

      <TrendingStrip products={trending} gender={gender} />
      <OffersSection />
      <section id="new-arrivals" className="pt-12 pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="mb-10">
            <p className="font-sans text-[0.675rem] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
              FRESH DROPS, EVERY DAY
            </p>
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.06em] uppercase text-black">
              NEW ARRIVALS
            </h2>
          </div>
          <NewArrivalsSection gender={gender} />
        </div>
      </section>
    </main>
  )
}
