# megg-api — endpoint reference

Production base URL: **`https://edge.meggfashion.in`**
Preview base URL: **`https://megg-api-edge.megg.workers.dev`**

> Both URLs go through the **Cloudflare Worker** (`cloudflare-worker/`),
> which serves most routes from Postgres directly. The Worker proxies the
> auth handshake (Better-Auth flows) to the **Vercel auth-service**
> (`src/`); see §1.

---

## 1. Topology

```
client ──► edge.meggfashion.in (Worker)
              │
              ├─► routes/* in worker          (90% of traffic)
              │       categories, products, search, reels, daily,
              │       offers, trending, banners, outfits, notifications,
              │       wishlist, /api/auth/{check,profile,sync}
              │
              └─► /api/auth/* fallback ───► api.meggfashion.in (Vercel origin)
                                              Better-Auth: signup, sign-in,
                                              session, refresh, OAuth callbacks,
                                              JWKS, plus mobile/google,
                                              mobile/apple, /sessions, /profile
                                              (PUT), /account, etc.

client ──► api.meggfashion.in (Vercel origin, direct — NOT via Worker)
              │
              └─► /api/agent/*                Fashion AI Agent (Gemma 4 via
                                              Cloudflare AI Gateway → Workers AI).
                                              See §3.12 and docs/AGENT.md.
```

The Worker and the Vercel origin share a `JWT_SECRET`. The origin issues
HS256 JWTs; the Worker verifies them locally using Web Crypto. The agent
routes verify the same tokens via Better-Auth's `authenticate` middleware.

---

## 2. Authentication

All authed endpoints expect:

```
Authorization: Bearer <access_token>
```

### Where access tokens come from

| Flow | Endpoint (proxied to auth-service) |
|---|---|
| Mobile Google sign-in | `POST /api/auth/mobile/google` |
| Mobile Apple sign-in | `POST /api/auth/mobile/apple` |
| Web (Better-Auth managed) | `POST /api/auth/sign-in/...` etc. |
| Refresh access token | `POST /api/auth/refresh` |

### JWT claims

Defined in `cloudflare-worker/src/lib/jwtClaims.js` (and the byte-identical
copy in `src/utils/jwtClaims.js`):

```ts
{ sub: string, role: string|null, sessionId: string, iat: number, exp: number }
```

The Worker's `requireAuth` middleware (`cloudflare-worker/src/lib/auth.js`)
populates `c.get('user')` with `{ id, role, sessionId }`. Endpoints listed
below as **Auth: required** use it. Endpoints marked **Auth: optional**
read the token if present but don't reject when absent.

Failure cases:
- Missing/invalid token on a required endpoint → `401 { error: "Invalid or expired token" }`
- Expired token → same 401; client should call `/api/auth/refresh`.

---

## 2.1 User object & feature flags

Every auth endpoint that returns a `user` object now includes a `features` map:

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "avatar_url": "...",
    "role": "admin",
    "features": {
      "agent": true
    }
  }
}
```

`features` is the only thing clients should read for capability checks — never branch on `role` directly. Each flag is a plain boolean with a guaranteed default of `false` when absent.

### Current flags

| Flag | Type | Phase 1 logic | Phase 2 |
|---|---|---|---|
| `agent` | `bool` | `role === "admin"` | flip to `true` for all users |

### Phase 2 rollout

Phase 2 is a **one-line backend change** in two files — no app update required:

- `src/controllers/auth.controller.js` → `buildFeatures()`
- `cloudflare-worker/src/routes/auth.js` → `buildFeatures()`

Change `agent: role === 'admin'` to `agent: true`. Takes effect on next login or profile refresh for all users.

> Note: `/api/auth/profile` (Worker) is KV-cached for 30 minutes per user. After a Phase 2 flip, users will see the new value within 30 minutes without any client action.

---

## 3. Endpoint catalogue

Convention: paths are relative to the base URL (`https://edge.meggfashion.in`).
Auth column: ✅ required, ☑ optional, ⬜ public.

### 3.1 Auth (proxied to Vercel auth-service)

