# Website Pagination

## Purpose and scope

This document records the conversion of the MEGG website's active product feeds from automatic infinite loading to explicit numbered pagination. This is a website-only user-interface and data-fetching change in `megg-web`.

The mobile app and shared backend are out of scope. This change does not require a database migration, a new API endpoint, an API response change, or a new package. The existing product-listing endpoints already accept page and limit parameters. Do not infer that app clients now display numbered pagination; their behavior was not changed or validated here.

## User-facing behavior

The website now requests and renders one page of results at a time. A shared pagination bar provides Previous, numbered page buttons, and Next, with an ellipsized range when there are more than five page numbers. The current page is identified accessibly, navigation buttons are disabled during a request, and controls are hidden when there is only one page.

| Website feed | Routes / location | Page size | Behavior |
|---|---|---:|---|
| Product browse | `/products`, `/category/[category]`, `/under699` | `BROWSE_PAGE_SIZE` (20) | Server-rendered initial results; client page changes fetch and replace the grid. Filter changes reset to page 1. |
| Search | `/search` | `BROWSE_PAGE_SIZE` (20) | Search and filters remain URL-driven; choosing a page fetches that page and replaces the displayed results. |
| New arrivals | Homepage `New Arrivals` section | 12 | Fetches one page, replaces the product grid on page selection, and retains its retry state. |

The product count and page count come from the existing API response (`total` and, where provided, `totalPages`). New arrivals calculates a page count from `total` when `totalPages` is absent.

## Files Changed

Implementation files changed for this functionality:

| Status | File | Responsibility in this change |
|---|---|---|
| Added | `components/ui/Pagination.tsx` | Shared numbered page controls, boundaries, and current-page accessibility state. |
| Modified | `components/ui/index.ts` | Exports the shared pagination component. |
| Modified | `hooks/useBrowsePage.ts` | Tracks the selected browse page and fetches a single replacement page. |
| Modified | `components/product/BrowseRoute.tsx` | Passes page state and page-change callback to the browse layout. |
| Modified | `components/product/BrowseLayout.tsx` | Renders page controls under browse results and bases the bottom SEO section on final-page state. |
| Modified | `hooks/useSearch.ts` | Fetches the selected search page and replaces visible search results. |
| Modified | `app/search/SearchClient.tsx` | Wires search page state and callback to the search layout. |
| Modified | `components/search/SearchLayout.tsx` | Renders page controls below search results. |
| Modified | `components/home/NewArrivalsSection.tsx` | Fetches and displays one new-arrivals page at a time. |
| Modified | `lib/constants.ts` | Removes the no-longer-used infinite-scroll root-margin constant; retains browse page size. |
| Removed | `components/ui/EndOfFeed.tsx` | Removed the old end-of-feed indicator, which no longer serves the numbered-pagination flows. |
| Modified | `AGENTS.md` | Updates the hook description from infinite-scroll state to page-navigation state. |

## Related Files (Not Modified)

These files were inspected or are dependencies of the changed flow; they were not modified for the pagination functionality:

- `lib/api.ts`: existing `listProducts`, `getUnder699`, `searchProductsRaw`, and `getNewArrivals` helpers and their page/limit contracts.
- `lib/browseRoutes.ts`: maps browse routes to existing paginated fetch helpers.
- `hooks/useScrollRestoration.ts`: existing search scroll-restoration behavior used by the search hook.
- `components/ui/CardSkeleton.tsx`: existing loading placeholder used by the result grids.
- `megg-api/cloudflare-worker/src/routes/products.js` and `megg-api/cloudflare-worker/src/routes/search.js`: existing shared API implementations; no backend files were changed.
- Mobile app repositories/clients: not changed or validated as part of this website functionality.

The root `README.md` was already modified in the worktree before this documentation update and was not changed as part of the pagination implementation. The generated `tsconfig.tsbuildinfo` change came from validation, not from the pagination feature.

