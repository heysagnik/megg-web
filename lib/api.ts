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

export interface SearchFilters {
  categories: { name: string; count: number }[];
  subcategories: { name: string; count: number }[];
  colors: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  priceRange: { min: number; max: number };
  priceFilters: { label: string; min: number; max: number }[];
}

export interface SearchResult {
  products: Product[];
  banners: Offer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchMode: string;
  appliedFilters: Record<string, unknown>;
  availableFilters: SearchFilters;
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

// ─── Fetch Helper ─────────────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
    return res.json() as Promise<T>
  } finally {
    clearTimeout(timer)
  }
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

/** Full-text search — GET /search */
export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const p = new URLSearchParams({ query: params.q });
  if (params.page) p.set('page', String(params.page));
  if (params.limit) p.set('limit', String(params.limit));
  if (params.category) p.set('category', params.category);
  if (params.minPrice != null) p.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) p.set('maxPrice', String(params.maxPrice));
  if (params.sort) p.set('sort', params.sort);
  const raw = await fetchJSON<{ success: boolean; data: SearchResult }>(`/search?${p}`);
  return raw.data;
}

/** Search filters — GET /search/filters */
export async function getSearchFilters(): Promise<SearchFilters> {
  const raw = await fetchJSON<{ success: boolean; data: SearchFilters }>('/search/filters');
  return raw.data;
}

/** Search suggestions — GET /search/suggestions */
export async function getSearchSuggestions(q: string): Promise<string[]> {
  const raw = await fetchJSON<{ success: boolean; data: { suggestions: string[] } }>(
    `/search/suggestions?q=${encodeURIComponent(q)}`,
  );
  return raw.data?.suggestions ?? [];
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

// ─── Utils ────────────────────────────────────────────────

export function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return 'Rs. —';
  return `Rs. ${num.toLocaleString('en-IN')}`;
}
