import { listProducts, type Product, type ProductsResponse } from '../lib/api';

const EDGE_BASE = 'https://edge.meggfashion.in';
const MEDIA_BASE = 'https://media.meggfashion.in';
const WIDTHS = [240, 300, 320, 480, 640, 800];

type ReelLite = { id: string; thumbnail_url?: string };

function resolveUrl(src: string): string {
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return `${MEDIA_BASE}${src}`;
  return `${MEDIA_BASE}/${src}`;
}

function buildWarmUrl(src: string, width: number): string {
  const full = resolveUrl(src);
  const u = new URL(`${EDGE_BASE}/api/optimize`);
  u.searchParams.set('url', full);
  u.searchParams.set('w', String(width));
  u.searchParams.set('q', '85');
  return u.toString();
}

async function fetchAllProducts(): Promise<Product[]> {
  const limit = 100;
  const first = await listProducts({ page: 1, limit });
  const totalPages = Math.max(1, Math.ceil((first.total ?? first.products.length) / limit));
  const out: Product[] = [...first.products];
  for (let page = 2; page <= totalPages; page++) {
    const r: ProductsResponse = await listProducts({ page, limit });
    out.push(...r.products);
    console.log(`products page ${page}/${totalPages} (${out.length})`);
  }
  return out;
}

async function fetchReels(): Promise<ReelLite[]> {
  const base = process.env.API_BASE_URL;
  if (!base) return [];
  const out: ReelLite[] = [];
  for (let page = 1; page <= 50; page++) {
    const res = await fetch(`${base}/reels?page=${page}&limit=100`);
    if (!res.ok) break;
    const json: unknown = await res.json();
    const reels: ReelLite[] = Array.isArray(json) ? (json as ReelLite[]) : (json as { reels?: ReelLite[] }).reels ?? [];
    if (!reels.length) break;
    out.push(...reels);
    if (reels.length < 100) break;
  }
  return out;
}

async function collectUrls(): Promise<string[]> {
  console.log('collecting products...');
  const products = await fetchAllProducts();
  console.log(`products: ${products.length}`);

  console.log('collecting reels...');
  const reels = await fetchReels();
  console.log(`reels: ${reels.length}`);

  const set = new Set<string>();
  for (const p of products) {
    for (const img of p.images ?? []) {
      if (!img) continue;
      for (const w of WIDTHS) set.add(buildWarmUrl(img, w));
    }
  }
  for (const r of reels) {
    if (!r.thumbnail_url) continue;
    for (const w of WIDTHS) set.add(buildWarmUrl(r.thumbnail_url, w));
  }
  return Array.from(set);
}

async function warmAll(urls: string[], max = 25): Promise<{ ok: number; fail: number }> {
  let ok = 0;
  let fail = 0;
  let inflight = 0;
  const waiters: Array<() => void> = [];

  const tasks = urls.map(async (url) => {
    while (inflight >= max) {
      await new Promise<void>(resolve => waiters.push(resolve));
    }
    inflight++;
    try {
      await fetch(url);
      ok++;
      if (ok % 100 === 0) console.log(`warmed ${ok}/${urls.length}`);
    } catch {
      fail++;
    } finally {
      inflight--;
      const next = waiters.shift();
      if (next) next();
    }
  });

  await Promise.all(tasks);
  return { ok, fail };
}

async function main(): Promise<void> {
  const urls = await collectUrls();
  console.log(`urls to warm: ${urls.length}`);
  if (!urls.length) {
    console.log('nothing to warm.');
    return;
  }
  const { ok, fail } = await warmAll(urls);
  console.log(`done. warm=${ok} failed=${fail}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
