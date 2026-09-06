/* =====================================================
   MEGG API — Typed Fetch Helpers
   Base URL: https://edge.meggfashion.in/api
   ===================================================== */

const BASE_URL = 'https://edge.meggfashion.in/api';

export type Gender = 'men' | 'women';

// ─── Types ────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  color: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  mrp?: string | number;
  sizes?: { label: string; available: boolean }[];
  brand: string;
  images: string[];
  category: string;
  subcategory?: string;
  color?: string;
  fabric?: string[];
  affiliate_link?: string;
  is_active?: boolean;
  popularity?: number;
  clicks?: number;
  gender?: Gender;
}

export interface ProductDetail extends Product {
  variants?: ProductVariant[];
  more_from_brand?: Product[];
  recommended?: Product[];
  outfits?: unknown[];
}

export interface Reel {
  id: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  product_ids: string[];
  views: number;
  likes: number;
  created_at: string;
}

export interface Outfit {
  id: string;
  name: string;
  model_image: string;
  product_ids: string[];
  group_type: string;
  created_at: string;
  products?: Product[];
}

export interface Offer {
  id: string;
  title: string;
  banner_image: string;
  affiliate_link: string;
}

export interface DailyDrop {
  id: string;
  title: string;
  banner_image: string;
  product_ids: string[];
  created_at: string;
}

export interface Category {
  category: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FilterOption {
  name: string;
  count: number;
}

export interface AvailableFilters {
  subcategories: FilterOption[];
  colors: FilterOption[];
  brands: FilterOption[];
  categories: FilterOption[];
}

export interface ProductsResponse {
  products: Product[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  availableFilters?: AvailableFilters;
}

export type SearchSort =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest'
  | 'popularity';

export type SearchMode = 'hybrid' | 'keyword' | 'browse' | 'empty';

export interface PriceFilterOption {
  label: string;
  value: string;            // e.g. "under699"
  maxPrice: number | string;
  count: number;
}

export interface FilterVisibility {
  showCategories: boolean;
  showSubcategories: boolean;
  showColors: boolean;
  showBrands: boolean;
}

export interface SearchFilters {
  categories: FilterOption[];
  subcategories: FilterOption[];
  colors: FilterOption[];
  brands: FilterOption[];
  priceRange: { min: number; max: number };
  priceFilters: PriceFilterOption[];
  visibility: FilterVisibility;
}

export interface SearchBanner {
  id: string;
  banner_image: string;
  link?: string;
  display_order?: number;
}

export interface AppliedFilters {
  query?: string;
  category?: string | null;
  subcategories?: string[];
  colors?: string[];
  brands?: string[];
  sort?: SearchSort;
  extractedConstraints: { minPrice?: number; maxPrice?: number | string } | null;
  searchMode: SearchMode;
}

export interface SuggestedFilters {
  category?: string;
  subcategory?: string[];
  colors?: string[];
  brands?: string[];
}

export interface SearchResult {
  products: Product[];
  banners: SearchBanner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchMode: SearchMode;
  appliedFilters: AppliedFilters;
  availableFilters: SearchFilters;
  suggestedFilters: SuggestedFilters | null;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string | string[];
  color?: string | string[];
  brand?: string | string[];
  minPrice?: number | string;
  maxPrice?: number | string;
  sort?: SearchSort;
}

export type SuggestionType = 'brand' | 'category' | 'subcategory' | 'multi';

export interface SuggestionFilters {
  category?: string;
  subcategory?: string;
  color?: string;
  brand?: string;
  [key: string]: string | undefined;
}

export interface SearchSuggestion {
  type?: SuggestionType;
  value: string;
  count?: number;
  filters?: SuggestionFilters;
}

// ─── Request shaped params ───────────────────────────────────

/** Common shaped params for listing endpoints — gender is the discriminator. */
export interface ScopeParams {
  gender?: Gender;
}

// Extends ScopeParams on every typed list input.
export interface ListParams extends ScopeParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  sort?: SortOption | 'relevance';
  brand?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ─── Fetch primitives ────────────────────────────────────

/**
 * Build URL search params from a flat record, omitting empty values.
 * Single utility so every endpoint serialises identically.
 */
function qs(params: Record<string, string | number | null | undefined>): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue;
    p.set(k, String(v));
  }
  return p;
}

interface FetchNext extends Omit<RequestInit, 'next'> {
  next?: { revalidate?: number | false; tags?: string[] };
}

