# Match The Mood homepage banners

## Purpose

The homepage presents three visual collection links directly after the Under Rs 699 banner: Formal Wear, Luxury Refined, and Athleisure Fits. Each card opens a catalog search scoped to the homepage gender, so the men's homepage never returns women's products and vice versa.

## Search behaviour

| Banner | Search keyword | Expected product intent |
| --- | --- | --- |
| Formal Wear | `formal wear` | Formal shirts, trousers, blazers, suits, and formal footwear. |
| Luxury Refined | `luxury refined` | Premium and luxury-style products. |
| Athleisure Fits | `sports` | Sport-specific inventory, including Gym Tees, Football Jerseys, Sports Jackets, Sports Shoes, Football Shoes, and Badminton Shoes. |

The Athleisure keyword is deliberately `sports`, rather than `athleisure sportswear`. The catalog's full-text search treats multiple terms as required; the two-word version could omit sport products that use only the exact word `sports` in their category, subcategory, or name.

Every link includes `gender=men` or `gender=women`. The existing search endpoint passes that parameter to the catalog query, which makes the result set gender-specific.

## Affected routes and behaviour change

- `/`: shows men-specific artwork and opens men-scoped results.
- `/women`: shows women-specific artwork and opens women-scoped results.
- `/search?query=sports&gender=men` and `/search?query=sports&gender=women`: receive the Athleisure card traffic and return their respective sport inventory.

Before this change, the homepage had no Match The Mood section. Its Athleisure destination used `athleisure sportswear`, which could omit exact sport products due to the search service's required-term matching. It now uses `sports`.

## Visual behaviour

- Men's and women's homepages use separate original editorial images for all three cards.
- Small screens use horizontally scrollable, snap-aligned cards; tablet and desktop render a three-column grid.
- Images use Next.js `Image` with intrinsic dimensions and responsive `sizes`, preventing layout shift and avoiding oversized image downloads.
- Visible labels are HTML overlays, not image text, for accessible copy and responsive type scaling.

## Files changed

| Status | File | Responsibility |
| --- | --- |
| Modified | `app/_gender/home.tsx` | Mounts the section immediately after the Under Rs 699 banner. |
| Added | `components/home/MatchTheMood.tsx` | Defines gender-specific artwork, focused search links, responsive layout, accessibility labels, and image loading behaviour. |
| Added | `public/assets/match-the-mood/formal.png` | Men's Formal Wear artwork. |
| Added | `public/assets/match-the-mood/luxury.png` | Men's Luxury Refined artwork. |
| Added | `public/assets/match-the-mood/athleisure.png` | Men's Athleisure Fits artwork. |
| Added | `public/assets/match-the-mood/women-formal.png` | Women's Formal Wear artwork. |
| Added | `public/assets/match-the-mood/women-luxury.png` | Women's Luxury Refined artwork. |
| Added | `public/assets/match-the-mood/women-athleisure.png` | Women's Athleisure Fits artwork. |
| Added | `docs/match-the-mood.md` | This implementation and maintenance record. |
| Modified | `docs/README.md` | Links this record from the documentation index. |

## Change log

| Change | Files modified | What changed |
| --- | --- | --- |
| Homepage placement | `app/_gender/home.tsx`, `components/home/MatchTheMood.tsx` | Added the section immediately after the Under Rs 699 banner. |
| Responsive collection UI | `components/home/MatchTheMood.tsx` | Added accessible cards, mobile snap scrolling, desktop three-column layout, responsive image sizing, and keyboard-focus treatment. |
| Men's catalogue experience | `components/home/MatchTheMood.tsx`, `public/assets/match-the-mood/formal.png`, `public/assets/match-the-mood/luxury.png`, `public/assets/match-the-mood/athleisure.png` | Added men's campaign art and `gender=men` search destinations. |
| Women's catalogue experience | `components/home/MatchTheMood.tsx`, `public/assets/match-the-mood/women-formal.png`, `public/assets/match-the-mood/women-luxury.png`, `public/assets/match-the-mood/women-athleisure.png` | Added separate women's campaign art and `gender=women` search destinations. |
| Sports-focused Athleisure | `components/home/MatchTheMood.tsx` | Replaced the restrictive `athleisure sportswear` query with `sports` so exact sport product labels can match. |
| Documentation | `docs/match-the-mood.md`, `docs/README.md` | Added and indexed this implementation record. |

## Related files (not changed)

- `lib/api.ts`: serialises the `gender`, `query`, and filter parameters for the existing search API.
- `hooks/useSearch.ts`: reads the URL parameters and fetches search results on the existing `/search` page.
- `app/search/SearchClient.tsx`: renders the existing search experience.
- `megg-api/cloudflare-worker/src/routes/search.js`: confirms the API applies `gender` to the product query. This backend file was inspected only and was not changed.

## Data assumptions and performance

- Sport product labels are sourced from the existing catalog taxonomy. If the inventory schema changes, confirm that `sports` remains a suitable discovery keyword.
- Search result relevance is owned by the existing API; this frontend does not curate or mutate products.
- Six local assets are handled by Next.js image optimisation. They are lazy-loaded because the section appears below the initial homepage content.

## Validation

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint components/home/MatchTheMood.tsx`

The repository-wide production build remains blocked by the existing `@cf-wasm/photon` import failure in `app/api/offer-banner/route.ts`; it is unrelated to this section.
