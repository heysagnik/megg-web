import Link from 'next/link'
import Image from 'next/image'

/* ─── Data ───────────────────────────────────────────── */
const SHOP_LINKS = [
  { label: 'Shirts',           href: '/category/Shirt' },
  { label: 'T-Shirts',         href: '/category/Tshirt' },
  { label: 'Jeans',            href: '/category/Jeans' },
  { label: 'Shoes',            href: '/category/Shoes' },
  { label: 'Jackets',          href: '/category/Jacket' },
  { label: 'Hoodies',          href: '/category/Hoodies' },
  { label: 'Sweatshirts',      href: '/category/Sweatshirt' },
  { label: 'Sweaters',         href: '/category/Sweater' },
  { label: 'Track Pants',      href: '/category/Trackpants' },
  { label: 'Accessories',      href: '/category/Mens Accessories' },
  { label: 'Innerwear',        href: '/category/Innerwear' },
  { label: 'Traditional',      href: '/category/Traditional' },
  { label: 'Perfume',          href: '/category/Perfume' },
  { label: 'Body Care',        href: '/category/Body Care' },
  { label: 'Daily Essentials', href: '/category/Daily Essentials' },
]

const DISCOVER_LINKS = [
  { label: 'All Products',  href: '/products' },
  { label: 'Under Rs. 699', href: '/under699' },
  { label: 'Search',        href: '/search' },
  { label: 'New Arrivals',  href: '/' },
]

const INFO_LINKS = [
  { label: 'About',   href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms',   href: '/terms' },
]

/* ─── Footer ─────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#080808', color: '#fff' }}>
      <style>{`
        .f-link {
          display: block;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #777;
          margin-bottom: 0.65rem;
          text-decoration: none;
          transition: color 120ms ease;
        }
        .f-link:hover { color: #e8e8e8; }

        .f-label {
          font-family: var(--font-sans);
          font-size: 0.52rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 1.25rem;
          display: block;
        }

        .f-app-card {
          display: block;
          border: 1px solid #242424;
          padding: 1rem 1.125rem;
          text-decoration: none;
          max-width: 230px;
          transition: border-color 180ms ease, background 180ms ease;
          background: transparent;
        }
        .f-app-card:hover {
          border-color: #3a3a3a;
          background: #0f0f0f;
        }
        .f-app-card:hover .f-app-arrow { color: #888; }

        .f-app-arrow { color: #333; transition: color 180ms ease; }

        .f-ig {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #777;
          text-decoration: none;
          transition: color 120ms ease;
          margin-top: 0.3rem;
        }
        .f-ig:hover { color: #e8e8e8; }

        .f-wordmark {
          font-family: var(--font-sans);
          font-size: clamp(4.5rem, 17vw, 13rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #0d0d0d;
          -webkit-text-stroke: 1px #2c2c2c;
          line-height: 0.88;
          user-select: none;
          display: block;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .f-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem 1.5rem !important; }
          .f-brand-col { grid-column: 1 / -1; }
          .f-app-card { max-width: 100% !important; }
          .f-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 0.375rem !important; }
        }
      `}</style>

      {/* ── Top rule ── */}
      <div style={{ borderTop: '1px solid #161616' }} />

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* ── Brand statement row ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingTop: '3rem',
          paddingBottom: '2.5rem',
          gap: '2rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid #141414',
        }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 300,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#fff',
            textDecoration: 'none',
            lineHeight: 1,
            flexShrink: 0,
          }}>
            MEGG
          </Link>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.68rem',
            fontWeight: 300,
            color: '#444',
            lineHeight: 1.8,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            textAlign: 'right',
            maxWidth: '280px',
          }}>
            Personally curated fashion picks.<br />Quality over quantity — always.
          </p>
        </div>

        {/* ── Links grid ── */}
        <div
          className="f-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.4fr 1fr',
            gap: '0 3rem',
            paddingTop: '2.75rem',
            paddingBottom: '3rem',
          }}
        >
          {/* App card */}
          <div className="f-brand-col">
            <Link href="/download" className="f-app-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <Image
                  src="/logo.png"
                  alt="Megg"
                  width={20}
                  height={20}
                  style={{ objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                />
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#444',
                }}>
                  Android &amp; iOS
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 400,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                color: '#d0d0d0',
                marginBottom: '0.875rem',
                lineHeight: 1.25,
              }}>
                Get the Megg App
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#444',
                }}>
                  Download free
                </span>
                <svg className="f-app-arrow" width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                  <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>

          {/* Shop */}
          <div>
            <span className="f-label">Shop</span>
            {SHOP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="f-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Discover + Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
            <div>
              <span className="f-label">Discover</span>
              {DISCOVER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="f-link">
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <span className="f-label">Info</span>
              {INFO_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="f-link">
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.instagram.com/meghansh07"
                target="_blank"
                rel="noopener noreferrer"
                className="f-ig"
              >
                Instagram
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1 7L7 1M7 1H2.5M7 1V5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Wordmark ── */}
        <div style={{ borderTop: '1px solid #181818', overflow: 'hidden', paddingTop: '0.75rem' }}>
          <span className="f-wordmark">MEGG</span>
        </div>

        {/* ── Bottom strip ── */}
        <div
          className="f-bottom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.25rem',
            paddingBottom: '2rem',
            borderTop: '1px solid #181818',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            color: '#4a4a4a',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            © 2026 MEGG. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            color: '#383838',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Curated fashion · Quality over quantity
          </p>
        </div>

      </div>
    </footer>
  )
}
