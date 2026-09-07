# ReRoute — Refined Feature Requirements Document (v2.2)

*CodeNection 2026 — Lifestyle Track: Planning an Escape*

Purpose: shared source of truth for Feature 0 (Auth) and Features 1–8, refined against `ReRoute_Feature_Updates.md`. Each feature now lists **Functional Requirements (FR)** and **Non-Functional Requirements (NFR)** separately for clarity.

Legend: **Real** = build fully working for demo. **Mocked** = simulated for demo. **TBD** = team must confirm before building. **[NEW]** = introduced by the update doc. **[CHG]** = existing requirement changed by the update doc. **[CUT]** = considered but placed out of scope. **[OUT OF SCOPE]** = explicitly not built for this demo. **[REMOVED]** = fully cut from scope and data model in this revision.

**v2.1 changelog** (applying `ReRoute_Review_Suggestion.md`): resolved the 3 Blockers and the Requirements-side High items from that review — added FR-1-0 (AI Chatbox), FR-1-3a (Preferences soft-gate default), FR-1-9 banner/decision-card severity tiering, FR-2-2a (Planning→Active trigger), FR-2-6a (manual decision-card creation), FR-2-9a (mixed-currency flagging), FR-2-10/2-10a (member removal cut + Room Settings screen), FR-8-2 follow mechanic cut, FR-9-3a (mascot/budget dependency), reworded FR-1-8's continuous/polling language, and updated the Section 14 dependency table and relevant Build Scope lines accordingly.

**v2.2 changelog**: (1) Friendship feature **fully removed** — `friendships` table dropped, FR-8-2 removed, Discover feed is now public-only (no friend-scoped view). (2) Added booking/ticketing deep-links to Modular Suggestions (FR-1-4a) and `booking_url` to `itinerary_items`. (3) Added Recent News personalization (FR-NAV-6): news/safety content on Home is now filtered to the user's own existing trip destinations, not shown globally.

---

## 1. Tech Stack

- Frontend: React Native (Expo)
- Backend: Supabase — Postgres + PostGIS (geospatial: live location, routes, landmarks)
- Auth: Supabase Auth
- Realtime: Supabase Realtime (chat, voting, live location, decision cards, mascot notifications)
- Storage: Supabase Storage (photos, album, 3D/photo assets)
- Maps: Google Maps API (Directions, Places)
- Weather: **[NEW]** a weather API (e.g. OpenWeather) — drives dynamic Trip Room theming based on current season and safety/weather risk analysis. Provider TBD.
- Translation: **[NEW]** a translation API (e.g. Google Translate API) for the real-time translator. Provider TBD.
- AI text tasks (itinerary generation, mascot messages, safety summarization): provider TBD — Claude or OpenAI, kept consistent across features.
- OCR / receipt extraction: TBD — multimodal AI vision API or dedicated OCR service + AI structuring.

---

## 2. Shared Data Model (high-level, updated)

- `users` — id, email, auth_provider, name, avatar, home_country, created_at
- `trip_rooms` — id, name, destination, stage (planning/active/archived), created_by, start_date, end_date, theme_color, is_public
- `trip_room_members` — room_id, user_id, role, location_sharing_opt_in (bool), joined_at, is_live_for_user (bool)
- `trip_preferences` — **[NEW]** room_id, companions (solo/family/couple/friends/elderly), travel_style (cultural/classic/nature/cityscape/historical), travel_pace (ambitious/moderate/relaxed), updated_at
- `itinerary_items` — id, room_id, day_id, name, lat, lng, scheduled_time, category **[CHG: constrained to transportation / attraction / stay]**, sort_order, tags[], compromise_reason (nullable), **booking_url (nullable) [NEW — external hotel booking / transport ticket link, populated for suggested Accommodation/Transportation items, FR-1-4a]**
- `itinerary_days` — **[NEW]** id, room_id, day_number,trip_date, title (editable), notes (text)
- `decision_cards` — id, room_id, trigger_type (disruption / conflict / **safety_risk [NEW]**),safety_alert_id (nullable FK → safety_alerts), options[], status, anonymous (boolean), created_at, resolved_at
- `votes` — id, decision_card_id, user_id (hidden if anonymous), chosen_option
- `messages` — id, room_id, sender_id (nullable), sender_type (user / system / **mascot [NEW]**), text, type, created_at
- `budget_categories`- id, room_id, category_name, planned_amount
- `expenses` - id, room_id, category_id, description, total_amount, currency, paid_by[], receipt_url, created_by, created_at
- `expense_splits` - id, expense_id, user_id, split_type, share_value, amount_owed
- `receipt_scans` - id, expense_id, image_url, ocr_status, extracted_data (json)
- `settlements` — id, room_id, from_user_id, to_user_id, amount, method, settled_at
- `album_photos` — id, room_id, uploaded_by, url, taken_at, lat, lng, itinerary_day_id (nullable FK)
- `landmarks` — id, name, lat, lng, model_asset_url (nullable), **photo_urls[] [CHG: prioritized over 3D model]**, dropoff_point (lat/lng) **[NEW]**, info_text, fun_facts[]
- `safety_alerts` — id, destination, risk_level, summary, source_url, fetched_at, **weather_snapshot (json) [NEW]**
- `starred_trips` — user_id, post_id (FK → community_posts, not trip_room_id) [CORRECTED — starring happens on Discover feed items, not raw rooms; a public trip_room should auto-create/link a community_post when shared], starred_at — unique(user_id, post_id)
- `community_posts` — id, user_id, type (recap/cloneable_itinerary), content, linked_room_id, created_at
- ~~`friendships`~~ **[REMOVED in v2.2]** — friendship feature fully cut; table dropped, no replacement entity
- `language_lessons` — id, destination, lesson_content, quiz_questions[]
- `badges` — id, user_id, badge_type, earned_at

