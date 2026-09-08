Read:
- AGENTS.md
- docs/DESIGN.md
- docs/UI_REQUIREMENTS.md
- frontend/docs/SCREEN_SPEC.md

Rewrite the **Trip Room → Itinerary** tab so it matches the reference screenshots below, across all applicable room stages: **Planning** (trip building — city search, day timeline, per-item voting, Landmark Detail with 3D/photos) and **Active/Live** (live route map, live member location, AI-suggested transport per leg, exact drop-off points, Reroute). Archived-state locking should reuse the pattern already built for the Discussion tab — do not build a second archived-banner/disabled-state implementation.

Reference screenshots attached (5 images):
1. `Itinerary_Live_ArchivedBanner.png` — Live trip room header + Itinerary tab, showing an **archived banner** — ⚠ inconsistency flagged below, do not build this combination.
2. `Itinerary_Live_SafetyBanner.png` — same Live trip, showing an **AI Safety Check banner** in place of the archived banner.
3. `Itinerary_Planning_DayTimeline.png` — Planning stage: city search bar, illustrative country map, Day 1 timeline/stepper with per-stop vote status, "Complete Planning" CTA.
4. `Itinerary_Planning_LandmarkTransition.png` — same Planning screen with a landmark hero image opened above the day timeline.
5. `LandmarkDetail_3DModel.png` — Landmark Detail screen: 3D-model hero view, History + Notable Facts, "Add to Itinerary" CTA, bookmark icon.

Use:
- `frontend/docs/SCREEN_SPEC.md` for exact layout and component order.
- `DESIGN.md` for styling/tokens — **Units 1–12 and 14 only** (see Design(2).md Unit 13 mismatch below).
- `UI_REQUIREMENTS.md` for acceptance criteria per sub-section.
- `AGENTS.md` for coding rules, folder structure, and the "Explicitly Out of Scope" list.

Context:
- Assume Auth, the core theme, shared components, Global Widgets, and the **Trip Room shell** (season-themed header card, in-room tab row, Planning/Active/Archived stage indicator, Room Settings) already exist — reuse them, do not rebuild.
- Assume the **Discussion tab** (message feed, shared Decision Card component, Propose Vote compose sheet, Archived-locking pattern) is already implemented under `src/features/trip-room/presentation`. The Decision Card component must be reused as-is for any itinerary-triggered voting — do not fork a second card component.
- Data model (from shared schema, mock these shapes — no backend wiring yet):
  - `itinerary_days` — id, room_id, day_number, trip_date, title, notes
  - `itinerary_items` — id, room_id, day_id, name, lat, lng, scheduled_time, category (transportation / attraction / stay), sort_order, tags[], compromise_reason (nullable), booking_url (nullable)
  - `landmarks` — id, name, lat, lng, model_asset_url (nullable), photo_urls[], dropoff_point (lat/lng), info_text, fun_facts[]
  - `decision_cards` — id, room_id, trigger_type (disruption / conflict / safety_risk), safety_alert_id (nullable), options[], status, anonymous, created_at, resolved_at
- Folder placement: Itinerary is core Trip Room functionality, same as Discussion — place Day List, the Day timeline/stepper, Landmark Detail, and the live Route/Map sub-view under `src/features/trip-room/presentation`. If the "AI-suggested transport" leg card is generalizable, put it under `trip-room/presentation/components` so a future reuse in the Maps tab doesn't fork it.

Requirements — Planning stage:
- City/destination search bar above a stylized country-level overview map (see Assumption 1 below) with pins for candidate cities; selecting one focuses that city.
- Day List renders as a vertical timeline/stepper. Each day section shows a day label + Draft/Planning badge, a date + arrival note, and its `itinerary_items` as stepper nodes.
- Each item node shows time, name, a short note, a thumbnail photo, and one of three states:
  - **Voted** — `✓ Voted (x/y agreed)` + "Locked in route" label, read-only.
  - **Pending** — a "Suggest Vote" button.
  - **Candidate stop** — dashed node, "+ Add Details" link, not yet a real `itinerary_items` row.
