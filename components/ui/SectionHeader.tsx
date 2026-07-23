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
    <div className={cn('mb-xl', className)}>
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
          <h2 className="text-section">{title}</h2>
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
