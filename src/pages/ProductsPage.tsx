import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../lib/api';
import type { Product } from '../lib/api';
import ProductCard from '../components/ProductCard';

const TABS = [
  { label: 'All',          value: '' },
  { label: 'Shirts',       value: 'Shirt' },
  { label: 'T-Shirts',     value: 'Tshirt' },
  { label: 'Jeans',        value: 'Jeans' },
  { label: 'Shoes',        value: 'Shoes' },
  { label: 'Jackets',      value: 'Jacket' },
  { label: 'Accessories',  value: 'Mens Accessories' },
];

const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '3px' }} />
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('category') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchPage = useCallback(async (pageNum: number, cat: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getProducts(pageNum, 20, cat || undefined);
      setProducts((prev) =>
        pageNum === 1 ? data.products : [...prev, ...data.products.filter((p) => !prev.find((x) => x.id === p.id))]
      );
      if (data.products.length < 20) setHasMore(false);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProducts([]); setHasMore(true);
    fetchPage(1, activeCat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat]);

  useEffect(() => {
    let page = 1;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        page++;
        fetchPage(page, activeCat);
      }
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchPage, activeCat]);

  const setCategory = (cat: string) =>
    cat ? setSearchParams({ category: cat }) : setSearchParams({});

  const pageTitle = TABS.find((t) => t.value === activeCat)?.label ?? 'All';

  return (
    <>
      <Helmet>
        <title>Shop — MEGG</title>
        <meta name="description" content="Browse curated fashion on MEGG." />
      </Helmet>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #EBEBEB', padding: '3.5rem 0 0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: '0.6rem', fontFamily: 'var(--font-sans)' }}>
            <Link to="/" style={{ opacity: 0.55 }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}>
              Home
            </Link>
            {' / '}Shop
          </p>
          <h1 className="text-section" style={{ marginBottom: '2rem' }}>{pageTitle}</h1>

          {/* Filter tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: 0 }}>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                style={{
                  flexShrink: 0,
                  padding: '0.875rem 1.5rem',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  borderBottom: activeCat === tab.value ? '2px solid #0A0A0A' : '2px solid transparent',
                  color: activeCat === tab.value ? '#0A0A0A' : '#9A9A9A',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (activeCat !== tab.value) e.currentTarget.style.color = '#0A0A0A'; }}
                onMouseLeave={(e) => { if (activeCat !== tab.value) e.currentTarget.style.color = '#9A9A9A'; }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 1.5rem 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
          className="md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && products.length === 0 && Array.from({ length: 20 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {!loading && products.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p style={{ color: '#9A9A9A', fontSize: '0.875rem' }}>No products found.</p>
          </div>
        )}

        <div ref={sentinelRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          {loading && products.length > 0 && (
            <div style={{ width: '28px', height: '28px', border: '1.5px solid #D4D4D4', borderTop: '1.5px solid #0A0A0A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          )}
          {!hasMore && products.length > 0 && (
            <p style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: 'var(--font-sans)' }}>
              All caught up
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default ProductsPage;
