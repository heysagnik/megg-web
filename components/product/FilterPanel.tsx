'use client'

import { useRef, useState } from 'react'
import type { AvailableFilters } from '@/lib/api'
import {
  type BrowseFilters,
  PRICE_OPTIONS,
  countVisibleFilters,
} from '@/lib/browseFilters'
import { getColorHex } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  filters: BrowseFilters
  avail: AvailableFilters
  total: number
  onChange: (next: BrowseFilters) => void
  onClearAll: () => void
}

const ITEM_LIMIT = 6

export default function FilterPanel({
  open,
  onClose,
  filters,
  avail,
  onChange,
  onClearAll,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useFocusTrap({ active: open, containerRef: panelRef, onEscape: onClose })

  // Only ever list options the API says actually have matching products —
  // a 0-count option is a dead end if clicked.
  const hasCount = (o: { count: number }) => o.count > 0

  const subcategories = (avail.subcategories ?? []).filter(hasCount)
  const colors        = (avail.colors        ?? []).filter(hasCount)
  const brands        = (avail.brands        ?? []).filter(hasCount)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const setSubcategory = (value: string) =>
    onChange({
      ...filters,
      subcategory: filters.subcategory.includes(value)
        ? filters.subcategory.filter(item => item !== value)
        : [...filters.subcategory, value],
    })
  const toggle = (key: 'color' | 'brand', value: string) =>
    onChange({
      ...filters,
      [key]: filters[key].includes(value)
        ? filters[key].filter(item => item !== value)
        : [...filters[key], value],
    })
  const activeCount = countVisibleFilters(filters)

  const visibleSubcats = expanded['subcategory'] ? subcategories : subcategories.slice(0, ITEM_LIMIT)
  const visibleColors  = expanded['color']       ? colors        : colors.slice(0, ITEM_LIMIT)
  const visibleBrands  = expanded['brand']       ? brands        : brands.slice(0, ITEM_LIMIT)

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[299] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Slide-over Side Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed inset-y-0 right-0 z-[300] bg-white flex flex-col justify-between will-change-transform transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] w-full sm:w-[400px] h-screen p-5 md:p-6"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        {/* Top Header — Minimal Close Icon */}
        <div className="flex items-center justify-between shrink-0 mb-4 pb-2 border-b border-neutral-100">
          <span className="font-sans text-[0.725rem] tracking-[0.16em] uppercase font-medium text-black">
            FILTERS
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="font-sans text-lg bg-transparent border-none cursor-pointer text-neutral-400 hover:text-black leading-none p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body — Scrollable filter groups */}
        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar space-y-6 md:space-y-7">

          {/* 2. SUBCATEGORY */}
          {subcategories.length > 0 && (
            <div className="flex items-start">
              <div className="w-[100px] shrink-0 font-sans text-[0.675rem] tracking-[0.14em] uppercase text-neutral-400 font-normal pt-0.5">
                TYPE
              </div>
              <div className="flex-1 min-w-0 space-y-2 font-sans">
                {visibleSubcats.map(s => {
                  const isActive = filters.subcategory.includes(s.name)
                  return (
                    <label
                      key={s.name}
                      className="flex w-full items-center gap-2.5 text-left uppercase text-[0.75rem] tracking-wider cursor-pointer"
                    >
                      <input type="checkbox" checked={isActive} onChange={() => setSubcategory(s.name)} className="h-4 w-4 shrink-0 accent-black" />
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {s.name}
                      </span>
                    </label>
                  )
                })}
                {subcategories.length > ITEM_LIMIT && (
                  <button
                    type="button"
                    onClick={() => toggleExpand('subcategory')}
                    className="font-sans text-[0.65rem] tracking-widest uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-1 text-left font-normal"
                  >
                    {expanded['subcategory'] ? 'VIEW LESS' : 'VIEW MORE'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. BRAND */}
          {brands.length > 0 && (
            <div className="flex items-start">
              <div className="w-[100px] shrink-0 font-sans text-[0.675rem] tracking-[0.14em] uppercase text-neutral-400 font-normal pt-0.5">
                BRAND
              </div>
              <div className="flex-1 min-w-0 space-y-2 font-sans">
                {visibleBrands.map(b => {
                  const isActive = filters.brand.includes(b.name)
                  return (
                    <label
                      key={b.name}
                      className="flex w-full items-center gap-2.5 text-left uppercase text-[0.75rem] tracking-wider cursor-pointer"
                    >
                      <input type="checkbox" checked={isActive} onChange={() => toggle('brand', b.name)} className="h-4 w-4 shrink-0 accent-black" />
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {b.name}
                      </span>
                    </label>
                  )
                })}
                {brands.length > ITEM_LIMIT && (
                  <button
                    type="button"
                    onClick={() => toggleExpand('brand')}
                    className="font-sans text-[0.65rem] tracking-widest uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-1 text-left font-normal"
                  >
                    {expanded['brand'] ? 'VIEW LESS' : 'VIEW MORE'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. COLOUR */}
          {colors.length > 0 && (
            <div className="flex items-start">
              <div className="w-[100px] shrink-0 font-sans text-[0.675rem] tracking-[0.14em] uppercase text-neutral-400 font-normal pt-0.5">
                COLOUR
              </div>
              <div className="flex-1 min-w-0 space-y-2.5 font-sans">
                {visibleColors.map(c => {
                  const isActive = filters.color.includes(c.name)
                  const hex = getColorHex(c.name)
                  return (
                    <label
                      key={c.name}
                      className="flex items-center w-full gap-2.5 text-left uppercase text-[0.75rem] tracking-wider cursor-pointer"
                    >
                      <input type="checkbox" checked={isActive} onChange={() => toggle('color', c.name)} className="h-4 w-4 shrink-0 accent-black" />
                      <span
                        className="w-3.5 h-3.5 rounded-[1px] border border-neutral-300 inline-block mr-2.5 shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {c.name}
                      </span>
                    </label>
                  )
                })}
                {colors.length > ITEM_LIMIT && (
                  <button
                    type="button"
                    onClick={() => toggleExpand('color')}
                    className="font-sans text-[0.65rem] tracking-widest uppercase bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-black mt-1 text-left font-normal block"
                  >
                    {expanded['color'] ? 'VIEW LESS' : 'VIEW MORE'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. PRICE */}
          <div className="flex items-start">
            <div className="w-[100px] shrink-0 font-sans text-[0.675rem] tracking-[0.14em] uppercase text-neutral-400 font-normal pt-0.5">
              PRICE
            </div>
            <div className="flex-1 min-w-0 space-y-2 font-sans">
              {PRICE_OPTIONS.map(o => {
                  const isActive = filters.maxPrice === o.value
                  return (
                    <label
                      key={o.value}
                      className="flex w-full items-center gap-2.5 text-left uppercase text-[0.75rem] tracking-wider cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="browse-price-range"
                        checked={isActive}
                        onChange={() => onChange({ ...filters, maxPrice: o.value })}
                        onClick={() => { if (isActive) onChange({ ...filters, maxPrice: null }) }}
                        className="h-4 w-4 shrink-0 accent-black"
                      />
                      <span className={isActive ? 'font-bold text-black' : 'text-neutral-500 hover:text-black font-normal'}>
                        {o.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

        </div>

        {/* Footer Action */}
        <div className="pt-4 shrink-0 flex gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 border border-neutral-300 text-neutral-600 bg-white font-sans text-[0.725rem] font-medium tracking-[0.14em] uppercase py-3 hover:border-black hover:text-black transition-colors text-center cursor-pointer"
            >
              CLEAR ALL
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] border border-black text-black bg-white font-sans text-[0.725rem] font-medium tracking-[0.2em] uppercase py-3 hover:bg-black hover:text-white transition-colors duration-200 text-center cursor-pointer"
          >
            VIEW RESULTS
          </button>
        </div>
      </div>
    </>
  )
}
