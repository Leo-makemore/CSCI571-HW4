# Process Log — AI Conversations

Mode: Cursor + GPT‑5 Agent Mode

Date: Current Session

--- Entry 1 ---
Role: Assistant
Summary:
- Initialized a React (Vite) + Node/Express project structure for HW3.
- Implemented Ticketmaster proxy endpoints (/api/suggest, /api/events, /api/events/:id).
- Implemented Spotify endpoints (token, /api/spotify/search, /api/spotify/albums/:artistId).
- Implemented MongoDB persistence for Favorites with Atlas.
- Built Search, Event Details (Info/Artists/Venue), Favorites pages; Autocomplete with suggest API.

Validation:
- Local smoke tests for /api/health, /api/suggest, /api/events.
- Verified UI flows: search → details → back to search (state preserved), favorites add/remove.

What was created:
- server/index.js — Express server, API proxy, MongoDB integration
- client/src/pages/SearchPage.tsx — search form, results grid, favorites actions
- client/src/pages/EventDetailsPage.tsx — tabs, seatmap, Spotify, share
- client/src/pages/FavoritesPage.tsx — favorites list + remove
- client/src/components/Autocomplete.tsx — debounced suggest, keyboard nav, clear/toggle
- client/src/contexts/SearchContext.tsx — cross-route state + scroll position
- client/src/index.css — global black/white theme, rounded, soft shadows

--- Entry 2 ---
Role: Assistant
Summary:
- Fixed Shadcn import errors by replacing with custom UI + CSS utilities.
- Simplified theme to black/white with smooth rounded aesthetics.
- Compressed search form to a single-line responsive layout.

Validation:
- Frontend renders with consistent styling; no missing imports.

--- Entry 3 ---
Role: Assistant
Summary:
- Implemented SearchContext to preserve inputs, results, and scroll on back navigation.
- Changed navigation to use react-router (no full page reload).

--- Entry 4 ---
Role: Assistant
Summary:
- Favorites end-to-end: wired frontend to backend; added undo UX and toast notifications.
- Confirmed Favorites persistence in MongoDB (DB: Ticketmaster, Collection: favourites).

--- Entry 5 ---
Role: Assistant
Summary:
- Event Details style pass: tabs to full-width three equal segments; seatmap image when available; softer cards.

--- Entry 6 ---
Role: Assistant
Summary:
- Wrote beginner-friendly README; added this process_log; added AI conversation log for index.html work.

Notes & Lessons
- Keep Ticketmaster calls on server to protect keys.
- Use SearchContext to preserve UX state between routes.
- Atlas IP access must be whitelisted for local dev.

--- Entry 7 ---
Date: 2025-10-29 10:10
Role: Assistant
Topic: Repository bootstrap and environment
Summary:
- Ensured `client` and `server` have isolated package.json files, lock files.
- Added `.gitignore` at repo root to ignore nested node_modules and local env files.
- Clarified `.env` split: server-side secrets only; client uses `VITE_...` vars.
Decisions:
- Avoid Tailwind runtime; keep custom CSS utilities for predictability.
Validation:
- `npm start` (server) and `npm run dev` (client) run concurrently without conflicts.

--- Entry 8 ---
Date: 2025-10-29 10:18
Role: Assistant
Topic: Search UX and validation states
Summary:
- Keyword is required; auto-detect disables location input and clears value.
- Added toast for validation errors; inputs keep focus state.
Diff (conceptual):
- `SearchPage.tsx`: guard clauses before fetch; `toast.error` messages for missing fields.
Risks:
- Over‑validation could annoy users; kept minimal.

--- Entry 9 ---
Date: 2025-10-29 10:26
Role: Assistant
Topic: Ticketmaster category mapping
Summary:
- Mapped UI categories to TM segmentId (Music/Sports/Arts & Theatre/Film/Miscellaneous).
- Only send segmentId when not “All”.
Rationale:
- Keeps broader results by default; narrows only when user selects category.

--- Entry 10 ---
Date: 2025-10-29 10:34
Role: Assistant
Topic: Suggest (Autocomplete) API reliability
Summary:
- Debounce 300ms; skip requests for <2 chars input.
- Handle empty `_embedded.attractions` gracefully.
Edge Cases:
- Network error → silent fallback with empty suggestions.
- Enter/Escape handling improves keyboard users’ flow.

