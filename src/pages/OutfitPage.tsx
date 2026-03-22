import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getOutfits, getProduct } from '../lib/api';
import type { Outfit, Product } from '../lib/api';
import ProductCard from '../components/ProductCard';

const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '3px' }} />
  </div>
);

const OutfitPage = () => {
  const { outfitId } = useParams<{ outfitId: string }>();
  const [outfit,   setOutfit]   = useState<Outfit | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    if (!outfitId) return;
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const res   = await getOutfits(1, 50);
        const found = res.data.outfits.find((o) => o.id === outfitId) ?? null;
        setOutfit(found);
        if (found?.product_ids?.length) {
          const results = await Promise.allSettled(found.product_ids.map(getProduct));
          setProducts(
            results
              .filter((r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled')
              .map((r) => r.value)
          );
        }
      } catch { setError(true); }
      finally   { setLoading(false); }
    };
    load();
  }, [outfitId]);

  /* ── Not found ─────────────────────────────────────── */
  if (!loading && (error || !outfit)) return (
    <div style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#D4D4D4', marginBottom: '1rem' }}>
        Outfit not found
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{outfit ? `${outfit.title} — MEGG` : 'Outfit — MEGG'}</title>
        <meta name="description" content={outfit ? `Shop ${outfit.title} on MEGG` : 'Shop this outfit on MEGG'} />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────── */}
      {loading ? (
        <div className="skeleton" style={{ height: '88svh', minHeight: '560px' }} />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '88svh', minHeight: '560px', overflow: 'hidden', background: '#F5F5F5' }}>
          <img
            src={outfit!.banner_image}
            alt={outfit!.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient — heavier at bottom for legibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)' }} />

          {/* Back button */}
          <div style={{ position: 'absolute', top: '2rem', left: '1.5rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.13em',
                textTransform: 'uppercase', fontFamily: 'var(--font-sans)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </Link>
          </div>

          {/* Content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '1440px', margin: '0 auto' }}>
            <p className="text-label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '0.75rem' }}>
              Outfit Collection
            </p>
            <h1 className="text-display" style={{ color: '#fff', maxWidth: '720px', marginBottom: '1.5rem' }}>
              {outfit!.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}>
                {products.length || outfit!.product_ids?.length || '—'} pieces in this look
              </p>
              {/* Scroll cue */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                  Scroll to shop
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Products ──────────────────────────────────── */}
      <section style={{ padding: '5rem 0 8rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid #EBEBEB', paddingBottom: '1.5rem' }}>
            <div>
              <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '0.4rem' }}>Shop this look</p>
              <h2 className="text-section">The Pieces</h2>
            </div>
            {!loading && products.length > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#9A9A9A', fontFamily: 'var(--font-sans)' }}>
                {products.length} item{products.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
            className="md:grid-cols-3 lg:grid-cols-4"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p.id} product={p} />)
            }
          </div>

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <p style={{ color: '#9A9A9A', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                No products found for this outfit.
              </p>
              <Link to="/" className="btn-outline">Browse All</Link>
            </div>
          )}
        </div>
      </section>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default OutfitPage;
