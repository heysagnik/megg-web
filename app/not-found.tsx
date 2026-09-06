import { Button } from '@/components/ui'

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
        <Button href="/">Home</Button>
        <Button href="/products" variant="outline">Shop All</Button>
        <Button href="/search" variant="outline">Search</Button>
      </div>
    </div>
  )
}
