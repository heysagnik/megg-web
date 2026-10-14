# Product Detail Independent Gallery Scrolling

## Purpose and user-visible behavior

On desktop product-detail pages, the product image gallery scrolls vertically in its own viewport-height region. Scrolling while the pointer is over the left gallery advances through the product images without requiring the page to move through the full image stack first. The product-information panel no longer captures scrolling in a nested viewport, so scrolling over the right side moves the page through the product information and onward to recommendation shelves.

Each desktop image now fills the full width of the left column without horizontal margins; the progress strip overlays the gallery instead of reserving image width. Images preserve their proportions without stretching. Where an image's aspect ratio differs from the gallery frame, `object-cover` crops the excess to fill the frame. The image progress strip tracks the left gallery's scroll position. Selecting a different product variant returns the gallery to its first image. The mobile swipeable image carousel is unchanged.

## Files Changed

| Status | File | Responsibility in this change |
|---|---|---|
| Modified | `components/product/ProductPageClient.tsx` | Makes the desktop image gallery an independent, viewport-height vertical scroller; fills the complete left-column width with each image without distortion or side margins; overlays the progress strip; makes right-side scrolling advance the page; updates progress tracking and resets the gallery on product or variant changes. |
| Added | `docs/product-detail-independent-gallery-scroll.md` | Records the product-detail gallery interaction and its implementation boundaries. |
| Modified | `docs/README.md` | Adds this behavior record to the website documentation index. |

## Related Files (Not Modified)

- `app/product/[productId]/page.tsx`: renders the product-detail client component for product routes; not changed.
- `components/product/ScrollProgressStrip.tsx`: renders the gallery progress indicator; not changed.
- `components/product/MobileCarousel.tsx`: retains the mobile horizontal swipe behavior; not changed.
- `components/product/ProductShelves.tsx`: renders brand and recommendation shelves after the product-detail layout; not changed.

## Routes and behavior

- Affected route: `/product/[productId]`.
- Before: on desktop, the left image stack contributed its full height to the document, delaying access to recommendation shelves until the image stack had been scrolled through. The right information panel also captured wheel input in its own scroll area.
- After: on desktop, the left gallery is independently vertically scrollable and limited to the viewport height. Each image frame spans the gallery width edge-to-edge, with the progress strip overlaid so it does not narrow the image area. Scrolling over the right side advances the page instead of the information panel capturing the scroll, and the recommendation shelves no longer wait for the complete image stack to scroll past.
- On mobile, the existing horizontal image carousel remains in use.

## Data, performance, and limitations

The gallery continues to use the product and variant image arrays already provided to the product-detail component. Image frames use a 3:4 aspect ratio and images use `object-cover`, preserving the source proportions without stretching; images with other ratios may be cropped to fill the frame. No API, data, dependency, or image-loading behavior is changed. The progress strip uses the gallery's scroll offset normalized by the viewport height, consistent with its prior viewport-based progress scale.

The gallery contains vertical scroll chaining at its boundary so scrolling over it remains focused on the images; users can scroll the page and shelves by moving the pointer to the product-information side. Product information remains in the document flow and can contribute to the page height. This is desktop-only behavior.

## Validation

- Focused ESLint passed with the existing `react-hooks/set-state-in-effect` diagnostic disabled. Without that override, ESLint reports the pre-existing synchronous `setScrollProgress(0)` in the product-change effect (line 56), unrelated to the gallery-scroll change.
- `npx tsc --noEmit -p tsconfig.json` did not pass because generated `.next/types/validator.ts` imports `AppRoutes`, `LayoutRoutes`, `ParamMap`, and `AppRouteHandlerRoutes`, which are absent from generated `.next/types/routes.js`. No type errors were reported in the changed component before the generated-type errors.
