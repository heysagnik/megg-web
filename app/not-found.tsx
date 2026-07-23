import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-[var(--container-px)] text-center py-xl">
      <p className="font-serif text-[clamp(4rem,10vw,8rem)] font-light tracking-[-0.04em] text-gray-200 leading-none mb-sm">
        404
      </p>
      <p className="font-sans text-2xs tracking-[0.14em] uppercase text-muted mb-lg">
        Page not found
      </p>
      <div className="flex gap-sm flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition bg-black text-white hover:opacity-[0.82] px-[2.25rem] py-[0.875rem]"
        >
          Home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition border border-black bg-transparent text-black hover:bg-black hover:text-white px-[2.25rem] py-[0.875rem]"
        >
          Shop All
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center font-sans text-xs font-medium uppercase tracking-wider cursor-pointer transition border border-black bg-transparent text-black hover:bg-black hover:text-white px-[2.25rem] py-[0.875rem]"
        >
          Search
        </Link>
      </div>
    </div>
  )
}
