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
      style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', overflow: 'hidden' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .cat-card-img { transition: transform 0.6s ease; }
        .cat-card:hover .cat-card-img { transform: scale(1.04); }
        .cat-scroll-row { scrollbar-width: none; }
        .cat-scroll-row::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'var(--space-lg)' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)' }}>Explore by Style</span>
          <h2 className="text-section">Shop by Category</h2>
        </div>

        <nav aria-label="Product categories">
          <ul
            className="cat-scroll-row"
            role="list"
            style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              marginLeft: 'calc(-1 * var(--container-px))',
              marginRight: 'calc(-1 * var(--container-px))',
              paddingLeft: 'var(--container-px)',
              paddingRight: 'var(--container-px)',
              paddingBottom: '4px',
              listStyle: 'none',
            }}
          >
            {BENTO.map((cat, i) => (
              <li key={cat.slug} style={{ flexShrink: 0, width: 'clamp(140px, 42vw, 280px)', scrollSnapAlign: 'start' }}>
                <Link
                  href={`/category/${encodeURIComponent(cat.slug)}`}
                  className="cat-card"
                  title={`Buy ${cat.keyword} — MEGG`}
                  aria-label={`Shop ${cat.keyword}`}
                >
                  <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
                    <img
                      src={cat.img.startsWith('/assets') ? cat.img : getCdnImageUrl(cat.img, { width: 320, quality: 90 })}
                      srcSet={cat.img.startsWith('/assets') 
                        ? undefined 
                        : `${getCdnImageUrl(cat.img, { width: 240, quality: 90 })} 240w, ${getCdnImageUrl(cat.img, { width: 320, quality: 90 })} 320w`}
                      sizes="clamp(140px, 42vw, 280px)"
                      alt={`${cat.keyword} — Shop on MEGG`}
                      className="cat-card-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={i < 2 ? 'high' : 'low'}
                      width={320}
                      height={427}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      draggable={false}
                    />
                  </div>
                  <p style={{
                    marginTop: '0.625rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-black)',
                    lineHeight: 1,
                  }}>
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
