'use client'

import { useState } from 'react'

export interface AccordionProps {
  label: string
  children: React.ReactNode
}

/**
 * Single accordion row — used on the PDP for "Description", "Details",
 * "Delivery & Returns". Pure CSS max-height transition; no motion lib.
 */
export default function Accordion({ label, children }: AccordionProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-border-mid">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="font-sans w-full flex items-center justify-between min-h-12 py-[0.6rem] bg-transparent border-none cursor-pointer text-black uppercase"
      >
        <span className="text-label">{label}</span>
        <span
          className="text-[1.1rem] leading-none font-light text-muted inline-block transition-transform duration-200 ease-out"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >+</span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-[220ms] ease-out"
        style={{
          maxHeight: open ? '800px' : '0',
        }}
      >
        <div className="pb-md font-sans uppercase tracking-wide text-gray-600 leading-[1.7] text-[0.8rem]">
          {children}
        </div>
      </div>
    </div>
  )
}