| Method | Path | Auth | Body / Query | Returns |
|---|---|---|---|---|
| `POST` | `/api/auth/mobile/google` | ⬜ | `{ idToken: string }` | `{ success, data: { user, tokens, session } }` |
| `POST` | `/api/auth/mobile/apple` | ⬜ | `{ idToken, name?, email? }` | `{ success, data: { user, tokens, session } }` |
| `POST` | `/api/auth/refresh` | ⬜ | `{ refresh_token }` | `{ success, data: { user, tokens, session_id } }` |
| `POST` | `/api/auth/logout` | ✅ | `{ refresh_token? }` | `{ success: true }` |
| `GET`  | `/api/auth/sessions` | ✅ | — | `{ sessions: [...] }` |
| `DELETE` | `/api/auth/sessions` | ✅ | — | `{ success: true, revoked: N }` |
| `DELETE` | `/api/auth/sessions/:id` | ✅ | — | `{ success: true }` |
| `PUT`  | `/api/auth/profile` | ✅ | `{ name?, image?, phoneNumber?, about? }` | `{ user }` |
| `DELETE` | `/api/auth/account` | ✅ | `{ reason? }` | `{ success: true }` |
| `GET`  | `/api/auth/admin/status` | API-key | header `x-api-key` | `{ success, isAdmin: true }` |
| `*`    | `/api/auth/sign-in/*`, `/sign-up/*`, `/session`, `/callback/*`, `/jwks`, etc. | varies | Better-Auth managed | Better-Auth response |

### 3.2 Auth (Worker-local, no proxy)

These three live on the Worker directly to avoid a round-trip to Vercel
for hot per-request operations.

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/auth/check` | ☑ | `{ authenticated: true, user: { id, role, sessionId, features } }` if token valid; `{ authenticated: false }` otherwise |
| `GET` | `/api/auth/profile` | ✅ | `{ id, full_name, avatar_url, email, phone, role, about, created_at, features }` (cached 30min in KV) |
| `POST` | `/api/auth/sync` | ✅ | `{ success: true, isNew: false }` — back-compat no-op for older mobile clients |

### 3.3 Products & listing

See `docs/SEARCH.md` for the full filter contract.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/products/list` | ⬜ | Unified listing. Params: `category, subcategory, color, brand, minPrice, maxPrice, sort, page, limit`. Returns products + facets + banners. |
| `GET` | `/api/products/browse/:category` | ⬜ | Shim → `/list?category=:category`. |
| `GET` | `/api/products/under699` | ⬜ | Shim → `/list?maxPrice=699` with category exclusions. |
| `GET` | `/api/products/brands` | ⬜ | `[{ name, product_count, min_price, max_price, categories }]`. Cached 2h. |
| `GET` | `/api/products/new-arrivals` | ⬜ | Two-bucket weighted feed (shirts/tshirt/jeans/shoes primary, rest secondary). Time-windowed shuffle (10min seed). |
| `GET` | `/api/products/:id` | ⬜ | One CTE: product + brand_variants + brand_products (8) + recommendations (16) + linked_outfits (10). Bumps popularity asynchronously. Cached 1h. |
| `GET` | `/api/products/:id/recommendations` | ⬜ | Up to 12 by subcategory similarity. |
| `GET` | `/api/products/:id/related` | ⬜ | Up to 8 same-category products. |
| `GET` | `/api/products/:id/variants` | ⬜ | Color/style variants (same brand + name). |
| `POST` | `/api/products/:id/click` | ☑ | Body `{ source?, session_id?, affiliate_clicked? }`. Inserts `trending_clicks`; trigger increments `popularity`. Anonymous if no token. |

### 3.4 Search