---

## 3. Global Navigation — **[CHG]**

**FR**
- FR-NAV-1: Bottom navigation reduced to 3 tabs: **Home, Trip, Profile**.
- FR-NAV-2: The standalone Community tab is removed; its content (public feed) is merged into the Home tab. **[CHG in v2.2]** No friend-activity component exists here since the friendship feature is fully removed (see Feature 8).
- FR-NAV-3: **[CHG]** Home tab surfaces the **Discover** module (renamed from "Friend's Trip"): browsable trip reviews from the **public** (friend-scoped browsing removed along with the friendship feature — see Feature 8), with search filters (destination, style, pace, etc.).
- FR-NAV-4: Users can share a trip publicly; other users may only **star (save)** it — liking and commenting on shared trips are not supported.
- FR-NAV-5: All starred trips are listed in the user's Profile.
- FR-NAV-6: **[NEW]** Home's **Recent News** widget only surfaces `safety_alerts` whose `destination` matches a destination from one of the current user's own `trip_rooms` (planning or active) — not a global/all-destinations feed. This scopes news content to what's personally relevant instead of showing unrelated destinations' news.

**NFR**
- NFR-NAV-1: Merging Community into Home must not increase Home's initial load time beyond current baseline (target < 2s on demo network).
- NFR-NAV-2: Navigation restructure must not break deep links previously pointing to the Community tab; redirect them to Home/Discover.
- NFR-NAV-3: **[NEW]** Recent News query (FR-NAV-6) must filter by the user's trip destinations server-side (not fetch-all-then-filter client-side), to avoid leaking or wastefully transferring irrelevant destinations' alerts.

---

## 4. Feature 0 — Authentication & Onboarding

*(Unchanged by update doc.)*

**FR**
- FR-0-1: Sign-up/login via email+password or Google OAuth (Supabase Auth).
- FR-0-2: First sign-up triggers onboarding to set display name and avatar.
- FR-0-3: Session persists across app restarts until explicit logout.
- FR-0-4: Password reset available for email/password accounts.
- FR-0-5: Auth gates access to all other features.

**NFR**
- NFR-0-1: Auth tokens must be securely stored on-device (Expo SecureStore or equivalent).
- NFR-0-2: Login/signup response time < 3s under normal network conditions.

**Build scope:** Email/password — Real; Google sign-in — Real; Email verification — Skipped for demo; Session persistence — Real; Password reset — Real; Onboarding — Real.

---

## 5. Feature 1 — AI Route Planning, Preferences, 3D Landmarks & Safety

*(Updated: preferences module, modular suggestions, itinerary structure, map refinements, proactive safety+weather.)*

