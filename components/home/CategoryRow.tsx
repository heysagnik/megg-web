import Link from 'next/link'
import { getCdnImageUrl } from '@/lib/image'

const BENTO = [
  { label: 'Shirts',           slug: 'Shirt',            img: 'https://media.meggfashion.in/products/00eb8653-dd44-48b2-88b8-0a84eb23859c/1772374312370_0.webp' },
  { label: 'Jeans',            slug: 'Jeans',            img: 'https://media.meggfashion.in/products/e202976f-5721-40f7-ae81-d6d660525ec2/1775300117304_0.webp' },
  { label: 'Shoes',            slug: 'Shoes',            img: 'https://media.meggfashion.in/products/b1008c2a-ef3d-4187-944f-edc685e5652c/1775477873452_0.webp' },
  { label: 'T-Shirts',         slug: 'Tshirt',           img: 'https://media.meggfashion.in/products/d95351f7-f4cc-4b9a-b4f1-5ef48b52f31c/1775737735991_0.webp' },
  { label: 'Jackets',          slug: 'Jacket',           img: 'https://media.meggfashion.in/products/temp_1771611492547_38u7u7q9h/image_0.webp' },
  { label: 'Accessories',      slug: 'Mens Accessories', img: 'https://media.meggfashion.in/products/bea12666-5c41-470a-bc41-cdac7f013cfc/1776507541400_0.webp' },
  { label: 'Hoodies',          slug: 'Hoodies',          img: 'https://media.meggfashion.in/products/temp_1770915432663_er6yvb1le/image_0.webp' },
  { label: 'Innerwear',        slug: 'Innerwear',        img: 'https://media.meggfashion.in/products/temp_1770919439126_z4xttgv2e/image_0.webp' },
  { label: 'Sweater',          slug: 'Sweater',          img: 'https://media.meggfashion.in/products/temp_1770920293205_5b8g1dfm3/image_0.webp' },
  { label: 'Sweatshirt',       slug: 'Sweatshirt',       img: 'https://media.meggfashion.in/products/temp_1770914564470_mo7nk88l9/image_0.webp' },
  { label: 'Track Pants',      slug: 'Trackpants',       img: 'https://media.meggfashion.in/products/0a4c383c-ee22-430d-b6b3-ed7342af71f0/1777109370621_0.webp' },
  { label: 'Traditional',      slug: 'Traditional',      img: 'https://media.meggfashion.in/products/temp_1770915875275_1x39ncroh/image_0.webp' },
  { label: 'Perfume',          slug: 'Perfume',          img: 'https://media.meggfashion.in/products/temp_1770147219246_mbd9f9w58/image_0.webp' },
  { label: 'Body Care',        slug: 'Body Care',        img: 'https://media.meggfashion.in/products/e52d90bc-ccb2-4d7b-aa2d-118af714d30b/1773911172244_0.webp' },
  { label: 'Daily Essentials', slug: 'Daily Essentials', img: 'https://media.meggfashion.in/products/567a62c2-116d-4fa5-b465-faaff4fc3c9d/1773829639379_0.webp' },
]

export default function CategoryRow() {
  return (
    <section
      style={{
        paddingTop: 'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
        overflow: 'hidden',
      }}
    >
      {/* ─── Scoped hover styles ─────────────────────────────── */}
      <style>{`
        .cat-card-img {
          transition: transform 0.6s ease;
        }
        .cat-card:hover .cat-card-img {
          transform: scale(1.04);
        }
        .cat-scroll-row {
          scrollbar-width: none;
        }
        .cat-scroll-row::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ─── Container ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
        }}
      >
        {/* ─── Section header ─────────────────────────────────── */}
        <div
          className="section-header-row"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: 'var(--space-lg)',
          }}
        >
          {/* Left stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span
              className="text-label"
              style={{ color: 'var(--color-muted)' }}
            >
              Explore by Style
            </span>
            <h2 className="text-section">Shop by Category</h2>
          </div>

          
        </div>

        {/* ─── Horizontal scroll row ──────────────────────────── */}
        <div
          className="cat-scroll-row"
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            /* Extend past the container padding so cards bleed nicely */
            marginLeft: 'calc(-1 * var(--container-px))',
            marginRight: 'calc(-1 * var(--container-px))',
            paddingLeft: 'var(--container-px)',
            paddingRight: 'var(--container-px)',
            paddingBottom: '4px', /* room for box-shadow if added later */
          }}
        >
          {BENTO.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${encodeURIComponent(cat.slug)}`}
              className="cat-card"
              style={{
                flexShrink: 0,
                /* ~4 cards visible on desktop, 2 on mobile */
                width: 'clamp(140px, 42vw, 280px)',
                scrollSnapAlign: 'start',
                textDecoration: 'none',
              }}
            >
              {/* Image wrapper — overflow hidden isolates the scale */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  background: 'var(--color-surface-2)',
                }}
              >
                <img
                  src={getCdnImageUrl(cat.img, { width: 320, quality: 80 })}
                  srcSet={`${getCdnImageUrl(cat.img, { width: 240, quality: 80 })} 240w, ${getCdnImageUrl(cat.img, { width: 320, quality: 80 })} 320w`}
                  sizes="clamp(140px, 42vw, 280px)"
                  alt={cat.label}
                  className="cat-card-img"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i < 2 ? 'high' : 'low'}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  draggable={false}
                />
              </div>

              {/* Label */}
              <p
                style={{
                  marginTop: '0.625rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-black)',
                  lineHeight: 1,
                }}
              >
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
