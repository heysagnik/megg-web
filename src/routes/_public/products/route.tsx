import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../../../lib/api';
import type { Product } from '../../../lib/api';
import ProductCard from '../../../components/ProductCard';
import { CardSkeleton, Container, EndOfFeed, PageHeader } from '../../../components/ui';

const TABS = [
  { label: 'All',         value: '' },
  { label: 'Shirts',      value: 'Shirt' },
  { label: 'T-Shirts',    value: 'Tshirt' },
  { label: 'Jeans',       value: 'Jeans' },
  { label: 'Shoes',       value: 'Shoes' },
  { label: 'Jackets',     value: 'Jacket' },
  { label: 'Accessories', value: 'Mens Accessories' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url      = new URL(request.url);
  const category = url.searchParams.get('category') ?? '';
  const data     = await getProducts(1, 20, category || undefined).catch(() => ({ products: [] as Product[] }));
  return { category, firstPage: data.products };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

const ProductsPage = () => {
  const { category: loaderCat, firstPage } = useLoaderData() as LoaderData;
  const [, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>(firstPage);
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(firstPage.length === 20);
  const pageRef     = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setProducts(firstPage);
    setHasMore(firstPage.length === 20);
    pageRef.current = 1;
  }, [loaderCat, firstPage]);

  const fetchNext = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      pageRef.current += 1;
      const data = await getProducts(pageRef.current, 20, loaderCat || undefined);
      setProducts((prev) => [...prev, ...data.products.filter((p) => !prev.find((x) => x.id === p.id))]);
      if (data.products.length < 20) setHasMore(false);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  }, [loading, loaderCat]);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchNext();
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchNext]);

  const setCategory = (cat: string) =>
    cat ? setSearchParams({ category: cat }) : setSearchParams({});

  const pageTitle = TABS.find((t) => t.value === loaderCat)?.label ?? 'All';

  const filterTabs = (
    <div style={{ display: 'flex', overflowX: 'auto', gap: 0 }}>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setCategory(tab.value)}
          style={{
            flexShrink: 0, padding: '0.875rem 1.5rem',
            fontSize: 'var(--text-xs)', fontWeight: 500,
            letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
            borderBottom: loaderCat === tab.value ? '2px solid var(--color-black)' : '2px solid transparent',
            color: loaderCat === tab.value ? 'var(--color-black)' : 'var(--color-muted)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { if (loaderCat !== tab.value) e.currentTarget.style.color = 'var(--color-black)'; }}
          onMouseLeave={(e) => { if (loaderCat !== tab.value) e.currentTarget.style.color = 'var(--color-muted)'; }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Shop — MEGG</title>
        <meta name="description" content="Browse curated fashion on MEGG." />
      </Helmet>

      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
        title={pageTitle}
        below={filterTabs}
      />

      <Container style={{ padding: '2.5rem var(--container-px) var(--space-3xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {!loading && products.length === 0 && (
          <div style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-base)' }}>No products found.</p>
          </div>
        )}

        <div ref={sentinelRef}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} message="All caught up" />
        </div>
      </Container>
    </>
  );
};

export default ProductsPage;