**FR**
- FR-1-0: **[NEW]** Home surfaces an **AI Chatbox**: a free-text entry point where the user describes a desired trip in natural language. This is a thin front-end to the same generation pipeline as FR-1-3/FR-1-4 (Preferences Form + Modular Suggestions) — it does not run a separate generation path. Output is shown in a review/confirm popup before being saved to a new Trip Room (Planning stage). Any fields the free-text input doesn't cover (e.g. Travel Pace) fall back to the FR-1-3a defaults below until the user edits them.
- FR-1-1: User inputs destination points; system calls Google Directions API for optimal route + per-leg ETA, rendered on the map.
- FR-1-2: **[CHG]** Primary map view is refocused on itinerary/trip planning using a standard route-planning algorithm (de-prioritized general map browsing).
- FR-1-3: **[NEW]** Before generation, user completes a **Preferences form**: Travel Companions (Solo/Family/Couple/Friends/Elderly), Travel Style (Cultural/Classic/Nature/Cityscape/Historical), Travel Pace (Ambitious/Moderate/Relaxed) — stored in `trip_preferences`. Editable later from the Trip Room's Settings screen; edits apply on the next explicit regenerate/Reroute, not retroactively to an already-generated itinerary.
- FR-1-3a: **[NEW]** The Preferences form is a **soft gate**: if the user skips or abandons it, generation proceeds using sensible defaults (Couple / Cultural / Moderate) rather than blocking. A visible prompt still invites the user to complete it for better-matched suggestions.
- FR-1-4: **[NEW]** System generates **modular suggestions** for Transportation, Accommodation, and Attractions, optimized against time and budget constraints and the saved preferences. A module may end up with zero accepted items (e.g. user rejects every suggestion) — this is a valid end state, not an error; the day-level "+ Transportation/Attractions/Stay" manual-add actions (FR-1-5) remain available as the fallback for that day/category.
- FR-1-4a: **[NEW]** Each suggested (and manually added, where applicable) Accommodation or Transportation item includes an outbound link/route to the corresponding external booking or ticketing website (e.g. hotel booking page, train/bus ticket site), stored as `itinerary_items.booking_url`. Tapping the item opens this link (in-app browser or external browser, TBD). No in-app booking/payment flow is built — this is a hand-off link only.
- FR-1-5: **[NEW]** Each itinerary day (`itinerary_days`) has an editable title and a notes field, plus three categorized addition actions: "+ Transportation" (How to Get There), "+ Attractions" (What to See & Do), "+ Stay" (Where to Stay).
- FR-1-6: "Reroute" re-runs route generation with updated constraints and updates map + ETA live.
- FR-1-7: Tapping a landmark opens a detail view. **[CHG]** The 3D model viewer is retained but de-prioritized in favor of real photographs and practical info (e.g. exact drop-off point); 3D remains available as a secondary tab. For landmarks outside the 2–4 pre-generated set, the 3D tab is **hidden entirely** (not shown as an empty/unavailable state) — the photo/info tab is unaffected.
- FR-1-8: **[CHG]** Safety check is upgraded to **proactive safety & weather analysis**: the AI assistant cross-references planned destinations against real-time weather and risk data on a near-real-time polling cycle (see NFR-1-2), replacing the old passive/manual check rather than claiming true continuous monitoring.
- FR-1-9: **[NEW]** Risk signals are tiered by severity: **lower-severity/informational** signals surface as the existing passive Home banner (unchanged, no action required from the user); **higher-severity/actionable** signals (a location flagged risky enough to warrant a plan change) automatically trigger a `decision_card` (trigger_type = safety_risk) with alternative itinerary suggestions instead of only a banner. The banner and the decision card are not duplicates of the same signal — each severity tier has exactly one surface.

**NFR**
- NFR-1-1: Route + ETA generation should return within 3s for up to 10 stops.
- NFR-1-2: Weather/safety polling frequency must balance API cost vs. freshness — target check interval ≤ 30 min while a trip is live.
- NFR-1-3: 3D model assets remain a small pre-generated set (2–4 landmarks) to control storage cost.
- NFR-1-4: **[NEW]** AI Chatbox (FR-1-0) response/parse time should stay under the same 3s target as NFR-1-1 for typical free-text input length.

**Build scope:** AI Chatbox — Real (thin wrapper on existing pipeline, no separate model/prompt path); Route+ETA+map — Real; Preferences form (incl. soft-gate defaults) — Real; Modular suggestions — Real logic, sample data if API-limited (TBD); Booking/ticket outbound links — Real (link-out only, no in-app booking); Itinerary day structure — Real; Reroute — Real; 3D landmarks — Mocked (2–4 pre-generated, tab hidden outside that set); Landmark photos/drop-off info — Real; Proactive safety+weather — Real (live API); Banner vs. decision-card severity tiering — Real; Auto-triggered decision cards — Real.

---

## 6. Feature 2 — Trip Room (Core Experience)