See `docs/SEARCH.md` for full request/response shapes.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/search` | ⬜ | Hybrid (text + vector) + intent extraction + diversification. Returns `meta.didYouMean` / `meta.relaxHint` on zero-result. |
| `GET` | `/api/search/filters` | ⬜ | Just the facet payload for a given filter set. Cached 1m. |
| `GET` | `/api/autocomplete` | ⬜ | Keystroke-time **sectioned** suggestions (filter combinations only — no product names). Brands / categories / subcategories / multi-dim combinations precomputed every 15min by the cron. Each item carries a structured `filters` object. Accepts `?q=` or `?query=`. See `docs/SEARCH.md` §7.1. |
| `GET` | `/api/intent` | ⬜ | Standalone query → intent-resolution endpoint (returns extracted brand/category/color). |

### 3.5 Categories & subcategories

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/categories` | ⬜ | `[{ category }]`. Cached 2h. |
| `GET` | `/api/subcategories` | ⬜ | `{ success, data: { subcategories: [...] } }`. All active subcategories. |
| `GET` | `/api/subcategories/:category` | ⬜ | Subcategories scoped to a category. |

### 3.6 Wishlist

All require ✅. JWT identifies the user; ownership is enforced server-side.

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET` | `/api/wishlist` | — | `{ items: [{ wishlist_id, added_at, id, name, price, brand, images, category, subcategory, color, affiliate_link, is_active }] }` |
| `POST` | `/api/wishlist/:productId` | — | `201 { success: true, item }` (new) · `200 { message: "Already in wishlist", id }` (existing) · `404 { error: "Product not found" }` |
| `DELETE` | `/api/wishlist/:productId` | — | `{ success: true }` · `404` if not in wishlist |
| `GET` | `/api/wishlist/check/:productId` | — | `{ inWishlist: boolean }` |

The `POST` is idempotent and race-safe — single CTE with `ON CONFLICT DO NOTHING` against the `(user_id, product_id)` unique constraint.

### 3.7 Reels

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/reels` | ⬜ | All reels, optional `?category=`. Cached 15m. |
| `GET` | `/api/reels/category/:category` | ⬜ | Paginated by category. |
| `GET` | `/api/reels/liked` | ✅ | User's liked reels. **Must come before `/:id`** in route order. |
| `GET` | `/api/reels/:id` | ⬜ | Reel + linked products. Cached 30m. |
| `GET` | `/api/reels/:id/products` | ⬜ | Same as above with a different envelope shape. |
| `POST` | `/api/reels/:id/view` | ⬜ | Increments view count. |
| `POST` | `/api/reels/:id/like` | ☑ | Body `{ like?: true }`. With token: deduped via `reel_likes`. Without token: best-effort increment/decrement. |

### 3.8 Outfits

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/outfits` | ⬜ | Optional `?group=`. Random order when grouped, newest-first otherwise. Embeds full product data per outfit. |
| `GET` | `/api/outfits/:id` | ⬜ | Single outfit. |
| `GET` | `/api/outfits/:id/products` | ⬜ | Outfit + its products. |
| `GET` | `/api/outfits/:id/recommendations` | ⬜ | Up to 10 outfits in the same `group_type`. |

### 3.9 Banners

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/banners` | ⬜ | `[{ id, banner_image, link, display_order, ... }]`. Cached 2h. |
| `GET` | `/api/banners/:id` | ⬜ | Single banner. |

### 3.10 Daily / Offers / Trending / Notifications

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/daily` | ⬜ | Daily featured items. Cached 15m. |
| `GET` | `/api/daily/:id` | ⬜ | Single daily item. |
| `GET` | `/api/offers` | ⬜ | Active offers. Cached 30m. |
| `GET` | `/api/offers/:id` | ⬜ | Single offer. |
| `GET` | `/api/trending` | ⬜ | Trending feed. Pre-computed by cron every 15m → KV; falls back to live query on miss. |
| `GET` | `/api/trending/products` | ⬜ | Trending products specifically. |
| `GET` | `/api/notifications` | ⬜ | Recent notifications. Cached 5m. (No FCM endpoint — `/api/fcm` is intentionally 404.) |
| `GET` | `/api/notifications/:id` | ⬜ | Single notification. |

### 3.11 Utility

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/health` | ⬜ | `{ status: "ok", service: "workers", topologyVersion, timestamp }` |
| `GET` | `/__worker/health` | ⬜ | Worker-internal health (different shape). |
| `POST` | `/__worker/purge` | Bearer `PURGE_TOKEN` | Manually purge an edge-cache URL. Body: `{ paths: string[] }`. |
| `GET` | `/api/optimize` | ⬜ | On-the-fly image transform (proxied via Workers AI / photon). Params: `?url=&w=&h=&q=`. Cached at edge. |

