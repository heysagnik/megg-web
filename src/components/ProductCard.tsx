import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/api';
import type { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md';
  rank?: number;
}

const COLOR_MAP: Record<string, string> = {
  white: '#F5F5F5', black: '#1A1A1A', blue: '#4A7FA5', navy: '#1B2A4A',
  grey: '#9E9E9E', gray: '#9E9E9E', beige: '#C9B89A', brown: '#7D5A3C',
  green: '#4A7C59', orange: '#D4703A', red: '#B74444', pink: '#E8A0A0',
  yellow: '#D4C03A', purple: '#7B5EA7', olive: '#6B6B45', maroon: '#7A2D2D',
};

const textBase: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as React.CSSProperties;

/* ── Chevron button ── */
const ChevronBtn = ({ dir, onClick }: { dir: 'left' | 'right'; onClick: (e: React.MouseEvent) => void }) => (
  <button
    onClick={onClick}
    aria-label={dir === 'left' ? 'Previous image' : 'Next image'}
    style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [dir]: '8px', zIndex: 20,
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(0,0,0,0.08)',
      cursor: 'pointer',
      /* Fitts: min 32px target */
      width: '32px', height: '32px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 0,
      /* ease-out entrance, 150ms hover timing */
      transition: 'opacity 150ms ease-out, transform 150ms ease-out',
    }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

const ProductCard = ({ product, size = 'md', rank }: ProductCardProps) => {
  const navigate  = useNavigate();
  const [imgIdx,  setImgIdx]  = useState(0);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const images   = product.images.filter(Boolean);
  const hasColor = product.color && product.color !== 'NA' && product.color !== 'N/A';

  const goToProduct = () => navigate(`/product/${product.id}`);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % images.length);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
        /* physics-active-state: scale on press */
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 150ms ease-out',
      }}
    >
      {/* ── Image container ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-gray-50)',
        aspectRatio: '3/4',
      }}>

        {/* Rank badge */}
        {rank !== undefined && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px', zIndex: 20,
            background: 'var(--color-black)', color: 'var(--color-white)',
            fontSize: 'var(--text-2xs)', fontWeight: 700, letterSpacing: 'var(--tracking-wide)',
            padding: '3px 8px', ...textBase,
          }}>
            #{rank}
          </div>
        )}

        {/* Image — crossfade on index change */}
        <img
          key={imgIdx}
          src={images[imgIdx] ?? ''}
          alt={product.name}
          loading="lazy"
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            /* ease-out entrance on image swap, 200ms small state */
            animation: 'card-img-in 200ms ease-out both',
          }}
        />

        {/* Chevrons + dots — visible on hover when multiple images */}
        {hovered && images.length > 1 && (
          <>
            <ChevronBtn dir="left"  onClick={prev} />
            <ChevronBtn dir="right" onClick={next} />

            {/* Dot strip */}
            <div style={{
              position: 'absolute', bottom: '10px', left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 20,
              /* ease-out entrance */
              animation: 'card-fade-in 150ms ease-out both',
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === imgIdx ? '16px' : '4px',
                    height: '3px',
                    background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    /* small state change: 200ms */
                    transition: 'width 200ms ease-out, background 200ms ease-out',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Subtle gradient — deepens on hover for better contrast */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 40%)'
            : 'none',
          transition: 'opacity 150ms ease-out',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Info ── */}
      <div style={{ paddingTop: size === 'sm' ? 'var(--space-xs)' : '0.65rem' }}>

        {/* Brand */}
        <p style={{
          fontSize: 'var(--text-2xs)', fontWeight: 700,
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
          color: 'var(--color-muted)', marginBottom: '3px', ...textBase,
        }}>
          {product.brand}
        </p>

        {/* Name */}
        <p style={{
          fontSize: size === 'sm' ? 'var(--text-sm)' : '0.78rem',
          fontWeight: 400, lineHeight: 1.4, color: 'var(--color-black)',
          display: '-webkit-box', WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2, overflow: 'hidden',
          textWrap: 'pretty',
          ...textBase,
        } as React.CSSProperties}>
          {product.name}
        </p>

        {/* Price + swatch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <span style={{
            fontSize: size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)',
            fontWeight: 500, color: 'var(--color-black)',
            /* type-tabular-nums-for-data */
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 'var(--tracking-normal)', ...textBase,
          }}>
            {formatPrice(product.price)}
          </span>

          {hasColor && (
            <span
              title={product.color}
              style={{
                display: 'inline-block', width: '10px', height: '10px',
                borderRadius: '50%', flexShrink: 0,
                /* visual-border-alpha-colors */
                border: '1.5px solid rgba(0,0,0,0.12)',
                background: COLOR_MAP[product.color!.toLowerCase()] ?? '#ccc',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