interface FetchOptions extends FetchNext {
  /** ISR revalidate in seconds. 0 / 'no-store' disables caching. Default 600s. */
  revalidate?: number | false;
}

/**
 * Header bag applied to every outbound request.
 * Single source of truth — changed in one place if the backend tightens.
 */
const HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'X-API-Version': '2',
});

async function fetchJSON<T>(path: string, { revalidate = 600, ...rest }: FetchOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  const fetchOptions: RequestInit = {
    ...rest,
    headers: { ...HEADERS, ...(rest.headers ?? {}) },
    signal: controller.signal,
  };

  if (rest.cache === 'no-store' || rest.cache === 'no-cache') {
    fetchOptions.cache = rest.cache;
  } else if (revalidate === false) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate, ...(rest.next ?? {}) };
  }

  try {
    return await fetch(`${BASE_URL}${path}`, fetchOptions).then(async (res) => {
      if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
      return res.json() as Promise<T>;
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Unwrap the response envelope. Tolerant to either shape:
 *  - Envelope: { success, data, meta }      <- preferred
 *  - Legacy:   { success, data }
 *  - Naked:    T                              <- fallback for plain arrays/objects
 *
 * Accept-only when `success === true`; surface the API's error otherwise.
 */
function unwrap<T>(raw: unknown): T {
  if (raw == null) return raw as T;
  if (typeof raw !== 'object') return raw as T;

  const r = raw as { success?: unknown; data?: unknown; error?: { message?: string } };

  if ('success' in r && r.success === false) {
    throw new Error(r.error?.message ?? 'API error');
  }

  if ('data' in r && typeof r.data !== 'undefined') {
    return r.data as T;
  }

  return raw as T;
}

function unwrapPaginated<T>(raw: unknown): T {
  if (raw == null) return raw as T;
  if (typeof raw !== 'object') return raw as T;

  const r = raw as { success?: unknown; data?: unknown; error?: { message?: string }, meta?: Record<string, unknown> };

  if ('success' in r && r.success === false) {
    throw new Error(r.error?.message ?? 'API error');
  }

  if ('data' in r && Array.isArray(r.data)) {
    const meta = (r.meta ?? {}) as Record<string, unknown>;
    // Hoist meta.search.* to top-level so endpoints that nest
    // `meta.search.availableFilters` (e.g. unauthed /api/search responses)
    // are accessible at result.availableFilters like authed responses.
    const search = (meta.search as Record<string, unknown> | undefined) ?? {};
    const pagination = (meta.pagination as Record<string, unknown> | undefined) ?? {};
    return {
      products: r.data,
      ...pagination,
      ...meta,
      ...search,
    } as unknown as T;
  }

  if ('data' in r && typeof r.data !== 'undefined') {
    return r.data as T;
  }

  return raw as T;
}

// ─── Products ─────────────────────────────────────────────

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular';

/** Product listing — GET /products/list (all filter params supported). */
export async function listProducts(params: ListParams): Promise<ProductsResponse> {
  const path = `/products/list?${qs({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    category: params.category,
    subcategory: params.subcategory,
    sort: params.sort,
    brand: params.brand,
    color: params.color,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    gender: params.gender,
  })}`;
  return unwrapPaginated<ProductsResponse>(await fetchJSON(path));
}

/** New arrivals — GET /products/new-arrivals */
export async function getNewArrivals(page = 1, limit = 20, scope: ScopeParams = {}): Promise<ProductsResponse> {
  const path = `/products/new-arrivals?${qs({ page, limit, gender: scope.gender })}`;
  return unwrapPaginated<ProductsResponse>(await fetchJSON(path));
}

/** Budget products — GET /products/under699 */
export async function getUnder699(params: {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  sort?: SortOption;
  color?: string;
  brand?: string;
  maxPrice?: number;
} & ScopeParams = {}): Promise<ProductsResponse> {
  const path = `/products/under699?${qs({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    category: params.category,
    subcategory: params.subcategory,
    sort: params.sort,
    color: params.color,
    brand: params.brand,
    maxPrice: params.maxPrice,
    gender: params.gender,
  })}`;
  return unwrapPaginated<ProductsResponse>(await fetchJSON(path));
}

/** Single product — GET /products/:id */
export async function getProduct(productId: string): Promise<ProductDetail> {
  const data = await fetchJSON<unknown>(`/products/${productId}`, { revalidate: 3600 });
  const d = unwrap<{ product: Product } & Omit<ProductDetail, keyof Product>>(data);
  return {
    ...d.product,
    variants: d.variants,
    more_from_brand: d.more_from_brand,
    recommended: d.recommended,
    outfits: d.outfits,
  };
}

/** Related products — GET /products/:id/related */
export async function getRelatedProducts(productId: string): Promise<Product[]> {
  const data = await fetchJSON<unknown>(`/products/${productId}/related`, { revalidate: 3600 });
  return unwrap<Product[]>(data);
}

/** Recommendations — GET /products/:id/recommendations */
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = await fetchJSON<unknown>(`/products/${productId}/recommendations`, { revalidate: 3600 });
  return unwrap<Product[]>(data);
}

/** Fetch multiple products concurrently */
export async function getProductsByIds(productIds: string[]): Promise<ProductDetail[]> {
  if (!productIds?.length) return [];
  const settled = await Promise.allSettled(productIds.map((id) => getProduct(id)));
  return settled
    .filter((r): r is PromiseFulfilledResult<ProductDetail> => r.status === 'fulfilled')
    .map((r) => r.value);
}

// ─── Search ───────────────────────────────────────────────

function appendMulti(p: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (value == null) return;
  if (Array.isArray(value)) value.forEach((v) => v && p.append(key, v));
  else if (value !== '') p.append(key, value);
}

function buildSearchParams(params: SearchParams & ScopeParams): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({
    query: params.query,
    page: params.page,
    limit: params.limit,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
    gender: params.gender,
  })) {
    if (v == null || v === '') continue;
    p.set(k, String(v));
  }
  appendMulti(p, 'subcategory', params.subcategory);
  appendMulti(p, 'color', params.color);
  appendMulti(p, 'brand', params.brand);
  return p;
}

