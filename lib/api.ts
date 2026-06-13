/* =====================================================
   MEGG API — Typed Fetch Helpers
   Base URL: https://api.megg.workers.dev/api
   ===================================================== */

const BASE_URL = 'https://api.megg.workers.dev/api';

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
  label:    string;
  value:    string;            // e.g. "under699"
  maxPrice: number | string;
  count:    number;
}

export interface FilterVisibility {
  showCategories:    boolean;
  showSubcategories: boolean;
  showColors:        boolean;
  showBrands:        boolean;
}

export interface SearchFilters {
  categories:    FilterOption[];
  subcategories: FilterOption[];
  colors:        FilterOption[];
  brands:        FilterOption[];
  priceRange:    { min: number; max: number };
  priceFilters:  PriceFilterOption[];
  visibility:    FilterVisibility;
}

export interface SearchBanner {
  id:            string;
  banner_image:  string;
  link?:         string;
  display_order?: number;
}

export interface AppliedFilters {
  query?:         string;
  category?:      string | null;
  subcategories?: string[];
  colors?:        string[];
  brands?:        string[];
  sort?:          SearchSort;
  extractedConstraints: { minPrice?: number; maxPrice?: number | string } | null;
  searchMode:     SearchMode;
}

export interface SuggestedFilters {
  category?:    string;
  subcategory?: string[];
  colors?:      string[];
  brands?:      string[];
}

export interface SearchResult {
  products:         Product[];
  banners:          SearchBanner[];
  total:            number;
  page:             number;
  limit:            number;
  totalPages:       number;
  searchMode:       SearchMode;
  appliedFilters:   AppliedFilters;
  availableFilters: SearchFilters;
  suggestedFilters: SuggestedFilters | null;
}

export interface SearchParams {
  query?:        string;
  page?:         number;
  limit?:        number;
  category?:     string;
  subcategory?:  string | string[];
  color?:        string | string[];
  brand?:        string | string[];
  minPrice?:     number | string;
  maxPrice?:     number | string;
  sort?:         SearchSort;
}

export type SuggestionType = 'brand' | 'category' | 'subcategory' | 'multi';

export interface SuggestionFilters {
  category?:    string;
  subcategory?: string;
  color?:       string;
  brand?:       string;
  [key: string]: string | undefined;
}

export interface SearchSuggestion {
  type?:    SuggestionType;
  value:    string;
  count?:   number;
  filters?: SuggestionFilters;
}

// ─── Fetch Helper ─────────────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15_000)
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        next: { revalidate: 60 },
        signal: controller.signal,
      })
      // Retry only on server errors / aborts; 4xx is final
      if (!res.ok) {
        if (res.status >= 500 && attempt === 0) {
          lastErr = new Error(`API error ${res.status}: ${path}`)
          continue
        }
        throw new Error(`API error ${res.status}: ${path}`)
      }
      return res.json() as Promise<T>
    } catch (err) {
      lastErr = err
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 200))
        continue
      }
      throw err
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr ?? new Error(`API request failed: ${path}`)
}

// ─── Products ─────────────────────────────────────────────

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular';

export interface ListParams {
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

/** Product listing — GET /products/list */
export async function getProducts(
  page = 1,
  limit = 20,
  category?: string,
  subcategory?: string,
  sort?: SortOption,
): Promise<ProductsResponse> {
  return listProducts({ page, limit, category, subcategory, sort });
}

/** Full-featured product listing with all filter params */
export async function listProducts(params: ListParams): Promise<ProductsResponse> {
  const p = new URLSearchParams({ page: String(params.page ?? 1), limit: String(params.limit ?? 20) });
  if (params.category) p.set('category', params.category);
  if (params.subcategory) p.set('subcategory', params.subcategory);
  if (params.sort) p.set('sort', params.sort);
  if (params.brand) p.set('brand', params.brand);
  if (params.color) p.set('color', params.color);
  if (params.minPrice != null) p.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) p.set('maxPrice', String(params.maxPrice));
  return fetchJSON<ProductsResponse>(`/products/list?${p}`);
}

