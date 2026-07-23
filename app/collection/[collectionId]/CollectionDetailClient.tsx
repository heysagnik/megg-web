'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPublicCollection, type WishlistCollection, type WishlistItem } from '@/lib/api'
import { getCdnImageUrl, getProductSrcSet } from '@/lib/image'
import { formatPrice, cn as CN } from '@/lib/utils'

function ItemCard({ item, priority }: { item: WishlistItem; priority?: boolean }) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(priority ?? false)
  const src = item.images?.[0] ? getCdnImageUrl(item.images[0]) : null

  return (
    <div
      role="button" tabIndex={0}
      onClick={() => router.push(`/product/${item.id}`)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/product/${item.id}`) } }}
      className="cursor-pointer w-full text-black"
      aria-label={`${item.brand} ${item.name}`}
    >
      <div className="relative w-full bg-gray-50 overflow-hidden aspect-[3/4]">
        {!loaded && <div className="skeleton absolute inset-0" />}
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
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: loaded ? 1 : 0 }}
            draggable={false}
          />
        )}
      </div>
      <div className="pt-1">
        <p className="font-sans text-[0.6rem] font-semibold tracking-wider uppercase text-muted mb-px leading-none">
          {item.brand}
        </p>
        <p className="font-sans text-[0.8rem] font-normal leading-[1.3] uppercase tracking-normal text-black line-clamp-2">
          {item.name}
        </p>
        <p className="mt-[0.25rem] font-sans text-[0.8rem] font-medium text-black tracking-normal normal-case tabular-nums">
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

  const cntClass = 'mx-auto max-w-[var(--container-max)] px-[var(--container-px)] pt-md pb-xl'

  return (
    <div className={cntClass}>
      {collection && (
        <div className="mb-lg">
          <p className="text-label text-muted mb-[0.4rem]">
            {collection.item_count ?? collection.items.length} item{collection.items.length !== 1 ? 's' : ''}
          </p>
          <h1 className="text-section">{collection.name}</h1>
          {collection.description && (
            <p className="mt-1 font-sans text-[0.8rem] text-muted tracking-[0.04em] uppercase">
              {collection.description}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg gap-x-[0.5rem]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton w-full aspect-[3/4]" />
              <div className="skeleton mt-1 w-[70%] h-[0.8rem] rounded-[2px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-xl">
          <p className="font-sans text-[0.85rem] text-muted tracking-[0.05em] uppercase">Collection not found</p>
        </div>
      ) : collection!.items.length === 0 ? (
        <p className="font-sans text-[0.85rem] text-muted tracking-[0.05em] uppercase">This collection is empty</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg gap-x-[0.5rem]">
          {collection!.items.map((item, i) => (
            <ItemCard key={item.wishlist_id ?? item.id} item={item} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  )
}