*(Updated: dynamic theming, single-live-trip routing, room state management, expense splitting unchanged.)*

**FR**
- FR-2-1: Room created via unique invite link/code; members join via that link.
- FR-2-2: Room has 3 stages: Planning, Active, Archived — UI/actions differ per stage.
- FR-2-2a: **[NEW]** Room transitions Planning → Active via an explicit **owner-initiated "Start Trip" action** (available from Room Settings, see FR-2-10a), not automatically on `start_date`. This keeps the transition deterministic and demo-triggerable on demand.
- FR-2-3: **[NEW]** Trip Room theme color dynamically updates based on the destination's current season condition.
- FR-2-4: **[NEW]** Only one trip per user may be "live" (active) at a time. While a trip is live, navigating to the Trip tab bypasses the trip-selection screen and routes directly into that active Trip Room.
- FR-2-5: **[CHG]** Users must manually exit a live Trip Room (no auto-exit); the room itself is archived either manually by the user or automatically once trip dates expire.
- FR-2-6: Decision cards support anonymous voting (votes hidden from other members, aggregate tally shown).
- FR-2-6a: **[NEW]** In addition to the auto-triggered `safety_risk` card (FR-1-9), any member can manually raise a `disruption` or `conflict` decision card from the Chat Room (a "Propose Vote" action next to the message composer), setting options and the anonymous flag at creation — same voting/resolution mechanics as FR-2-6.
- FR-2-7: Room-wide chatbox mixes user messages, system messages, and **mascot messages [NEW]** in one feed.
- FR-2-8: Each member has a `location_sharing_opt_in` toggle (off by default).
- FR-2-9 (Budget, unchanged): Expense logging supports Equal / Percentage / Shares / Exact-amount splits, multi-payer expenses, receipt OCR scanning, debt-simplification settle-up, and a planned-vs-actual budget dashboard.
- FR-2-9a: **[NEW]** When a room's expenses use more than one `currency`, the Budget Dashboard shows per-currency subtotals and flags the mix rather than silently summing raw amounts into one total. Live currency conversion is out of scope for the demo.
- FR-2-10: **[OUT OF SCOPE]** Owner-initiated removal ("kick") of a member is **not** in scope for this build — only voluntary member exit (FR-2-5-adjacent) is supported. Flagged explicitly so it isn't assumed to exist from the `role` field alone.
- FR-2-10a: **[NEW]** A **Room Settings** screen/sheet (reachable from the Trip Room Page) consolidates: the `is_public` toggle (for Discover sharing), manual Archive action, Edit Preferences shortcut (FR-1-3), and the Start Trip action (FR-2-2a).

**NFR**
- NFR-2-1: Enforcing "one live trip" must be validated server-side (Postgres constraint or trigger), not just client-side, to prevent race conditions across devices.
- NFR-2-2: Theme color recalculation should not cause visible UI flicker — apply via smooth transition (≤ 500ms).
- NFR-2-3: Auto-archive job (on date expiry) must run reliably even if no user opens the app that day (Supabase scheduled function/cron).

**Build scope:** Room creation/join — Real; Owner-initiated Start Trip (Planning→Active) — Real; Anonymous voting — Real; Manual decision-card creation (disruption/conflict) — Real; Chatbox incl. mascot — Real; Live location sharing — Real; Dynamic theming — Real (weather-driven); Single-live-trip routing — Real; Manual exit / auto-archive — Real; Room Settings screen — Real; Member removal — Out of scope; Expense splitting + OCR + settle-up — Real (unchanged from prior scope); Mixed-currency flagging — Real (no conversion).

---

## 7. Feature 3 — AI-Suggested Itineraries (Recommendation Engine)

*(Unchanged by update doc; now also fed by Discover/starred-trip signals.)*

**FR**
- FR-3-1: System aggregates anonymized behavior/preference data (destinations, kept/removed items, tags, **and starred trips [CHG]**) with no PII in the aggregate model.
- FR-3-2: Home tab surfaces ranked suggested itineraries ("travelers similar to you also did...").
- FR-3-3: Suggestions can link to a `cloneable_itinerary` sourced from Discover.

**NFR**
- NFR-3-1: In-app disclosure must state that anonymized data feeds recommendations (transparency requirement, unchanged).

**Build scope:** Real aggregate model — Mocked (seeded dataset, rule-based matching); Home suggestion UI — Real.

---

## 8. Feature 4 — Emergency Call (SOS)

*(Updated: SOS scope broadened.)*

