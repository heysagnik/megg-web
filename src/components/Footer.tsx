import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Shirts',      slug: 'Shirt' },
  { label: 'T-Shirts',    slug: 'Tshirt' },
  { label: 'Jeans',       slug: 'Jeans' },
  { label: 'Shoes',       slug: 'Shoes' },
  { label: 'Jackets',     slug: 'Jacket' },
  { label: 'Accessories', slug: 'Mens Accessories' },
];

const Footer = () => (
  <footer style={{ background: '#0A0A0A', color: '#fff', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Top — logo + grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

        {/* Brand */}
        <div style={{ gridColumn: 'span 2' }}>
          <Link to="/" className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 1 }}>
            MEGG
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#777', lineHeight: 1.7, maxWidth: '260px' }}>
            Personally curated fashion picks. Quality over quantity — always.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p className="text-label" style={{ color: '#555', marginBottom: '1.25rem' }}>Shop</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${encodeURIComponent(cat.slug)}`}
                style={{ fontSize: '0.8rem', color: '#888', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Discover */}
        <div>
          <p className="text-label" style={{ color: '#555', marginBottom: '1.25rem' }}>Discover</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'All Products', to: '/products' },
              { label: 'Search',       to: '/search' },
              { label: 'New Arrivals', to: '/' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} style={{ fontSize: '0.8rem', color: '#888', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-label" style={{ color: '#555', marginBottom: '1.25rem' }}>Info</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'About',    to: '/about' },
              { label: 'Privacy',  to: '/privacy' },
              { label: 'Terms',    to: '/terms' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} style={{ fontSize: '0.8rem', color: '#888', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                {label}
              </Link>
            ))}
            <a href="https://www.instagram.com/meghansh07" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.8rem', color: '#888', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '1.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.7rem', color: '#444' }}>© {new Date().getFullYear()} MEGG. All rights reserved.</p>
        <p style={{ fontSize: '0.7rem', color: '#444' }}>Curated fashion · Quality over quantity</p>
      </div>
    </div>
  </footer>
);

export default Footer;
