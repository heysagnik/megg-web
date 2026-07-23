'use client'

export interface ScrollProgressStripProps {
  count: number
  progress: number
}

/**
 * Thin vertical bar shown beside the desktop PDP image stack.
 * Each tick fills in proportion to how far the corresponding
 * image has scrolled past the top of the viewport.
 */
export default function ScrollProgressStrip({ count, progress }: ScrollProgressStripProps) {
  return (
    <div className="sticky top-0 h-[100svh] w-5 flex flex-col items-center justify-center gap-[5px] z-5 pointer-events-none shrink-0">
      {Array.from({ length: count }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, progress - i))
        return (
          <div key={i} className="w-[2px] h-8 bg-border-mid relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-black transition-[height] duration-[80ms] ease-linear"
              style={{ height: `${fill * 100}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}
