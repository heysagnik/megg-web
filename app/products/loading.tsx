import CardSkeleton from '@/components/ui/CardSkeleton'

export default function ProductsLoading() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between p-[1.25rem_1.5rem] border-b border-border">
          <div className="skeleton h-6 w-[30%]" aria-hidden="true" />
          <div className="skeleton h-3 w-[60px]" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-sm p-sm">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