- Tapping "Suggest Vote" on a Pending item opens the reused Propose Vote compose sheet from Discussion (see Assumption 3 on trigger_type).
- Tapping an item's thumbnail/name opens **Landmark Detail**: a hero area that toggles Photos (default) / 3D model — the 3D toggle is hidden entirely (not an empty state) if `model_asset_url` is null, matching the existing landmark spec — followed by History text, Notable Facts cards, an "Add to Itinerary" primary CTA, and a bookmark icon (see Assumption 4).
- "Complete Planning" CTA at the bottom of the Day List — do **not** wire this to the Planning→Active stage transition. That transition is the Owner-only "Start Trip" action in Room Settings (FR-2-2a). Treat "Complete Planning" as a day/itinerary-level "mark days as finalized" flag only, pending team confirmation of its real semantics.

Requirements — Active/Live stage:
- The Itinerary tab's map area switches to the live route map (reuse the existing Maps-tab implementation, do not fork a second map component) showing: the day's route, a "live" marker, other members' live locations gated by `trip_room_members.location_sharing_opt_in`, and a floating "Reroute" pill.
- A "Suggested Routes" section below the map lists per-leg cards: time + from→to, then 2–3 transport option chips (mode, duration, price) with one AI-picked option visually tagged. Selecting a different chip must not discard the others.
- Each leg card includes an "Exact Drop-off Point" sub-card: thumbnail photo, name, a walk-time note, and a "Street View Verified" checkmark — populate from `landmarks.dropoff_point` when the leg's destination is a known landmark; degrade gracefully (no crash, no placeholder error) when it isn't available.

Do not build:
- A second map engine for the Planning-stage overview — see Assumption 1, flag it rather than guessing the library.
- A second Decision Card component — reuse Discussion's.
- Per-itinerary-item comment threads (already out of scope per Requirements/Page docs).

Known mismatches / assumptions — flag, do not silently resolve:
1. **Two different "maps" in the screenshots.** The Planning-stage overview (search bar + a simplified, illustrative country map with a highlighted city pill) does not match the real Google-Maps-tile look of the Active-stage route map in the other screenshots. Requirements only specify the Google Maps API for route/live-location (Feature 1 / Maps tab). Assumption: build the Planning overview as a lightweight custom/vector map component, not a second live Google Maps instance — flag this for team confirmation.
2. **Archived banner shown on a header badged "Live."** One screenshot shows the room header as "Live" while the tab content shows Discussion's archived banner ("This trip room is archived..."). Archived and Live are mutually exclusive stages. Treat this as a screenshot inconsistency, not a spec to implement — confirm with whoever supplied it which state is correct.
3. **AI Safety Check banner inside Itinerary/Maps.** Not described in Page.md or Requirements, which only place safety content on Home's Recent News (informational tier) and as a `safety_risk` Decision Card in Discussion (actionable tier). This is a third surfacing point. Assumption: implement as a dismissible, read-only banner (no vote), sourced from the same `safety_alerts` feed — flag whether this duplicates Home's Recent News or should replace it while inside a live room.
4. **Per-item vote status has no schema field.** "Voted (x/y agreed)" / "Locked in route" / "Pending" aren't columns on `itinerary_items` or `decision_cards` as currently modeled. Assumption: derive these locally from a linked `decision_card.status` + its `votes` tally rather than adding new schema columns — flag for the team to confirm the real item↔decision_card relationship.
5. **Suggest-Vote trigger_type is ambiguous.** `decision_cards.trigger_type` is constrained to `disruption / conflict / safety_risk`; none clearly fits "should we include this candidate stop." Assumption: default to `conflict` as the closest existing type — flag as a guess, not a resolved decision.
6. **Landmark bookmark icon vs. `starred_trips`.** The bookmark on Landmark Detail doesn't match the `starred_trips` mechanic (which stars Discover posts, not individual landmarks). Assumption: implement as local UI state only, no persistence call, until the team defines landmark-level saving.
7. **Design(2).md Unit 13 IA is still stale** (4-tab nav, Community/Friends) vs. `ReRoute_Page_Refined_v2_2.md` (3-tab, friendship fully removed). Same caveat as the Discussion-tab task: use Design(2).md for tokens/shapes only (Units 1–12, 14), never Unit 13.

Before finishing, summarize:
1. Files changed.
2. Components created/reused (confirm the Planning-stage map is NOT a second Google Maps instance, and that the Decision Card is reused as-is).
3. Assumptions made (Planning map library, item vote-status derivation, Suggest-Vote trigger_type default, safety-banner sourcing, bookmark behavior).
4. Confirmation that no duplicate Trip Room header, tab row, stage indicator, or Global Widget was created.
5. The 7 flagged mismatches above, so the team can confirm each before wireframe/UI review.