### 3.12 Fashion AI Agent (Vercel origin only)

Base URL: **`https://api.meggfashion.in`** (NOT the Worker — these endpoints
live on Vercel because they need long-lived connections to Cloudflare AI
Gateway). Every route requires ✅ auth. See **`docs/AGENT.md`** for the
full client-integration guide.

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST`   | `/api/agent/threads` | `{ title? }` | `{ success, data: thread }` |
| `GET`    | `/api/agent/threads` | query: `?cursor&limit&status` | `{ items, nextCursor }` |
| `GET`    | `/api/agent/threads/:id` | — | `{ thread }` |
| `PATCH`  | `/api/agent/threads/:id` | `{ title?, status? }` | `{ thread }` |
| `DELETE` | `/api/agent/threads/:id` | — | `{ success }` (soft delete) |
| `GET`    | `/api/agent/threads/:id/messages` | query: `?cursor&limit&direction` | `{ items, nextCursor }` |
| `POST`   | `/api/agent/threads/:id/messages/stream` | `{ content, clientMsgId? }` | SSE — AI SDK UI-message stream; on cached replay, a single `{ type: "replay", userMessage, assistantMessage, productIds }` frame |
| `GET`    | `/api/agent/quota` | — | `{ used, remaining, limit, resetsAt }` |
| `GET`    | `/api/agent/profile` | — | `{ user_id, about, updated_at }` |
| `PUT`    | `/api/agent/profile/preferences` | `{ partial about patch }` | `{ profile }` |
| `POST`   | `/api/agent/profile/photo` | `multipart/form-data` field `photo` (≤5MB, jpeg/png/webp) | `{ user_id, about, updated_at }` |

Key behaviours:
- Sending a message atomically consumes 1 of `AGENT_DAILY_LIMIT` (default 10/day,
  resets at IST midnight). Over-limit calls return `429`.
- `clientMsgId` makes `POST /messages/stream` idempotent — replays emit a single `replay` SSE frame with the original assistant reply, without re-billing the quota or the model.
- `503 { code: "AGENT_AT_CAPACITY", retryAfterSeconds }` means Workers AI is
  rate-limited; the quota row is refunded so a retry doesn't penalise the user.
- The photo upload runs the vision SKU, persists extracted profile keys into
  `user.about`, and never stores the image.

---

## 4. Conventions

### 4.1 Response envelopes

Two shapes coexist (historical reasons; not changing now):

```json
// Most product/list/banner endpoints — direct
{ "products": [...], "total": 412, "page": 1, "limit": 20, ... }

// Newer endpoints — wrapped
{ "success": true, "data": { ... } }
```

Errors always use:

```json
{ "error": "Failed to fetch products" }
```

### 4.2 Pagination

Where applicable: `?page=1&limit=20`. Defaults: page=1, limit=20, max
limit=100. Responses include `total`, `page`, `limit`, `totalPages`.

### 4.3 Cache headers

Worker uses two layers:
- **`caches.default`** — Cloudflare HTTP cache, URL-keyed (`https://cache.internal/...`). Per-PoP, no quota. TTLs in `lib/cache.js::CACHE_TTL`.
- **`env.CACHE`** (KV) — Cloudflare KV, used for search results and the trending pre-compute. Has explicit `expirationTtl`.

Clients should rely on server caching; don't add aggressive client-side
caching beyond standard browser HTTP-cache behaviour.

### 4.4 Rate limits

Auth endpoints (`mobile/google`, `mobile/apple`, `refresh`) are rate-
limited at the Vercel auth-service via `authLimiter`. The Worker itself
doesn't rate-limit reads — all read traffic is cache-friendly.

### 4.5 CORS

Worker allows the admin frontend (`https://admin.meggfashion.in`,
`http://localhost:5173`, `http://localhost:3000`) and any origin on
auth-service for the proxied paths. Mobile apps don't trigger CORS.

---

## 5. Quick examples

### Sign in (mobile Google)

