import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProduct, getRelatedProducts, getProducts, formatPrice } from '../../../../lib/api';
import type { Product } from '../../../../lib/api';
import ProductCard from '../../../../components/ProductCard';

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await getProduct(params.productId!);
  const [related, brandRes] = await Promise.all([
    getRelatedProducts(params.productId!).catch(() => [] as Product[]),
    getProducts(1, 20, product.category).catch(() => ({ products: [] as Product[] })),
  ]);

  const brandProducts = (brandRes as { products: Product[] }).products
    .filter((bp) => bp.id !== product.id)
    .slice(0, 12);

  const relatedRaw = (related as Product[]).filter((p) => p.id !== product.id);
  const relatedFinal = relatedRaw.length > 0 ? relatedRaw.slice(0, 8) : brandProducts.slice(0, 8);

  return { product, related: relatedFinal, brandProducts };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

const T: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-sm)',
  fontWeight: 400,
  letterSpacing: 'var(--tracking-normal)',
  lineHeight: '1rem',
  textTransform: 'uppercase',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as React.CSSProperties;

const Accordion = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          ...T, fontSize: '0.75rem',
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          minHeight: '3rem', padding: '0.6rem 0',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-black)',
          transform: pressed ? 'scale(0.99)' : 'scale(1)',
          transition: 'transform 150ms ease-out',
        }}
      >
        <span style={{ letterSpacing: 'var(--tracking-wider)' }}>{label}</span>
        <span style={{
          fontSize: '1.1rem', lineHeight: 1, fontWeight: 300, color: 'var(--color-muted)',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease-out',
        }}>+</span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? '600px' : '0', transition: 'max-height 220ms ease-out' }}>
        <div style={{ paddingBottom: '1.25rem', ...T, textTransform: 'none', letterSpacing: '0.01em', color: 'var(--color-gray-600)', lineHeight: '1.7', fontSize: '0.78rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ShelfTitle = ({ title }: { title: string }) => (
  <div style={{ marginBottom: 'var(--space-lg)', paddingLeft: '2rem' }}>
    <p style={{ ...T, fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.22em', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Collection</p>
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 400, letterSpacing: '0.04em', color: 'var(--color-black)', lineHeight: 1.2, textTransform: 'uppercase', WebkitFontSmoothing: 'antialiased' }}>{title}</p>
  </div>
);

const HScrollShelf = ({ title, products }: { title: string; products: Product[] }) => (
  <section style={{ padding: 'var(--space-2xl) 0', borderTop: '1px solid var(--color-border-mid)' }}>
    <ShelfTitle title={title} />
    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingLeft: '4rem', paddingRight: '4rem' }}>
      {products.map((p) => (
        <div key={p.id} style={{ flexShrink: 0, width: 'calc(25vw - 3rem)', scrollSnapAlign: 'start' }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </section>
);

const VGridShelf = ({ title, products }: { title: string; products: Product[] }) => (
  <section style={{ padding: 'var(--space-2xl) 0', borderTop: '1px solid var(--color-border-mid)' }}>
    <ShelfTitle title={title} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  </section>
);

const BuyButton = ({ href }: { href: string }) => {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem', fontWeight: 600,
        letterSpacing: 'var(--tracking-widest)',
        textTransform: 'uppercase',
        WebkitFontSmoothing: 'antialiased',
        width: '100%', minHeight: '3.25rem',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-white)',
        background: hovered ? 'linear-gradient(to bottom, #2a2a2a, #111)' : 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
        boxShadow: `
          0 0 0 0.5px rgba(0,0,0,0.4),
          inset 0 0 0 1px rgba(255,255,255,0.04),
          inset 0 1px 0 rgba(255,255,255,0.07),
          0 1px 2px rgba(0,0,0,0.18),
          0 2px 6px rgba(0,0,0,0.10),
          0 4px 12px rgba(0,0,0,0.06)
        `,
        textShadow: '0 1px 1px rgba(0,0,0,0.2)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 150ms ease-out, background 150ms ease-out',
      }}
    >
      Visit Brand Store
    </button>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', WebkitFontSmoothing: 'antialiased' }}>
    <span style={{ color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>{label}</span>
    <span style={{ color: 'var(--color-black)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{value}</span>
  </p>
);

const ProductPage = () => {
  const { product, related, brandProducts } = useLoaderData() as LoaderData;
  const [scrollProgress, setScrollProgress] = useState(0);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollProgress(0);
  }, [product.id]);

  const setImgRef = useCallback((el: HTMLDivElement | null, i: number) => {
    imgRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const first = imgRefs.current[0];
      if (!first) return;
      const containerTop = first.getBoundingClientRect().top + window.scrollY;
      const n = product.images.filter(Boolean).length;
      const progress = (window.scrollY - containerTop) / window.innerHeight;
      setScrollProgress(Math.max(0, Math.min(n, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product.id, product.images]);

  const images   = product.images.filter(Boolean);
  const hasColor = product.color && product.color !== 'NA' && product.color !== 'N/A';
  const hasFabric = product.fabric && product.fabric.length > 0;

  return (
    <>
      <Helmet>
        <title>{product.name} — MEGG</title>
        <meta name="description" content={product.description ?? `Shop ${product.name} by ${product.brand}`} />
      </Helmet>

      <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--color-white)' }}>
        {/* LEFT — images + scroll progress */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'row' }}>
          <div style={{ position: 'sticky', top: 0, height: '100svh', width: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', zIndex: 5, pointerEvents: 'none', flexShrink: 0 }}>
            {images.map((_, i) => {
              const fill = Math.min(1, Math.max(0, scrollProgress - i));
              return (
                <div key={i} style={{ width: '2px', height: '2rem', background: 'var(--color-border-mid)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${fill * 100}%`, background: 'var(--color-black)', transition: 'height 80ms linear' }} />
                </div>
              );
            })}
          </div>
          <div style={{ flex: 1 }}>
            {images.map((img, i) => (
              <div key={i} ref={(el) => setImgRef(el, i)} style={{ height: '100svh', position: 'relative', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
                <img src={img} alt={`${product.name} — ${i + 1}`} draggable={false} loading={i === 0 ? 'eager' : 'lazy'}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', userSelect: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — sticky info panel */}
        <div ref={(el) => { if (el) el.scrollTop = 0; }} style={{ width: '50%', position: 'sticky', top: 0, height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--color-border)', overflowY: 'auto' }}>
          <div style={{ width: '72%', padding: '2rem 0' }}>
            <p style={{ ...T, fontSize: '0.6rem', fontWeight: 700, letterSpacing: 'var(--tracking-widest)', color: 'var(--color-muted)', marginBottom: '0.35rem' }}>
              {product.brand}
            </p>
            <p style={{ ...T, fontSize: '1rem', fontWeight: 400, color: 'var(--color-black)', lineHeight: '1.4', letterSpacing: '-0.01em', marginBottom: '0.75rem', textWrap: 'balance' as React.CSSProperties['textWrap'], textTransform: 'uppercase' }}>
              {product.name}
            </p>
            <p style={{ ...T, fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-black)', marginBottom: 'var(--space-md)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em' } as React.CSSProperties}>
              {formatPrice(product.price)}
            </p>

            <BuyButton href={product.affiliate_link} />

            <p style={{ ...T, color: 'var(--color-muted)', textAlign: 'center', fontSize: 'var(--text-xs)', marginTop: '0.6rem', textTransform: 'none' as React.CSSProperties['textTransform'], letterSpacing: '0.01em', lineHeight: 1.5 }}>
              You'll be redirected to the brand's website
            </p>

            <div style={{ height: 'var(--space-md)' }} />

            {product.description && (
              <Accordion label="Description">
                <p style={{ textTransform: 'none' }}>{product.description}</p>
              </Accordion>
            )}

            {(hasColor || hasFabric) && (
              <Accordion label="Composition & Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {hasColor && <Row label="Colour" value={product.color!} />}
                  {hasFabric && <Row label="Fabric" value={product.fabric!.join(', ')} />}
                  <Row label="Category" value={product.subcategory} />
                </div>
              </Accordion>
            )}

            <Accordion label="Delivery & Returns">
              <p>Complimentary shipping on all orders. Returns accepted within 30 days.</p>
            </Accordion>

            <div style={{ borderTop: '1px solid var(--color-border-mid)' }} />
          </div>
        </div>
      </div>

      {brandProducts.length > 0 && <HScrollShelf title={`More from ${product.brand}`} products={brandProducts} />}
      {related.length > 0 && (
        <div style={{ background: 'var(--color-surface-2)' }}>
          <VGridShelf title="You May Also Like" products={related} />
        </div>
      )}
    </>
  );
};

export default ProductPage;