/** Full-text search — GET /search */
export async function searchProducts(params: SearchParams & ScopeParams): Promise<SearchResult> {
  return unwrapPaginated<SearchResult>(await fetchJSON(`/search?${buildSearchParams(params)}`));
}

/** Search via pre-built URLSearchParams (e.g. URL state in the hook). */
export async function searchProductsRaw(params: URLSearchParams): Promise<SearchResult> {
  return unwrapPaginated<SearchResult>(await fetchJSON(`/search?${params}`));
}

/** Search filters — GET /search/filters */
export async function getSearchFilters(params: SearchParams & ScopeParams = {}): Promise<SearchFilters> {
  const p = buildSearchParams(params);
  const qs = p.toString();
  return unwrap<SearchFilters>(await fetchJSON(`/search/filters${qs ? `?${qs}` : ''}`));
}

/** Autocomplete suggestions — proxied via Next.js. */
export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (query.trim().length < 2) return [];
  const res = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

// ─── Categories ───────────────────────────────────────────

/** All categories — GET /categories */
export async function getCategories(scope: ScopeParams = {}): Promise<Category[]> {
  const p = qs({ gender: scope.gender });
  return unwrap<Category[]>(await fetchJSON(`/categories${p.size ? `?${p}` : ''}`)) ?? [];
}

/** Subcategories — GET /subcategories */
export async function getSubcategories(scope: ScopeParams = {}): Promise<Subcategory[]> {
  const p = qs({ gender: scope.gender });
  const raw = await fetchJSON<unknown>(`/subcategories${p.size ? `?${p}` : ''}`);
  const unwrapped = unwrap<{ subcategories?: Subcategory[] } | Subcategory[]>(raw);
  return Array.isArray(unwrapped) ? unwrapped : (unwrapped?.subcategories ?? []);
}

/** Subcategories for a category — GET /subcategories/:category */
export async function getCategorySubcategories(category: string, scope: ScopeParams = {}): Promise<Subcategory[]> {
  const p = qs({ gender: scope.gender });
  const raw = await fetchJSON<unknown>(`/subcategories/${encodeURIComponent(category)}${p.size ? `?${p}` : ''}`);
  return unwrap<Subcategory[]>(raw) ?? [];
}

// ─── Reels ────────────────────────────────────────────────

/** Reels — GET /reels */
export async function getReels(limit?: number, scope: ScopeParams = {}): Promise<Reel[]> {
  const p = qs({ limit, gender: scope.gender });
  return unwrap<Reel[]>(await fetchJSON(`/reels${p.size ? `?${p}` : ''}`)) ?? [];
}

/** Reels by category — GET /reels/category/:category */
export async function getReelsByCategory(category: string, scope: ScopeParams = {}): Promise<Reel[]> {
  const p = qs({ gender: scope.gender });
  return unwrap<Reel[]>(await fetchJSON(`/reels/category/${encodeURIComponent(category)}${p.size ? `?${p}` : ''}`)) ?? [];
}