**FR**
- FR-4-1: **[CHG]** SOS button is persistently accessible from **anywhere in the app** (not just within the Trip Room screen) whenever a trip is live.
- FR-4-2: On tap: (1) sends alert + current location to all `trip_room_members` via system message + push notification; (2) shows quick-dial pre-filled with the correct local emergency number, auto-detected from GPS/country.

**NFR**
- NFR-4-1: SOS button must render as a persistent overlay (e.g. floating action button) that survives navigation across all 3 tabs without re-render lag.
- NFR-4-2: Alert dispatch (message + location) must complete within 2s even on degraded network, with a locally-visible pending/sent status.

**Build scope:** Group alert — Real; Quick-dial — Mocked/UI-only; Persistent global overlay — Real.

---

## 9. Feature 5 — Destination Language Learning

*(Updated: real-time translator added.)*

**FR**
- FR-5-1: Dedicated page per trip room with mini-lessons scoped to the destination language, quiz-style (multiple choice/matching).
- FR-5-2: Content scoped to travel scenarios (ordering food, directions, check-in, emergencies).
- FR-5-3: Progress tracking feeds Feature 7 badges.
- FR-5-4: **[NEW]** A real-time translator is integrated into the app (text input/output, likely also accessible during an active trip for on-the-go use).

**NFR**
- NFR-5-1: Translator response time < 2s per request for typical phrase-length input.
- NFR-5-2: Translator should work offline-degraded (cached common phrases) if network is poor — stretch goal, not required for demo.

**Build scope:** Lesson content — Real, limited set (3–5 lessons); Quiz + progress tracking — Real; Real-time translator — Real (API-backed), offline cache — stretch/TBD.

---

## 10. Feature 6 — Group Album

*(Unchanged by update doc.)*

**FR**
- FR-6-1: Any room member can upload photos to the room album.
- FR-6-2: Photos auto-organized by day/location using timestamp + geotag metadata.
- FR-6-3: Album accessible during Active and Archived stages.

**NFR**
- NFR-6-1: Photo upload must degrade gracefully (queue + retry) on poor connectivity.

**Build scope:** Upload/storage — Real; Auto-organization — Real if EXIF available, else fallback to upload-time sort.

---

## 11. Feature 7 — User Profile with Trip History & Badges

*(Updated: now also home for starred trips.)*

**FR**
- FR-7-1: Profile lists all `trip_rooms` the user participated in, with basic stats.
- FR-7-2: Badges awarded for milestones (countries visited, trips completed, lessons finished).
- FR-7-3: **[NEW]** Profile includes a **Starred Trips** section listing all trips the user has starred via Discover.

**NFR**
- NFR-7-1: Profile page must load trip history + badges + starred trips in a single paginated query set to avoid multiple round-trips.

**Build scope:** Trip history — Real; Badges — Real (fixed set); Starred trips list — Real.

---

## 12. Feature 8 — Discover (formerly Community)

*(Renamed and re-scoped: no standalone tab, interaction limited to starring, friendship feature fully removed in v2.2.)*

**FR**
- FR-8-1: **[CHG]** "Community" is no longer a standalone tab; its functions live inside **Home → Discover**.
- FR-8-2: **[REMOVED in v2.2]** Friend requests / friendships are fully cut from scope — the `friendships` table is dropped from the data model (Section 2) and no request/accept UI is built. (The earlier v2.1 "follow" mechanic was already cut; this removes the underlying friend-request mechanism too, so Feature 8 has no user-to-user relationship graph at all.)
- FR-8-3: **[CHG]** Discover feed shows trip reviews/posts from the **public only** (no friend-scoped filter, since there is no relationship graph) with search filters (destination, style, pace, budget).
- FR-8-4: **[CHG]** Interaction on any shared/public trip is limited to **starring (saving)** — liking and commenting are removed.
- FR-8-5: Clicking "clone" on a `cloneable_itinerary` post copies its `itinerary_items`/`itinerary_days` into a new `trip_room` owned by the current user.
- FR-8-6: Cloned/starred itineraries feed into Feature 3's recommendation signal.

**NFR**
- NFR-8-1: Removing comments/likes requires a data-migration note: existing `comments` data (if any) is deprecated, not deleted, pending confirmation from the team on retention.
- NFR-8-2: Discover search filters must return results within 2s for the demo dataset size.
- NFR-8-3: **[NEW]** Removing `friendships` is a schema drop, not a soft-deprecation — confirm no other feature reads from it before dropping (checked: FR-8-2 was its only consumer; Discover, Profile, and Recommendations all key off `community_posts`/`starred_trips`, not `friendships`).

