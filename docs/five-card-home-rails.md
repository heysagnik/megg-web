# Five-card homepage rails

## Purpose and user-visible behaviour

At tablet and desktop widths, both “Shop by Category” and “Trending Now” present exactly five complete cards in one view. Each rail has 25px outer gutters and four 24px gaps. The sixth card is fully outside the initial view, and the rails remain horizontally scrollable. Mobile keeps the existing touch-friendly, horizontally scrollable card rails.

## Affected UI

- Homepage “Shop by Category” rail on `/` and `/women`.
- Homepage “Trending Now” rail on `/` and `/women`.

## Files changed

| Status | File | Responsibility |
| --- | --- | --- |
| Modified | `components/home/CategoryRow.tsx` | Uses five-card desktop sizing, matching gutters, and overflow clipping. |
| Modified | `components/home/TrendingStrip.tsx` | Uses the same five-card desktop sizing, gutters, and overflow clipping. |
| Added | `docs/five-card-home-rails.md` | Documents the shared rail layout and validation. |
| Modified | `docs/README.md` | Links this record from the documentation index. |

## Related files (not changed)

- `app/_gender/home.tsx`: mounts both existing homepage sections.
- `components/product/ProductCard.tsx`: supplies existing Trending card content.
- `lib/genderPath.ts`: continues to create existing gender-aware routes.

## Performance and accessibility

- No data request or package was added.
- Category and product cards preserve their existing links, lazy loading, image dimensions, and mobile touch scrolling.

## Validation

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint components/home/CategoryRow.tsx components/home/TrendingStrip.tsx`
