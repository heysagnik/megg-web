import type React from 'react'
import { Spinner } from './Spinner'
import { cn } from '@/lib/utils'

interface EndOfFeedProps {
  loading: boolean
  hasMore: boolean
  count: number
  message?: string
  className?: string
}

export function EndOfFeed({
  loading,
  hasMore,
  count,
  message = 'You\'ve seen everything',
  className,
}: EndOfFeedProps) {
  if (loading) {
    return (
      <div
        className={cn(className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-xl) 0',
        }}
      >
        <Spinner size="md" />
      </div>
    )
  }

  if (!hasMore && count > 0) {
    return (
      <div
        className={cn(className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-xl) 0',
        }}
      >
        {/* Left hairline */}
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--color-border)',
          }}
        />

        {/* Label */}
        <span
          className="text-label"
          style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}
        >
          {message}
        </span>

        {/* Right hairline */}
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--color-border)',
          }}
        />
      </div>
    )
  }

  return null
}

export default EndOfFeed
