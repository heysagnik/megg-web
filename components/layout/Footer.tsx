import Link from 'next/link'

/* ─── Data ───────────────────────────────────────────── */
const SHOP_LINKS = [
  { label: 'Shirts',      href: '/category/Shirt' },
  { label: 'T-Shirts',    href: '/category/Tshirt' },
  { label: 'Jeans',       href: '/category/Jeans' },
  { label: 'Shoes',       href: '/category/Shoes' },
  { label: 'Jackets',     href: '/category/Jacket' },
  { label: 'Accessories', href: '/category/Mens Accessories' },
  { label: 'Body Care',   href: '/category/Body Care' },
  { label: 'Perfume',     href: '/category/Perfume' },
]

const DISCOVER_LINKS = [
  { label: 'All Products', href: '/products' },
  { label: 'Search',       href: '/search' },
  { label: 'New Arrivals', href: '/' },
]

const INFO_LINKS = [
  { label: 'About',   href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms',   href: '/terms' },
]

/* ─── Sub-components (all server-safe) ───────────────── */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily:    'var(--font-sans)',
        fontSize:      '0.5625rem',
        fontWeight:    500,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color:         '#555555',
        marginBottom:  '1.25rem',
        lineHeight:    1,
      }}
    >
      {children}
    </p>
  )
}

function FooterInternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="footer-link">
      {children}
    </Link>
  )
}

function FooterExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      {children}
    </a>
  )
}

/* ─── Footer ─────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-black)',
        color:           '#ffffff',
        paddingTop:      '5rem',
        paddingBottom:   '2.5rem',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  '0 var(--container-px)',
        }}
      >
        {/* ── Top grid ──────────────────────────────────── */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap:                 '2.5rem 2rem',
            marginBottom:        '4rem',
          }}
        >
          {/* Brand — spans 2 cols on larger grids, 1 col on mobile */}
          <div className="footer-brand-col">
            <Link
              href="/"
              style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      '2.5rem',
                fontWeight:    400,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color:         '#ffffff',
                display:       'block',
                marginBottom:  '1.125rem',
                lineHeight:    1,
              }}
            >
              MEGG
            </Link>

            <p
              style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.8rem',
                fontWeight:    300,
                color:         '#777777',
                lineHeight:    1.7,
                maxWidth:      '270px',
                textTransform: 'none',
                letterSpacing: '0.015em',
              }}
            >
              Personally curated fashion picks.
              <br />
              Quality over quantity — always.
            </p>
          </div>

          {/* Shop */}
          <div>
            <FooterHeading>Shop</FooterHeading>
            {SHOP_LINKS.map((link) => (
              <FooterInternalLink key={link.href} href={link.href}>
                {link.label}
              </FooterInternalLink>
            ))}
          </div>

          {/* Discover */}
          <div>
            <FooterHeading>Discover</FooterHeading>
            {DISCOVER_LINKS.map((link) => (
              <FooterInternalLink key={link.href} href={link.href}>
                {link.label}
              </FooterInternalLink>
            ))}
          </div>

          {/* Info */}
          <div>
            <FooterHeading>Info</FooterHeading>
            {INFO_LINKS.map((link) => (
              <FooterInternalLink key={link.href} href={link.href}>
                {link.label}
              </FooterInternalLink>
            ))}
            <FooterExternalLink href="https://www.instagram.com/meghansh07">
              Instagram ↗
            </FooterExternalLink>
          </div>
        </div>

        {/* ── Bottom strip ──────────────────────────────── */}
        <div
          style={{
            borderTop:      '1px solid #1E1E1E',
            paddingTop:     '1.75rem',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      '0.7rem',
              fontWeight:    300,
              color:         '#444444',
              textTransform: 'none',
              letterSpacing: '0.04em',
            }}
          >
            © 2025 MEGG. All rights reserved.
          </p>

          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      '0.7rem',
              fontWeight:    300,
              color:         '#444444',
              textTransform: 'none',
              letterSpacing: '0.04em',
            }}
          >
            Curated fashion · Quality over quantity
          </p>
        </div>
      </div>
    </footer>
  )
}