--- Entry 11 ---
Date: 2025-10-29 10:42
Role: Assistant
Topic: Scroll position persistence
Summary:
- Added `scrollPosition` into SearchContext; saved on card click, restored on mount.
Result:
- Returning from details lands user exactly where they left off.

--- Entry 12 ---
Date: 2025-10-29 10:50
Role: Assistant
Topic: Artists tab (Spotify)
Summary:
- Server obtains token with client credentials grant.
- Search each attraction by name; use first matching artist.
- Fetch albums for first artist; grid (2 on mobile, 4 on desktop).
UX Notes:
- Followers localized with `toLocaleString()`.

--- Entry 13 ---
Date: 2025-10-29 10:57
Role: Assistant
Topic: Tabs styling alignment with project theme
Summary:
- Converted to full-width 3-column grid.
- Active state uses white bg + subtle shadow.
Outcome:
- Consistent with black/white rounded theme.

--- Entry 14 ---
Date: 2025-10-29 11:05
Role: Assistant
Topic: Seat Map rendering
Summary:
- If `seatmap.staticUrl` exists show image (object-contain); else placeholder.
Accessibility:
- Added alt text.

--- Entry 15 ---
Date: 2025-10-29 11:13
Role: Assistant
Topic: Favorites API schema
Summary:
- Chosen schema fields: eventId, eventName, eventDate, eventTime, eventVenue, eventImage, eventUrl, createdAt.
- Duplicates guarded by eventId.
Reasoning:
- Sufficient for list UI and detail jumps; minimal write footprint.

--- Entry 16 ---
Date: 2025-10-29 11:21
Role: Assistant
Topic: MongoDB Atlas connection
Summary:
- Use single shared client; select DB `Ticketmaster`, collection `favourites`.
- Added helpful logs on connection success/failure.
Operational Tips:
- Ensure IP allowlist; rotate creds if needed.

--- Entry 17 ---
Date: 2025-10-29 11:30
Role: Assistant
Topic: Error handling philosophy
Summary:
- Don’t swallow errors; log server-side, show friendly client toasts.
- Keep UI recoverable (retry search, toggle suggestions).

--- Entry 18 ---
Date: 2025-10-29 11:38
Role: Assistant
Topic: CSS polish pass
Summary:
- Increased border-radius on cards/buttons; softened shadows.
- Standardized paddings; added utility classes for spacing.
Consistency:
- Avoided arbitrary colors; limited palette ensures coherence.

--- Entry 19 ---
Date: 2025-10-29 11:46
Role: Assistant
Topic: Accessibility quick wins
Summary:
- Added aria-labels to icon buttons in Autocomplete.
- Focus rings consistent; keyboard navigation through list items.

--- Entry 20 ---
Date: 2025-10-29 11:54
Role: Assistant
Topic: Navigation ergonomics
Summary:
- Back to Search uses navigate(-1) to preserve SPA history.
- Favorites page uses navigate to details; search remains unaffected.

--- Entry 21 ---
Date: 2025-10-29 12:02
Role: Assistant
Topic: API boundaries
Summary:
- Ticketmaster strictly server-only to hide key.
- Google Geocoding + IPinfo directly from client as per assignment guidance.

--- Entry 22 ---
Date: 2025-10-29 12:10
Role: Assistant
Topic: Result cards micro-interactions
Summary:
- Hover: lift 1–2px, shadow-md; badge with subtle border.
- Click: saves scroll, navigates.

--- Entry 23 ---
Date: 2025-10-29 12:18
Role: Assistant
Topic: Toast policies
Summary:
- Success toasts for favorite add/remove; remove supports undo pattern in SearchPage.
- Error toasts only when action fails; avoid noise.

--- Entry 24 ---
Date: 2025-10-29 12:26
Role: Assistant
Topic: Code quality guardrails
Summary:
- Avoid deep nesting; early returns in handlers.
- Meaningful var names; explicit function signatures where helpful.

--- Entry 25 ---
Date: 2025-10-29 12:34
Role: Assistant
Topic: Build for production
Summary:
- `client/dist` served by Express static in production.
- Single origin simplifies CORS when deployed.

--- Entry 26 ---
Date: 2025-10-29 12:42
Role: Assistant
Topic: Git workflow tips
Summary:
- Feature branches per area; small PRs easier to review.
- Conventional commits recommended.

