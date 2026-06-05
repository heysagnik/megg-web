export default function ProductLoading() {
  return (
    <>
      <style>{`
        .product-loading {
          display: flex;
          flex-direction: column;
          background: var(--color-white);
          min-height: 100svh;
        }
        @media (min-width: 768px) {
          .product-loading {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Left / image side */
        .product-loading-img {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
        @media (min-width: 768px) {
          .product-loading-img {
            width: 50%;
          }
        }

        .product-loading-strip {
          width: 1.25rem;
          height: 100svh;
          flex-shrink: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        @media (min-width: 768px) {
          .product-loading-strip {
            display: flex;
          }
        }

        .product-loading-img-area {
          flex: 1;
          aspect-ratio: 3 / 4;
        }
        @media (min-width: 768px) {
          .product-loading-img-area {
            aspect-ratio: unset;
            height: 100svh;
          }
        }

        /* Right / info side */
        .product-loading-info {
          width: 100%;
          padding: 1.5rem var(--container-px) 3rem;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .product-loading-info {
            width: 50%;
            height: 100svh;
            padding: 0;
            align-items: center;
            justify-content: center;
            border-left: 1px solid var(--color-border);
          }
        }

        .product-loading-info-inner {
          width: 100%;
        }
        @media (min-width: 768px) {
          .product-loading-info-inner {
            width: 72%;
            padding: 2rem 0;
          }
        }
      `}</style>

      <div className="product-loading" aria-hidden="true">
        {/* ── Image side ── */}
        <div className="product-loading-img">
          <div className="product-loading-strip">
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: '2px', height: '2rem', background: 'var(--color-border-mid)', flexShrink: 0 }} />
            ))}
          </div>
          <div className="skeleton product-loading-img-area" />
        </div>

        {/* ── Info side ── */}
        <div className="product-loading-info">
          <div className="product-loading-info-inner">
            {/* Brand */}
            <div className="skeleton" style={{ height: '0.55rem', width: '32%', marginBottom: '0.75rem' }} />

            {/* Name */}
            <div className="skeleton" style={{ height: '1.4rem', width: '90%', marginBottom: '0.45rem' }} />
            <div className="skeleton" style={{ height: '1.4rem', width: '65%', marginBottom: '1.25rem' }} />

            {/* Price */}
            <div className="skeleton" style={{ height: '1.5rem', width: '28%', marginBottom: 'var(--space-md)' }} />

            <div style={{ height: 'var(--space-md)' }} />

            {/* Accordion rows */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{ borderTop: '1px solid var(--color-border-mid)', minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="skeleton" style={{ height: '0.6rem', width: i === 0 ? '36%' : i === 1 ? '52%' : '44%' }} />
                <div className="skeleton" style={{ height: '0.6rem', width: '0.6rem' }} />
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border-mid)' }} />

            {/* Buy button */}
            <div className="skeleton" style={{ width: '100%', height: '3.25rem' }} />

            {/* Caption */}
            <div className="skeleton" style={{ height: '0.5rem', width: '60%', margin: '0.75rem auto 0' }} />
          </div>
        </div>
      </div>
    </>
  )
}
