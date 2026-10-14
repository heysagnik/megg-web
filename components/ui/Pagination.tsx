'use client'

interface PaginationProps {
  page: number
  totalPages: number
  loading?: boolean
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, loading = false, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  const buttonClass =
    'min-w-8 h-8 px-1.5 sm:min-w-9 sm:h-9 sm:px-2 font-sans text-[10px] sm:text-xs uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 pt-20 overflow-x-auto">
      <button
        type="button"
        className={`${buttonClass} border border-neutral-300 text-neutral-700 hover:border-black hover:text-black`}
        disabled={loading || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      {start > 1 && <span className="px-1 text-xs text-neutral-400" aria-hidden="true">...</span>}
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          className={`${buttonClass} border ${number === page ? 'border-black bg-black text-white' : 'border-neutral-300 text-neutral-700 hover:border-black hover:text-black'}`}
          aria-current={number === page ? 'page' : undefined}
          aria-label={`Page ${number}`}
          disabled={loading}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      {end < totalPages && <span className="px-1 text-xs text-neutral-400" aria-hidden="true">...</span>}
      <button
        type="button"
        className={`${buttonClass} border border-neutral-300 text-neutral-700 hover:border-black hover:text-black`}
        disabled={loading || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
      <span className="sr-only" aria-live="polite">Page {page} of {totalPages}</span>
    </nav>
  )
}