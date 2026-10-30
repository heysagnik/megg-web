import Link from 'next/link'
import { getCdnImageUrl } from '@/lib/image'
import type { Gender } from '@/lib/api'
import { genderPath } from '@/lib/genderPath'

interface BentoItem {
  label: string
  slug: string
  keyword: string
  img: string
  isAsset: boolean
}

const MEN_BENTO: BentoItem[] = [
  { label: 'Shirts',           slug: 'Shirt',            keyword: "Men's Shirts Online India",        img: '/assets/SHIRTS.webp', isAsset: true },
  { label: 'Jeans',            slug: 'Jeans',            keyword: "Men's Jeans Online India",         img: '/assets/JEANS.webp', isAsset: true },
  { label: 'Shoes',            slug: 'Shoes',            keyword: "Men's Shoes Online India",         img: '/assets/SHOES.webp', isAsset: true },
  { label: 'T-Shirts',         slug: 'Tshirt',           keyword: "Men's T-Shirts Online India",      img: '/assets/TSHIRT.webp', isAsset: true },
  { label: 'Jackets',          slug: 'Jacket',           keyword: "Men's Jackets Online India",       img: '/assets/JACKET.webp', isAsset: true },
  { label: 'Accessories',      slug: 'Mens Accessories', keyword: "Men's Accessories Online India",   img: '/assets/ACESSORIES.webp', isAsset: true },
  { label: 'Hoodies',          slug: 'Hoodies',          keyword: "Men's Hoodies Online India",       img: '/assets/HOODIES.webp', isAsset: true },
  { label: 'Innerwear',        slug: 'Innerwear',        keyword: "Men's Innerwear Online India",     img: '/assets/INNERWEAR.webp', isAsset: true },
  { label: 'Sweater',          slug: 'Sweater',          keyword: "Men's Sweaters Online India",      img: '/assets/SWEATER.webp', isAsset: true },
  { label: 'Sweatshirt',       slug: 'Sweatshirt',       keyword: "Men's Sweatshirts Online India",   img: '/assets/SWEATSHIRT.webp', isAsset: true },
  { label: 'Track Pants',      slug: 'Trackpants',       keyword: "Men's Track Pants Online India",   img: '/assets/TRACKPANTS.webp', isAsset: true },
  { label: 'Traditional',      slug: 'Traditional',      keyword: "Men's Ethnic Wear Online India",   img: '/assets/FORMAL-TEXTURED-OUTFIT.webp', isAsset: true },
  { label: 'Perfume',          slug: 'Perfume',          keyword: "Men's Perfume Online India",       img: '/assets/PERFUME.webp', isAsset: true },
  { label: 'Body Care',        slug: 'Body Care',        keyword: "Men's Body Care Products India",   img: '/assets/SKINCARE.webp', isAsset: true },
]

