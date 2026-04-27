import Link from 'next/link'

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

const linkStyle: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-sans)',
  fontSize:      '0.75rem',
  fontWeight:    300,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color:         '#777777',
  marginBottom:  '0.625rem',
  transition:    'color 0.15s',
}

/* ─── Footer ─────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-black)',
        color:           '#ffffff',
        paddingTop:      '4rem',
        paddingBottom:   '2.5rem',
      }}
    >
      <style>{`
        .footer-col-link:hover { color: #ffffff !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand-col { grid-column: 1 / -1; }
          .footer-app-col { grid-column: 1 / -1; }
        }
      `}</style>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* ── Top grid ──────────────────────────────────── */}
        <div
          className="footer-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap:                 '3rem 2rem',
            marginBottom:        '3.5rem',
          }}
        >
          {/* Brand + App card */}
          <div className="footer-brand-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <Link
                href="/"
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '2rem',
                  fontWeight:    400,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color:         '#ffffff',
                  display:       'block',
                  marginBottom:  '1rem',
                  lineHeight:    1,
                }}
              >
                MEGG
              </Link>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: '#555', lineHeight: 1.7, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Personally curated fashion picks.<br />Quality over quantity — always.
              </p>
            </div>

            {/* App install card */}
            <a
              href="https://play.google.com/store/apps/details?id=com.megg.megg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'block',
                border:         '1px solid #222',
                padding:        '1rem 1.125rem',
                textDecoration: 'none',
                position:       'relative',
                overflow:       'hidden',
                maxWidth:       '260px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                <img src="/logo.png" alt="Megg" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555' }}>
                  Available on Android
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                Get the Megg App
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #333', paddingBottom: '1px' }}>
                  Download free
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="#555" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444', marginBottom: '1.25rem' }}>
              Shop
            </p>
            {SHOP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-col-link" style={linkStyle}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Discover */}
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444', marginBottom: '1.25rem' }}>
              Discover
            </p>
            {DISCOVER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-col-link" style={linkStyle}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444', marginBottom: '1.25rem' }}>
              Info
            </p>
            {INFO_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-col-link" style={linkStyle}>
                {link.label}
              </Link>
            ))}
            <a href="https://www.instagram.com/meghansh07" target="_blank" rel="noopener noreferrer" className="footer-col-link" style={linkStyle}>
              Instagram ↗
            </a>
          </div>
        </div>

        {/* ── Bottom strip ──────────────────────────────── */}
        <div
          style={{
            borderTop:      '1px solid #1a1a1a',
            paddingTop:     '1.5rem',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '0.5rem',
          }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: '#333', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            © 2025 MEGG. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: '#333', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Curated fashion · Quality over quantity
          </p>
        </div>

      </div>
    </footer>
  )
}
