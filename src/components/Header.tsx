import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NAV = [
  { to: '/',                                        label: 'Home' },
  { to: '/products',                                label: 'Shop' },
  { to: `/category/${encodeURIComponent('Shirt')}`, label: 'Shirts' },
  { to: `/category/${encodeURIComponent('Jeans')}`, label: 'Jeans' },
  { to: `/category/${encodeURIComponent('Shoes')}`, label: 'Shoes' },
  { to: '/about',                                   label: 'About' },
];

const MOBILE_NAV = [
  { to: '/',                                                  label: 'Home' },
  { to: '/products',                                          label: 'Shop All' },
  { to: `/category/${encodeURIComponent('Shirt')}`,           label: 'Shirts' },
  { to: `/category/${encodeURIComponent('Tshirt')}`,          label: 'T-Shirts' },
  { to: `/category/${encodeURIComponent('Jeans')}`,           label: 'Jeans' },
  { to: `/category/${encodeURIComponent('Shoes')}`,           label: 'Shoes' },
  { to: `/category/${encodeURIComponent('Jacket')}`,          label: 'Jackets' },
  { to: `/category/${encodeURIComponent('Mens Accessories')}`, label: 'Accessories' },
  { to: '/about',                                             label: 'About' },
];

const Header = () => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [query,       setQuery]       = useState('');
  const [pastHero, setPastHero] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) { setPastHero(true); return; }
    setPastHero(window.scrollY >= window.innerHeight * 0.9);
    const onScroll = () => setPastHero(window.scrollY >= window.innerHeight * 0.9);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  if (isHome && !pastHero) return null;

  return (
    <>
      {/* ── Main header ──────────────────────────────────── */}
      <header
        className="sticky top-0 z-[100]"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #EBEBEB',
          height: 'var(--header-height)',
        }}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '1440px', margin: '0 auto' }}
        >
          {/* Left — desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: '2rem', flex: 1 }}>
            {NAV.slice(0, 3).map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${pathname === to ? 'active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Center — Logo */}
          <Link
            to="/"
            className="font-display absolute left-1/2"
            style={{
              transform: 'translateX(-50%)',
              fontSize: '1.6rem',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            MEGG
          </Link>

          {/* Right — desktop nav + icons */}
          <div className="hidden md:flex items-center" style={{ gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
            {NAV.slice(3).map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${pathname === to ? 'active' : ''}`}>
                {label}
              </Link>
            ))}
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              style={{ display: 'flex', alignItems: 'center', opacity: 0.7, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Mobile — hamburger + search */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}>
              <span style={{ display: 'block', width: '22px', height: '1px', background: '#0A0A0A', transition: 'transform 0.25s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ display: 'block', width: '22px', height: '1px', background: '#0A0A0A', transition: 'opacity 0.25s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '22px', height: '1px', background: '#0A0A0A', transition: 'transform 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* ── Desktop search bar ──────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0, right: 0,
            background: 'white',
            borderBottom: '1px solid #EBEBEB',
            overflow: 'hidden',
            maxHeight: searchOpen ? '80px' : '0',
            transition: 'max-height 0.3s ease',
          }}
        >
          <form onSubmit={handleSearch} style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', height: '72px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, styles..."
              autoFocus={searchOpen}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '0.875rem', fontFamily: 'var(--font-sans)',
                background: 'transparent', color: '#0A0A0A',
              }}
            />
            {query && (
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Search
              </button>
            )}
            <button type="button" onClick={() => setSearchOpen(false)} style={{ opacity: 0.45, fontSize: '1.2rem', lineHeight: 1 }}>
              ✕
            </button>
          </form>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          zIndex: 200,
          background: 'white',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #EBEBEB' }}>
          <Link to="/" className="font-display" style={{ fontSize: '1.4rem', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
            MEGG
          </Link>
          <button onClick={() => setMenuOpen(false)} style={{ fontSize: '1.4rem', opacity: 0.5 }}>✕</button>
        </div>

        {/* Links */}
        <nav style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {MOBILE_NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: pathname === to ? '#0A0A0A' : '#444',
                padding: '0.65rem 0',
                borderBottom: '1px solid #F0F0F0',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile search */}
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #0A0A0A', paddingBottom: '0.5rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', background: 'transparent' }}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Header;
