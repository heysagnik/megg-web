import { listProducts, type Product, type ProductsResponse } from '../lib/api';

const MEDIA_BASE = 'https://media.meggfashion.in';

// Two hero videos — both WebM and MP4 URLs, browser picks one via Accept.
const HERO_VIDEOS = [
  'https://media.meggfashion.in/web_hero/hero1.webm',
  'https://media.meggfashion.in/web_hero/hero2.webm',
  'https://media.meggfashion.in/web_hero/hero1.mp4',
  'https://media.meggfashion.in/web_hero/hero2.mp4',
];

type ReelLite = { id: string; thumbnail_url?: string };

function resolveMediaUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return `${MEDIA_BASE}${src}`;
  return `${MEDIA_BASE}/${src}`;
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
    const reels: ReelLite[] = Array.isArray(json)
      ? (json as ReelLite[])
      : (json as { reels?: ReelLite[] }).reels ?? [];
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
      set.add(resolveMediaUrl(img));
    }
  }
  for (const r of reels) {
    if (!r.thumbnail_url) continue;
    set.add(resolveMediaUrl(r.thumbnail_url));
  }
  for (const v of HERO_VIDEOS) set.add(v);

  return Array.from(set);
}

async function warmAll(urls: string[], max = 25): Promise<{ ok: number; fail: number; bytesIn: number }> {
  let ok = 0;
  let fail = 0;
  let bytesIn = 0;
  let inflight = 0;
  const waiters: Array<() => void> = [];

  const tasks = urls.map(async (url) => {
    while (inflight >= max) {
      await new Promise<void>(resolve => waiters.push(resolve));
    }
    inflight++;
    try {
      // Stream up to 1 MB so we don't pin the whole video in memory.
      // Cloudflare streams the body; we just need to traverse enough
      // bytes that the edge cache key for the URL is populated.
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        fail++;
        return;
      }
      // Drain the body so the bytes flow through the edge; for video files
      // this is wasteful, but we cap at 1 MB to keep RAM bounded.
      const reader = res.body?.getReader();
      if (reader) {
        let received = 0;
        const cap = 1024 * 1024;
        while (received < cap) {
          const r = await reader.read();
          if (r.done) break;
          received += r.value?.byteLength ?? 0;
          bytesIn += r.value?.byteLength ?? 0;
        }
        try { await reader.cancel(); } catch { /* ignore */ }
      }
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
  return { ok, fail, bytesIn };
}

async function main(): Promise<void> {
  const urls = await collectUrls();
  console.log(`urls to warm: ${urls.length} (incl. ${HERO_VIDEOS.length} hero videos)`);
  if (!urls.length) {
    console.log('nothing to warm.');
    return;
  }
  const { ok, fail, bytesIn } = await warmAll(urls);
  const mb = (bytesIn / 1024 / 1024).toFixed(1);
  console.log(`done. warm=${ok} failed=${fail} bytesDrained=${mb} MB`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
