import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getOutfits, getTrendingProducts, getProducts } from '../lib/api';
import type { Product, Outfit } from '../lib/api';
import ProductCard from '../components/ProductCard';

/* ── Skeleton ────────────────────────────────────────── */
const CardSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '10px', width: '100%', marginBottom: '6px', borderRadius: '3px' }} />
    <div className="skeleton" style={{ height: '10px', width: '65%', borderRadius: '3px' }} />
  </div>
);

/* ── Section wrapper ─────────────────────────────────── */
const Section = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <section style={{ padding: '5rem 0', ...style }}>
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
      {children}
    </div>
  </section>
);

const SectionHeader = ({ eyebrow, title, cta, ctaTo }: { eyebrow: string; title: string; cta?: string; ctaTo?: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
    <div>
      <p className="text-label" style={{ color: '#9A9A9A', marginBottom: '0.5rem' }}>{eyebrow}</p>
      <h2 className="text-section">{title}</h2>
    </div>
    {cta && ctaTo && (
      <Link to={ctaTo} className="btn-outline" style={{ padding: '0.625rem 1.5rem' }}>
        {cta}
      </Link>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════
   Hero — full viewport
   ═══════════════════════════════════════════════════════ */
const OutfitHero = ({ outfit }: { outfit: Outfit | null }) => {
  const navigate = useNavigate();

  if (!outfit) return (
    <div className="skeleton" style={{ height: '100svh', minHeight: '600px' }} />
  );

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100svh', minHeight: '600px', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => navigate(`/outfit/${outfit.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/outfit/${outfit.id}`)}
    >
      <img
        src={outfit.banner_image}
        alt={outfit.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        draggable={false}
      />
      {/* Gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)' }} />

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
        <p className="text-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Today's Outfit</p>
        <h1 className="text-display" style={{ color: '#fff', marginBottom: '2rem', maxWidth: '700px' }}>
          {outfit.title}
        </h1>
        <button
          className="btn-primary"
          style={{ background: '#fff', color: '#0A0A0A' }}
        >
          Shop This Look
        </button>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Outfit grid
   ═══════════════════════════════════════════════════════ */
const OutfitGrid = ({ outfits }: { outfits: Outfit[] }) => {
  const navigate = useNavigate();
  const displayed = outfits.slice(1, 5); // skip hero outfit

  return (
    <Section>
      <SectionHeader eyebrow="Curated Collections" title="Shop by Outfit" cta="View All" ctaTo="/products" />
      {displayed.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }}>
          {[0,1,2,3].map((i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '4/5' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: displayed.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '2px' }}>
          {displayed.map((outfit, idx) => (
            <div
              key={outfit.id}
              style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', cursor: 'pointer', background: '#F5F5F5' }}
              onClick={() => navigate(`/outfit/${outfit.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/outfit/${outfit.id}`)}
              className="group"
            >
              <img
                src={outfit.banner_image}
                alt={outfit.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                className="outfit-img"
                loading={idx < 2 ? 'eager' : 'lazy'}
                draggable={false}
              />
              <style>{`.group:hover .outfit-img { transform: scale(1.04); }`}</style>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 60%)', transition: 'opacity 0.3s' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
                <p className="text-label" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>
                  {String(idx + 1).padStart(2, '0')}
                </p>
                <p className="font-display" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
                  {outfit.title}
                </p>
                <p style={{ marginTop: '0.6rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
                  Shop This Look →
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   Trending Strip — drag to scroll
   ═══════════════════════════════════════════════════════ */
const TrendingStrip = ({ products }: { products: Product[] }) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (stripRef.current?.offsetLeft ?? 0);
    scrollLeft.current = stripRef.current?.scrollLeft ?? 0;
    if (stripRef.current) stripRef.current.style.cursor = 'grabbing';
  };
  const onMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !stripRef.current) return;
    e.preventDefault();
    stripRef.current.scrollLeft = scrollLeft.current - (e.pageX - stripRef.current.offsetLeft - startX.current) * 1.5;
  };
  const onStop = () => {
    isDragging.current = false;
    if (stripRef.current) stripRef.current.style.cursor = 'grab';
  };

  return (
    <Section style={{ background: '#F5F5F5' }}>
      <SectionHeader eyebrow="What everyone's wearing" title="Trending Now" cta="See All" ctaTo="/products" />
      {products.length === 0 ? (
        <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ flexShrink: 0, width: '200px' }}><CardSkeleton /></div>
          ))}
        </div>
      ) : (
        <div
          ref={stripRef}
          style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem', cursor: 'grab', userSelect: 'none', scrollSnapType: 'x mandatory' }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onStop}
          onMouseLeave={onStop}
        >
          {products.slice(0, 20).map((p, idx) => (
            <div key={p.id} style={{ flexShrink: 0, width: '200px', scrollSnapAlign: 'start' }}>
              <ProductCard product={p} size="sm" rank={idx + 1} />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   Category Bento
   ═══════════════════════════════════════════════════════ */
const BENTO = [
  { label: 'Shirts',      slug: 'Shirt',           img: 'https://media.meggfashion.in/products/867ed803-89cb-4478-8d79-1aacdee6e5ed/1772003218452_0.webp' },
  { label: 'Jeans',       slug: 'Jeans',            img: 'https://media.meggfashion.in/products/temp_1770296334566_4exbcjh5p/image_0.webp' },
  { label: 'Shoes',       slug: 'Shoes',            img: 'https://media.meggfashion.in/products/9fc30632-5ef8-4e61-b88b-166998d6b708/1771775586890_0.webp' },
  { label: 'T-Shirts',    slug: 'Tshirt',           img: 'https://media.meggfashion.in/products/temp_1770920862874_6fzi2g1kx/image_0.webp' },
  { label: 'Jackets',     slug: 'Jacket',           img: 'https://media.meggfashion.in/products/temp_1771611411519_c3vwawrom/image_0.webp' },
  { label: 'Accessories', slug: 'Mens Accessories', img: 'https://media.meggfashion.in/products/66279bd9-213c-4ef4-a814-54dbdb76ef0c/1773830328639_0.webp' },
];

const CategoryBento = () => (
  <Section>
    <SectionHeader eyebrow="Explore by style" title="Categories" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto', gap: '2px' }}>
      {BENTO.map((cat, idx) => (
        <Link
          key={cat.slug}
          to={`/category/${encodeURIComponent(cat.slug)}`}
          style={{
            position: 'relative', overflow: 'hidden',
            aspectRatio: '4/5', background: '#F5F5F5', display: 'block',
            gridColumn: idx === 0 ? 'span 2' : undefined,
            gridRow: idx === 0 ? 'span 2' : undefined,
          }}
          className="group"
        >
          <img
            src={cat.img}
            alt={cat.label}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
            className="bento-img"
          />
          <style>{`.group:hover .bento-img { transform: scale(1.04); }`}</style>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: idx === 0 ? '2rem' : '1.25rem' }}>
            <p className="font-display" style={{ fontWeight: 400, color: '#fff', textTransform: 'uppercase', lineHeight: 1, fontSize: idx === 0 ? '2.5rem' : '1.35rem' }}>
              {cat.label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </Section>
);

/* ═══════════════════════════════════════════════════════
   New Arrivals — infinite scroll
   ═══════════════════════════════════════════════════════ */
const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [_page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getProducts(pageNum, 12);
      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...data.products.filter((p) => !ids.has(p.id))];
      });
      if (data.products.length < 12) setHasMore(false);
    } catch { setHasMore(false); }
    finally   { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchPage(1); }, []); // eslint-disable-line

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading)
        setPage((p) => { fetchPage(p + 1); return p + 1; });
    }, { rootMargin: '200px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, fetchPage]);

  return (
    <Section style={{ background: '#F5F5F5' }}>
      <SectionHeader eyebrow="Fresh drops, every day" title="New Arrivals" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem 1rem' }}
        className="md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
        {loading && products.length === 0 && Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>

      <div ref={sentinelRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
        {loading && products.length > 0 && (
          <div style={{ width: '28px', height: '28px', border: '1.5px solid #D4D4D4', borderTop: '1.5px solid #0A0A0A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-label" style={{ color: '#9A9A9A' }}>You've seen it all</p>
        )}
      </div>
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   Home
   ═══════════════════════════════════════════════════════ */
const Home = () => {
  const [heroOutfit, setHeroOutfit] = useState<Outfit | null>(null);
  const [outfits,    setOutfits]    = useState<Outfit[]>([]);
  const [trending,   setTrending]   = useState<Product[]>([]);

  useEffect(() => {
    getOutfits(1, 10).then((res) => {
      const list = res.data.outfits ?? [];
      setHeroOutfit(list[0] ?? null);
      setOutfits(list);
    }).catch(console.error);
    getTrendingProducts().then(setTrending).catch(console.error);
  }, []);

  return (
    <>
      <Helmet>
        <title>MEGG — Curated Fashion</title>
        <meta name="description" content="Curated fashion picks, outfits, and trending products. Quality over quantity." />
      </Helmet>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <OutfitHero outfit={heroOutfit} />
      <OutfitGrid outfits={outfits} />
      <TrendingStrip products={trending} />
      <CategoryBento />
      <NewArrivals />
    </>
  );
};

export default Home;
