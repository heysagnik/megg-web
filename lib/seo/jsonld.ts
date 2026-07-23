/**
 * Schema.org JSON-LD builders for the catalog routes.
 *
 * Each builder returns a plain object — pass it to {@link JsonLd} for
 * SSR-safe HTML rendering. Centralised so any change to the markup
 * is one edit, not ten.
 */

export const SITE_URL = 'https://www.meggfashion.in'

export interface ListItem {
  id: string
  name: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface MinimalProduct {
  id: string
  name: string
  brand?: string
  price?: number | string
  images?: string[]
}

/** Standard merchant return policy for Google Merchant listings. */
export const DEFAULT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'IN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
  merchantReturnDays: 7,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
}

/** Standard shipping details for Google Merchant listings. */
export const DEFAULT_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0',
    currency: 'INR',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'IN',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 2,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 5,
      unitCode: 'DAY',
    },
  },
}

/** Build an `ItemList` of the first N products, suitable for `mainEntity`. */
export function productItemList(products: ReadonlyArray<MinimalProduct>, limit = 10) {
  return {
    '@type': 'ItemList',
    itemListElement: products.slice(0, limit).map((p, i) => {
      const priceNum = typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? ''))
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          url: `${SITE_URL}/product/${p.id}`,
          ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
          ...(p.images?.[0] ? { image: p.images[0] } : {}),
          ...(!isNaN(priceNum) && priceNum > 0 ? {
            offers: {
              '@type': 'Offer',
              price: priceNum,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              hasMerchantReturnPolicy: DEFAULT_RETURN_POLICY,
              shippingDetails: DEFAULT_SHIPPING_DETAILS,
            },
          } : {}),
        },
      }
    }),
  }
}

/**
 * `CollectionPage` JSON-LD graph — used by `/products`, `/under699`,
 * `/category/[slug]`, `/collection/[id]`. Embeds an `ItemList` of the
 * first ten products and an empty `BreadcrumbList` placeholder the
 * page may extend.
 */
export function collectionPageLd({
  url,
  name,
  description,
  products,
  breadcrumb,
}: {
  url: string
  name: string
  description?: string | null
  products: ReadonlyArray<MinimalProduct>
  breadcrumb?: ReadonlyArray<BreadcrumbItem>
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name,
        url,
        ...(description ? { description } : {}),
        mainEntity: productItemList(products),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb?.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.url,
        })) ?? [],
      },
    ],
  }
}

/** Plain `BreadcrumbList` graph. */
export function breadcrumbLdGraph(items: ReadonlyArray<BreadcrumbItem>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
    ],
  }
}
