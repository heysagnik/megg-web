import CardSkeleton from '@/components/ui/CardSkeleton'

export default function ProductsLoading() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
        }}>
          <div className="skeleton" style={{ height: '1.5rem', width: '30%' }} aria-hidden="true" />
          <div className="skeleton" style={{ height: '0.75rem', width: '60px' }} aria-hidden="true" />
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem', padding: '1rem',
        }}>
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