```bash
curl -X POST https://edge.meggfashion.in/api/auth/mobile/google \
  -H 'Content-Type: application/json' \
  -d '{"idToken":"<google-id-token>"}'
# → { "success": true, "data": { "user": { "id": "...", "email": "...", "role": "user", "features": { "agent": false } }, "tokens": { "access_token": "...", "refresh_token": "..." }, "session": { ... } } }
```

### List products (Shoes, sorted cheapest first)

```bash
curl 'https://edge.meggfashion.in/api/products/list?category=Shoes&sort=price_asc&page=1&limit=20'
```

### Search with hybrid intent extraction

```bash
curl 'https://edge.meggfashion.in/api/search?query=nike+air+jordan+red+shoes'
```

### Add to wishlist

```bash
curl -X POST https://edge.meggfashion.in/api/wishlist/<productId> \
  -H "Authorization: Bearer $TOKEN"
```

### Track a click (anonymous)

```bash
curl -X POST https://edge.meggfashion.in/api/products/<productId>/click \
  -H 'Content-Type: application/json' \
  -d '{"source":"search","session_id":"abc","affiliate_clicked":false}'
```

### Refresh expired access token

```bash
curl -X POST https://edge.meggfashion.in/api/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refresh_token":"<refresh>"}'
```

### Health check

```bash
curl https://edge.meggfashion.in/api/health
```

### Send a message to the stylist agent

```bash
curl -N -X POST https://api.meggfashion.in/api/agent/threads/<threadId>/messages/stream \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"content":"Suggest a black blazer under 3000","clientMsgId":"abc-123"}'
```

---

## 6. Reference — file mapping

If you need to dig into the implementation:

| Area | Worker file | Auth-service file |
|---|---|---|
| Auth flows (sign-in, refresh, sessions, profile PUT) | `routes/auth.js` (local 3) + api.js fallback proxy | `src/routes/auth.routes.js` + `src/controllers/auth.controller.js` |
| JWT claim contract | `cloudflare-worker/src/lib/jwtClaims.js` | `src/utils/jwtClaims.js` (byte-identical) |
| `requireAuth` middleware | `cloudflare-worker/src/lib/auth.js` | `src/middleware/auth.js` |
| Product listing / filtering | `routes/products.js` + `lib/productQuery.js` | n/a (Worker-only) |
| Search | `routes/search.js` + `lib/{availableFilters,semanticSearch,intentEmbeddings,filterBuilder}.js`. Intent extraction is embedding-based (`@cf/baai/bge-small-en-v1.5`); pre-computed dim vectors live in KV under `search-embeddings:v1`, regenerated by `scripts/prefetch-search-data.mjs`. See `docs/SEARCH.md` §11. | n/a |
| Wishlist | `routes/wishlist.js` | n/a |
| Cache layer | `lib/cache.js` | n/a |
| DB connection | `lib/db.js` (Neon serverless, per-isolate cache) | `src/config/db.js` (pg.Pool) |
| Fashion AI Agent | n/a (Vercel-only) | `src/routes/agent.routes.js` + `src/controllers/agent.controller.js` + `src/services/agent/*` |
| AI Gateway client | n/a | `src/services/ai/cloudflareClient.js` (Vercel AI SDK + `ai-gateway-provider`) |

---

## 7. Common gotchas

- **Don't call the Vercel URL directly** for product/wishlist/search routes — they only exist on the Worker.
- **`/api/auth/check` does NOT hit the DB.** It just verifies the JWT signature locally. Cheap; safe to call frequently.
- **Order matters in `routes/reels.js`**: `/liked` is registered before `/:id` so it isn't matched as a UUID param. If you add new fixed-string sub-paths to a router, register them first.
- **Click endpoint counts twice if you call `increment_product_clicks()` manually** — there's an `AFTER INSERT` trigger on `trending_clicks` that handles it. The route was fixed in a recent commit; don't regress.
- **Cache key versions** are bumped at the call site (`search:v8`, `filters:v4`, `facets:v2`). Bump them when response shape changes; otherwise stale entries will leak.
- **The search and list endpoints share one query path** (`lib/productQuery.js`). Filter behavior is identical; only scoring/diversification differ. Don't fork them again.
