'use client'

import { useRouter } from 'next/navigation'
import { cn as CN } from '@/lib/utils'

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

interface FilterTabsProps {
  activeCategory: string
}

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
      className="hide-scrollbar flex items-stretch overflow-x-auto"
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
            className={CN(
              'inline-flex items-center py-[0.875rem] mr-lg shrink-0',
              'font-sans text-xs font-medium tracking-wider uppercase whitespace-nowrap',
              'transition-[color,box-shadow] duration-200',
              isActive
                ? 'text-black shadow-[inset_0_-2px_0_0_var(--color-black)]'
                : 'text-muted hover:text-black',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
