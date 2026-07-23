/**
 * Fire-and-forget product-click analytics.
 * POST /api/products/:id/click on the edge worker.
 * Never throws — callers can `void trackProductClick(...)` without await.
 */
const API_BASE = 'https://edge.meggfashion.in'

export interface TrackClickOptions {
  source?: string
  affiliateClicked?: boolean
}

export async function trackProductClick(
  productId: string,
  options: TrackClickOptions = {},
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/products/${productId}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Version': '2' },
      body: JSON.stringify({
        source: options.source || 'pdp',
        affiliate_clicked: options.affiliateClicked ?? false,
      }),
    })
  } catch {
    /* fire-and-forget — analytics must never break the UI */
  }
}
