import Link from 'next/link'
import { getCdnImageUrl } from '@/lib/image'

const BENTO = [
  { label: 'Shirts',           slug: 'Shirt',            keyword: "Men's Shirts Online India",        img: '/assets/SHIRTS.webp' },
  { label: 'Jeans',            slug: 'Jeans',            keyword: "Men's Jeans Online India",         img: '/assets/JEANS.webp' },
  { label: 'Shoes',            slug: 'Shoes',            keyword: "Men's Shoes Online India",         img: '/assets/SHOES.webp' },
  { label: 'T-Shirts',         slug: 'Tshirt',           keyword: "Men's T-Shirts Online India",      img: '/assets/TSHIRT.webp' },
  { label: 'Jackets',          slug: 'Jacket',           keyword: "Men's Jackets Online India",       img: '/assets/JACKET.webp' },
  { label: 'Accessories',      slug: 'Mens Accessories', keyword: "Men's Accessories Online India",   img: '/assets/ACESSORIES.webp' },
  { label: 'Hoodies',          slug: 'Hoodies',          keyword: "Men's Hoodies Online India",       img: '/assets/HOODIES.webp' },
  { label: 'Innerwear',        slug: 'Innerwear',        keyword: "Men's Innerwear Online India",     img: '/assets/INNERWEAR.webp' },
  { label: 'Sweater',          slug: 'Sweater',          keyword: "Men's Sweaters Online India",      img: '/assets/SWEATER.webp' },
  { label: 'Sweatshirt',       slug: 'Sweatshirt',       keyword: "Men's Sweatshirts Online India",   img: '/assets/SWEATSHIRT.webp' },
  { label: 'Track Pants',      slug: 'Trackpants',       keyword: "Men's Track Pants Online India",   img: '/assets/TRACKPANTS.webp' },
  { label: 'Traditional',      slug: 'Traditional',      keyword: "Men's Ethnic Wear Online India",   img: 'https://media.meggfashion.in/products/temp_1770915875275_1x39ncroh/image_0.webp' },
  { label: 'Perfume',          slug: 'Perfume',          keyword: "Men's Perfume Online India",       img: '/assets/PERFUME.webp' },
  { label: 'Body Care',        slug: 'Body Care',        keyword: "Men's Body Care Products India",   img: '/assets/SKINCARE.webp' },
  { label: 'Daily Essentials', slug: 'Daily Essentials', keyword: "Men's Daily Essentials India",     img: 'https://media.meggfashion.in/products/567a62c2-116d-4fa5-b465-faaff4fc3c9d/1773829639379_0.webp' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Shop Men's Fashion by Category — MEGG",
  description: "Browse curated men's fashion categories on MEGG — Shirts, Jeans, Shoes, T-Shirts, Jackets, Hoodies & more. Top brands, new arrivals daily.",
  numberOfItems: BENTO.length,
  itemListElement: BENTO.map((cat, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: cat.keyword,
    url: `https://www.meggfashion.in/category/${encodeURIComponent(cat.slug)}`,
  })),
}

export default function CategoryRow() {
  return (
    <section
      aria-label="Shop men's fashion by category"
      className="pt-xl pb-xl overflow-hidden"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)]">
        <div className="flex flex-col gap-1 mb-lg">
          <span className="text-label text-muted">Explore by Style</span>
          <h2 className="text-section">Shop by Category</h2>
        </div>

        <nav aria-label="Product categories">
          <ul
            className="hide-scrollbar flex gap-sm overflow-x-auto list-none p-0 pb-1 [scroll-snap-type:x_mandatory] -mx-[var(--container-px)] px-[var(--container-px)]"
          >
            {BENTO.map((cat, i) => (
              <li
                key={cat.slug}
                className="shrink-0 group [scroll-snap-align:start]"
                style={{
                  width:           'clamp(140px, 42vw, 280px)',
                }}
              >
                <Link
                  href={`/category/${encodeURIComponent(cat.slug)}`}
                  title={`Buy ${cat.keyword} — MEGG`}
                  aria-label={`Shop ${cat.keyword}`}
                >
                  <div className="relative overflow-hidden bg-surface-2 aspect-[3/4]">
                    <img
                      src={cat.img.startsWith('/assets') ? cat.img : getCdnImageUrl(cat.img)}
                      srcSet={cat.img.startsWith('/assets')
                        ? undefined
                        : `${getCdnImageUrl(cat.img)} 240w, ${getCdnImageUrl(cat.img)} 320w`}
                      sizes="clamp(140px, 42vw, 280px)"
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
