import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../../../lib/api';
import type { Product } from '../../../lib/api';
import ProductCard from '../../../components/ProductCard';
import { CardSkeleton, Container, EndOfFeed } from '../../../components/ui';

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

  const fetchSearch = useCallback(async (pageNum: number, q: string) => {
    if (!q.trim()) { setProducts([]); setHasMore(false); setTotal(0); return; }
    if (loading) return;
    setLoading(true);
    try {
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

      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-white)', padding: 'var(--space-md) 0 0' }}>
        <Container>
          <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-md)' }}>
            <Link to="/" style={{ opacity: 0.55 }}>Home</Link>
            {' / '}Search
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '2rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.4">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text" value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search products, brands, styles..."
              autoFocus
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontFamily: 'var(--font-serif)', fontWeight: 400, color: 'var(--color-black)', background: 'transparent', letterSpacing: '-0.01em' }}
            />
            {inputVal && <button type="submit" className="btn-primary">Search</button>}
          </form>
        </Container>
      </div>

      <Container style={{ padding: '2.5rem var(--container-px) var(--space-3xl)' }}>
        {query && !loading && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)', marginBottom: '2rem', fontFamily: 'var(--font-sans)' }}>
            {total > 0 ? `${total} result${total !== 1 ? 's' : ''} for "${query}"` : `No results for "${query}"`}
          </p>
        )}

        {!query && !loading && (
          <div style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-gray-200)', marginBottom: '0.75rem' }}>What are you looking for?</p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>Try searching for brands, categories, or styles</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
              {['Shirts', 'Jeans', 'Nike', 'White', 'Oversized', 'Shoes'].map((s) => (
                <button key={s} onClick={() => setSearchParams({ q: s })} className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: 'var(--text-xs)' }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {query && !loading && products.length === 0 && (
          <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gray-200)', marginBottom: '0.75rem' }}>No results found</p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem' }}>Try different keywords or browse all products</p>
            <Link to="/products" className="btn-primary">Browse All</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && products.length === 0 && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        <div ref={sentinelRef}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} message="End of results" />
        </div>
      </Container>
    </>
  );
};

export default SearchPage;
