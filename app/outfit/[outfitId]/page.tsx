import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getOutfit, getProduct, type Product } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  params: Promise<{ outfitId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { outfitId } = await params
  try {
    const outfit = await getOutfit(outfitId)
    return { title: outfit.name, description: `Shop ${outfit.name} on MEGG` }
  } catch {
    return { title: 'Outfit' }
  }
}

export default async function OutfitPage({ params }: Props) {
  const { outfitId } = await params

  let outfit
  try {
    outfit = await getOutfit(outfitId)
  } catch {
    notFound()
  }

  const results = await Promise.allSettled(
    (outfit.product_ids ?? []).map((id) => getProduct(id)),
  )
  const products: Product[] = results
    .filter((r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled')
    .map((r) => r.value)

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '80svh',
          minHeight: '480px',
          overflow: 'hidden',
          background: 'var(--color-surface)',
        }}
      >
        {outfit.model_image && (
          <Image
            src={outfit.model_image}
            alt={outfit.name}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          }}
        />
        <Link
          href="/"
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          ← Back
        </Link>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(2rem,5vw,3.5rem) var(--container-px)',
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
          }}
        >
          <p className="text-label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '0.6rem' }}>
            Outfit Collection
          </p>
          <h1 className="text-display" style={{ color: '#fff', maxWidth: '680px' }}>
            {outfit.name}
          </h1>
          <p style={{ marginTop: '1rem', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            {products.length || outfit.product_ids?.length || '—'} pieces in this look
          </p>
        </div>
      </div>

      {/* Products */}
      {products.length > 0 && (
        <section style={{ padding: 'var(--space-xl) 0 var(--space-3xl)' }}>
          <div
            style={{
              maxWidth: 'var(--container-max)',
              margin: '0 auto',
              padding: '0 var(--container-px)',
            }}
          >
            <div style={{ marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
              <p className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Shop this look</p>
              <h2 className="text-section">The Pieces</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
              }}
            >
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
