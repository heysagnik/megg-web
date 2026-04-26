'use client'

import { useRouter } from 'next/navigation'

/* ─── Data ───────────────────────────────────────────── */
const TABS = [
  { label: 'All',         value: '' },
  { label: 'Shirts',      value: 'Shirt' },
  { label: 'T-Shirts',    value: 'Tshirt' },
  { label: 'Jeans',       value: 'Jeans' },
  { label: 'Shoes',       value: 'Shoes' },
  { label: 'Jackets',     value: 'Jacket' },
  { label: 'Accessories', value: 'Mens Accessories' },
  { label: 'Hoodies',     value: 'Hoodies' },
  { label: 'Body Care',   value: 'Body Care' },
  { label: 'Perfume',     value: 'Perfume' },
]

/* ─── Props ──────────────────────────────────────────── */
interface FilterTabsProps {
  activeCategory: string
}

/* ─── Component ──────────────────────────────────────── */
export default function FilterTabs({ activeCategory }: FilterTabsProps) {
  const router = useRouter()

  const handleTab = (value: string) => {
    const url = value
      ? `/products?category=${encodeURIComponent(value)}`
      : '/products'
    router.push(url)
  }

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      style={{
        display:          'flex',
        alignItems:       'stretch',
        gap:              0,
        overflowX:        'auto',
        /* Hide scrollbar but keep it functional */
        scrollbarWidth:   'none',
        msOverflowStyle:  'none' as React.CSSProperties['msOverflowStyle'],
        paddingBottom:    0,
        /* Stretch to the full header width */
        marginLeft:       0,
        marginRight:      0,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.value === activeCategory

        return (
          <button
            key={tab.value || 'all'}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => handleTab(tab.value)}
            style={{
              /* Reset */
              appearance:      'none',
              background:      'none',
              border:          'none',
              cursor:          'pointer',
              /* Layout */
              display:         'inline-flex',
              alignItems:      'center',
              padding:         '0.875rem 0',
              marginRight:     '2rem',
              flexShrink:      0,
              /* Typography */
              fontFamily:      'var(--font-sans)',
              fontSize:        'var(--text-xs)',
              fontWeight:      500,
              letterSpacing:   'var(--tracking-wider)',
              textTransform:   'uppercase',
              whiteSpace:      'nowrap',
              /* Colour */
              color:           isActive ? 'var(--color-black)' : 'var(--color-muted)',
              /* Active indicator: bottom border rendered via boxShadow
                 so it doesn't affect layout flow */
              boxShadow:       isActive
                ? 'inset 0 -2px 0 0 var(--color-black)'
                : 'none',
              /* Smooth transition */
              transition:      'color 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-black)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-muted)'
              }
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
