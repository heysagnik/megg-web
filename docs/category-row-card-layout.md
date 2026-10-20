# Category row card layout

## Purpose and user-visible behaviour

On tablet and desktop, the “Shop by Category” rail displays exactly five complete cards across its available width. Card widths are calculated after the four inter-card gaps, and desktop overflow is clipped after the fifth card so a sixth category can never peek into the composition. Desktop uses 24px gaps and 32px side gutters for the requested extra breathing room; the width calculation accounts for all four gaps inside those gutters. Mobile retains the existing touch-friendly, horizontally scrollable card rail and snap behavior.

## Affected UI

- Homepage “Shop by Category” rail on `/` and `/women`.

Before this change, desktop cards used a fixed maximum width. At common viewport sizes, five cards did not consume the full rail width and a partial sixth card was visible. Desktop now deliberately presents a five-card composition; the full category list remains available through the site navigation and category routes.

## Files changed

| Status | File | Responsibility |
| --- | --- | --- |
| Modified | `components/home/CategoryRow.tsx` | Calculates the desktop card width as one fifth of the inset rail after gaps and updates responsive image sizing. |
| Added | `docs/category-row-card-layout.md` | Records the responsive layout behavior and validation. |
| Modified | `docs/README.md` | Links this record from the documentation index. |

## Related files (not changed)

- `app/_gender/home.tsx`: mounts the existing category row on both homepages.
- `lib/image.ts`: continues to resolve existing category images.
- `lib/genderPath.ts`: continues to generate category destinations.

## Performance and accessibility

- No data request, interaction, or package was added.
- Existing scroll snapping, keyboard-accessible category links, lazy loading, and image dimensions remain in place.
- The revised `sizes` hint helps the browser choose an appropriate desktop image candidate.

## Validation

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint components/home/CategoryRow.tsx`
