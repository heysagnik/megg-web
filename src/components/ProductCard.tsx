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

const ProductCard = ({ product, size = 'md', rank }: ProductCardProps) => {
  const primaryImg = product.images[0] ?? '';
  const hoverImg   = product.images[1] ?? '';
  const hasHover   = !!hoverImg && hoverImg !== primaryImg;

  const handleClick = () => {
    if (product.affiliate_link) window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="product-card group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Image */}
      <div
        style={{ position: 'relative', overflow: 'hidden', background: '#F5F5F5', aspectRatio: '3/4' }}
      >
        {/* Rank */}
        {rank !== undefined && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px', zIndex: 10,
            background: '#0A0A0A', color: '#fff',
            fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1em',
            padding: '3px 7px', fontFamily: 'var(--font-sans)',
          }}>
            #{rank}
          </div>
        )}

        {/* Primary image */}
        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="product-card-img"
          style={{ position: 'absolute', inset: 0, opacity: hasHover ? undefined : 1 }}
        />

        {/* Hover image */}
        {hasHover && (
          <>
            {/* Hide primary on hover via group */}
            <style>{`.group:hover .primary-img { opacity: 0; } .group:hover .hover-img { opacity: 1; } .group:hover .product-card-img { transform: scale(1.04); }`}</style>
            <img
              src={primaryImg}
              alt={product.name}
              loading="lazy"
              draggable={false}
              className="product-card-img primary-img"
              style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity 0.35s ease, transform 0.65s ease' }}
            />
            <img
              src={hoverImg}
              alt={product.name}
              loading="lazy"
              draggable={false}
              className="product-card-img hover-img"
              style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0, transition: 'opacity 0.35s ease, transform 0.65s ease' }}
            />
          </>
        )}

        {/* Shop CTA */}
        <div style={{
          position: 'absolute', bottom: 0, inset: 'auto 0 0 0', zIndex: 10,
          background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)',
          padding: '1.5rem 0.75rem 0.75rem',
          opacity: 0, transform: 'translateY(4px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
          className="card-cta"
        >
          <style>{`.group:hover .card-cta { opacity: 1 !important; transform: translateY(0) !important; }`}</style>
          <span style={{
            display: 'inline-block',
            color: '#fff', fontSize: '0.58rem', fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.5)',
            paddingBottom: '1px',
            fontFamily: 'var(--font-sans)',
          }}>
            Shop Now ↗
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ paddingTop: '0.625rem' }}>
        <p style={{ fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>
          {product.brand}
        </p>
        <p style={{
          fontSize: size === 'sm' ? '0.75rem' : '0.8rem',
          fontWeight: 400, lineHeight: 1.35, color: '#0A0A0A',
          display: '-webkit-box', WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2, overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.375rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0A0A0A', fontFamily: 'var(--font-sans)' }}>
            {formatPrice(product.price)}
          </span>
          {product.color && product.color !== 'NA' && product.color !== 'N/A' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.6rem', color: '#9A9A9A', textTransform: 'capitalize', fontFamily: 'var(--font-sans)' }}>
              <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.12)', background: COLOR_MAP[product.color.toLowerCase()] ?? '#aaa', flexShrink: 0 }} />
              {product.color}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
