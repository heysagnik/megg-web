export default {
  async fetch(request, env) {
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) return new Response('Missing url', { status: 400 });

    const w = url.searchParams.get('w') ?? '1080';
    const q = url.searchParams.get('q') ?? '85';
    const f = url.searchParams.get('f') ?? 'webp';

    const u = new URL(target);
    u.searchParams.set('w', w);
    u.searchParams.set('q', q);
    if (f && f !== 'auto') u.searchParams.set('f', f);

    const upstream = await fetch(u.toString(), {
      cf: {
        image: {
          width: Number(w),
          quality: Number(q),
          fit: 'scale-down',
          format: f === 'auto' ? 'webp' : (f as any),
        },
        cacheTtl: 31536000,
        cacheEverything: true,
      } as any,
    });

    const finalRes = new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'image/webp',
        'cache-control': 'public, max-age=31536000, immutable',
        'cf-cache-status': 'MISS',
      },
    });

    ctx.waitUntil(cache.put(request, finalRes.clone()));
    return finalRes;
  },
};

declare const ctx: { waitUntil: (p: Promise<unknown>) => void };
