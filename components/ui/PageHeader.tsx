'use client'

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
      className={cn(className)}
      style={{
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-md) 0 0',
      }}
    >
      {/* Breadcrumbs */}
      {crumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginBottom: 'var(--space-sm)',
          }}
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <span
                key={`${crumb.label}-${index}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {crumb.to && !isLast ? (
                  <Link
                    href={crumb.to}
                    className="text-label"
                    style={{
                      color: 'var(--color-muted)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'var(--color-black)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'var(--color-muted)')
                    }
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="text-label"
                    style={{
                      color: isLast
                        ? 'var(--color-black)'
                        : 'var(--color-muted)',
                    }}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}

                {!isLast && (
                  <span
                    className="text-label"
                    style={{
                      color: 'var(--color-muted)',
                      userSelect: 'none',
                    }}
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
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: 'var(--color-black)',
          marginBottom: subtitle || below ? 'var(--space-xs)' : 'var(--space-md)',
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="text-caption"
          style={{
            marginBottom: below ? 'var(--space-sm)' : 'var(--space-md)',
            maxWidth: '52ch',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Below slot — filter tabs, sort controls, etc. */}
      {below && (
        <div
          style={{
            marginTop: subtitle ? 0 : 'var(--space-sm)',
          }}
        >
          {below}
        </div>
      )}
    </header>
  );
}
