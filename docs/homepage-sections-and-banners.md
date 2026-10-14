# Homepage Sections and Banners

## Purpose and scope

This website-only change restores the homepage Under ₹699 banner, temporarily hides the Special Offers carousel, and aligns the Category, Trending, Offers, and New Arrivals section headings to one shared responsive content grid.

## User-visible behavior

- The homepage Under ₹699 banner is visible again. Its component and background art are unchanged.
- The homepage Special Offers carousel is not rendered for now. The component remains in the repository for later re-enabling.
- Category, Trending, Offers (when re-enabled), and New Arrivals section headings share a 1280px maximum content width with consistent responsive gutters: 16px by default, 24px at `sm`, 40px at `md`, and 48px at `lg`.
- Section headings share the same vertical title-stack gap and bottom spacing. Trending's “View All” remains aligned to the right at desktop widths and stacks below/alongside the heading on narrow screens without shifting its title's left edge.

## Files Changed

| Status | File | Responsibility in this change |
|---|---|---|
| Modified | `app/_gender/home.tsx` | Restores the Under ₹699 banner and comments out the Special Offers render call. Uses shared content/heading classes for New Arrivals. |
| Added | `components/home/homeLayout.ts` | Defines the shared responsive homepage content and heading-stack class names. |
| Modified | `components/home/CategoryRow.tsx` | Uses the shared content width and heading spacing. |
| Modified | `components/home/TrendingStrip.tsx` | Uses the shared content width/heading stack and keeps its CTA right-aligned only at desktop widths. |
| Modified | `components/home/OffersSection.tsx` | Uses the shared content width and heading stack if/when the section is re-enabled. |
| Modified | `docs/README.md` | Links this homepage record from the documentation index. |
| Added | `docs/homepage-sections-and-banners.md` | Records the behavior, changed files, and validation. |

## Related Files (Not Modified)

- `components/home/Under699Banner.tsx`: the existing sale-banner component; its visual content is unchanged.
- `components/home/NewArrivalsSection.tsx`: the existing page-numbered product grid; only its parent section wrapper/heading alignment changed.
- `components/home/OffersSection.tsx` remains in the source tree but is not mounted on the homepage while its render call is commented out.
- Backend and mobile-app repositories: not changed or validated for this presentation update.

## Performance and ownership

The change adjusts class names and which existing homepage sections are mounted. It adds no package, data request, backend endpoint, or mobile-app behavior. Hiding Special Offers removes that section's client component from the homepage render, including its offer-fetch effect, while disabled. Restoring the Under ₹699 banner restores the existing decorative image request when the banner approaches the viewport; that image's size/cache considerations are recorded in [under699-banner-background.md](./under699-banner-background.md).

## Validation status

- TypeScript check `npx tsc --noEmit -p tsconfig.json` passed.
- Local browser check confirmed the Under ₹699 banner is visible, Special Offers is absent, and the Under ₹699 navigation link remains.
- At a 390px viewport, “Shop by Category,” “Trending Now,” and “New Arrivals” heading left edges all measured 16px. At the desktop viewport, all three measured the same left edge before the mobile-only Trending alignment adjustment; the adjustment only changes mobile alignment behavior.
- Production visual/performance metrics were not collected.