# MEGG Web Documentation

This folder documents website behavior, architecture boundaries, operational decisions, and implementation changes. It is specific to `megg-web`; shared API and mobile-app behavior are documented as dependencies, not owned by this project.

## Documents

- [Website pagination](./website-pagination.md): current numbered pagination behavior, affected routes, request flow, performance considerations, validation, and integration boundaries.
- [Hero video replacement](./hero-video-asset-replacement.md): records the homepage hero asset URL changes, playback behavior, source URL construction, and performance validation requirements.
- [Under ₹699 banner background](./under699-banner-background.md): records the Cloudflare image background, foreground 3D-style text treatment, files changed, and performance validation notes.
- [Website multi-select filters](./website-multi-select-filters.md): records checkbox filters across browse/search, category-scoped Under ₹699 facets, API serialization, and the temporary homepage sale-banner hide.
- [Homepage sections and banners](./homepage-sections-and-banners.md): records the Under ₹699/Special Offers visibility swap and shared responsive heading alignment.

- [Match The Mood banners](./match-the-mood.md): records the gender-specific Formal, Luxury, and sports-focused Athleisure homepage links.

- [Search bar clear behaviour](./search-bar-clear-behavior.md): records the clean focus and full-reset interaction for Search.

- [Sidebar navigation typography](./sidebar-navigation-typography.md): records the category menu typography refinement.

- [Category row card layout](./category-row-card-layout.md): records the five-card desktop category-rail layout.

- [Five-card homepage rails](./five-card-home-rails.md): records the shared five-card desktop layout for Category and Trending.

- [Product detail independent gallery scrolling](./product-detail-independent-gallery-scroll.md): records desktop gallery scrolling independently from the product details and recommendations.

## Documentation rule

For each functionality implemented or changed on the website, create or update a dedicated record containing:

- Purpose and user-visible behavior.
- A **Files Changed** list with repository-relative paths and each file's status (`added`, `modified`, or `removed`), plus its specific responsibility in the change.
- A separate **Related Files** list for files inspected, depended on, or involved in the flow but not modified. State explicitly that these files were not changed.
- Affected routes, behavior before and after, API/data assumptions, performance considerations, validation performed, and known limitations.

Keep file paths scoped to the correct repository. A shared backend or mobile-app file must not be listed as changed unless that repository was actually modified. Distinguish verified behavior from assumptions, and do not imply that an app behavior changed merely because the website uses a shared API.
