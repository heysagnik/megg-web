import { useLoaderData, Link } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getOutfits, getProduct } from '../../../../lib/api';
import type { Product } from '../../../../lib/api';
import ProductCard from '../../../../components/ProductCard';
import { Container } from '../../../../components/ui';

export async function loader({ params }: LoaderFunctionArgs) {
  const res    = await getOutfits(1, 50);
  const outfit = res.data.outfits.find((o) => o.id === params.outfitId) ?? null;

  if (!outfit) throw new Response('Outfit not found', { status: 404 });

  const results  = await Promise.allSettled(outfit.product_ids.map(getProduct));
  const products = results
    .filter((r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled')
    .map((r) => r.value);

  return { outfit, products };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

const OutfitPage = () => {
  const { outfit, products } = useLoaderData() as LoaderData;

  return (
    <>
      <Helmet>
        <title>{outfit.title} — MEGG</title>
        <meta name="description" content={`Shop ${outfit.title} on MEGG`} />
      </Helmet>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', height: '88svh', minHeight: '560px', overflow: 'hidden', background: 'var(--color-surface)' }}>
        <img src={outfit.banner_image} alt={outfit.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)' }} />

        <div style={{ position: 'absolute', top: '2rem', left: '1.5rem' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <p className="text-label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '0.75rem' }}>Outfit Collection</p>
          <h1 className="text-display" style={{ color: '#fff', maxWidth: '720px', marginBottom: '1.5rem' }}>{outfit.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}>
              {products.length || outfit.product_ids?.length || '—'} pieces in this look
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <span className="text-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Scroll to shop</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <section style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
            <div>
              <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Shop this look</p>
              <h2 className="text-section">The Pieces</h2>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
              {products.length} item{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
              className="md:grid-cols-3 lg:grid-cols-4"
            >
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: '1.5rem' }}>
                No products found for this outfit.
              </p>
              <Link to="/" className="btn-outline">Browse All</Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default OutfitPage;
