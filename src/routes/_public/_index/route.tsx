import { useRef, useState, useCallback, useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getTrendingProducts, getProducts } from '../../../lib/api';
import type { Product } from '../../../lib/api';
import ProductCard from '../../../components/ProductCard';
import { CardSkeleton, Section, SectionHeader, Spinner } from '../../../components/ui';

/* ── Route loader ────────────────────────────────────── */
export async function loader() {
  const trending = await getTrendingProducts().catch(() => [] as Product[]);
  return { trending };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

/* ═══════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════ */
const HERO_PANELS = [
  { src: 'https://res.cloudinary.com/dlnf84fzs/video/upload/v1774763266/1_sbvyts.mp4',  label: 'New Collection' },
  { src: 'https://res.cloudinary.com/dlnf84fzs/video/upload/v1774763250/2_zpezta.mp4',  label: 'New Collection' },
];

const HEADER_H = 56; // matches --header-height

const HeroPanel = ({ panel }: { panel: { src: string; label: string } }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => { videoRef.current?.play(); };
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      style={{ position: 'relative', flex: 1, overflow: 'hidden' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={panel.src}
        muted loop playsInline
        preload="metadata"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
    </div>
  );
};

const OutfitHero = () => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const threshold = window.innerHeight * 0.45;
    const onScroll = () => setT(Math.min(1, window.scrollY / threshold));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Interpolate position: center of screen → header logo position
  const top = `calc(${(1 - t) * 50}vh + ${t * (HEADER_H / 2)}px)`;
  const fontSize = `${4 - t * (4 - 1.6)}rem`;
  // White over video → black over header background
  const r = Math.round(t * 10);
  const color = t < 0.6 ? '#fff' : `rgb(${r},${r},${r})`;

  return (
    <>
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100svh', minHeight: '600px', overflow: 'hidden' }}>
        {HERO_PANELS.map((panel, i) => (
          <HeroPanel key={i} panel={panel} />
        ))}
      </div>

      {/* Animated MEGG — fixed, moves from center to header logo position */}
      {t < 1 && (
        <div style={{ position: 'fixed', left: '50%', top, transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 110 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize, fontWeight: 400, color, letterSpacing: '-0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1 }}>
            MEGG
          </p>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   Under 699 Banner
   ═══════════════════════════════════════════════════════ */
const Under699Banner = () => (
  <Section style={{ background: 'var(--color-black)', padding: '4rem 2rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gray-400)' }}>
        Limited Time
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--color-white)', lineHeight: 1.05 }}>
        Shop Under ₹699
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-gray-400)', letterSpacing: '0.04em', maxWidth: '360px', lineHeight: 1.6 }}>
        Quality picks that don't break the bank. New styles added daily.
      </p>
      <Link
        to="/products?maxPrice=699"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-white)', color: 'var(--color-black)', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '0.875rem 2.5rem', marginTop: '0.5rem', transition: 'opacity 0.2s' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.8')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
      >
        Shop Now
      </Link>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════════════════
   Trending Strip
   ═══════════════════════════════════════════════════════ */
const TrendingStrip = ({ products }: { products: Product[] }) => (
  <Section>
    <SectionHeader eyebrow="What everyone's wearing" title="Trending Now" cta="See All" ctaTo="/products" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {products.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  </Section>
);



const BENTO = [
  { label: 'Shirts',           slug: 'Shirt',            img: 'https://media.meggfashion.in/products/867ed803-89cb-4478-8d79-1aacdee6e5ed/1772003218452_0.webp' },
  { label: 'Jeans',            slug: 'Jeans',            img: 'https://media.meggfashion.in/products/temp_1770296334566_4exbcjh5p/image_0.webp' },
  { label: 'Shoes',            slug: 'Shoes',            img: 'https://media.meggfashion.in/products/9fc30632-5ef8-4e61-b88b-166998d6b708/1771775586890_0.webp' },
  { label: 'T-Shirts',         slug: 'Tshirt',           img: 'https://media.meggfashion.in/products/temp_1770920862874_6fzi2g1kx/image_0.webp' },
  { label: 'Jackets',          slug: 'Jacket',           img: 'https://media.meggfashion.in/products/temp_1771611411519_c3vwawrom/image_0.webp' },
  { label: 'Accessories',      slug: 'Mens Accessories', img: 'https://media.meggfashion.in/products/66279bd9-213c-4ef4-a814-54dbdb76ef0c/1773830328639_0.webp' },
  { label: 'Hoodies',          slug: 'Hoodies',          img: 'https://media.meggfashion.in/products/temp_1770915330420_g3t5b7vg4/image_0.webp' },
  { label: 'Innerwear',        slug: 'Innerwear',        img: 'https://media.meggfashion.in/products/temp_1770919408840_7qlr2qo5j/image_0.webp' },
  { label: 'Sweater',          slug: 'Sweater',          img: 'https://media.meggfashion.in/products/temp_1770920550332_h6eq6y3t0/image_0.webp' },
  { label: 'Sweatshirt',       slug: 'Sweatshirt',       img: 'https://media.meggfashion.in/products/temp_1770914624320_kbtie2wdy/image_0.webp' },
  { label: 'Track Pants',      slug: 'Trackpants',       img: 'https://media.meggfashion.in/products/temp_1770299740533_si414p35o/image_0.webp' },
  { label: 'Traditional',      slug: 'Traditional',      img: 'https://media.meggfashion.in/products/temp_1770915915609_3gj7xobyj/image_0.webp' },
  { label: 'Perfume',          slug: 'Perfume',          img: 'https://media.meggfashion.in/products/temp_1770147261769_mbxetki8o/image_0.webp' },
  { label: 'Body Care',        slug: 'Body Care',        img: 'https://media.meggfashion.in/products/ab9bad94-6e34-4000-b4ab-cabfa5df8572/1773655710932_0.webp' },
  { label: 'Daily Essentials', slug: 'Daily Essentials', img: 'https://media.meggfashion.in/products/567a62c2-116d-4fa5-b465-faaff4fc3c9d/1773829639379_0.webp' },
];

const CategoryBento = () => (
  <Section>
    <SectionHeader eyebrow="Explore by style" title="Shop by Category" cta="View All" ctaTo="/products" />
    <style>{`.cat-card:hover .cat-img { transform: scale(1.04); }`}</style>
    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
      {BENTO.map((cat) => (
        <Link
          key={cat.slug} to={`/category/${encodeURIComponent(cat.slug)}`}
          className="cat-card"
          style={{ flexShrink: 0, width: '200px', scrollSnapAlign: 'start', textDecoration: 'none' }}
        >
          <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--color-surface-2)', marginBottom: '0.75rem' }}>
            <img src={cat.img} alt={cat.label} loading="lazy"
              className="cat-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
            />
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-black)', marginBottom: '0.2rem' }}>
            {cat.label}
          </p>
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
  const [_page, setPage]        = useState(1);
  const [loading, setLoading]   = useState(false);
  const [hasMore, setHasMore]   = useState(true);
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
    <Section>
      <SectionHeader eyebrow="Fresh drops, every day" title="New Arrivals" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
        {loading && products.length === 0 && Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div ref={sentinelRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
        {loading && products.length > 0 && <Spinner />}
        {!hasMore && products.length > 0 && <p className="text-label" style={{ color: 'var(--color-muted)' }}>You've seen it all</p>}
      </div>
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   Home
   ═══════════════════════════════════════════════════════ */
const Home = () => {
  const { trending } = useLoaderData() as LoaderData;

  return (
    <>
      <Helmet>
        <title>MEGG — Curated Fashion</title>
        <meta name="description" content="Curated fashion picks, outfits, and trending products. Quality over quantity." />
      </Helmet>
      <OutfitHero />
      <CategoryBento/>
      <Under699Banner />
      <TrendingStrip products={trending} />
      <NewArrivals />
    </>
  );
};

export default Home;