**Build scope:** Friend requests — Removed (no longer built); Discover feed + filters (public-only) — Real; Starring — Real; Clone itinerary — Real.

---

## 13. Feature 9 — App Mascot / AI Assistant **[NEW]**

**FR**
- FR-9-1: A visual App Mascot acts as the delivery channel for system notifications (e.g. reroute alerts, safety/weather warnings, budget alerts).
- FR-9-2: Mascot messages appear inline in the Trip Room chat feed (`messages.sender_type = mascot`) and/or as push notifications.
- FR-9-3: Mascot is the presentation layer for Feature 1's proactive safety/weather analysis (FR-1-8/1-9) — i.e. those alerts are visually attributed to the mascot.
- FR-9-3a: **[NEW]** Mascot is also the presentation layer for budget alerts sourced from Feature 2's Budget subsystem (FR-2-9) — e.g. overspend vs. `planned_amount`, mixed-currency flags (FR-2-9a) — attributed to the mascot the same way as safety/weather alerts.

**NFR**
- NFR-9-1: Mascot message generation (via AI text provider) must not block the chat UI — render optimistic/system placeholder while generating.
- NFR-9-2: Mascot tone/copy should stay consistent (defined style guide) across all trigger types.

**Build scope:** Mascot UI + notification delivery — Real; AI-generated message copy — Real (same AI provider as Feature 1); Full personality/animation system — Mocked/simplified for demo.

---

## 14. Cross-Feature Dependencies (updated)

| Feature | Depends on |
|---|---|
| All features | Feature 0 (Auth) |
| Feature 2 (Trip Room) | Core container for Features 1, 4, 5, 6, 9 |
| Feature 1 (Preferences/Route/Safety) | Weather API (theming + safety); feeds Feature 9 (mascot) decision cards |
| Feature 3 (Recommendations) | Seeded data; enriched by Feature 8 (starred + cloned trips) |
| Feature 4 (SOS) | trip_room_members + location data from Feature 2; now global overlay across nav |
| Feature 7 (Badges/Profile) | Trip history (F2), lesson completion (F5), starred trips (F8) |
| Feature 8 (Discover) | Lives inside Home tab (Global Nav); clone creates a Feature 2 trip_room; feeds Feature 3 |
| Feature 9 (Mascot) | Realtime (F2 chat) + AI provider (F1 safety/weather logic) + Budget subsystem (F2, for budget-alert triggers) |

---

## 15. Open Items — Team Must Confirm

**Resolved in v2.1** (see changelog above — no longer open): AI Chatbox scope, Preferences-form skip behavior, banner vs. decision-card tiering, Planning→Active trigger, manual decision-card creation, mixed-currency handling, member removal, follow mechanic, mascot/budget dependency.

**Resolved in v2.2**: friendship feature scope (fully removed, not deprecated — `friendships` table dropped); booking/ticket link-out scope for Modular Suggestions (link-out only, no in-app booking, FR-1-4a); Recent News personalization scope (filtered to user's own trip destinations, FR-NAV-6).

**Still open:**
- Weather API provider (theming + safety/weather analysis) and polling strategy.
- Translation API provider for the real-time translator.
- AI provider for mascot copy generation — must match Feature 1's AI provider (per Section 1, do not mix).
- Exact demo destination(s) — scopes Feature 1 route/safety, Feature 5 language/translator.
- Which 2–4 landmarks get pre-generated 3D + photo assets.
- Retention decision for deprecated `comments`/`likes` data (NFR-8-1).
- Server-side enforcement mechanism for "one live trip per user" (NFR-2-1) — Postgres trigger vs. application-level check.
- News/search API choice for safety risk detection.
- OCR/receipt-scanning approach (multimodal vision vs. dedicated OCR + AI structuring) — unchanged open item.
- Default split method shown first in expense form (recommend Equal as default) — unchanged open item.
- Booking/ticketing link source for FR-1-4a (e.g. Booking.com/Agoda affiliate links for accommodation, official carrier/OTA sites for transport) — pick a provider so `booking_url` generation is consistent, not per-suggestion ad hoc.

---

## 16. Next Step

Once open items are confirmed, proceed to the **UI Requirements Document** — style guide (colors incl. season-driven theme palette, typography, mascot character design) and screen-by-screen designs for the updated 3-tab navigation.