## Request and rendering model

Pagination uses the page and limit support already exposed by the typed API helpers in `lib/api.ts`:

- Browse requests use `listProducts` or `getUnder699` with the selected page and the existing filter set.
- Search requests use `searchProductsRaw` with the current query/filter parameters and the selected page.
- New-arrival requests use `getNewArrivals(page, limit, scope)`.

On successful navigation, the requested page replaces the current grid rather than being concatenated with earlier pages. Browse/search filtering resets to page one. No `IntersectionObserver` is used to fetch additional product records. Header and footer observers remain because they control layout visibility, not feed loading.

## Performance considerations

The intended performance property is bounded result rendering: the browser renders one requested result page rather than an indefinitely growing list. This reduces the number of simultaneously mounted product cards compared with a user scrolling through many appended pages. It also avoids additional data requests until the user explicitly changes page.

The page size and API response shapes are unchanged. No client-side pagination of a fully fetched catalog was added, and no additional dependency or backend round trip was introduced. Each page change still requires a network request to the existing API. Existing API/CDN caching behavior remains in control.

Performance must be verified in the deployed-like runtime before making absolute latency claims. The implementation has not established a production benchmark or a numerical Core Web Vitals improvement. Avoid increasing page sizes or prefetching adjacent pages without measurement, since both can increase transfer and rendering work.

## URL, history, and scroll behavior

- Browse filter state continues to update the URL using the existing filter mechanism. The selected browse page is held in client state and is not currently serialized as a `page` query parameter.
- Search filters remain URL-driven. The selected search page is client state; this change does not establish direct-linkable page URLs.
- Successful page changes scroll to the top of the page or relevant New Arrivals section.
- Search retains the existing search scroll-restoration mechanism. Numbered-page navigation does not change the search URL format.

These are current implementation details, not guarantees of a canonical page-URL scheme. If shareable or browser-history page navigation becomes a requirement, define it separately and keep it consistent with query/filter reset behavior.

## Ownership and integration boundaries

1. `megg-web` owns these website pagination controls and their client-side page state.
2. `megg-api` / Cloudflare Worker own API query behavior, response totals, filtering, and server-side result ordering. They were not changed for this website pagination work.
3. Mobile-app clients share the API but are not modified by this work. Do not make API-contract changes for the website without coordinating app compatibility.
4. If API pagination semantics or response fields need to change, document the cross-client impact and validate web and app consumers before release.

## Validation record

Validation performed for this change:

- `npx tsc --noEmit -p tsconfig.json` from `megg-web` passed.
- Focused ESLint on the pagination component, browse files, search client, and new-arrivals component passed. Linting all touched search files is not clean because of existing issues in `components/search/SearchLayout.tsx` (unused declarations and a synchronous state update in an effect) and a React refs rule violation in `hooks/useSearch.ts` at `paramsRef.current = params` during render. These issues are unrelated to the pagination change.
- The full production build was attempted but is blocked by Photon WASM import resolution in `app/api/offer-banner/route.ts` (`@cf-wasm/photon`). This is unrelated to pagination. A production build has therefore not been verified.
- The scan for feed pagination observers found only the Header and footer-visibility observers remaining; those are not result-loading observers.

Do not report the production build as passing until the Photon issue is resolved or the production build succeeds in the deployment environment.

## Release checklist

- Confirm each browse route changes page without changing its active filters.
- Confirm search page changes preserve the query, filters, and sort order.
- Confirm changing a filter returns to page one and replaces old results.
- Confirm Previous/Next boundaries, current-page accessibility state, and one-page control hiding.
- Confirm new arrivals page changes stay within the section and its retry control still retries the current page.
- Check request sizes and browser performance on a production-like deployment; compare against a recorded baseline before claiming there is no performance impact.
- Verify shared backend and mobile-app repositories have no unintended changes.
- Track and resolve the independent Photon build blocker before considering the full release validation complete.
