# Homepage Hero Video Asset Replacement

## Record

The homepage hero video sources were changed in `components/home/HeroSection.tsx`:

| Panel | Previous configured asset | Current configured asset |
|---|---|---|
| Left | `https://media.meggfashion.in/web_hero/hero1` | `https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner1.MP4` |
| Right | `https://media.meggfashion.in/web_hero/hero2` | `https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner3.mp4` |

The media host changed from `media.meggfashion.in` paths to direct public Cloudflare R2 URLs. The MP4 `<source>` now uses the configured URL as-is instead of appending `.mp4`. The homepage hero includes small, regular-weight black Men/Women labels and unbordered Shop now links, centered at the bottom of their respective panels. There is no bottom gradient or text shadow. When one panel is hovered and playing, the paused panel receives a subtle black overlay; both videos resume without dimming when the pointer leaves the banner. This record describes the current repository source; it does not verify whether the remote assets are live, playable, or byte-for-byte the intended videos.

## Files Changed

| Status | File | Responsibility in this change |
|---|---|---|
| Modified | `components/home/HeroSection.tsx` | Configures the two hero videos and their WebM/MP4 sources; renders small black Men and Women labels centered at the bottom with unbordered Shop now links to `/` and `/women`; dims the paused video panel during hover without a bottom gradient or text shadow. |
| Modified | `docs/hero-video-asset-replacement.md` | Records panel-link behavior, centered black text styling, paused-panel dimming, responsive visibility, related routes, and updated performance considerations. |

## Related Files (Not Modified)

These files were inspected to understand URL handling, route destinations, and where the hero is rendered; they were not modified for the video/link update:

- `lib/image.ts`: `getCdnVideoUrl()` returns absolute URLs unchanged; it does not optimize or transcode them.
- `app/page.tsx`: renders the default Men homepage at `/`; not changed.
- `app/women/page.tsx`: renders the Women homepage at `/women`; not changed.
- `app/_gender/home.tsx`: renders shared gender-specific homepage content containing the hero section; not changed for the video/link update.
- `public/` assets: no local video assets were added or changed by this URL replacement.

## Current Playback Behavior

Current hero playback and panel behavior:

- Both video elements are muted, autoplaying, looping, and use `playsInline`.
- Both declare `preload="auto"`.
- The Men panel is on the left with its label and Shop now link centered at the bottom; the link returns to `/`.
- The Women panel is on the right with its label and Shop now link centered at the bottom; the link navigates to `/women`.
- Both video panels and links remain visible on narrow screens and desktop.
- Labels and links use small regular-weight black text. Shop now has no border, and there is no bottom gradient or text shadow.
- Hovering a panel pauses the other panel and attempts to play the hovered one; the paused panel gets a subtle black overlay. Leaving the banner resumes both videos and clears the overlay.
- The browser is offered WebM first, followed by MP4 as a fallback.

`getCdnVideoUrl()` in `lib/image.ts` returns absolute URLs unchanged. It does not currently perform format conversion, compression, resizing, or CDN transformation for these absolute R2 URLs.

The nearby source comment in `HeroSection.tsx` refers to `q_auto:low` and `vc_auto`. Those options are not applied by the current `getCdnVideoUrl()` implementation for the configured absolute R2 URLs, so do not use that comment as evidence that the replacement assets are automatically optimized or transcoded.

## Important WebM URL Detail

The WebM source is constructed by appending `.webm` to each configured source string. With the current values, the browser is therefore asked for:

- `https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner1.MP4.webm`
- `https://pub-c1be4f1247d5405a8678960f074cc084.r2.dev/banner3.mp4.webm`

The MP4 fallback URLs are the configured `banner1.MP4` and `banner3.mp4` URLs. The repository does not establish that the derived WebM objects exist. Validate these requests in browser Network tools or against the object store. If they do not exist, the browser will incur a failed WebM request before falling back to MP4; correct the asset mapping in a separate code change rather than assuming automatic transcoding occurs.

## Performance and Quality Considerations

The source replacement alone does not demonstrate equal or improved performance. The current markup preloads both videos automatically, and both panels now remain visible on narrow screens as well as desktop. This can increase initial media transfer on mobile compared with hiding the right panel. Direct R2 URLs are not transformed by `getCdnVideoUrl()`, and the repository contains no measured asset sizes, bitrate, resolution, startup time, or playback-error results for the replacement files.

Before making a performance claim or treating the video update as validated, check:

1. Both intended MP4 URLs return successfully with the expected `Content-Type`, duration, dimensions, and encoding.
2. The derived WebM URLs either exist and play, or are intentionally omitted/fixed in a separately reviewed implementation change.
3. Mobile and desktop loading behavior with both videos visible, including whether both are downloaded immediately.
4. Transfer size and playback startup against the previous assets in a production-like environment, including a throttled mobile network.
5. Console and media errors, autoplay behavior, and visual correctness at desktop and mobile breakpoints.

Do not state that the replacement has no performance impact until those checks are performed. Any follow-up that changes source selection, preload policy, encoding, or responsive loading remains a website-only change, but should be measured and recorded separately.

## Ownership Boundary

This is a homepage website asset/configuration change. No shared backend endpoint, database schema, or mobile-app code is involved. The asset URLs point directly to public R2 objects; their availability and cache behavior are external runtime dependencies.

## Validation Status

- Repository inspection confirmed the configured source URLs, source-element URL construction, Men/Women homepage routes, and homepage hero rendering path.
- Focused ESLint passed for `components/home/HeroSection.tsx`.
- Visual browser validation was not performed because no local preview server was available during this change.
- Remote asset availability, WebM existence, playback, transfer size, and production performance have not been verified as part of this documentation update.