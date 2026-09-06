import Link from 'next/link'
import { getCategories, listProducts, type Gender } from '@/lib/api'
import { getCdnImageUrl } from '@/lib/image'
import { genderPath } from '@/lib/genderPath'
import { getCategoryDisplay } from '@/lib/utils'

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
  { label: 'Traditional',      slug: 'Traditional',      keyword: "Men's Ethnic Wear Online India",   img: 'https://media.meggfashion.in/products/temp_1770915875275_1x39ncroh/image_0.webp', isAsset: false },
  { label: 'Perfume',          slug: 'Perfume',          keyword: "Men's Perfume Online India",       img: '/assets/PERFUME.webp', isAsset: true },
  { label: 'Body Care',        slug: 'Body Care',        keyword: "Men's Body Care Products India",   img: '/assets/SKINCARE.webp', isAsset: true },
  { label: 'Daily Essentials', slug: 'Daily Essentials', keyword: "Men's Daily Essentials India",     img: 'https://media.meggfashion.in/products/567a62c2-116d-4fa5-b465-faaff4fc3c9d/1773829639379_0.webp', isAsset: false },
]

/**
 * Women's category art isn't shot/exported yet (see docs/gender-split-plan.md
 * — Stage B). Until then, tile art is auto-derived: one representative
 * product per category, its first image used as the tile background —
 * same technique this file already used for `Traditional`/`Daily Essentials`.
 */
async function buildWomenBento(): Promise<BentoItem[]> {
  const categories = await getCategories({ gender: 'women' }).catch(() => [])
  const names = categories
    .map(c => (typeof c === 'string' ? c : (c as unknown as { category: string }).category))
    .filter(Boolean)

  const items = await Promise.all(
    names.map(async (name): Promise<BentoItem | null> => {
      const res = await listProducts({ category: name, gender: 'women', page: 1, limit: 1 }).catch(() => null)
      const img = res?.products?.[0]?.images?.[0]
      if (!img) return null
      const label = getCategoryDisplay(name)
      return { label, slug: name, keyword: `Women's ${label} Online India`, img, isAsset: false }
    }),
  )

  return items.filter((i): i is BentoItem => i !== null)
}

export default async function CategoryRow({ gender }: { gender: Gender }) {
  const bento = gender === 'women' ? await buildWomenBento() : MEN_BENTO
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
            {bento.map((cat) => (
              <li
                key={cat.slug}
                className="shrink-0 group [scroll-snap-align:start]"
                style={{
                  width:           'clamp(140px, 42vw, 280px)',
                }}
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
