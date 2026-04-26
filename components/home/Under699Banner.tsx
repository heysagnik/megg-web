import Link from 'next/link'

export default function Under699Banner() {
  return (
    <section
      style={{
        background: 'var(--color-black)',
        paddingTop: 'clamp(3rem, 6vw, 5rem)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          textAlign: 'center',
          padding: '0 var(--container-px)',
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.2em',
            color: 'var(--color-gray-400)',
            textTransform: 'uppercase',
          }}
        >
          Limited Time
        </span>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: 'var(--color-white)',
            letterSpacing: '-0.02em',
            textTransform: 'none',
            lineHeight: 1.05,
          }}
        >
          Shop Under ₹699
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            color: 'var(--color-gray-400)',
            maxWidth: '340px',
            lineHeight: 1.6,
            textTransform: 'none',
            letterSpacing: '0.03em',
          }}
        >
          Quality picks that don&apos;t break the bank. New styles added daily.
        </p>

        {/* CTA */}
        <Link
          href="/under699"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-white)',
            color: 'var(--color-black)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '0.875rem 2.5rem',
            marginTop: '0.5rem',
            transition: 'opacity 0.2s',
            fontWeight: 500,
          }}
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
