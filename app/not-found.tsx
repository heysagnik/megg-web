import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl) var(--container-px)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 300,
          letterSpacing: '-0.04em',
          color: 'var(--color-gray-200)',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        404
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
          marginBottom: '2.5rem',
        }}
      >
        Page not found
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/products" className="btn-outline">
          Shop All
        </Link>
        <Link href="/search" className="btn-outline">
          Search
        </Link>
      </div>
    </div>
  )
}
