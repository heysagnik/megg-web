# Match the Mood — Feature Documentation

## 1. Overview

Match the Mood is a fashion discovery feature on the Megg website. It allows users to browse curated clothing collections based on a particular style.

The feature includes three collections:

- **Formal Wear**
- **Traditional Wear**
- **Winter Wear**

The feature is available for both men's and women's shopping experiences. Each gender has its own banner images, product collection definitions, and collection routes.

The implementation reuses the existing product API, product cards, filter panel, and pagination component. It does not require a separate product database or a new backend service.

## 2. Objectives

The feature is designed to:

- Help users discover relevant products through curated collections.
- Keep men's and women's products separated.
- Allow users to filter products across the entire mood page.
- Support multiple subcategory selections, subject to each product group's configured scope.
- Support independent pagination for each product group.
- Provide a responsive banner experience across mobile, tablet, and desktop devices.
- Preserve filter selections in the URL so they can be restored on refresh.
- Reuse existing application components and API functionality.

## 3. Files and Responsibilities

### `components/home/MatchTheMood.tsx`

Responsible for the homepage banner section.

Responsibilities include:

- Rendering the three mood banners.
- Selecting banner content according to the current gender.
- Rendering optimized Next.js images.
- Displaying the banner title, subtitle, and Shop Now link.
- Supporting horizontal swipe navigation on mobile.
- Displaying mobile pagination indicators.
- Applying responsive image sizing, typography, spacing, and overlays.

### `lib/moods/collections.ts`

Defines the mood collections and their product groups.

Responsibilities include:

- Defining the available mood slugs.
- Configuring the product categories and subcategories associated with each collection.
- Maintaining separate collection definitions for men and women.
- Providing `getMoodCollection()` to retrieve a collection.
- Providing `isMoodSlug()` to validate supported mood slugs.

The collection definitions determine which product categories a mood page can request. They must be kept aligned with the actual category and subcategory values supported by the product API.

### `components/home/MoodCollectionPage.tsx`

Responsible for displaying products on a mood collection page.

Responsibilities include:

- Loading the collection definition.
- Restoring filter selections from the URL.
- Fetching products for each configured product group.
- Maintaining independent pagination state for each group.
- Applying shared filters to relevant groups.
- Aggregating available filter options from API responses.
- Displaying product cards, loading placeholders, errors, empty states, and pagination controls.
- Updating the URL when filters change.

### `components/product/FilterPanel.tsx`

Reuses the existing filter interface.

The panel receives the available filters and selected filter state from the mood collection page. It supports the filter options implemented by the shared component, including subcategories, colors, brands, and price limits.

The mood page remains responsible for applying those selections to the appropriate product groups.

### `components/product/ProductCard.tsx`

Renders individual products using the existing product card implementation.

Reusing this component helps maintain consistent product presentation across the website.

### `components/ui/Pagination.tsx`

Provides the pagination controls for product groups.

The mood page supplies the current page, total pages, loading state, and page-change callback.

### `lib/api.ts`

Provides the existing `listProducts()` API function and relevant TypeScript types.

The mood page uses this existing API rather than introducing a separate product-fetching service.

### `lib/browseFilters.ts`

Provides shared filter utilities, including:

- Default filter values.
- URL query parameter parsing and serialization.
- Visible filter counts.
- Sort conversion.
- Available price options.

Reusing these utilities helps maintain consistent filter behavior across the website.

## 4. Routes and Navigation

The banner links use gender-specific routes.

### Men's collections

| Collection | Route |
|---|---|
| Formal Wear | `/mood/formal` |
| Traditional Wear | `/mood/traditional` |
| Winter Wear | `/mood/winter` |

### Women's collections

| Collection | Route |
|---|---|
| Formal Wear | `/women/mood/formal` |
| Traditional Wear | `/women/mood/traditional` |
| Winter Wear | `/women/mood/winter` |

The `moodHref()` helper in `MatchTheMood.tsx` determines the correct route from the gender and mood slug.

Keep this route structure consistent with the corresponding mood route pages and navigation.

## 5. Banner Design and Responsive Behavior

The homepage banner component uses Next.js `Image` for image rendering and `Link` for navigation.

### Desktop

