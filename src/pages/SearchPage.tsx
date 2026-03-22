import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../lib/api';
import type { Product } from '../lib/api';
import ProductCard from '../components/ProductCard';

const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '3px' }} />
  </div>
);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [inputVal, setInputVal] = useState(query);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Client-side search: fetch all products and filter by query
  const fetchSearch = useCallback(async (pageNum: number, q: string) => {
    if (!q.trim()) { setProducts([]); setHasMore(false); setTotal(0); return; }
    if (loading) return;
    setLoading(true);
    try {
      // Fetch a large page and filter client-side
      const data = await getProducts(pageNum, 40);
      const lower = q.toLowerCase();
      const filtered = data.products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.subcategory?.toLowerCase().includes(lower) ||
          p.color?.toLowerCase().includes(lower)
      );
      setProducts((prev) => {
        if (pageNum === 1) { setTotal(filtered.length); return filtered; }
        const ids = new Set(prev.map((p) => p.id));
        const next = [...prev, ...filtered.filter((p) => !ids.has(p.id))];
        setTotal(next.length);
        return next;
      });
      setHasMore(data.products.length === 40);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProducts([]); setHasMore(false); setTotal(0);
    setInputVal(query);
    if (query) fetchSearch(1, query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    let page = 1;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        page++;
        fetchSearch(page, query);
      }
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchSearch, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) setSearchParams({ q: inputVal.trim() });
  };

  return (
    <>
      <Helmet>
        <title>{query ? `"${query}" — MEGG` : 'Search — MEGG'}</title>
      </Helmet>

      {/* Search header */}
      <div style={{ borderBottom: '1px solid #EBEBEB', background: '#fff', padding: '3rem 0 0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            <Link to="/" style={{ opacity: 0.55 }}>Home</Link>
            {' / '}Search
          </p>

          {/* Big search input */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '2rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.4">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search products, brands, styles..."
              autoFocus
              style={{
                flex: 1,
                border: 'none', outline: 'none',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                color: '#0A0A0A',
                background: 'transparent',
                letterSpacing: '-0.01em',
              }}
            />
            {inputVal && (
              <button type="submit" className="btn-primary">Search</button>
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 1.5rem 8rem' }}>
        {/* Result count */}
        {query && !loading && (
          <p style={{ fontSize: '0.75rem', color: '#9A9A9A', marginBottom: '2rem', fontFamily: 'var(--font-sans)' }}>
            {total > 0
              ? `${total} result${total !== 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </p>
        )}

        {/* Empty state */}
        {!query && !loading && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#D4D4D4', marginBottom: '0.75rem' }}>
              What are you looking for?
            </p>
            <p style={{ fontSize: '0.8rem', color: '#9A9A9A', fontFamily: 'var(--font-sans)' }}>
              Try searching for brands, categories, or styles
            </p>
            {/* Quick suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
              {['Shirts', 'Jeans', 'Nike', 'White', 'Oversized', 'Shoes'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSearchParams({ q: s })}
                  className="btn-outline"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.625rem' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && !loading && products.length === 0 && (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#D4D4D4', marginBottom: '0.75rem' }}>
              No results found
            </p>
            <p style={{ fontSize: '0.8rem', color: '#9A9A9A', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem' }}>
              Try different keywords or browse all products
            </p>
            <Link to="/products" className="btn-primary">Browse All</Link>
          </div>
        )}

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
          className="md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && products.length === 0 && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {/* Sentinel */}
        <div ref={sentinelRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          {loading && products.length > 0 && (
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #D4D4D4', borderTop: '1.5px solid #0A0A0A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          )}
          {!hasMore && products.length > 0 && (
            <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: 'var(--font-sans)' }}>
              End of results
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default SearchPage;
