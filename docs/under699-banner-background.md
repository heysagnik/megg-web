# Under ₹699 Banner Background

## Purpose and scope

This record documents the website homepage Under ₹699 banner update. The supplied Cloudflare image is used as a decorative background; the banner text and call to action remain foreground content. The heading uses layered text shadows for a restrained extruded/3D appearance.

This is a `megg-web` presentation change only. It does not alter the shared API, backend, database, or mobile-app behavior.

## User-visible behavior

- The banner displays `https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/699Banner.png` behind its existing eyebrow, heading, subtitle, and Shop Now link.
- A semi-transparent black overlay is placed between the image and text to maintain contrast across different image areas.
- The heading has multiple shadow layers to create visual depth.
- The banner remains a normal-flow section; the image and overlay are absolutely positioned inside it, so they do not add layout height.
- The CTA still routes through the existing gender-aware `/under699` path.

## Files Changed

| Status | File | Responsibility in this change |
|---|---|---|
| Modified | `components/home/Under699Banner.tsx` | Adds the background image, dark contrast layer, foreground stacking, and heading depth styling. |
| Modified | `docs/README.md` | Links this feature record from the documentation index. |
| Added | `docs/under699-banner-background.md` | Records behavior, file ownership, performance choices, and validation limits. |

## Related Files (Not Modified)

These files were inspected or participate in rendering/navigation but were not modified for this functionality:

- `app/_gender/home.tsx`: renders the banner on the homepage.
- `app/under699/page.tsx` and the gender-specific Under ₹699 route wrappers: render the destination listing; these are not changed by the banner artwork.
- `lib/genderPath.ts`: existing helper used by the CTA to choose the gender-aware destination.
- `next.config.ts`: image optimization is configured as unoptimized; no optimizer request was introduced.
- Cloudflare R2 object `699Banner.png`: externally hosted asset; it is not a repository file. Its dimensions and transfer size were checked during this change, but its production cache behavior was not verified.
- Backend and mobile-app repositories: not changed or validated for this UI update.

## Performance considerations

- The image is rendered as a decorative `<img>` with empty alt text and `aria-hidden="true"`.
- Native `loading="lazy"`, `decoding="async"`, and low fetch priority are used because the banner appears below the homepage hero. This is intended to defer work until the banner approaches the viewport.
- The image is not routed through Next Image Optimization; project configuration sets `images.unoptimized: true`. No new package, API call, image proxy, JavaScript observer, or client-side state was added.
- The absolute image layer does not affect document flow or add a second image-sized layout region.
- Lazy loading limits eager work but does not make a large source file small. Browser inspection confirmed the source is 2048 x 768. A HEAD request reported `Content-Length: 1657977` bytes (about 1.58 MiB) and no `Cache-Control` or `Age` response header. This means the exact transfer size is material for users who scroll to the banner; mobile devices currently download the same full source.
- For a high-traffic production deployment, upload a properly compressed responsive derivative (for example WebP/AVIF variants) to the production asset domain/CDN, ensure long-lived edge caching, and use a mobile-appropriate source. Keep the current lazy loading, but do not claim zero performance impact until payload and cache behavior have been optimized and measured.

## Ownership and integration boundaries

The website owns the banner markup and visual styling. The R2 object host owns asset availability and delivery. No shared API contract, backend service, or mobile client is involved.

## Validation status

- `npx eslint components/home/Under699Banner.tsx` passed.
- `npx tsc --noEmit -p tsconfig.json` passed after regenerating stale Next.js route type artifacts with `npx next typegen`.
- Local browser inspection at mobile and desktop widths confirmed the remote image loaded, with natural dimensions 2048 x 768, and the text/CTA were layered over it.
- A HEAD request to the supplied URL returned HTTP 200 and `Content-Type: image/png`, `Content-Length: 1657977`; `Cache-Control` and `Age` headers were absent from that response.
- Production CDN edge behavior, repeat-request caching, image compression/responsive variants, and real-user performance have not been verified.

## Release checks

- Load the homepage at desktop and mobile widths and verify the complete banner crop, text contrast, 3D shadow, and CTA visibility.
- Confirm the image request succeeds and inspect its transfer size, content type, and cache headers.
- Confirm the image request is deferred while the banner is well below the viewport and starts near the banner viewport boundary.
- Replace the 1.58 MiB PNG with appropriately compressed responsive assets and configure/verify production cache behavior before a high-traffic release.
- Compare page-load and mobile-network behavior against a baseline before claiming no performance regression.
- Verify the `/under699` CTA destination for both gender contexts.