/** Single reel — GET /reels/:id */
export async function getReel(id: string): Promise<Reel | undefined> {
  try {
    const reel = unwrap<Reel>(await fetchJSON(`/reels/${id}`));
    if (reel?.id) return reel;
  } catch {/* fall through to listing */}
  const all = await getReels();
  return all.find((r) => r.id === id);
}

// ─── Outfits ──────────────────────────────────────────────

/** Outfits — GET /outfits */
export async function getOutfits(page = 1, limit = 20, scope: ScopeParams = {}): Promise<Outfit[]> {
  const p = qs({ page, limit, gender: scope.gender });
  // Outfits refresh 5×/day — long enough that the homepage & category pages
  // don't re-hit origin every 2 minutes.
  const raw = unwrap<{ outfits?: Outfit[] } | Outfit[]>(await fetchJSON(`/outfits?${p}`, { revalidate: 300 }));
  return Array.isArray(raw) ? raw : (raw?.outfits ?? []);
}

/** Single outfit — GET /outfits/:id */
export async function getOutfit(id: string, scope: ScopeParams = {}): Promise<Outfit> {
  const p = qs({ gender: scope.gender });
  return unwrap<Outfit>(await fetchJSON(`/outfits/${id}${p.size ? `?${p}` : ''}`));
}

// ─── Trending / Offers / Daily ────────────────────────────

/** Trending products — GET /trending/products */
export async function getTrendingProducts(scope: ScopeParams = {}): Promise<Product[]> {
  const p = qs({ gender: scope.gender });
  return unwrap<Product[]>(await fetchJSON(`/trending/products${p.size ? `?${p}` : ''}`)) ?? [];
}

/** Offer banners — GET /offers */
export async function getOffers(): Promise<Offer[]> {
  return unwrap<Offer[]>(await fetchJSON('/offers', { revalidate: 600 })) ?? [];
}

/** Daily drops — GET /daily */
export async function getDailyDrops(): Promise<DailyDrop[]> {
  return unwrap<{ daily?: DailyDrop[] }>(await fetchJSON('/daily', { revalidate: 300 }))?.daily ?? [];
}

// ─── Wishlist ─────────────────────────────────────────────

export interface WishlistItem {
  wishlist_id: string;
  added_at: string;
  id: string;
  name: string;
  price: number;
  brand: string;
  images: string[];
  category: string;
  subcategory?: string;
  color?: string;
  affiliate_link?: string;
  is_active?: boolean;
}

export interface WishlistCollection {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  item_count?: number;
}

/** GET /wishlist/collections/:id — public, no auth required */
export async function getPublicCollection(
  id: string,
): Promise<WishlistCollection & { items: WishlistItem[] }> {
  const raw = await fetchJSON<unknown>(`/wishlist/collections/${id}`, { revalidate: 300 });
  return unwrap<{ collection: WishlistCollection & { items: WishlistItem[] } }>(raw).collection;
}

// ─── Utils ────────────────────────────────────────────────

export function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return 'Rs. —';
  return `Rs. ${num.toLocaleString('en-IN')}`;
}

/** Coerce arbitrary input into a Gender value, defaulting to {@link DEFAULT_GENDER}. */
export function parseGender(input: string | null | undefined, fallback: Gender = DEFAULT_GENDER): Gender {
  return input === 'men' || input === 'women' ? input : fallback;
}

/**
 * Pick the gender to scope API requests to.
 *
 * Resolution order:
 *   1. Explicit `override` (e.g. server components reading `searchParams.gender`).
 *   2. `'men'` — the documented backend default, satisfying backward compat.
 *
 * The default is centralised so a future flip (e.g. marketing push toward women's)
 * only requires editing this single line.
 */
export const DEFAULT_GENDER: Gender = 'men';

/** Read gender from a Next.js `searchParams`-like object. */
export function genderFromSearchParams(
  sp: Record<string, string | string[] | undefined> | URLSearchParams | undefined,
  fallback: Gender = DEFAULT_GENDER,
): Gender {
  if (!sp) return fallback;
  const raw =
    sp instanceof URLSearchParams
      ? sp.get('gender') ?? undefined
      : (sp.gender as string | string[] | undefined);
  const v = Array.isArray(raw) ? raw[0] : raw;
  return parseGender(v, fallback);
}
