# ReRoute — End-User Workflow Document (Refined, v2, for System Testing)

*Derived from `ReRoute_Requirements_Refined.md` — CodeNection 2026, Lifestyle Track*

Purpose: enumerate every realistic end-user path through the **updated** system — main flows, alternate flows, and edge cases — so QA can design test cases with full feature coverage. Changes from v1 are marked **[CHG]**/**[NEW]**; flows removed by the update are marked **[REMOVED]**.

**Data model validation note:** this revision was checked against the updated Shared Data Model (starring keyed on `community_posts.post_id`, per-member `is_live_for_user`, `itinerary_items.sort_order`, `itinerary_days.trip_date`, `decision_cards.safety_alert_id`, `album_photos.itinerary_day_id`). One item remains ambiguous and is **not** assumed here: whether `community_posts.linked_room_id` is now required (non-nullable) for every post type, including plain `recap` posts that may not originate from a clonable room. Team should confirm before QA treats "every post has a linked room" as a hard invariant.

**Actors**
- **New User** — no account yet
- **Returning User** — has an account
- **Room Owner** — creator of a `trip_room`
- **Room Member** — joined via invite
- **Non-member** — logged in, but not in a given room

---

## 0. Authentication & Onboarding
*(Unchanged.)*

**Main flow — Email signup**
1. Open app → tap Sign Up → enter email+password → account created (no email verification gate).
2. Onboarding: set display name + avatar → `users` record created.
3. Land on Home, session persists across restarts.

**Main flow — Google signup/login**
1. Tap "Continue with Google" → OAuth consent → account created/matched → onboarding if first-time.

**Alternate/edge flows**
- Returning user login → skips onboarding, goes straight to Home.
- Force-quit mid-session → reopen → still logged in.
- Forgot-password reset flow completes → login with new password.
- Weak/mismatched password → validation error, no account created.
- Signup with already-registered email → error, prompted to log in.
- Logout from Profile → all protected routes blocked until re-auth.
- Logged-out user deep-links into a trip-room invite URL → routed to login/signup, then dropped into the room after auth.

---

## 1. Global Navigation **[NEW SECTION]**

**Main flow — 3-tab navigation**
1. User sees bottom nav with exactly **Home, Trip, Profile** (Community tab removed).
2. Home tab shows the merged feed: friend activity + the **Discover** module (destination/style/pace search filters) in one screen.
3. Trip tab: if the user has a **live** trip, tapping it routes directly into that active Trip Room (bypasses trip-selection screen). If no live trip, shows trip-selection/creation screen.
4. Profile tab shows trip history, badges, and **Starred Trips**.

**Main flow — Share & star (replaces likes/comments) [CORRECTED to data model]**
1. Room Owner marks a trip `is_public = true` from Trip Room settings → this **auto-creates/links a `community_post`** (`linked_room_id` → the room) so it can appear in Discover.
2. Other users find the post via Discover → tap **Star**, which writes a `starred_trips` row keyed on `(user_id, post_id)` — **starring targets the Discover post, not the raw `trip_room` directly.**
3. Starred trip appears in the starring user's Profile → Starred Trips (resolved via the linked post → room).

**Alternate/edge flows**
- User follows an old deep link that pointed at the former Community tab → redirected to Home/Discover, not a 404/blank screen.
- Owner sets a room `is_public = true` but the auto-link to a `community_post` fails/is delayed → verify the room doesn't silently appear starrable with no underlying post (data-integrity check, since `starred_trips.post_id` has no fallback to `trip_room_id`).
- User attempts to unstar a previously starred trip → the `(user_id, post_id)` row is removed, no confirmation dialog needed.
- Room Owner sets `is_public = false` after it was starred by others → verify defined behavior for existing `starred_trips`/`community_posts` rows (kept for history vs. hidden) is consistent.
- User tries to comment or like on a shared trip (e.g. via an old cached UI/API call) → action rejected/hidden; only starring is exposed.
- Merged Home feed under slow network → verify initial load stays under the 2s target (NFR-NAV-1) and doesn't block on Discover data if friend-feed data is ready first (or vice versa).
- User has a live trip but navigates to Trip tab from a fresh cold start → still bypasses selection screen correctly (state not lost on relaunch).

---

## 2. AI Route Planning, Preferences, Modular Suggestions & Proactive Safety **[CHG]**

**Main flow — Preferences form (new, gates generation)**
1. Before first itinerary generation, user completes: Travel Companions (Solo/Family/Couple/Friends/Elderly), Travel Style (Cultural/Classic/Nature/Cityscape/Historical), Travel Pace (Ambitious/Moderate/Relaxed).
2. Preferences saved to `trip_preferences`, scoped to the room.
3. User can revisit/edit preferences later; edits should be reflected next time suggestions/route are (re)generated.

**Main flow — Modular suggestions**
1. System generates separate suggestion modules for **Transportation**, **Accommodation**, and **Attractions**, optimized against time/budget constraints and the saved preferences.
2. User reviews each module and accepts/rejects individual items rather than an all-or-nothing itinerary.

**Main flow — Itinerary day structure**
1. Trip is broken into `itinerary_days`, each with an editable title and a notes field.
2. On any day, user taps **"+ Transportation"**, **"+ Attractions"**, or **"+ Stay"** to add items into that day, each item constrained to its respective category.
3. Within a day, user can drag-reorder items → `sort_order` updates per item; the day's displayed order reflects the new sequence.
4. User inputs destination points; Google Directions API returns optimal route + per-leg ETA rendered on the map.

**Main flow — Reroute**
1. User adds/removes/reorders a stop, or a `decision_card` resolution changes plans.
2. Taps "Reroute" → system re-runs generation with updated constraints → map + ETAs update live.

**Main flow — Landmark detail (photos primary, 3D secondary)**
1. User taps a landmark pin → detail view opens showing **real photographs** and practical info (history, fun facts, **exact drop-off point**) by default.
2. A secondary tab offers the 3D model viewer (pinch-zoom, drag-rotate) **only** for the 2–4 pre-generated landmarks.

**Main flow — Proactive safety & weather → auto decision card**
1. AI assistant continuously cross-references planned destinations against live weather and safety/risk data (≤30 min check interval while trip is live), rather than periodic passive polling.
2. If a location is flagged as risky (weather or safety), the system **automatically creates** a `decision_card` (trigger_type = `safety_risk`) with alternative itinerary options — delivered via the mascot (see Feature 9) — instead of only a dismissible banner.
3. Group votes on the card as in Feature 3 voting flow; resolution triggers a Reroute if an alternative is chosen.

**Alternate/edge flows**
- User skips/abandons the Preferences form → verify generation either blocks with a clear prompt or falls back to sensible defaults (confirm intended behavior).
- User changes preferences mid-trip after itinerary already generated → verify existing itinerary isn't silently overwritten; changes apply on next explicit regenerate/Reroute.
- Modular suggestion API/data is unavailable → falls back to sample/seeded data (per Build Scope) rather than an empty module.
- User inputs only one destination point → route generation blocked or gracefully handled (no route to render).
- Invalid/unreachable address via Directions API → explicit error state, not silent failure.
- Reroute triggered while a previous request is in flight → no race/duplicate map renders.
- User taps a landmark with **no** pre-generated 3D model → 3D tab hidden or shows a clear "not available" state; photo/info tab still fully functional.
- Weather/safety check finds **no** risk → no decision card or mascot alert generated (absence is valid; verify no stale/false alerts persist).
- Multiple safety_risk decision cards trigger in quick succession (e.g. two destinations flagged) → verify each is distinct and resolvable, not overwritten by the latest.
- Network loss during proactive check → check silently retries next cycle, does not crash or spam retries.
- Decision card of type `safety_risk` times out/unresolved before trip proceeds → verify defined fallback behavior (e.g. keep original plan, re-prompt) is consistent.
- User edits an `itinerary_day`'s title/notes → verify its `trip_date` and `day_number` are unaffected by the edit.
- A day's `trip_date` is edited/reassigned outside the room's `start_date`–`end_date` range → validation error or clamped, not silently accepted.
- Two items in the same day are reordered concurrently by two members → `sort_order` values resolve consistently, no duplicate/conflicting order.
- Tapping an auto-triggered `safety_risk` decision card shows the linked `safety_alerts` record (`safety_alert_id`) with its risk level, weather snapshot, and source — verify the link is never broken/orphaned (traceability from card back to source alert).

---

## 3. Trip Room — Core, Chat, Voting, Location, Theming **[CHG]**

**Main flow — Create & join room**
1. Room Owner creates a trip room (name, destination) → enters **Planning** stage.
2. Owner shares invite link/code → others join as Room Members.
3. Room progresses Planning → Active → Archived; available actions differ per stage.

**Main flow — Dynamic theming**
1. Room theme color is derived from the destination's current season/weather condition on room creation and on periodic refresh.
2. When the theme changes, transition is smooth (≤500ms), no visible flicker.

**Main flow — Single live trip enforcement [CORRECTED to data model]**
1. User starts/enters an Active trip → **that user's `trip_room_members` row for this room** gets `is_live_for_user = true`. Liveness is tracked per membership, not on `trip_rooms` itself (a room has no global "live" state — it can be Active for the group while live only for some members' own navigation).
2. If the user attempts to mark a second room's membership live while one of their own membership rows already has `is_live_for_user = true`, the system blocks it server-side (constraint: at most one `is_live_for_user = true` row per `user_id` across all their memberships).
3. While the user has a live membership, the Trip tab always routes directly into that room for them specifically (see Global Navigation) — other members of the same room are unaffected and follow their own `is_live_for_user` state.
4. User manually exits (their `is_live_for_user` flips back to false) — no auto-exit on backgrounding/navigation away. The room's own `stage` (Planning/Active/Archived) is independent and only changes via archiving.

**Main flow — Archiving**
1. Room Owner manually archives the room, **or**
2. A scheduled job (cron) automatically archives the room once trip dates expire, even if no user opens the app that day.

**Main flow — Chat (with mascot)**
1. Member sends a message → all members see it in the shared feed in realtime.
2. Feed also carries system messages and **mascot messages** (reroute alerts, safety/weather warnings, budget alerts) inline, visually distinguished by sender type.

**Main flow — Anonymous voting (decision card)**
1. A decision card is triggered (Reroute disruption, manual group conflict, or auto safety_risk from Feature 2).
2. Options + anonymous flag set at creation.
3. Each member votes; if anonymous, individual choice hidden — only aggregate tally shown.
4. Card resolves; result posted as a system message in chat.

**Main flow — Live location sharing**
1. Member toggles `location_sharing_opt_in` ON (default off) → live location appears on shared in-room map.
2. Member toggles OFF → location stops updating/disappears.

**[REMOVED] Itinerary item comments** — standalone comment threads on individual `itinerary_items` are deprecated; do **not** test for a per-item comment UI. All room-level discussion happens in the main chat feed only.

**Alternate/edge flows**
- User already has a live trip on Device A, attempts to make another live on Device B simultaneously → server-side check prevents both from being live concurrently (race-condition test).
- User is a member of Room A and Room B; sets Room A's membership live → verify Room B's membership row for that same user stays `is_live_for_user = false`, and attempting to also go live in Room B is blocked until Room A is exited.
- Two different users in the *same* room both set their own membership live at the same time → both succeed independently (the constraint is per-user, not per-room).
- Theme recalculation happens while user is mid-interaction (e.g. scrolling map) → no layout jump/flicker beyond the defined transition.
- Auto-archive cron fires while a member has an unsent draft (chat/expense) in that room → verify no data loss, and room correctly becomes read-only/Archived-state afterward.
- Owner manually archives a room that still has open (unresolved) decision cards → verify defined behavior (e.g. auto-resolve, lock, or block archive) is consistent.
- Non-member opens an expired/invalid invite link → access denied, clear error.
- Member leaves mid-Active-stage → prior votes/expenses remain attached to their historical record; they lose live access.
- Two members vote on a decision card simultaneously near close → tally consistent, no double-count.
- Anonymous card with only one voter → tally still doesn't reveal that single vote's identity.
- Member never opts into location sharing → all other trip-room features remain usable.
- Chat message sent while offline → queued and delivered on reconnect, or clearly marked failed — never silently dropped.
- Mascot message generation is slow/pending → chat shows an optimistic/placeholder bubble, does not block sending/reading other messages (NFR-9-1).

---

## 4. Budget & Expense Splitting (Splitwise-style)
*(Unchanged — retained for full-suite coverage.)*

**Main flow — Manual expense entry**
1. During Planning, a member optionally sets `planned_amount` per budget category.
2. Any member logs an expense: description, amount, currency, payer(s), category.
3. Selects split method: **Equal** (default), **Percentage**, **Shares**, or **Exact amount**.
4. Expense saved → balances recalculated for all involved members.

**Main flow — Receipt scan**
1. Member scans/uploads a receipt photo → sent to AI/OCR → `ocr_status` processing → completed.
2. Extracted data shown as an editable form; member corrects and confirms → expense saved with `receipt_url`.

**Main flow — Settle up**
1. Member opens Budget Dashboard → sees simplified settle-up list (minimum transfers).
2. Records an external payment between two users → balances update (no real payment processed).

**Alternate/edge flows**
- Percentage split not summing to 100% → validation error before save.
- Shares split with zero/negative value → rejected.
- Exact-amount split not summing to total → validation error.
- Multiple payers whose amounts don't sum to total → validation error.
- Blurry/unreadable receipt → `ocr_status` = failed → prompted to enter manually.
- Corrected OCR values are saved, not raw OCR output.
- Mixed currencies in one room → dashboard flags/handles rather than silently summing.
- 3+-person debt cycle (A→B→C→A) → simplification collapses to minimum transfer count.
- Settle-up payment recorded above outstanding balance → blocked/flagged.
- Expense edited/deleted after split calculated → balances/settle-up recompute correctly.
- Category with no `planned_amount` still logs expenses → dashboard shows actual with no planned comparison (not an error).

---

## 5. AI-Suggested Itineraries (Recommendation Engine) **[CHG — now also fed by Discover]**

**Main flow**
1. User opens Home → sees a ranked list of suggested itineraries, matched on destination, tags, budget, **and now also on starred/cloned-trip signals from Feature 8**.
2. Taps a suggestion → views details → optionally clones it (Feature 8 flow).

**Alternate/edge flows**
- Brand-new user with no preference/starring history → still sees suggestions from the seeded aggregate dataset, not a blank state.
- No close matches exist → sensible fallback list shown, not an empty page.
- User taps the in-app anonymized-data disclosure → text is accessible/understandable.
- User stars several trips of a clear pattern (e.g. all nature/relaxed) → verify future suggestions plausibly reflect that signal (qualitative check, not exact ranking assertion).

---

## 6. Emergency Call (SOS) **[CHG — global overlay]**

**Main flow**
1. Whenever the user has a **live** trip, the SOS button is a persistent overlay reachable from **any of the 3 tabs**, not only inside the Trip Room screen.
2. Tap → confirmation step (prevents accidental taps) → confirmed.
3. Alert system message + current location sent to all `trip_room_members` via chat + push notification (target <2s, with visible pending/sent status).
4. Quick-dial appears, pre-filled with local emergency number auto-detected from GPS/country.
5. Tap quick-dial → (mocked) shows correct number/flow without placing a real call.

**Alternate/edge flows**
- SOS tapped from Home or Profile tab (not the Trip Room screen) while a trip is live → still fires the full flow correctly (this is the key regression test vs. v1 scope).
- Location services denied/unavailable → alert still sends, flagged "location unavailable" instead of stale/wrong coordinates.
- User outside demo-covered country → emergency number lookup falls back gracefully or states coverage limits.
- Multiple rapid SOS taps → no duplicate alerts spammed to the group.
- SOS accessed while no trip is live → button not reachable/visible on any tab.
- SOS triggered in a room still in Planning (not yet Active/live) → verify button visibility correctly scoped (per NFR-4-1, overlay should persist across nav only while live).
- App backgrounded/navigated across all 3 tabs rapidly → overlay persists without re-render lag (NFR-4-1).

---

## 7. Destination Language Learning + Real-Time Translator **[CHG]**

**Main flow — Lessons**
1. Member opens the room's Language Learning page (scoped to destination language).
2. Browses mini-lessons (3–5 for demo) → completes quiz-style interactions.
3. Lesson marked complete → progress saved → feeds Feature "Profile & Badges."

**Main flow — Real-time translator [NEW]**
1. Member opens the translator (available on the language page and, per spec, potentially during an active trip for on-the-go use).
2. Types/pastes text → selects target/source language → gets a translation within ~2s.
3. Copies/uses the translated text as needed (e.g. paste into chat).

**Alternate/edge flows**
- Exit lesson mid-quiz → progress saved at last completed question or clearly discarded (verify consistent behavior).
- Retake a completed lesson → doesn't double-count toward badge progress incorrectly (or confirmed intended behavior).
- All quiz answers wrong → flow allows completion/retry, doesn't dead-end.
- Destination has no lesson content prepared → appropriate empty/coming-soon state.
- Translator called with empty/very long input → validation or graceful truncation, not a crash.
- Translator used on poor network → degrades per spec (cached common phrases as stretch goal) or shows a clear retry state if offline cache isn't implemented.
- Translator response exceeds 2s target under load → verify a loading indicator, not a frozen UI.

---

## 8. Group Album
*(Unchanged.)*

**Main flow**
1. Member uploads photo(s) to the room album during Active/Archived stage — either from the general album screen or from within a specific itinerary day's view.
2. If uploaded from a day's view, the photo is directly tagged with that `itinerary_day_id`; otherwise it's auto-organized by day/location using timestamp + geotag EXIF metadata.
3. Other members browse the album by day/location.

**Alternate/edge flows**
- No EXIF metadata (e.g. screenshot) and no `itinerary_day_id` context → falls back to upload-time sort, grouping doesn't break.
- Photo has an explicit `itinerary_day_id` (uploaded from a day's view) but its EXIF geotag/timestamp suggests a different day → verify the explicit `itinerary_day_id` takes precedence over the EXIF-based heuristic, not silently overridden.
- Upload attempted during Planning stage → correctly restricted to Active/Archived.
- Very large file upload → progress/size handling visible, no silent failure.
- Simultaneous multi-member uploads → all appear, no overwrite/race.
- Poor connectivity mid-upload → queue + retry rather than failure (NFR-6-1).

---

## 9. User Profile — Trip History, Badges & Starred Trips **[CHG]**

**Main flow**
1. User opens Profile → sees `trip_rooms` participated in (with stats).
2. Sees earned badges (countries visited, trips completed, lessons finished).
3. **[NEW]** Sees a **Starred Trips** section listing every trip starred via Discover.
4. All three sections load via a single paginated query (no separate round-trips per NFR-7-1).

**Alternate/edge flows**
- New user, zero trips/badges/stars → empty/encouraging state, not a broken list.
- Qualifying badge action completes (e.g. final lesson, room archived) → badge appears without app restart.
- Trip still in Planning/Active (not Archived) → correctly represented in trip history vs. only counting Archived trips.
- User stars, then unstars, a trip → Starred Trips list updates immediately and consistently.
- Large number of starred trips/badges → pagination works without duplicate/missing entries.

---

## 10. Discover (formerly Community) **[CHG — renamed, re-scoped]**

**Main flow — Friends/follow**
1. From Home → Discover, user searches for another user → sends a friend request or follows them.
2. Recipient accepts/declines (follow may be one-directional per final design).

**Main flow — Feed, filters & clone**
1. User browses the Discover feed (recap posts + cloneable-itinerary posts) from friends and the public, using filters (destination, style, pace, budget).
2. User taps **Star** on a post to save it (writes to `starred_trips` keyed on `post_id`; no like/comment option anywhere) — the underlying room is reached via the post's `linked_room_id`.
3. User taps **Clone** on a cloneable-itinerary post → system copies its `itinerary_items`/`itinerary_days` (via `linked_room_id`) into a new `trip_room` owned by the current user, opened in editable Planning stage.

**Alternate/edge flows**
- Cloning the same itinerary twice → two independent trip rooms, no cross-linking/shared state.
- User attempts to friend/follow themselves → blocked.
- Pending friend request withdrawn before acceptance → no longer appears for recipient.
- User publishes their own trip as recap/cloneable → appears correctly in others' Discover feeds and feeds Feature "AI-Suggested Itineraries" signal.
- Non-friend browses another user's public content → visibility matches intended privacy design (public vs. friends-only).
- Discover search filters return results within the 2s target for demo dataset size (NFR-8-2).
- User attempts to comment or like via any leftover UI/API path → action is unavailable; only star/clone exposed.
- Old data referencing deprecated `comments`/`likes` exists → confirm it's hidden from UI, not deleted (pending retention decision, NFR-8-1) and doesn't cause render errors.

---

## 11. App Mascot / AI Assistant **[NEW]**

**Main flow — Notification delivery**
1. A trigger occurs elsewhere in the app (reroute alert, safety/weather warning from Feature 2, budget alert from Feature 4/Budget).
2. Mascot generates a message via the AI text provider and posts it inline in the Trip Room chat (`sender_type = mascot`) and/or as a push notification.
3. While the message is generating, chat shows an optimistic/system placeholder rather than blocking the UI (NFR-9-1).
4. User reads the mascot message; if it's attached to a `decision_card` (e.g. safety_risk), taps through into the voting flow (Feature 3/Trip Room).

**Alternate/edge flows**
- AI provider is slow/unavailable → placeholder shown, then a graceful fallback message (or retry) rather than a stuck loader.
- Multiple triggers fire close together (e.g. weather alert + budget alert) → both mascot messages appear distinctly in feed order, not merged/overwritten.
- Mascot tone/copy checked across all trigger types (safety, reroute, budget) for consistency with the defined style guide (NFR-9-2) — qualitative spot-check, not a hard assertion.
- Push notification permission denied by user → mascot message still appears in-app chat even though push fails silently (no crash).
- Mascot-delivered decision card is dismissed without voting → verify card remains accessible/resolvable later rather than disappearing.

---

## 12. Cross-Feature End-to-End Scenarios

**Scenario A — Full trip lifecycle (updated)**
1. New user signs up (Auth) → creates a trip room (Planning).
2. Completes the Preferences form → reviews modular suggestions (Transportation/Accommodation/Attractions) → builds itinerary days.
3. Plans route; proactive safety/weather check runs continuously in the background.
4. Invites friends → they join room; room theme reflects destination season.
5. Room moves to Active; becomes the owner's one live trip (Trip tab routes directly into it).
6. Group logs expenses (manual + receipt OCR), splits costs.
7. A flagged risk auto-triggers a safety_risk decision card, delivered via mascot → group votes anonymously → Reroute applied if changed.
8. A member shares live location; another triggers SOS from a different tab (not the room screen) mid-trip.
9. Group uploads photos; members complete language lessons and use the translator on the go.
10. Trip ends → room archived (manual or auto-expiry cron) → settle-up finalized.
11. Badges awarded on Profile, alongside trip history.
12. User publishes the trip as a recap/cloneable post → appears in another user's Discover feed and feeds their Home suggestions; others can star it.

**Scenario B — Clone-and-restart path (via Discover)**
1. Returning user browses Discover → clones a cloneable itinerary.
2. New trip room created in Planning, pre-filled with cloned days/items.
3. User edits preferences/itinerary, regenerates route, invites members.
4. Continues as a normal trip room (rejoins Scenario A from step 4 onward).

**Scenario C — Solo-to-group transition**
1. User creates a room alone, completes preferences, plans route solo.
2. No members added initially — verify solo route planning, budget entry (sole payer), album upload all work without a group.
3. Later invites members mid-Planning — verify solo-created data becomes visible/consistent to new joiners.

**Scenario D — Permission & stage-boundary stress test**
1. Verify each feature's availability against room stage (Planning/Active/Archived) — e.g. SOS reachable app-wide only while trip is live/Active, Album in Active/Archived, budget editable in Planning but logged mostly in Active.
2. Verify a member who leaves/is removed loses room-specific live access (chat, location, live route) while historical records remain intact for others.

**Scenario E — Single-live-trip & auto-archive stress test [NEW]**
1. User attempts to make a second trip live while one is already live (same device, then a second device) → server-side rejection both times.
2. A live trip's end date passes with the app unopened → scheduled cron archives it correctly on next check; user later opens app and sees it Archived, not still "live."

**Scenario F — Discover-to-badge loop [NEW]**
1. User stars a trip in Discover → appears in Profile → Starred Trips.
2. Starred signal feeds into that user's Home suggestions (Feature "AI-Suggested Itineraries") on next load.
3. User clones a starred trip → completes it → contributes to their own trip-history badge count.

---

## 13. Test-Focus Checklist (Quick Reference, refined)

- [ ] Auth gates every protected route (no feature reachable while logged out)
- [ ] Session persists across restarts; logout clears it fully
- [ ] Bottom nav shows exactly 3 tabs; old Community deep links redirect correctly
- [ ] Preferences form is required (or has a defined default) before itinerary generation
- [ ] Modular suggestions (Transport/Accommodation/Attractions) fall back to sample data when live API is limited
- [ ] Itinerary day add-actions correctly constrain category (Transportation/Attractions/Stay)
- [ ] Proactive safety/weather check runs continuously (≤30 min interval) and auto-creates decision cards, not just banners
- [ ] Landmark detail defaults to photos/drop-off info; 3D tab degrades gracefully outside the pre-generated set
- [ ] Single-live-trip is enforced **server-side** (race-condition safe across devices)
- [ ] Trip theme transitions smoothly (≤500ms), no flicker
- [ ] Auto-archive cron fires reliably even with no app opens
- [ ] Room stage (Planning/Active/Archived) correctly gates feature availability
- [ ] No comment/like UI or API path exists anywhere on shared trips or itinerary items — only starring
- [ ] Anonymous votes never leak identity, even in low-participation edge cases
- [ ] All 4 expense split methods validate correctly (sums must reconcile)
- [ ] OCR failure path falls back to manual entry cleanly
- [ ] Debt-simplification produces minimum transfers, updates on edit/delete
- [ ] Location sharing is strictly opt-in, toggle works both directions in realtime
- [ ] SOS overlay is reachable from **all 3 tabs**, not just the Trip Room screen, whenever a trip is live
- [ ] SOS reaches all members with location + correct local emergency number
- [ ] Reroute doesn't race with in-flight route requests
- [ ] Real-time translator responds within ~2s; degrades gracefully offline
- [ ] Mascot messages never block chat UI (placeholder shown while generating)
- [ ] Mascot tone stays consistent across trigger types (safety, reroute, budget)
- [ ] Discover search filters return within 2s for demo dataset size
- [ ] Clone action creates a fully independent, editable new trip room
- [ ] Badges award in realtime on qualifying actions, no restart needed
- [ ] Starred Trips list in Profile stays consistent with star/unstar actions
- [ ] Realtime sync (chat incl. mascot, votes, location, decision cards) has no dropped/duplicated events under concurrent use
