/* =====================================================
   MEGG API — Typed Fetch Helpers
   Base URL: https://api.megg.workers.dev/api
   ===================================================== */

const BASE_URL = 'https://api.megg.workers.dev/api';

// ─── Types ────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  brand: string;
  images: string[];
  category: string;
  subcategory: string;
  color: string;
  fabric?: string[];
  affiliate_link: string;
  popularity?: number;
  clicks?: number;
  recent_clicks?: string;
  click_count?: number;
}

export interface Outfit {
  id: string;
  title: string;
  banner_image: string;
  product_ids: string[];
  created_at: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  limit: number;
  total?: number;
}

export interface OutfitsResponse {
  success: boolean;
  data: {
    outfits: Outfit[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Fetch Helpers ────────────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── API Functions ────────────────────────────────────────

export async function getProducts(
  page = 1,
  limit = 20,
  category?: string
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category) params.set('category', category);
  return fetchJSON<ProductsResponse>(`/products?${params}`);
}

export async function getProduct(productId: string): Promise<Product> {
  const data = await fetchJSON<{ product: Product }>(`/products/${productId}`);
  return data.product;
}

export async function getRelatedProducts(productId: string): Promise<Product[]> {
  const data = await fetchJSON<Product[] | { products: Product[] }>(`/products/${productId}/related`);
  return Array.isArray(data) ? data : (data as { products: Product[] }).products ?? [];
}

export async function getOutfits(page = 1, limit = 10): Promise<OutfitsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return fetchJSON<OutfitsResponse>(`/outfits?${params}`);
}

export interface Category {
  category: string;
}

export async function getCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>('/categories');
}

export async function getTrendingProducts(): Promise<Product[]> {
  const data = await fetchJSON<{ success: boolean; data: Product[] }>('/trending/products');
  return data.data ?? [];
}

export function formatPrice(price: string): string {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
}
