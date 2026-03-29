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

const ProductCard = ({ product, size = 'md', rank }: ProductCardProps) => {
  const navigate = useNavigate();

  const primaryImg = product.images[0] ?? '';
  const hasColor   = product.color && product.color !== 'NA' && product.color !== 'N/A';

  const goToProduct = () => navigate(`/product/${product.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
      style={{ cursor: 'pointer', userSelect: 'none', outline: 'none' }}
    >
      {/* ── Image container ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-gray-50)', aspectRatio: '3/4' }}>

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

        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* ── Info ── */}
      <div style={{ paddingTop: size === 'sm' ? 'var(--space-xs)' : '0.65rem' }}>
        {/* Brand */}
        <p style={{
          fontSize: 'var(--text-2xs)', fontWeight: 700, letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase', color: 'var(--color-muted)',
          marginBottom: '3px', ...textBase,
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
