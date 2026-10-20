# Website Multi-Select Filters

## Purpose and scope

This record documents website filter changes across catalog browse routes and Search. Subcategory/type, brand, and color facets can hold multiple selections. The controls use checkboxes, active selections are visible/removable, and Clear All removes the active filters. The homepage Under ₹699 sale banner is temporarily hidden by commenting out its render call; its component and the Under ₹699 listing page remain available.

This is a `megg-web` change. The shared API already accepts CSV facet values and returns category-scoped facets. No backend, database, or mobile-app source was modified.

## Filter semantics

- Multiple selected values in one facet combine with OR. Example: brands `BUSHIRT,CAMPUS SUTRA` means either brand.
- Different facets combine with AND. Example: category `Shirt` AND brand (either selected brand) AND color (either selected color).
- Category is a single-value scope, not a multi-select facet. Changing category clears selected subcategory, brand, and color values so options/results belong to the newly selected category.
- Price range and sort are single-choice controls. Price uses radio inputs; sort remains its existing single-choice control.
- The filter drawer applies selections using the existing request flow. Selected values are shown as removable chips above browse results and Search results; each view has a Clear All action.

## Under ₹699 category behavior

Selecting a category on `/under699` requests that category under the existing price cap. The API returns `availableFilters` for that category, and the browse hook updates the Type, Brand, and Colour option lists while preserving the full category navigation list. Subsequent selections reuse those category-scoped facet options, allowing multiple values without losing the remaining choices.

For a direct URL containing a category plus active facet selections, the client makes one additional request with those facet selections omitted to recover the full options within that category. It only updates the facet option list; the actual result request still uses all selected values. This edge case avoids showing only the currently selected value after a reload/deep link.

## API contract and serialization

The Worker list/search implementation parses multi-value facets through `toArray`, which handles comma-separated values. Although its normalizer accepts arrays, route code reads each facet with `c.req.query(key)`, which yields only one value for repeated query keys in the observed Worker runtime. The website therefore:

- Keeps repeated values in the browser URL for shareable filter state.
- Serializes selected facet values as a comma-separated value in outbound list/search API requests.

The live Under ₹699 request with repeated URL values encoded as CSV was accepted and reported both brands and both colors in `appliedFilters`. No backend change was needed.

## Files Changed

| Status | File | Responsibility in this change |
|---|---|---|
| Modified | `lib/browseFilters.ts` | Changes browse facet state to arrays, serializes repeated URL parameters, and counts selected facets. |
| Modified | `lib/api.ts` | Types list facet parameters as arrays and serializes them as CSV for the Worker; Search request helpers also send CSV. |
| Modified | `lib/browseRoutes.ts` | Parses repeated/CSV URL facets and passes arrays to listing fetchers. |
| Modified | `hooks/useBrowsePage.ts` | Preserves category-scoped facet options, resets dependent facets on category changes, and handles scoped deep-link facet initialization. |
| Modified | `components/product/FilterPanel.tsx` | Renders Type, Brand, and Colour as checkboxes, price options as single-choice radios, and adds Clear All. |
| Modified | `components/product/BrowseLayout.tsx` | Toggles multi-select subcategory navigation and displays removable active-filter chips/Clear All. |
| Modified | `components/search/SearchLayout.tsx` | Renders Search Type/Brand/Colour as checkboxes and displays removable active filter chips/Clear All. |
| Modified | `app/_gender/home.tsx` | Comments out the homepage Under ₹699 sale-banner render only. |
| Modified | `docs/README.md` | Links this feature record. |
| Added | `docs/website-multi-select-filters.md` | Records UI behavior, API semantics, ownership, performance, and validation. |

## Related Files (Not Modified)

- `megg-api/cloudflare-worker/src/routes/products.js`: existing Under ₹699/list route parses facet values and returns scoped facets; not changed.
- `megg-api/cloudflare-worker/src/routes/search.js`: existing Search route parses facet values; not changed.
- `megg-api/cloudflare-worker/src/lib/filterBuilder.js`: existing `toArray` and product filter builder implement CSV normalization and OR-within-facet semantics; not changed.
- `megg-api/cloudflare-worker/src/lib/availableFilters.js`: existing category-aware facet generation and facet-specific selected-value behavior; not changed.
- `megg-api/cloudflare-worker/src/lib/productQuery.js`: existing shared product WHERE builder applies facet arrays; not changed.
- `components/home/Under699Banner.tsx`: banner component and artwork remain in the repository; only its homepage render call is commented out.
- Mobile-app repositories/clients: not changed or validated.

## Performance and reliability

- No new endpoint, package, or backend call was introduced for ordinary selections; selections use the existing cached listing/search endpoints.
- Each browse checkbox change follows the existing immediate filter-fetch behavior. Search query state remains URL-driven and its existing request cancellation behavior remains in place.
- In browse routes, changing category clears dependent facet choices, so the normal results request also refreshes category-scoped facets. A direct browse URL with category plus selected facets makes one additional request to recover uncollapsed facet options. In Search, a pre-filtered URL makes a one-item base-facet request only when no cached facet options exist for that query/category scope.
- CSV is used on outbound API requests to ensure all selected values reach the current Worker handler; repeated values remain in the browser URL.
- No production load or latency benchmark was performed. Verify deployed API cache-hit rate and request volume before claiming measured performance at high traffic.

## Homepage banner status

`<Under699Banner gender={gender} />` is commented out in the homepage content. The banner component still exists, the dedicated `/under699` listing is unaffected, and the homepage banner can be restored by uncommenting the render call and restoring its import.

## Validation status

- TypeScript check `npx tsc --noEmit -p tsconfig.json` passed.
- Local browser test on `/under699`: selecting Shirt showed Shirt-scoped facets; two brands and two colors could be checked simultaneously; selected chips and Clear All appeared.
- Local browser test on `/search?query=shirt`: Type, Colour, and Brand appeared as checkboxes; selecting Blue and Black left both checked, updated the URL with both values, showed both removable chips, and retained the existing product grid.
- Live Worker request for Shirt under ₹699 with CSV brands `BUSHIRT,CAMPUS SUTRA` and colors `Blue,Black` reported both selections and 17 matching products. A repeated-query-key probe confirmed the Worker only applied the first value, motivating website CSV serialization.
- Focused ESLint reports existing issues in `components/search/SearchLayout.tsx` and `app/_gender/home.tsx`; these are unrelated to the new checkbox/filter behavior. No new TypeScript errors were reported.
- No backend/app files were modified.