--- Entry 27 ---
Date: 2025-10-29 12:50
Role: Assistant
Topic: Edge cases — Events without images
Summary:
- Use placeholder images; keep layout intact.
- Avoid CLS by fixing image containers’ heights.

--- Entry 28 ---
Date: 2025-10-29 12:58
Role: Assistant
Topic: Autocomplete UX
Summary:
- Toggle (▲/▼) and clear (✕) inside input aligned right; centered vertically.
- List item spacing increased; truncate long names.

--- Entry 29 ---
Date: 2025-10-29 13:06
Role: Assistant
Topic: API rate considerations
Summary:
- Debounce and short-circuit for short terms reduce suggest hits.
- Limit albums to 8 to minimize Spotify calls.

--- Entry 30 ---
Date: 2025-10-29 13:14
Role: Assistant
Topic: Favorites consistency across pages
Summary:
- SearchPage loads favorites IDs set on mount to display heart filled state.
- Details toggling updates state immediately (optimistic), with server write.

--- Entry 31 ---
Date: 2025-10-29 13:22
Role: Assistant
Topic: Defensive coding in server
Summary:
- Validate required params; return 400 with message.
- Try/catch around external fetch; return 500 with generic error.

--- Entry 32 ---
Date: 2025-10-29 13:30
Role: Assistant
Topic: Seat map placeholder design
Summary:
- Neutral grey panel with emoji; matches overall style.
- Prevents blank space when seat map absent.

--- Entry 33 ---
Date: 2025-10-29 13:38
Role: Assistant
Topic: Lint pass and escapes in CSS utilities
Summary:
- Fixed escaped class selectors like `md\:grid-cols-2`.
- Avoided duplicate utility definitions.

--- Entry 34 ---
Date: 2025-10-29 13:46
Role: Assistant
Topic: Error banners
Summary:
- Unified error card style for SearchPage (red-50 background, border-red-200).
- Clear, concise copy.

--- Entry 35 ---
Date: 2025-10-29 13:54
Role: Assistant
Topic: Time formatting
Summary:
- 12-hour time with minutes; include AM/PM.
- Fallback when time missing.

--- Entry 36 ---
Date: 2025-10-29 14:02
Role: Assistant
Topic: Accessibility — buttons vs links
Summary:
- Buy Tickets uses `<button>` in card to avoid nested anchor conflicts; opens TM in new tab.
- Proper `rel="noopener noreferrer"` on external anchors.

--- Entry 37 ---
Date: 2025-10-29 14:10
Role: Assistant
Topic: Backend logging
Summary:
- morgan dev logger enabled; logs GET/POST/DELETE with status.
- Helpful for quick debugging of /api/favorites reachability.

--- Entry 38 ---
Date: 2025-10-29 14:18
Role: Assistant
Topic: Security posture
Summary:
- Keys only in server/.env; never in repo.
- Spotify access token not logged.

--- Entry 39 ---
Date: 2025-10-29 14:26
Role: Assistant
Topic: Favorites undo behavior
Summary:
- Undo implemented in SearchPage via toast action; re‑adds to server.
- Details page keeps behavior simple (toggle only) to reduce complexity.

--- Entry 40 ---
Date: 2025-10-29 14:34
Role: Assistant
Topic: Deploy strategy
Summary:
- App Engine simple deploy via app.yaml; or containerize for Cloud Run.
- Single service hosting both API and static assets.

--- Entry 41 ---
Date: 2025-10-29 14:42
Role: Assistant
Topic: Testing checklist
Summary:
- Manual smoke tests: suggest, search happy path, details tabs, seat map presence, favorites add/remove, refresh persistence.

--- Entry 42 ---
Date: 2025-10-29 14:50
Role: Assistant
Topic: Future work — E2E tests
Summary:
- Consider Playwright smoke flows (search→details→favorite→favorites page).

--- Entry 43 ---
Date: 2025-10-29 14:58
Role: Assistant
Topic: Performance nits
Summary:
- Limit images’ sizes via CSS; defer heavy parts.
- Minimal rerenders via state coalescing in SearchContext.

--- Entry 44 ---
Date: 2025-10-29 15:06
Role: Assistant
Topic: Code comments
Summary:
- Added comments only where rationale non-obvious (e.g., tab layout choices).

--- Entry 45 ---
Date: 2025-10-29 15:14
Role: Assistant
Topic: README expansion
Summary:
- Added API Reference, Data Model, FAQ, GitHub workflow, Roadmap, Quality checklist.



