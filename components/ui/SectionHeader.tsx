import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  cta?: string;
  ctaTo?: string;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  cta,
  ctaTo,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(className)}
      style={{ marginBottom: 'var(--space-lg)' }}
    >
      <div
        className="section-header-row"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Left: eyebrow + title stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {eyebrow && (
            <span
              className="text-label"
              style={{ color: 'var(--color-muted)' }}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-section">{title}</h2>
        </div>

        {/* Right: CTA */}
        {cta && (
          <>
            {ctaTo ? (
              <Link href={ctaTo} className="btn-underline">
                {cta}
              </Link>
            ) : (
              <span className="btn-underline">{cta}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
