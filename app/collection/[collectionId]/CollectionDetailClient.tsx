'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPublicCollection, type WishlistCollection, type WishlistItem } from '@/lib/api'
import { getCdnImageUrl, getProductSrcSet } from '@/lib/image'
import { formatPrice } from '@/lib/utils'

function ItemCard({ item, priority }: { item: WishlistItem; priority?: boolean }) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(priority ?? false)
  const src = item.images?.[0] ? getCdnImageUrl(item.images[0], { width: 480, quality: 90 }) : null

  return (
    <div
      role="button" tabIndex={0}
      onClick={() => router.push(`/product/${item.id}`)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/product/${item.id}`) } }}
      style={{ cursor: 'pointer', width: '100%', color: 'var(--color-black)' }}
      aria-label={`${item.brand} ${item.name}`}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', background: 'var(--color-gray-50)', overflow: 'hidden' }}>
        {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        {src && (
          <img
            src={src}
            srcSet={getProductSrcSet(item.images[0])}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            alt={`${item.brand} ${item.name}`}
            width={480} height={640}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: priority ? 'none' : 'opacity 300ms ease' }}
            draggable={false}
          />
        )}
      </div>
      <div style={{ paddingTop: '0.5rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '2px', lineHeight: 1 }}>
          {item.brand}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 400, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: 0, color: 'var(--color-black)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.name}
        </p>
        <p style={{ marginTop: '0.25rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-black)', fontVariantNumeric: 'tabular-nums', letterSpacing: 0, textTransform: 'none' }}>
          {formatPrice(String(item.price))}
        </p>
      </div>
    </div>
  )
}

export default function CollectionDetailClient({ collectionId }: { collectionId: string }) {
  const [collection, setCollection] = useState<(WishlistCollection & { items: WishlistItem[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getPublicCollection(collectionId)
      .then(setCollection)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [collectionId])

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)', paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      {/* Title */}
      {collection && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
            {collection.item_count ?? collection.items.length} item{collection.items.length !== 1 ? 's' : ''}
          </p>
          <h1 className="text-section">{collection.name}</h1>
          {collection.description && (
            <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {collection.description}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 'var(--space-sm) var(--space-xs)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton" style={{ width: '100%', aspectRatio: '3 / 4' }} />
              <div className="skeleton" style={{ width: '70%', height: '0.8rem', marginTop: '0.5rem', borderRadius: '2px' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Collection not found
          </p>
        </div>
      ) : collection!.items.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          This collection is empty
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 'var(--space-sm) var(--space-xs)' }}>
          {collection!.items.map((item, i) => (
            <ItemCard key={item.wishlist_id ?? item.id} item={item} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  )
}
