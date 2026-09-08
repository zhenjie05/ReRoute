Read:
- AGENTS.md
- docs/DESIGN.md
- docs/UI_REQUIREMENTS.md
- frontend/docs/SCREEN_SPEC.md

Rewrite the **Trip Room → Album** tab so it matches the reference screenshots below: a day-grouped photo grid with an Upload action, and a full-screen photo lightbox/carousel with uploader attribution and like/share actions.

Reference screenshots attached (2 images):
1. `Album_Grid_DayGrouped.png` — Album tab main view: "Shared Photos" header + orange "Upload" pill top-right, photos grouped under day headers ("DAY 4 · KYOTO", "DAY 3 · TOKYO"), 3-column grid, an overflow tile ("+12 more") on days with more photos than fit.
2. `Album_PhotoDetail_Lightbox.png` — full-screen photo detail: dark scrim, close (X) top-right, left/right arrows to page through the set, uploader name ("Sarah K.") + relative timestamp ("2 hours ago") bottom-left, a share icon bottom-right. **[CHG]** The reference screenshot also shows a heart/like icon next to share — per team decision, do not implement it (see Known mismatches below); share is the only bottom-right action.

Use:
- `frontend/docs/SCREEN_SPEC.md` for exact layout and component order.
- `DESIGN.md` for styling/tokens — Units 1–12 and 14 only (Unit 13 IA is stale, same caveat as prior tasks).
- `UI_REQUIREMENTS.md` for acceptance criteria per sub-section.
- `AGENTS.md` for coding rules, folder structure, and the "Explicitly Out of Scope" list.

Context:
- Assume Auth, the core theme, shared components, Global Widgets, and the Trip Room shell (header card, in-room tab row, stage indicator, Room Settings) already exist — reuse, do not rebuild.
- Data model (mock these shapes — no backend wiring yet):
  - `photos` — id, room_id, itinerary_day_id (nullable), uploader_id, url, taken_at (EXIF), lat (nullable), lng (nullable), created_at
- Folder placement: same convention as Discussion/Itinerary — place the photo grid, day-group header, upload sheet, and lightbox/carousel under `src/features/trip-room/presentation`.

Requirements — Grid view:
- Fetch the room's `photos`, group by `itinerary_day_id` (fall back to a date-derived "Unsorted"/location group if a photo has no day tag), most recent day first, each group headed by a "DAY N · LOCATION" label.
- Render each group as a 3-column grid. If a group has more than 4 photos, show the first 4 photo cells plus a 5th "+N more" overlay tile (N = remaining count beyond the 4 shown); tapping it opens the full gallery for that day rather than the lightbox directly. Groups with 4 or fewer photos render with no overlay tile.
- "Upload" pill button in the header opens the upload flow (camera/library picker). Since this entry point isn't tied to a specific Day Detail view, auto-resolve the uploaded photo's `itinerary_day_id` from its EXIF `taken_at` against the room's day date ranges; if no day matches, file it under the fallback "Unsorted" group rather than blocking the upload.

Requirements — Photo detail (lightbox):
- Tapping any grid photo opens a full-screen carousel starting at that photo, swipeable/arrow-navigable within the same day group's photo set.
- Show uploader name + a relative timestamp ("2 hours ago") resolved from `uploader_id` + `created_at`.
- A single share icon, wired per Assumption 1 below. No like/favorite affordance — confirmed cut, do not implement it even though the reference screenshot shows one.
- Close (X) returns to the grid at the same scroll position.

Do not build:
- A duplicate Trip Room header, tab row, or stage indicator.
- A per-itinerary-item comment thread (out of scope, unrelated to Album regardless).
- A second upload flow inside Day Detail — if one already exists there per Itinerary Day Detail spec (tagging the photo with that `itinerary_day_id` directly), reuse the same upload component/hook here instead of forking it.

Known mismatches / assumptions — flag, do not silently resolve:
1. **Share icon isn't in Page.md's Album bullet at all.** Assumption: wire it to the OS-level share sheet (e.g. React Native `Share` API) to export/share the image outside the app — not a custom in-app share/repost feature. Flag for confirmation.
2. **Archived-state Album isn't shown in any reference screenshot** (both screenshots show a "Live" header badge). Assumption: apply the same Archived-locking convention used elsewhere in Trip Room — hide/disable the Upload button and the share action, keep the grid and lightbox fully viewable (read-only history) — but this is inferred, not confirmed by a screenshot. Flag before building it.
3. **5-cell grid cap is inferred from the screenshot, not stated in any doc.** The exact "4 photos + overflow tile" threshold is a guess based on counting the reference image; confirm with design whether it should instead be a fixed row count (e.g. always exactly one row) responsive to screen width.
4. **Design(2).md Unit 13 IA is still stale** (4-tab nav, Community/Friends) vs. `ReRoute_Page_Refined_v2_2.md` (3-tab, friendship fully removed) — same caveat as prior tasks: use Design(2).md for tokens/shapes only (Units 1–12, 14), never Unit 13.

**Resolved (no longer open):** Like/favorite icon on Album photos — team decision is to cut it entirely; the reference screenshot's heart icon is not implemented. Album's only per-photo interaction is share.

Before finishing, summarize:
1. Files changed.
2. Components created/reused (confirm no second upload flow was forked if one already exists in Itinerary Day Detail).
3. Assumptions made (share behavior, Archived-state locking, grid overflow threshold).
4. Confirmation that no duplicate Trip Room header/tab row/stage indicator/Global Widget was created, and that no like/favorite affordance was added.
5. The 4 flagged mismatches above, so the team can confirm each before wireframe/UI review.