- Three banners appear in a row.
- Each banner displays its image, text overlay, and Shop Now link.
- Hover effects are enabled where appropriate.
- The layout uses consistent spacing and image proportions.

### Mobile

- The banners form a horizontally scrollable carousel.
- One full banner occupies the available carousel width at a time.
- CSS scroll snapping helps align each banner after a swipe.
- Pagination indicators show the active banner.
- Tapping an indicator navigates to the corresponding banner.
- Banner text and button dimensions are adjusted for narrow screens.

### Tablet and intermediate widths

Typography, spacing, and button sizing should scale according to the available banner width. Avoid abrupt font-size increases that cause text to look oversized or distorted.

The banner images should use appropriate cropping without stretching. Test at narrow mobile, tablet, and desktop widths whenever the responsive styles change.

### Heading

The section heading is **The Style Edit**, with the supporting text **Curated for your style**.

The heading block is centered above the banner section.

Banner titles and Shop Now links remain UI overlays rather than text embedded into the image files.

## 6. Collection Configuration

The collection definitions are stored in `lib/moods/collections.ts`.

Each collection contains a title and an array of product groups. A group defines its title, product category, and optional subcategory restrictions.

For example, a formal collection may contain separate groups for formal shirts, formal trousers, formal shoes, and tailored jackets.

The women's and men's collections can use different category names and subcategory values because the underlying product taxonomy may differ.

### Adding or modifying a group

1. Identify the correct gender and mood.
2. Check the actual category and subcategory values used by the API.
3. Update the relevant group definition.
4. Confirm the filter scope remains correct.
5. Test the group with and without selected filters.
6. Verify pagination and empty states.
7. Update this documentation if the configuration or behavior changes.

Do not assume that a category or subcategory exists merely because its name sounds appropriate. Confirm it against the application's actual product data and API behavior.

## 7. Product Fetching and Group State

`MoodCollectionPage.tsx` fetches products independently for each configured group.

The page size is controlled by:

`MOOD_PAGE_SIZE = 12`

Each group's state includes:

- `products`: products returned by the API.
- `total`: total matching product count.
- `totalPages`: number of available pages.
- `page`: currently selected page.
- `loading`: whether a request is in progress.
- `error`: whether the request failed.

A separate `pages` state object tracks the current page number for each group.

The group key is generated by `groupKey()`, which combines the group's category and title.

Separating page numbers from fetched product data allows a page change to trigger the fetching effect without relying on product-state updates to initiate requests.

### Request lifecycle

1. The component obtains the collection definition.
2. Filter selections are restored from the current URL.
3. The fetching effect starts requests for the configured product groups.
4. The relevant group states are marked as loading.
5. The existing `listProducts()` function receives the current page, page size, category, subcategory, filters, sort option, and gender.
6. The responses update the corresponding group states.
7. The interface displays the returned products, pagination controls, or appropriate loading, error, and empty states.

The effect uses cleanup to ignore results from requests that belong to an obsolete effect execution.

## 8. Shared Filtering Behavior

One filter panel is shared across the mood collection page.

Filter selections are applied to each group where they are relevant. Each group's configured category and subcategory restrictions remain in effect.

### Supported filter dimensions

The page passes supported filter values to `listProducts()`, including:

- Subcategories.
- Colors.
- Brands.
- Maximum price.
- Sort order.
- Gender.

The available filter options are assembled from the API responses and restricted to the configured collection scope where applicable.

### Subcategory restrictions

A selected subcategory must not cause a group to fetch products outside its configured scope.

For groups with explicit subcategory restrictions, only selections that match those restrictions are passed to the API.

For groups without an explicit subcategory list, the selected subcategories are passed through alongside the group's fixed category.

When a selected subcategory does not apply to a particular group, that group displays its corresponding empty state rather than requesting products from an unrelated category.

### Filter reset

Changing filters or sort order resets each group's page to page 1.

The Clear all action restores the default filter values and resets pagination.

Filter selections are serialized into URL query parameters so they can be restored when the page is refreshed.

The category remains controlled by the mood collection configuration rather than by a user-supplied URL category value.

## 9. Pagination Behavior

Pagination is independent for each product group.

For example, moving to page 2 in Formal Shirts should not automatically move the Formal Trousers group to page 2.

When the user changes a group's page:

1. `changePage()` updates that group's entry in `pages`.
2. The corresponding group is marked as loading.
3. The fetching effect detects the updated page state.
4. `listProducts()` is called with the new page number.
5. The returned products and pagination metadata update that group.
6. The pagination component displays the updated page and available navigation controls.

Changing filters resets all groups to page 1 because the result set has changed.

### Troubleshooting repeated products

If clicking Next displays the same products, inspect the request in the browser's Network panel.

Verify:

- The request contains the expected page number.
- The page size is correct.
- The response contains the expected products.
- The returned `totalPages` and total count are consistent with the result set.

If the request uses the correct page number but returns the same products, investigate the existing API's pagination behavior before changing the frontend again.

## 10. Loading, Error, and Empty States

The page handles the following conditions:

- **Loading:** placeholder cards are shown while requests are in progress.
- **Request failure:** a message asks the user to refresh and try again.
- **No matching products:** the affected group displays an empty-state message.
- **No products across the page:** a page-level message suggests changing or clearing the filters.

These states should remain independent for each group so that one group's results do not incorrectly determine another group's loading or pagination status.

## 11. Performance and Security Considerations

The implementation reuses the existing API and UI components.

Important considerations:

- Keep the page size bounded.
- Avoid introducing unnecessary requests or repeated fetch loops.
- Ignore stale request results when the active filters or page changes.
- Preserve the fixed category and gender restrictions.
- Do not treat frontend filtering as an authorization boundary; the backend remains responsible for validating requests and enforcing applicable access controls.
- Do not expose environment variables, credentials, or sensitive API details in this component.
- Avoid introducing additional dependencies unless they are necessary.
- Do not change production data, billing configuration, backend routes, or deployment settings as part of a frontend-only change.

## 12. Testing Checklist

### Banner and navigation

- [ ] All three banners appear in the correct order.
- [ ] Men's pages display men's banner assets.
- [ ] Women's pages display women's banner assets.
- [ ] Each Shop Now link opens the correct mood route.
- [ ] Banner images retain their proportions.
- [ ] Heading and overlay text remain readable on mobile and tablet.

### Responsive layout

- [ ] Mobile shows one full banner at a time.
- [ ] Horizontal swipe moves between banners.
- [ ] Pagination indicators update after swiping.
- [ ] Tapping an indicator navigates to the correct banner.
- [ ] Desktop shows three banners in a row.
- [ ] No unwanted horizontal overflow appears elsewhere on the page.

### Product listing and pagination

- [ ] Each configured group loads products.
- [ ] Next requests the correct page.
- [ ] Previous returns to the earlier page.
- [ ] Different pages show the expected products.
- [ ] Each group maintains independent pagination.
- [ ] Pagination controls respect the available total pages.

### Filters

- [ ] Multiple applicable subcategories can be selected.
- [ ] Category and subcategory restrictions remain intact.
- [ ] Color, brand, and price filters work where supported by the API.
- [ ] Sort changes refresh the product results.
- [ ] Changing filters resets pagination.
- [ ] Clear all resets the filters and pages.
- [ ] URL query parameters restore the selected filters after refresh.

### Reliability

- [ ] Loading indicators disappear after requests finish.
- [ ] Failed requests display an error state.
- [ ] Empty results display the appropriate message.
- [ ] TypeScript validation completes successfully.
- [ ] Browser Network requests use the expected page and filter parameters.

## 13. Development Workflow

The feature is being developed on the `feature/match-the-mood` branch.

Before committing:

1. Review the final changes in all modified files.
2. Run TypeScript validation using `npx tsc --noEmit`.
3. Run the available relevant tests.
4. Complete the manual testing checklist.
5. Inspect `git diff` to ensure unrelated changes are not included.
6. Confirm the documentation matches the final implementation.

Do not commit, push, merge, or deploy until the changes have been reviewed and the relevant tests have passed.

## 14. Future Maintenance

When changing this feature:

- Update `MatchTheMood.tsx` for banner content or responsive behavior.
- Update `lib/moods/collections.ts` for product group configuration.
- Update `MoodCollectionPage.tsx` for product fetching, filters, pagination, or collection-page state.
- Reuse existing product and filter components wherever practical.
- Verify category and subcategory values against the actual API and product data.
- Update this document whenever implementation behavior, routes, state handling, or testing requirements change.
