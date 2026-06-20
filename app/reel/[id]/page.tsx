import { notFound } from 'next/navigation'
import { getReel, getProductsByIds } from '@/lib/api'
import { getCdnVideoUrl } from '@/lib/image'
import ProductCard from '@/components/product/ProductCard'
import type { Metadata } from 'next'
import Link from 'next/link'

interface ReelPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReelPageProps): Promise<Metadata> {
  const { id } = await params
  const reel = await getReel(id)
  if (!reel) return { title: 'Reel Not Found' }

  return {
    title: `Style Reel — ${reel.category} | MEGG`,
    description: `Watch this style reel featuring the latest trends in ${reel.category}. Shop the look at MEGG.`,
    openGraph: {
      images: [reel.thumbnail_url],
    },
  }
}

export default async function ReelPage({ params }: ReelPageProps) {
  const { id } = await params
  const reel = await getReel(id)

  if (!reel) {
    notFound()
  }

  const products = await getProductsByIds(reel.product_ids || [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--color-bg)',
      }}
    >
      <style>{`
        .reel-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          max-width: var(--container-max);
          margin: 0 auto;
          width: 100%;
          padding: var(--space-lg) var(--container-px);
        }

        @media (min-width: 900px) {
          .reel-layout {
            grid-template-columns: minmax(300px, 450px) 1fr;
            align-items: start;
          }
        }

        .reel-video-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          aspect-ratio: 9 / 16;
          background: var(--color-black);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .reel-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
        }

        @media (min-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.5rem;
          }
        }
      `}</style>


      <main className="reel-layout">
        {/* Video Column */}
        <div className="reel-video-container">
          <video
            className="reel-video"
            src={getCdnVideoUrl(reel.video_url)}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.5rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              color: 'white',
              pointerEvents: 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              {reel.category}
            </p>
          </div>
        </div>

        {/* Products Column */}
        <div>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h1 className="text-section">Shop the Look</h1>
            <p className="text-body" style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>
              Products featured in this style reel.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center', color: 'var(--color-muted)' }}>
              <p className="text-body">No products found for this reel.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
