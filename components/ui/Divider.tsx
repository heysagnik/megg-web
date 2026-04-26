import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <div
        className={cn(className)}
        style={{
          borderTop: '1px solid var(--color-border)',
          width: '100%',
        } satisfies CSSProperties}
        role="separator"
        aria-hidden="true"
      />
    )
  }

  const lineStyle: CSSProperties = {
    flex: 1,
    borderTop: '1px solid var(--color-border)',
    alignSelf: 'center',
  }

  const labelStyle: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wider)',
    textTransform: 'uppercase',
    color: 'var(--color-muted)',
    padding: '0 1rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }

  return (
    <div
      className={cn(className)}
      style={wrapperStyle}
      role="separator"
    >
      <div style={lineStyle} aria-hidden="true" />
      <span style={labelStyle}>{label}</span>
      <div style={lineStyle} aria-hidden="true" />
    </div>
  )
}
