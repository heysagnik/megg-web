'use client'

import type { ProductVariant } from '@/lib/api'
import { cn } from '@/lib/utils'
import { getCdnImageUrl } from '@/lib/image'

export interface VariantSelectorProps {
  variants: ProductVariant[]
  activeId: string | null
  onSelect: (v: ProductVariant) => void
}

/**
 * Row of small 52×52 thumbnail swatches representing alternative
 * colour/style variants of the same product. Toggling the active one
 * deselects (sets back to null) so the parent can revert to base.
 */
export default function VariantSelector({
  variants,
  activeId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants.length) return null

  return (
    <div className="mb-sm">
      <p className="font-sans text-[0.7rem] tracking-wider uppercase text-muted mb-[0.6rem]">
        More styles
      </p>
      <div className="flex gap-1 flex-wrap">
        {variants.map(v => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v)}
            className={cn(
              'w-[52px] h-[52px] p-0 border-none cursor-pointer relative overflow-hidden shrink-0',
              activeId === v.id
                ? 'outline outline-2 outline-black outline-offset-1'
                : 'outline outline-1 outline-border-mid outline-offset-1',
              'bg-surface',
            )}
            aria-label={`${v.color} variant`}
          >
            {v.images[0] && (
              <img
                src={getCdnImageUrl(v.images[0])}
                alt={v.color}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
