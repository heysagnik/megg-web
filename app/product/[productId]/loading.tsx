export default function ProductLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        background: 'var(--color-white)',
        minHeight: '100svh',
      }}
    >
      {/* ── LEFT: full-height image skeleton ── */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Scroll strip placeholder */}
        <div
          style={{
            width: '1.25rem',
            height: '100svh',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '2px',
                height: '2rem',
                background: 'var(--color-border-mid)',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Image area */}
        <div
          className="skeleton"
          style={{
            flex: 1,
            height: '100svh',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT: sticky info panel skeleton ── */}
      <div
        style={{
          width: '50%',
          height: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        <div style={{ width: '72%', padding: '2rem 0' }}>
          {/* Brand line */}
          <div
            className="skeleton"
            style={{
              height: '0.55rem',
              width: '32%',
              marginBottom: '0.75rem',
            }}
            aria-hidden="true"
          />

          {/* Name — two lines */}
          <div
            className="skeleton"
            style={{
              height: '1.4rem',
              width: '90%',
              marginBottom: '0.45rem',
            }}
            aria-hidden="true"
          />
          <div
            className="skeleton"
            style={{
              height: '1.4rem',
              width: '65%',
              marginBottom: '1.25rem',
            }}
            aria-hidden="true"
          />

          {/* Price */}
          <div
            className="skeleton"
            style={{
              height: '1.5rem',
              width: '28%',
              marginBottom: 'var(--space-md)',
            }}
            aria-hidden="true"
          />

          {/* Spacer */}
          <div style={{ height: 'var(--space-md)' }} />

          {/* Accordion row placeholders */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderTop: '1px solid var(--color-border-mid)',
                minHeight: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                className="skeleton"
                style={{
                  height: '0.6rem',
                  width: i === 0 ? '36%' : i === 1 ? '52%' : '44%',
                }}
                aria-hidden="true"
              />
              <div
                className="skeleton"
                style={{
                  height: '0.6rem',
                  width: '0.6rem',
                }}
                aria-hidden="true"
              />
            </div>
          ))}

          {/* Hairline above buy button */}
          <div
            style={{ borderTop: '1px solid var(--color-border-mid)', marginTop: 0 }}
          />

          {/* Buy button skeleton */}
          <div
            className="skeleton"
            style={{
              width: '100%',
              height: '3.25rem',
              marginTop: 0,
            }}
            aria-hidden="true"
          />

          {/* Redirect caption placeholder */}
          <div
            className="skeleton"
            style={{
              height: '0.5rem',
              width: '60%',
              margin: '0.75rem auto 0',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
