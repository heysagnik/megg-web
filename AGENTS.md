# MEGG Web — Project Notes for Agents

## Branches & PR Workflow
- Main branch: `main`
- Production deployment: Vercel (front-end only).
- The site is a catalog/recommendations layer; all product data comes from `https://edge.meggfashion.in/api`.
- Never commit to main directly without review; use feature branches.

## Tech Stack
- **Next.js 15** (App Router, `force-static` + ISR on catalog pages)
- **Tailwind CSS v4** (CSS-first, `@theme` tokens in `app/globals.css`)
- **TypeScript** (`tsconfig.json` — strict-ish, `esModuleInterop` off)
- **React 19** with `'use client'` / server-component boundaries

## Commands
```sh
npm run dev          # starts dev server with Turbopack
npm run build        # production build
npm run lint         # ESLint (may fail due to next lint CLI arg parsing — fixable)
npm run warm:cache   # pre-warm the image CDN cache
```

**TypeScript type-check** (always passes after every change):
```sh
npx tsc --noEmit -p tsconfig.json
```

## Code Conventions Discovered During Refactor

### Shared utility: `cn`
Use `import { cn } from '@/lib/utils'` for every class-name merge. No local `CN` helpers anywhere — the one helper is aliased as `CN` for call-site compatibility via `import { cn as CN } from '@/lib/utils'`.

### Colours
Single source of truth: `lib/utils.ts` → `COLOR_SWATCH_MAP` + `getColorHex(name)`. Filter-panel swatches use the same getter — no local hex maps.

### Image helpers
- `getCdnImageUrl(src)` — resolves a media-path → CDN URL; no width/quality params.
- `getProductSrcSet(src)` — generates a responsive width-useried srcSet for `img`.
- `getOptimizedImageUrl(src, {width,quality,format})` — routes through the optimize Worker for OP/OG generation only.

### Constants
All app-wide magic numbers live in `lib/constants.ts`.

### Browse routes
All catalog listing pages (`/products`, `/under699`, `/category/[slug]`) use one client component: `<BrowseRoute kind="..." />`. Route-specific config lives in `lib/browseRoutes.ts`. Adding a new catalog route means:
1. Add a config entry in `BROWSE_ROUTES` (Partial<Record<BrowseKind, . er>).
2. Write a server page that calls `<BrowseRoute />` with SSR-fetched initial data.

### JSON-LD / SEO
All schema markup uses `<JsonLd data={...} />` from `components/seo/JsonLd.tsx`. Common partials (`collectionPageLd`, `breadcrumbLdGraph`, `productItemList`) live in `lib/seo/jsonld.ts`.

### Hooks
- `useBrowsePage` — shared paging/filter/infinite-scroll state for browse pages.
- `useScrollHideOnIdle` — rAF-throttled mobile-bar autohide.
- `useFooterVisibility` — observer for footer-in-viewport detection.
- `useFocusTrap` — WAI-ARIA focus lock for modal/slideover panels.

### File organisation
- `components/product/` — PDP + catalog components (no cross-cutting concern).
- `hooks/` — no `use client` marker needed? Actually all hooks in this project have `'use client'`.
- `lib/` — zero-runtime helpers + constants + API fetch layer.
- `lib/seo/` — SEO data structures (keywords, JSON-LD).

## Notes for Future Changes
- **Dead `getCdnImageUrl` opts**: the function ignores width/quality args. Callers that pass them are doing unnecessary work — the CDN serves the same URL regardless.
- **Broken srcsets**: `ReelsSection` and `CategoryRow` generate srcsets with identical URLs under different width labels — the browser only fetches once. Needs a CDN resize param to actually vary the URL.
- **Page-size**: all browse pages use `BROWSE_PAGE_SIZE = 20`. Changing it changes one constant.
- **SearchLayout auto-hide**: uses `useScrollHideOnIdle` — the old non-rAF version has been replaced.