'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 40,
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const px = SIZE_MAP[size]
  const r = (px - 3) / 2          // radius leaves room for stroke-width 1.5
  const cx = px / 2
  const circumference = 2 * Math.PI * r
  // Show ~75% of the circle as the visible arc
  const dashArray = `${(circumference * 0.75).toFixed(2)} ${(circumference * 0.25).toFixed(2)}`

  const spinStyle: CSSProperties = {
    animation: 'spin 0.9s linear infinite',
    transformOrigin: 'center',
    display: 'block',
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      aria-label="Loading"
      role="status"
      className={cn(className)}
      style={spinStyle}
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="var(--color-gray-200)"
        strokeWidth={1.5}
        fill="none"
      />
      {/* Arc */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke="var(--color-black)"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray={dashArray}
        strokeLinecap="square"
      />
    </svg>
  )
}

export default Spinner
