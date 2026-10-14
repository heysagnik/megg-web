# Sidebar navigation typography

## Purpose and user-visible behaviour

The left navigation drawer now uses compact navigation typography for categories instead of the large display-heading style. Category names have a consistent medium weight, tighter line height, subtle tracking, and a restrained hover colour. A small “Shop by category” label clarifies the group without competing with the menu items. The category-row baseline alignment remains unchanged from the original layout.

## Affected UI

- The site-wide left navigation drawer opened from the header menu, for both men and women.

Before this change, category links used the shared `text-section` display typography, making the utility menu appear oversized and visually inconsistent. The new styling is designed for scanning a category list.

## Alignment decision

The category rows retain their original baseline alignment. Only typography and vertical rhythm were refined; no new row alignment is introduced.

## Files changed

| Status | File | Responsibility |
| --- | --- | --- |
| Modified | `components/layout/NavSidebar.tsx` | Updates category-list typography and adds the category-group label. |
| Added | `docs/sidebar-navigation-typography.md` | Records this visual refinement and validation. |
| Modified | `docs/README.md` | Links this record from the documentation index. |

## Related files (not changed)

- `components/layout/Header.tsx`: mounts the existing navigation drawer and supplies its open state.
- `app/globals.css`: provides the existing font tokens used by the revised classes.
- `lib/genderPath.ts`: continues to generate the existing gender-aware category routes.

## Performance and accessibility

- This is a CSS-class and semantic-label update only; it adds no data request, client state, or package.
- Existing links, focus behavior, keyboard handling, and active-page underline remain unchanged.

## Validation

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint components/layout/NavSidebar.tsx`