/** @deprecated use getProducts with category param */
export async function browseCategory(
  category: string,
  page = 1,
  limit = 20,
  subcategory?: string,
  sort?: SortOption,
): Promise<ProductsResponse> {
  return getProducts(page, limit, category, subcategory, sort);
}

/** New arrivals — GET /products/new-arrivals → {success, data: Product[]} */
export async function getNewArrivals(
  page = 1,
  limit = 20,
): Promise<ProductsResponse> {
  const raw = await fetchJSON<
    { success: boolean; data: Product[] } |
    { products: Product[]; total?: number }
  >(`/products/new-arrivals?page=${page}&limit=${limit}`);

  if ('data' in raw && Array.isArray(raw.data)) {
    return { products: raw.data, page, limit };
  }
  return raw as ProductsResponse;
}

/** Budget products — GET /products/under699 (supports category + sort) */
export async function getUnder699(
  page = 1,
  limit = 20,
  category?: string,
  sort?: SortOption,
): Promise<ProductsResponse> {
  const p = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) p.set('category', category);
  if (sort) p.set('sort', sort);
  return fetchJSON<ProductsResponse>(`/products/under699?${p}`);
}

/** Single product with variants, recommendations — GET /products/:id */
export async function getProduct(productId: string): Promise<ProductDetail> {
  const data = await fetchJSON<{ product: Product } & Omit<ProductDetail, keyof Product>>(`/products/${productId}`);
  return {
    ...data.product,
    variants:       data.variants,
    more_from_brand: data.more_from_brand,
    recommended:    data.recommended,
    outfits:        data.outfits,
  };
}

/** Related products — GET /products/:id/related */
export async function getRelatedProducts(productId: string): Promise<Product[]> {
  const data = await fetchJSON<Product[] | { products: Product[] }>(
    `/products/${productId}/related`,
  );
  return Array.isArray(data) ? data : (data as { products: Product[] }).products ?? [];
}

/** Recommendations — GET /products/:id/recommendations */
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = await fetchJSON<Product[] | { products: Product[] }>(
    `/products/${productId}/recommendations`,
  );
  return Array.isArray(data) ? data : (data as { products: Product[] }).products ?? [];
}

// ─── Search ───────────────────────────────────────────────

/** Build a URLSearchParams instance, repeating keys for array values. */
function buildSearchParams(params: SearchParams): URLSearchParams {
  const p = new URLSearchParams();
  const append = (key: string, value: string | number | undefined | null) => {
    if (value == null || value === '') return;
    p.append(key, String(value));
  };
  const appendMulti = (key: string, value: string | string[] | undefined) => {
    if (value == null) return;
    if (Array.isArray(value)) value.forEach(v => v && p.append(key, v));
    else if (value !== '') p.append(key, value);
  };
  append('query',    params.query);
  append('page',     params.page);
  append('limit',    params.limit);
  append('category', params.category);
  appendMulti('subcategory', params.subcategory);
  appendMulti('color',       params.color);
  appendMulti('brand',       params.brand);
  append('minPrice', params.minPrice);
  append('maxPrice', params.maxPrice);
  append('sort',     params.sort);
  return p;
}

/** Full-text search — GET /search */
export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const p = buildSearchParams(params);
  const raw = await fetchJSON<{ success: boolean; data: SearchResult }>(`/search?${p}`);
  return raw.data;
}

/** Same as searchProducts, but accepts a prebuilt URLSearchParams (e.g. from the URL). */
export async function searchProductsRaw(params: URLSearchParams): Promise<SearchResult> {
  const raw = await fetchJSON<{ success: boolean; data: SearchResult }>(`/search?${params}`);
  return raw.data;
}

/** Search filters — GET /search/filters (accepts the same filter params as /search) */
export async function getSearchFilters(params: SearchParams = {}): Promise<SearchFilters> {
  const p = buildSearchParams(params);
  const qs = p.toString();
  const raw = await fetchJSON<{ success: boolean; data: SearchFilters }>(
    `/search/filters${qs ? `?${qs}` : ''}`,
  );
  return raw.data;
}

/** Autocomplete suggestions — GET /api/autocomplete?query=... (min 2 chars) */
export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (query.trim().length < 2) return [];
  const res = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ─── Categories ───────────────────────────────────────────

