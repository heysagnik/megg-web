'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
  below?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  crumbs,
  title,
  subtitle,
  below,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn('border-b border-border pt-md', className)}
    >
      {/* Breadcrumbs */}
      {crumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-sm flex items-center gap-1.5"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <span
                key={`${crumb.label}-${index}`}
                className="inline-flex items-center gap-1.5"
              >
                {crumb.to && !isLast ? (
                  <Link
                    href={crumb.to}
                    className="text-label text-muted transition-colors hover:text-black"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn('text-label', isLast ? 'text-black' : 'text-muted')}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}

                {!isLast && (
                  <span
                    className="text-label select-none text-muted"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {/* Title */}
      <h1
        className={cn(
          'font-serif uppercase leading-[1.05] tracking-tight text-black text-[clamp(1.8rem,3.5vw,3rem)] font-normal',
          subtitle || below ? 'mb-xs' : 'mb-md',
        )}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'text-caption max-w-[52ch]',
            below ? 'mb-sm' : 'mb-md',
          )}
        >
          {subtitle}
        </p>
      )}

      {/* Below slot — filter tabs, sort controls, etc. */}
      {below && (
        <div className={subtitle ? undefined : 'mt-sm'}>
          {below}
        </div>
      )}
    </header>
  );
}
