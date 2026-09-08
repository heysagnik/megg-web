'use client'

/**
 * Labeled two-column row used inside the "Details" accordion
 * on the PDP (Colour: …, Fabric: …, Style: …).
 */
export interface DetailRowProps {
  label: string
  value: string
}

export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <p className="flex justify-between items-baseline font-sans text-xs">
      <span className="text-label text-muted">{label}</span>
      <span className="text-black tracking-[0.04em]">{value}</span>
    </p>
  )
}
