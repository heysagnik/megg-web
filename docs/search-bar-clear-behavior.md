# Search bar clear behaviour

## Purpose and user-visible behaviour

The Search field now uses the URL's current `query` value as its only displayed search term. Clicking the clear control cancels pending debounced searches, removes the query and all active filters, hides suggestions, and keeps focus in the empty field. Simply focusing the field does not trigger a search. Selected-filter chips and the redundant mobile category strip no longer render beneath the sticky search field, preventing long labels from wrapping and distorting the search header. Mobile filters remain available from the fixed bottom Filters control. On desktop, the category and sort rails are pinned below the full sticky header, so their first item cannot be obscured by the search field.

## Affected route

- `/search`: the input, active-search state, result chips, and clear interaction.

Before this change, the input could briefly restore an old term from the previous API response and a delayed debounced update could reapply it after the user cleared the field. The clear control now has a dedicated reset path.

## Files changed

| Status | File | Responsibility |
| --- | --- | --- |
| Modified | `app/search/SearchClient.tsx` | Provides separate callbacks for clearing filters while retaining a query and clearing the entire search. |
| Modified | `components/search/SearchLayout.tsx` | Cancels stale timers, removes automatic focus, uses URL state for the displayed term, adds the full clear interaction, removes the layout-disrupting filter-chip row, and correctly offsets desktop side rails below the sticky header. |
| Added | `docs/search-bar-clear-behavior.md` | Documents the behaviour, affected route, implementation, and validation. |
| Modified | `docs/README.md` | Links this record from the documentation index. |

## Change log

| Change | Files modified | What changed |
| --- | --- | --- |
| Search reset | `app/search/SearchClient.tsx`, `components/search/SearchLayout.tsx` | Added a full-reset callback that clears the query and filters together; cancelled delayed client-side searches; removed automatic field focus; and made the input display URL state only. |
| Header cleanup | `components/search/SearchLayout.tsx` | Removed the visible selected-filter chip row and redundant mobile category strip below the search field, leaving a single clean header. |
| Desktop rail alignment | `components/search/SearchLayout.tsx` | Offset the Category and Sort side rails below the entire sticky search header, reduced their viewport height accordingly, and top-aligned their content so it cannot be clipped. |
| Documentation | `docs/search-bar-clear-behavior.md`, `docs/README.md` | Added and indexed this record. |

## Related files (not changed)

- `hooks/useSearch.ts`: owns URL mutation, request cancellation, and the existing `clearAll` operation.
- `lib/api.ts`: sends the existing search query to the API.
- `megg-api/cloudflare-worker/src/routes/search.js`: existing backend search handler; not changed.

## Performance and reliability

- Cancelling both autocomplete and query debounce timers prevents stale client-side searches after Clear.
- No endpoint, package, or additional request is introduced.
- The search request hook continues to abort superseded network requests.

## Validation

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint app/search/SearchClient.tsx components/search/SearchLayout.tsx`
