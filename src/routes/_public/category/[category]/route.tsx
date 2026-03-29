import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../../../../lib/api';
import type { Product } from '../../../../lib/api';
import ProductCard from '../../../../components/ProductCard';
import { CardSkeleton, Container, EndOfFeed, PageHeader } from '../../../../components/ui';

const DISPLAY: Record<string, string> = {
  'Shirt': 'Shirts', 'Tshirt': 'T-Shirts', 'Jeans': 'Jeans',
  'Shoes': 'Shoes', 'Jacket': 'Jackets', 'Mens Accessories': 'Accessories',
  'Body Care': 'Body Care',
};

export async function loader({ params }: LoaderFunctionArgs) {
  const category = params.category ? decodeURIComponent(params.category) : '';
  const data     = await getProducts(1, 16, category).catch(() => ({ products: [] as Product[] }));
  return { category, firstPage: data.products };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

const CategoryPage = () => {
  const { category, firstPage } = useLoaderData() as LoaderData;
  const displayName = DISPLAY[category] ?? category;

  const [products, setProducts] = useState<Product[]>(firstPage);
  const [loading,  setLoading]  = useState(false);
  const [hasMore,  setHasMore]  = useState(firstPage.length === 16);
  const pageRef     = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setProducts(firstPage);
    setHasMore(firstPage.length === 16);
    pageRef.current = 1;
  }, [category, firstPage]);

  const fetchNext = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      pageRef.current += 1;
      const data = await getProducts(pageRef.current, 16, category);
      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...data.products.filter((p) => !ids.has(p.id))];
      });
      if (data.products.length < 16) setHasMore(false);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  }, [loading, category]);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchNext();
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchNext]);

  return (
    <>
      <Helmet>
        <title>{displayName} — MEGG</title>
        <meta name="description" content={`Shop curated ${displayName} on MEGG.`} />
      </Helmet>

      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: displayName }]}
        title={displayName}
        subtitle={products.length > 0 ? `${products.length}${hasMore ? '+' : ''} items` : undefined}
      />

      <Container style={{ padding: '2.5rem var(--container-px) var(--space-3xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
          className="md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {!loading && products.length === 0 && (
          <div style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem' }}>
              No products found in this category.
            </p>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        )}

        <div ref={sentinelRef}>
          <EndOfFeed loading={loading} hasMore={hasMore} count={products.length} message={`End of ${displayName}`} />
        </div>
      </Container>
    </>
  );
};

export default CategoryPage;
