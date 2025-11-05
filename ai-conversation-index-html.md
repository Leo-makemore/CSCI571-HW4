AI Conversation Log - index.html (Reference Styling Work)
=======================================================

Date: Current Session
File: templates/index.html (reference log adapted for this project)

Conversation 1: Redo styling to match screenshot
------------------------------------------------
User Request:
"Remove existing styling, redo to match dark theme with stacked fields and clear/submit."

Changes:
- Replaced CSS with a dark themed layout, teal labels, red asterisks for required fields.
- Grid layout for keyword, distance/category, location/auto-detect, buttons.
- Responsive behavior for mobile.

Conversation 2: Move category field to right alignment
-----------------------------------------------------
Changes:
- CSS update to right-align category group relative to keyword input.

Conversation 3: Fix ipinfo.io JSONP response parsing
---------------------------------------------------
Changes:
- Robust JSONP extraction via regex to capture first JSON object.
- Populate location with "City, Region, Country"; fallback to lat,lon.

Conversation 4: User styling updates
-----------------------------------
Changes:
- Added background image, widened container, separate results container, larger category dropdown.

Conversation 5: Hide location when auto-detect is checked
---------------------------------------------------------
Changes:
- Toggle display for location input while still storing value for submission.

Conversation 6: Table sorting and clickable event names
-------------------------------------------------------
Changes:
- Added sortable headers (Date/Event/Genre/Venue) with indicators.
- Made Event cell clickable to fetch and show details.

Conversation 7: Hide results initially and on clear
--------------------------------------------------
Changes:
- Results container hidden by default; shown when data present.

Conversation 8: Hidden ID column + key-value detail display
-----------------------------------------------------------
Changes:
- Hidden ID column to bind record.id.
- Details section renders key-value pairs, link/image handling, scrolling.

Conversation 9: Parse TM event details into structured view
-----------------------------------------------------------
Changes:
- Extract Date, Artist/Team, Venue, Genres, Ticket Status, Buy Ticket At, Seat Map.
- Two-column layout: info and seat map.

Conversation 10: Ticket status styling and visual polish
-------------------------------------------------------
Changes:
- Removed extra titles/edges; added status color mapping (on/off sale, canceled, postponed, rescheduled).

Conversation 11: Enhanced genre extraction
-----------------------------------------
Conversation 12: Color tokens and spacing scale
----------------------------------------------
Changes:
- Introduced semantic tokens: primary text (#111827), secondary text (#4b5563), muted bg (#f3f4f6).
- Normalized spacing: 4/8/12/16/24 px; consistent paddings on containers.

Conversation 13: Button states and focus rings
---------------------------------------------
Changes:
- Added :hover lift and :active press styles.
- Focus ring 2px, semi-opaque dark for accessibility.

Conversation 14: Mobile layout tuning
-------------------------------------
Changes:
- Reduced padding on small screens; stacked rows fully.
- Increased tap targets for buttons to 44px min height.

Conversation 15: Typography rhythm
----------------------------------
Changes:
- Headings tightened line-height; body text at 14px baseline.
- Consistent `leading-tight` for card titles.

Conversation 16: Table zebra striping (optional)
-----------------------------------------------
Changes:
- Introduced subtle row hover background; kept zebra off by default.

Conversation 17: Empty state visuals
-----------------------------------
Changes:
- Added neutral illustration emoji and concise copy for no-results and no-details cases.

Conversation 18: Loading skeletons
----------------------------------
Changes:
- Skeleton blocks for title, table, and details sections using animate-pulse.

Conversation 19: Form error display
----------------------------------
Changes:
- Inline error message below inputs when validation fails, minimal red tint.

Conversation 20: Dark vs light consideration
-------------------------------------------
Changes:
- Stuck to black/white requirement; avoided colored accents except status/links.

Conversation 21: Iconography
----------------------------
Changes:
- Placeholder emojis for Search, Heart, ExternalLink, Arrow; lucide can replace later.

Conversation 22: Autocomplete list density
------------------------------------------
Changes:
- Increased vertical padding of items; added divider between rows; truncate long names.

Conversation 23: Keyboard interactions
-------------------------------------
Changes:
- ArrowUp/Down to move active; Enter to select; Esc to close; preserves typed value.

Conversation 24: Click-outside behavior
--------------------------------------
Changes:
- Global mousedown listener; closes dropdown when clicking elsewhere.

Conversation 25: Panels and cards
---------------------------------
Changes:
- Unified subtle borders (#e5e7eb) and white background; rounded-xl radius for main cards.

Conversation 26: Grid breakpoints
---------------------------------
Changes:
- 1 column on mobile, 2 on md, 3 on lg for results grid; avoids overflow.

Conversation 27: Badge styling
------------------------------
Changes:
- Category badge uses grey background with thin border; pill shape.

Conversation 28: Link styling
-----------------------------
Changes:
- External links show subtle underline on hover; color stays within gray/black palette.

Conversation 29: Seat map container
----------------------------------
Changes:
- White background, thin border, padding; image uses object-contain to prevent cropping.

Conversation 30: Share buttons area
----------------------------------
Changes:
- Even spacing and consistent sizes; distinct brand colors for clarity.

Conversation 31: Consistency audit
----------------------------------
Changes:
- Reviewed margins/paddings across sections; removed stray mismatches.

Conversation 32: Focus order
----------------------------
Changes:
- Ensured logical tab order through form and dropdown controls.

Conversation 33: Screen reader text for icons
---------------------------------------------
Changes:
- Added aria-labels on icon-only controls within input.

Conversation 34: State persistence edge cases
--------------------------------------------
Changes:
- Guard against undefined results during restore; no errors thrown.

Conversation 35: Microcopy polish
---------------------------------
Changes:
- Simplified button and helper texts for clarity and tone.

Conversation 36: Performance — avoid layout thrash
-------------------------------------------------
Changes:
- Avoid repeated style writes; batch state updates in React where possible.

Conversation 37: CSS utility dedupe
-----------------------------------
Changes:
- Removed duplicate `.text-xs`, `.bg-gray-100` definitions to reduce confusion.

Conversation 38: Print styles (basic)
------------------------------------
Changes:
- Ensured details content remains legible when printed (basic reset).

Conversation 39: Seat map fallback text
--------------------------------------
Changes:
- Clarified message; consistent iconographic language.

Conversation 40: Buttons inside input
------------------------------------
Changes:
- Right-aligned inline controls; ensured click targets don’t overlap text selection.

Changes:
- Also consider type/subtype; skip "undefined" and duplicates; join with " | ".


