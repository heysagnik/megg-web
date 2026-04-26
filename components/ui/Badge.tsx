import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'dark'
  className?: string
}

const styles: Record<'default' | 'dark', CSSProperties> = {
  default: {
    backgroundColor: 'var(--color-gray-50)',
    color: 'var(--color-muted)',
  },
  dark: {
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
  },
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.6rem',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wider)',
    textTransform: 'uppercase',
    lineHeight: 1,
    ...styles[variant],
  }

  return (
    <span
      className={cn('text-label', className)}
      style={baseStyle}
    >
      {children}
    </span>
  )
}