/** All categories — GET /categories → Category[] */
export async function getCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>('/categories');
}

/** Subcategories — GET /subcategories */
export async function getSubcategories(): Promise<Subcategory[]> {
  const raw = await fetchJSON<{ success: boolean; data: { subcategories: Subcategory[] } }>(
    '/subcategories',
  );
  return raw.data?.subcategories ?? [];
}

/** Subcategories for a specific category — GET /subcategories/:category → {success, data: Subcategory[]} */
export async function getCategorySubcategories(category: string): Promise<Subcategory[]> {
  const raw = await fetchJSON<{ success: boolean; data: Subcategory[] }>(
    `/subcategories/${encodeURIComponent(category)}`,
  );
  return Array.isArray(raw.data) ? raw.data : [];
}

// ─── Reels ────────────────────────────────────────────────

/** All reels — GET /reels → Reel[] (plain array) */
export async function getReels(limit?: number): Promise<Reel[]> {
  const path = limit ? `/reels?limit=${limit}` : '/reels';
  const raw = await fetchJSON<Reel[] | { success: boolean; data: Reel[] }>(path);
  return Array.isArray(raw) ? raw : (raw as { data: Reel[] }).data ?? [];
}

/** Reels by category — GET /reels/category/:category */
export async function getReelsByCategory(category: string): Promise<Reel[]> {
  const raw = await fetchJSON<Reel[] | { success: boolean; data: Reel[] }>(
    `/reels/category/${encodeURIComponent(category)}`,
  );
  return Array.isArray(raw) ? raw : (raw as { data: Reel[] }).data ?? [];
}

// ─── Outfits ──────────────────────────────────────────────

/** All outfits — GET /outfits → {success, data: Outfit[]} */
export async function getOutfits(page = 1, limit = 20): Promise<Outfit[]> {
  const raw = await fetchJSON<
    { success: boolean; data: Outfit[] } |
    { success: boolean; data: { outfits: Outfit[] }; pagination: unknown }
  >(`/outfits?page=${page}&limit=${limit}`);

  if ('data' in raw) {
    const d = raw.data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === 'object' && 'outfits' in d) {
      return (d as { outfits: Outfit[] }).outfits ?? [];
    }
  }
  return [];
}

/** Single outfit — GET /outfits/:id */
export async function getOutfit(id: string): Promise<Outfit> {
  const raw = await fetchJSON<{ success: boolean; data: Outfit } | Outfit>(`/outfits/${id}`);
  return 'data' in raw ? (raw as { data: Outfit }).data : raw as Outfit;
}

// ─── Trending ─────────────────────────────────────────────

/** Trending products — GET /trending/products → {success, data: Product[]} */
export async function getTrendingProducts(): Promise<Product[]> {
  const raw = await fetchJSON<{ success: boolean; data: Product[] }>('/trending/products');
  return raw.data ?? [];
}

// ─── Offers ───────────────────────────────────────────────

/** Promotional offers — GET /offers → Offer[] */
export async function getOffers(): Promise<Offer[]> {
  const raw = await fetchJSON<Offer[] | { success: boolean; data: Offer[] }>('/offers');
  return Array.isArray(raw) ? raw : (raw as { data: Offer[] }).data ?? [];
}

// ─── Daily drops ──────────────────────────────────────────

/** Daily drops — GET /daily → {success, data: {daily: DailyDrop[]}} */
export async function getDailyDrops(): Promise<DailyDrop[]> {
  const raw = await fetchJSON<{ success: boolean; data: { daily: DailyDrop[] } }>('/daily');
  return raw.data?.daily ?? [];
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

/** GET /api/wishlist/collections/:id — public, no auth required */
export async function getPublicCollection(
  id: string,
): Promise<WishlistCollection & { items: WishlistItem[] }> {
  const raw = await fetchJSON<{ collection: WishlistCollection & { items: WishlistItem[] } }>(
    `/wishlist/collections/${id}`,
  )
  return raw.collection
}

// ─── Utils ────────────────────────────────────────────────

export function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return 'Rs. —';
  return `Rs. ${num.toLocaleString('en-IN')}`;
}
