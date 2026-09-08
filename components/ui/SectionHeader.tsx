import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  cta?: string;
  ctaTo?: string;
  className?: string;
  /**
   * Use inside a page whose own content (e.g. a PDP's product title) must
   * stay the dominant element — a recommendation/upsell shelf shouldn't
   * out-shout the thing the visitor came for. Swaps the big serif display
   * treatment for a quieter sans-serif heading, matched in voice and scale
   * to sit clearly below that primary content.
   */
  compact?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  cta,
  ctaTo,
  className,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(compact ? 'mb-lg' : 'mb-xl', className)}>
      <div
        className={cn(
          'flex items-end justify-between gap-sm',
          'max-md:flex-col max-md:items-start max-md:gap-1',
        )}
      >
        {/* Left: eyebrow + title stack */}
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <span className="text-label text-muted">{eyebrow}</span>
          )}
          <h2
            className={
              compact
                ? 'font-sans font-normal text-black uppercase tracking-tight leading-[1.15] text-[clamp(1.15rem,1.8vw,1.5rem)]'
                : 'text-section'
            }
          >
            {title}
          </h2>
        </div>

        {/* Right: CTA — underline button styled as plain utilities */}
        {cta && (
          <>
            {ctaTo ? (
              <Link
                href={ctaTo}
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'text-xs tracking-wide uppercase',
                  'underline decoration-1 underline-offset-[3px]',
                  'transition-opacity hover:opacity-60',
                )}
              >
                {cta}
              </Link>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'text-xs tracking-wide uppercase',
                  'underline decoration-1 underline-offset-[3px]',
                )}
              >
                {cta}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