const WOMEN_BENTO: BentoItem[] = [
  { label: 'Tops', slug: 'Tops', keyword: "Women's Stylish Tops Online India", img: '/assets/top.webp', isAsset: true },
  { label: 'Jackets', slug: 'Jackets', keyword: "Women's Jackets Online India", img: '/assets/jacketsW.webp', isAsset: true },
  { label: 'Jeans', slug: 'Jeans', keyword: "Women's Jeans Online India", img: '/assets/jeansW.webp', isAsset: true },
  { label: 'Sweaters', slug: 'Sweater', keyword: "Women's Sweaters Online India", img: '/assets/sweatersW.webp', isAsset: true },
  { label: 'T-Shirts', slug: 'Tshirt', keyword: "Women's T-Shirts Online India", img: '/assets/wtshirts.webp', isAsset: true },
  { label: 'Hoodies', slug: 'Hoodies', keyword: "Women's Hoodies Online India", img: '/assets/hoodiesW.webp', isAsset: true },
  { label: 'Co-ord Sets', slug: 'Co-ord Sets', keyword: "Women's Co-ord Sets Online India", img: '/assets/co-ord-sets.webp', isAsset: true },
  { label: 'Sweatshirts', slug: 'Sweatshirt', keyword: "Women's Sweatshirts Online India", img: '/assets/sweatshirt-alternative.webp', isAsset: true },
  { label: 'Footwear', slug: 'Footwear', keyword: "Women's Footwear Online India", img: '/assets/footwear.webp', isAsset: true },
  { label: 'Gym Wear', slug: 'Gym Wear', keyword: "Women's Gym Wear Online India", img: '/assets/gym-wear.webp', isAsset: true },
  { label: 'Dresses', slug: 'Dresses', keyword: "Women's Dresses Online India", img: '/assets/dresses.webp', isAsset: true },
  { label: 'Shirts', slug: 'Shirts', keyword: "Women's Shirts Online India", img: '/assets/women-shirts.webp', isAsset: true },
  { label: 'Accessories', slug: 'Accessories', keyword: "Women's Accessories Online India", img: '/assets/accessories.webp', isAsset: true },
  { label: 'Perfume', slug: 'Perfume', keyword: "Women's Perfumes Online India", img: '/assets/perfumes.webp', isAsset: true },
  { label: 'Shorts', slug: 'Shorts', keyword: "Women's Shorts Online India", img: '/assets/shorts.webp', isAsset: true },
  { label: 'Skirts', slug: 'Skirts', keyword: "Women's Skirts Online India", img: '/assets/skirts.webp', isAsset: true },
  { label: 'Kurtas & Ethnic Wear', slug: 'Kurtas & Ethnic Wear', keyword: "Women's Sarees Online India", img: '/assets/sarees.webp', isAsset: true },
  { label: 'Trousers & Bottoms', slug: 'Trousers and Bottoms', keyword: "Women's Trousers and Bottoms Online India", img: '/assets/trouserbottom.webp', isAsset: true },
  
]
export default async function CategoryRow({ gender }: { gender: Gender }) {
  const bento = gender === 'women' ? WOMEN_BENTO : MEN_BENTO
  if (bento.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Shop ${gender === 'women' ? "Women's" : "Men's"} Fashion by Category — MEGG`,
    description: `Browse curated ${gender === 'women' ? "women's" : "men's"} fashion categories on MEGG — top brands, new arrivals daily.`,
    numberOfItems: bento.length,
    itemListElement: bento.map((cat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cat.keyword,
      url: `https://www.meggfashion.in${genderPath(gender, `/category/${encodeURIComponent(cat.slug)}`)}`,
    })),
  }

  return (
    <section
      aria-label={`Shop ${gender === 'women' ? "women's" : "men's"} fashion by category`}
      className="w-full min-w-0 overflow-hidden pt-xl pb-xl"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="flex flex-col items-center text-center gap-1 mb-lg px-[var(--container-px)]">
          <span className="text-label text-muted">Explore by Style</span>
          <h2 className="text-section">Shop by Category</h2>
        </div>

        <nav
          aria-label="Product categories"
          className="px-[calc(var(--container-px)_+_0.5rem)] md:mx-[25px] md:px-2"
        >
          <ul
            className="hide-scrollbar flex min-w-0 gap-sm overflow-x-auto list-none p-0 pb-1 [scroll-snap-type:x_mandatory] md:gap-6"
          >
            {bento.map((cat) => (
              <li
                key={cat.slug}
                className="group w-[clamp(140px,42vw,280px)] shrink-0 [scroll-snap-align:start] md:w-[calc((100%_-_6rem)_/_5)]"
              >
                <Link
                  href={genderPath(gender, `/category/${encodeURIComponent(cat.slug)}`)}
                  title={`Buy ${cat.keyword} — MEGG`}
                  aria-label={`Shop ${cat.keyword}`}
                >
                  <div className="relative overflow-hidden bg-surface-2 aspect-[3/4]">
                    <img
                      src={cat.isAsset ? cat.img : getCdnImageUrl(cat.img)}
                      srcSet={cat.isAsset
                        ? undefined
                        : `${getCdnImageUrl(cat.img)} 240w, ${getCdnImageUrl(cat.img)} 320w`}
                      sizes="(min-width: 768px) 20vw, clamp(140px, 42vw, 280px)"
                      alt={`${cat.keyword} — Shop on MEGG`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="auto"
                      width={320}
                      height={427}
                      draggable={false}
                    />
                  </div>
                  <p className="mt-[0.625rem] font-sans text-[0.7rem] tracking-wider uppercase text-black leading-none">
                    {cat.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
