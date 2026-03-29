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
    getProducts(1, 8, product.category).catch(() => ({ products: [] as Product[] })),
  ]);
  return {
    product,
    related: (related as Product[]).slice(0, 4),
    brandProducts: (brandRes as { products: Product[] }).products
      .filter((bp) => bp.id !== product.id)
      .slice(0, 3),
  };
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
  return (
    <div style={{ borderTop: '1px solid var(--color-border-mid)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ ...T, fontSize: '0.8rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '3rem', padding: '0.6rem 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-black)' }}
      >
        <span>{label}</span>
        <span style={{ fontSize: '1rem', lineHeight: 1, fontWeight: 300 }}>{open ? '−' : '+'}</span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? '600px' : '0', transition: 'max-height 0.35s ease' }}>
        <div style={{ paddingBottom: '1.25rem', ...T, textTransform: 'none', letterSpacing: '0', color: '#555', lineHeight: '1.6' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ShelfSection = ({ title, products, cols }: { title: string; products: Product[]; cols: number }) => (
  <section style={{ padding: '5rem 2rem', borderTop: '1px solid var(--color-border-mid)' }}>
    <p style={{ ...T, color: 'var(--color-black)', marginBottom: '2.5rem' }}>{title}</p>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem' }}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  </section>
);

const ProductPage = () => {
  const { product, related, brandProducts } = useLoaderData() as LoaderData;

  const [scrollProgress, setScrollProgress] = useState(0);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setScrollProgress(0);
  }, [product.id]);

  const setImgRef = useCallback((el: HTMLDivElement | null, i: number) => {
    imgRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const n = product.images.filter(Boolean).length;
    const handleScroll = () => {
      const first = imgRefs.current[0];
      if (!first) return;
      const containerTop = first.getBoundingClientRect().top + window.scrollY;
      const progress = (window.scrollY - containerTop) / window.innerHeight;
      setScrollProgress(Math.max(0, Math.min(n, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product.id]);

  const images    = product.images.filter(Boolean);
  const hasColor  = product.color && product.color !== 'NA' && product.color !== 'N/A';
  const hasFabric = product.fabric && product.fabric.length > 0;

  return (
    <>
      <Helmet>
        <title>{product.name} — MEGG</title>
        <meta name="description" content={product.description ?? `Shop ${product.name} by ${product.brand}`} />
      </Helmet>

      <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--color-white)' }}>
        {/* LEFT — images + line strip */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'row' }}>
          <div style={{ position: 'sticky', top: 0, height: '100svh', width: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', zIndex: 5, pointerEvents: 'none', flexShrink: 0 }}>
            {images.map((_, i) => {
              const fill = Math.min(1, Math.max(0, scrollProgress - i));
              return (
                <div key={i} style={{ width: '3px', height: '2.5rem', background: 'var(--color-border-mid)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${fill * 100}%`, background: 'var(--color-black)' }} />
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

        {/* RIGHT — sticky info */}
        <div style={{ width: '50%', position: 'sticky', top: 0, height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--color-border)', overflowY: 'auto' }}>
          <div style={{ width: '78%', padding: '1.5rem 0' }}>
            <p style={{ ...T, fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-black)', marginBottom: '0.4rem' }}>{product.brand}</p>
            <p style={{ ...T, fontSize: '0.88rem', color: 'var(--color-black)', marginBottom: '1.25rem', lineHeight: '1.5' }}>{product.name}</p>
            <p style={{ ...T, fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--color-black)', marginBottom: '1.5rem', fontVariantNumeric: 'tabular-nums' } as React.CSSProperties}>
              {formatPrice(product.price)}
            </p>

            {product.description && <Accordion label="Description"><p>{product.description}</p></Accordion>}

            {(hasColor || hasFabric) && (
              <Accordion label="Composition & Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {hasColor && <p style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-muted)' }}>COLOUR</span><span>{product.color!.toUpperCase()}</span></p>}
                  {hasFabric && <p style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-muted)' }}>FABRIC</span><span>{product.fabric!.join(', ').toUpperCase()}</span></p>}
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-muted)' }}>CATEGORY</span><span>{product.subcategory.toUpperCase()}</span></p>
                </div>
              </Accordion>
            )}

            <Accordion label="Delivery & Returns">
              <p>Complimentary shipping on all orders. Returns accepted within 30 days. You will be redirected to the brand's website to complete your purchase.</p>
            </Accordion>

            <div style={{ borderTop: '1px solid var(--color-border-mid)' }} />

            <button
              onClick={() => window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')}
              style={{ ...T, fontSize: '0.8rem', letterSpacing: 'var(--tracking-wider)', width: '100%', minHeight: '3.25rem', background: 'var(--color-black)', color: 'var(--color-white)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.25rem', transition: 'background 200ms ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-gray-600)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-black)')}
            >
              Visit Brand Store
            </button>

            <p style={{ ...T, color: 'var(--color-muted)', textAlign: 'center', fontSize: 'var(--text-xs)', marginTop: '0.75rem', textTransform: 'none' as React.CSSProperties['textTransform'], letterSpacing: '0' }}>
              You will be redirected to the brand's website
            </p>
          </div>
        </div>
      </div>

      {brandProducts.length > 0 && <ShelfSection title={`Shop from ${product.brand}`} products={brandProducts} cols={3} />}
      {related.length > 0 && (
        <div style={{ background: 'var(--color-surface-2)' }}>
          <ShelfSection title="You May Also Like" products={related} cols={4} />
        </div>
      )}
    </>
  );
};

export default ProductPage;
