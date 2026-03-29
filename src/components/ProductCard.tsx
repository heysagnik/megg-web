import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/api';
import type { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
}

const COLOR_MAP: Record<string, string> = {
  white: '#F5F5F5', black: '#1A1A1A', blue: '#4A7FA5', navy: '#1B2A4A',
  grey: '#9E9E9E', gray: '#9E9E9E', beige: '#C9B89A', brown: '#7D5A3C',
  green: '#4A7C59', orange: '#D4703A', red: '#B74444', pink: '#E8A0A0',
  yellow: '#D4C03A', purple: '#7B5EA7', olive: '#6B6B45', maroon: '#7A2D2D',
};

const T: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as React.CSSProperties;

const ChevronBtn = ({ dir, onClick }: { dir: 'left' | 'right'; onClick: (e: React.MouseEvent) => void }) => (
  <button
    onClick={onClick}
    aria-label={dir === 'left' ? 'Previous image' : 'Next image'}
    style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [dir]: '10px', zIndex: 20,
      background: 'none', border: 'none', cursor: 'pointer',
      width: '32px', height: '32px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 0,
    }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const images = product.images.filter(Boolean);
  const hasColor = product.color && product.color !== 'NA' && product.color !== 'N/A';

  const goToProduct = () => navigate(`/product/${product.id}`);
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
      style={{ cursor: 'pointer', userSelect: 'none', outline: 'none' }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-gray-50)', aspectRatio: '3/4' }}>
        <img
          key={imgIdx}
          src={images[imgIdx] ?? ''}
          alt={product.name}
          loading="lazy"
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'card-img-in 200ms ease-out both' }}
        />

        {hovered && images.length > 1 && (
          <>
            <ChevronBtn dir="left" onClick={prev} />
            <ChevronBtn dir="right" onClick={next} />
            <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 20, animation: 'card-fade-in 150ms ease-out both' }}>
              {images.map((_, i) => (
                <div key={i} style={{ width: i === imgIdx ? '12px' : '3px', height: '1.5px', background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'width 200ms ease-out, background 200ms ease-out' }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ paddingTop: '0.65rem' }}>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '3px', ...T }}>
          {product.brand}
        </p>
        <p style={{ fontSize: '0.78rem', fontWeight: 400, lineHeight: 1.4, color: 'var(--color-black)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textWrap: 'pretty', ...T } as React.CSSProperties}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-black)', fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--tracking-normal)', ...T }}>
            {formatPrice(product.price)}
          </span>
          {hasColor && (
            <span title={product.color} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, border: '1.5px solid rgba(0,0,0,0.12)', background: COLOR_MAP[product.color!.toLowerCase()] ?? '#ccc' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
