import Link from 'next/link'
import { getCdnImageUrl } from '@/lib/image'

const BENTO = [
  { label: 'Shirts',           slug: 'Shirt',            keyword: "Men's Shirts Online India",        img: 'https://media.meggfashion.in/products/248e1d11-1f39-4b76-8283-d3296f6a4b16/1779441206418_0.webp' },
  { label: 'Jeans',            slug: 'Jeans',            keyword: "Men's Jeans Online India",         img: 'https://media.meggfashion.in/products/e202976f-5721-40f7-ae81-d6d660525ec2/1775300117304_0.webp' },
  { label: 'Shoes',            slug: 'Shoes',            keyword: "Men's Shoes Online India",         img: 'https://media.meggfashion.in/products/b1008c2a-ef3d-4187-944f-edc685e5652c/1775477873452_0.webp' },
  { label: 'T-Shirts',         slug: 'Tshirt',           keyword: "Men's T-Shirts Online India",      img: 'https://media.meggfashion.in/products/d95351f7-f4cc-4b9a-b4f1-5ef48b52f31c/1775737735991_0.webp' },
  { label: 'Jackets',          slug: 'Jacket',           keyword: "Men's Jackets Online India",       img: 'https://media.meggfashion.in/products/temp_1771611492547_38u7u7q9h/image_0.webp' },
  { label: 'Accessories',      slug: 'Mens Accessories', keyword: "Men's Accessories Online India",   img: 'https://media.meggfashion.in/products/bea12666-5c41-470a-bc41-cdac7f013cfc/1776507541400_0.webp' },
  { label: 'Hoodies',          slug: 'Hoodies',          keyword: "Men's Hoodies Online India",       img: 'https://media.meggfashion.in/products/temp_1770915432663_er6yvb1le/image_0.webp' },
  { label: 'Innerwear',        slug: 'Innerwear',        keyword: "Men's Innerwear Online India",     img: 'https://media.meggfashion.in/products/temp_1770919439126_z4xttgv2e/image_0.webp' },
  { label: 'Sweater',          slug: 'Sweater',          keyword: "Men's Sweaters Online India",      img: 'https://media.meggfashion.in/products/temp_1770920293205_5b8g1dfm3/image_0.webp' },
  { label: 'Sweatshirt',       slug: 'Sweatshirt',       keyword: "Men's Sweatshirts Online India",   img: 'https://media.meggfashion.in/products/temp_1770914564470_mo7nk88l9/image_0.webp' },
  { label: 'Track Pants',      slug: 'Trackpants',       keyword: "Men's Track Pants Online India",   img: 'https://media.meggfashion.in/products/0a4c383c-ee22-430d-b6b3-ed7342af71f0/1777109370621_0.webp' },
  { label: 'Traditional',      slug: 'Traditional',      keyword: "Men's Ethnic Wear Online India",   img: 'https://media.meggfashion.in/products/temp_1770915875275_1x39ncroh/image_0.webp' },
  { label: 'Perfume',          slug: 'Perfume',          keyword: "Men's Perfume Online India",       img: 'https://media.meggfashion.in/products/temp_1770147219246_mbd9f9w58/image_0.webp' },
  { label: 'Body Care',        slug: 'Body Care',        keyword: "Men's Body Care Products India",   img: 'https://media.meggfashion.in/products/e52d90bc-ccb2-4d7b-aa2d-118af714d30b/1773911172244_0.webp' },
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
                      src={getCdnImageUrl(cat.img, { width: 320, quality: 90 })}
                      srcSet={`${getCdnImageUrl(cat.img, { width: 240, quality: 90 })} 240w, ${getCdnImageUrl(cat.img, { width: 320, quality: 90 })} 320w`}
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
