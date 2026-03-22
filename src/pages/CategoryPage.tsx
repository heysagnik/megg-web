import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../lib/api';
import type { Product } from '../lib/api';
import ProductCard from '../components/ProductCard';

const DISPLAY: Record<string, string> = {
  'Shirt': 'Shirts', 'Tshirt': 'T-Shirts', 'Jeans': 'Jeans',
  'Shoes': 'Shoes', 'Jacket': 'Jackets', 'Mens Accessories': 'Accessories',
  'Body Care': 'Body Care',
};

const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '3px' }} />
  </div>
);

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const decoded     = category ? decodeURIComponent(category) : '';
  const displayName = DISPLAY[decoded] ?? decoded;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchPage = useCallback(async (pageNum: number, cat: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getProducts(pageNum, 16, cat);
      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...data.products.filter((p) => !ids.has(p.id))];
      });
      if (data.products.length < 16) setHasMore(false);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProducts([]); setHasMore(true);
    fetchPage(1, decoded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded]);

  useEffect(() => {
    let page = 1;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        page++;
        fetchPage(page, decoded);
      }
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchPage, decoded]);

  return (
    <>
      <Helmet>
        <title>{displayName} — MEGG</title>
        <meta name="description" content={`Shop curated ${displayName} on MEGG.`} />
      </Helmet>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #EBEBEB', padding: '3.5rem 0 2.5rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: '0.6rem', fontFamily: 'var(--font-sans)' }}>
            <Link to="/" style={{ opacity: 0.55 }}>Home</Link>
            {' / '}{displayName}
          </p>
          <h1 className="text-section">{displayName}</h1>
          {products.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: '#9A9A9A', marginTop: '0.5rem', fontFamily: 'var(--font-sans)' }}>
              {products.length}{hasMore ? '+' : ''} items
            </p>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 1.5rem 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
          className="md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && products.length === 0 && Array.from({ length: 16 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {!loading && products.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p style={{ color: '#9A9A9A', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
              No products found in this category.
            </p>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        )}

        <div ref={sentinelRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          {loading && products.length > 0 && (
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #D4D4D4', borderTop: '1.5px solid #0A0A0A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          )}
          {!hasMore && products.length > 0 && (
            <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: 'var(--font-sans)' }}>
              End of {displayName}
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default CategoryPage;
