# ReRoute — End-User Workflow Document (for System Testing)

*Derived from ReRoute_Feature_Requirements.md — CodeNection 2026, Lifestyle Track*

Purpose: enumerate every realistic end-user path through the system — main flows, alternate flows, and edge cases — so QA can design test cases with full feature coverage. Organized by feature, then closed with cross-feature end-to-end scenarios and a test-focus checklist.

**Actors**
- **New User** — no account yet
- **Returning User** — has an account
- **Room Owner** — creator of a `trip_room`
- **Room Member** — joined via invite
- **Non-member** — logged in, but not in a given room

---

## 0. Authentication & Onboarding

**Main flow — Email signup**
1. Open app → tap Sign Up.
2. Enter email + password → submit.
3. Account created immediately (no email verification gate).
4. Onboarding: set display name + avatar → `users` record created.
5. Land on home page, session persists across restarts.

**Main flow — Google signup/login**
1. Tap "Continue with Google" → OAuth consent → account created/matched.
2. First-time Google users go through the same onboarding (name + avatar).

**Alternate/edge flows**
- Returning user logs in with existing email/password → skips onboarding, goes straight home.
- User force-quits app mid-session → reopens → still logged in (session persistence).
- User taps "Forgot password" → enters email → resets → logs in with new password.
- User enters mismatched/weak password at signup → validation error shown, no account created.
- User signs up with an email already registered → error, prompted to log in instead.
- User logs out from Profile page → returned to login screen → all protected routes blocked until re-auth.
- Logged-out user deep-links into a trip room invite URL → redirected to login/signup first, then dropped into the room after auth.

---

## 1. AI Route Planning, 3D Landmarks & Safety Check

**Main flow — Route generation**
1. From a trip room, user opens Route Planning and inputs 2+ destination points.
2. System calls Google Directions API → optimal route + per-leg ETA rendered on embedded map with ordered stop markers.
3. User views transport mode options per leg (train/bus + next departure) where data is available.

**Main flow — Reroute**
1. User adds, removes, or reorders a stop (or time changes materially).
2. Taps "Reroute."
3. System re-runs route generation with new constraints → map and ETAs update live without full replan.

**Main flow — 3D landmark**
1. User taps a landmark pin on the map.
2. Detail view opens: 3D model viewer (pinch-zoom, drag-rotate) + info panel (history, facts, e.g. film locations).
3. User closes detail view, returns to map.

**Main flow — Safety check**
1. System periodically queries a news/search API for the trip destination.
2. If a risk item is found (conflict, disaster, unrest, severe weather), a non-intrusive banner/notification appears with summary + source link.
3. User taps banner → views full summary + source, dismisses.

**Alternate/edge flows**
- User inputs only one destination point → system should either block route generation or handle gracefully (single-point, no route).
- User inputs a destination unreachable by Directions API (invalid address) → error state shown, not a silent failure.
- User taps a landmark that has **no** pre-generated 3D model (outside the demo set) → falls back to info panel only, no broken viewer.
- Reroute triggered while a previous route request is still in flight → system should not race/duplicate map renders.
- No safety risk currently exists for destination → no banner shown (absence is a valid state, verify it doesn't show stale/false alerts).
- Multiple safety alerts exist simultaneously → verify all are queued/accessible, not just the latest overwriting others.
- User loses network mid-route-generation → error/retry state, not an infinite loader.

---

## 2. Trip Room — Core, Chat, Voting, Location

**Main flow — Create & join room**
1. Room Owner creates a trip room (name, destination) → room enters **Planning** stage.
2. Owner shares invite link/code.
3. Other users tap the link → join as Room Members.
4. Room progresses Planning → Active → Archived; UI/available actions differ per stage.

**Main flow — Chat & comments**
1. Member opens room chat → sends a message → all members see it in the shared feed in realtime.
2. System-generated messages (e.g. decision cards) appear inline in the same feed.
3. Member opens a specific `itinerary_item` → adds a comment → visible to all members in that item's thread (separate from main chat).

**Main flow — Anonymous voting (decision card)**
1. A decision card is triggered (disruption from Feature 1 reroute, or a manual group conflict).
2. Options + anonymous flag set by creator.
3. Each member casts a vote; if anonymous, individual choice is hidden from other members — only aggregate tally is visible.
4. Card resolves once voting closes; result posted as a system message in chat.

**Main flow — Live location sharing**
1. Member toggles `location_sharing_opt_in` ON (default is off).
2. Their live location appears on the shared in-room map to other opted-in/all members.
3. Member toggles it OFF at any time → location stops updating/disappears from the map.

**Alternate/edge flows**
- Non-member attempts to open a room via an expired/invalid invite link → access denied, clear error.
- Member leaves a room mid-Active-stage → verify their prior votes/comments/expenses remain attached to their historical record but they lose live access.
- Two members vote on a decision card simultaneously near the close deadline → tally must be consistent (no double-count/race).
- A decision card is marked anonymous, but only one member votes → tally should still not reveal that single vote's identity.
- Member never opts into location sharing → verify they can still use every other trip-room feature without it.
- Chat message sent while offline → queued and delivered on reconnect (or clearly failed), not silently dropped.
- Room stage changes (e.g. Planning → Active) while a member has an unsent draft comment/expense → no data loss.

---

## 2b. Budget & Expense Splitting (Splitwise-style)

**Main flow — Manual expense entry**
1. During Planning, a member optionally sets `planned_amount` per budget category.
2. Any member logs an expense: description, amount, currency, payer(s) (single or multiple), category.
3. Member selects a split method: **Equal** (default), **Percentage**, **Shares**, or **Exact amount**.
4. Expense saved → balances recalculated for all involved members.

**Main flow — Receipt scan**
1. Member taps "Scan receipt" → takes/uploads a photo.
2. Photo sent to AI/OCR service → `ocr_status` = processing → completed.
3. Extracted data (merchant, line items, subtotal, tax, total) shown as an editable form.
4. Member reviews, corrects any misread values, confirms → expense saved with `receipt_url` attached.

**Main flow — Settle up**
1. Member opens Budget Dashboard → sees simplified settle-up list (debt-simplification algorithm result — minimum transfers needed).
2. Member records a payment made outside the app (cash/bank transfer) between two users.
3. Balances update; no real payment is processed.

**Alternate/edge flows**
- Expense split by Percentage that doesn't sum to 100% → validation error before save.
- Expense split by Shares with a zero or negative share value → rejected/validated.
- Exact-amount split where entered amounts don't sum to the total → validation error, must reconcile before saving.
- Multiple payers on one expense where payer amounts don't sum to the total → validation error.
- Receipt image is blurry/unreadable → `ocr_status` = failed → user prompted to enter manually instead.
- User edits AI-extracted data before confirming (e.g. corrects a misread total) → saved expense reflects the corrected values, not the raw OCR output.
- Currency differs from other expenses in the room → verify dashboard totals handle/flag mixed currencies rather than silently summing incompatible values.
- A three-or-more-person debt cycle exists (A→B→C→A) → verify simplification collapses it to the minimum transfer count.
- "Settle up" payment recorded for more than the outstanding balance → should be blocked or flagged, not silently accepted.
- Expense deleted/edited after splits already calculated → balances and settle-up list must recompute correctly.
- Member with no `planned_amount` set for a category still logs expenses in it → dashboard shows actual with no planned comparison (not an error).

---

## 3. AI-Suggested Itineraries (Recommendation Engine)

**Main flow**
1. User opens home page.
2. System shows a ranked list of suggested itineraries based on similar travelers (destination + interest tags + budget range as seeded/matched criteria).
3. User taps a suggestion → views details → optionally proceeds to clone it (Feature 8 flow).

**Alternate/edge flows**
- Brand-new user with no preference data yet → home page still shows suggestions from the seeded aggregate dataset, not a blank state.
- No close matches exist for a user's profile → verify a sensible fallback list is shown rather than an empty page.
- User taps the in-app disclosure about anonymized data use → disclosure text is accessible and understandable.

---

## 4. Emergency Call (SOS)

**Main flow**
1. Inside an Active trip room, member taps the SOS button.
2. Confirmation step (recommended to prevent accidental taps) → confirmed.
3. System sends an alert system message + current location to all `trip_room_members` via chat + push notification.
4. Quick-dial button appears, pre-filled with the correct local emergency number auto-detected from the user's GPS/country.
5. Member taps quick-dial → (mocked for demo) shows the correct number/flow without placing a real call.

**Alternate/edge flows**
- SOS triggered with location services denied/unavailable → alert still sends to group, but flags "location unavailable" rather than sending stale/wrong coordinates.
- SOS triggered while user is outside the demo-covered country → emergency number lookup gracefully falls back (or clearly states coverage limits) instead of showing a wrong number.
- Multiple SOS taps in quick succession → system should not spam duplicate alerts to the group.
- SOS triggered in a room still in Planning stage (not yet Active) → verify expected behavior per spec (button visibility should be scoped to Active rooms).
- Member not currently in an active room accessing SOS → button should not be reachable/visible outside a trip room context.

---

## 5. Destination Language Learning

**Main flow**
1. Member opens the room's Language Learning page (scoped to destination language).
2. Browses available mini-lessons (3–5 for demo destination).
3. Selects a lesson → completes quiz-style interactions (multiple choice / matching).
4. Lesson marked complete → progress saved → feeds into Feature 7 badge tracking.

**Alternate/edge flows**
- Member exits a lesson mid-quiz → progress either saved at last completed question or clearly discarded (verify consistent behavior).
- Member retakes a completed lesson → verify it doesn't double-count toward badge progress incorrectly (or confirm intended behavior if replay is meant to be allowed freely).
- Member answers all quiz questions incorrectly → lesson flow still allows completion/retry rather than dead-ending.
- Destination has no lesson content prepared (outside demo scope) → page shows an appropriate empty/coming-soon state, not an error.

---

## 6. Group Album

**Main flow**
1. Room member uploads a photo (or several) to the room album during Active or Archived stage.
2. Photo stored in Supabase Storage; auto-organized by day/location using timestamp + geotag EXIF data.
3. Other members browse the album, grouped by day/location.

**Alternate/edge flows**
- Uploaded photo has no EXIF metadata (e.g. screenshot, stripped metadata) → falls back to sort-by-upload-time instead of breaking the day/location grouping.
- Member attempts to upload during Planning stage → verify album access is correctly restricted to Active/Archived per spec.
- Very large photo file uploaded → verify upload progress/size handling, no silent failure.
- Multiple members upload simultaneously → all photos appear without overwriting/race conditions.

---

## 7. User Profile & Badges

**Main flow**
1. User opens Profile page.
2. Sees list of all `trip_rooms` participated in, with destinations and dates.
3. Sees earned badges (countries visited, trips completed, language lessons finished).

**Alternate/edge flows**
- New user with zero trips → profile shows an empty/encouraging state, not a broken list.
- User completes the qualifying action for a badge (e.g. finishes final language lesson, or a trip room is archived) → badge appears without requiring app restart.
- User participates in a trip room but never completes it (still Planning/Active) → verify it's represented correctly in trip history (vs. only counting Archived trips).

---

## 8. Community (Social Layer)

**Main flow — Friends/follow**
1. User searches for another user → sends a friend request or follows them.
2. Recipient accepts/declines a friend request (follow may be one-directional, depending on final design).

**Main flow — Feed & clone**
1. User browses community feed: recap posts and cloneable-itinerary posts.
2. User taps "Clone" on an itinerary post.
3. System copies that post's `itinerary_items` into a brand-new `trip_room` owned by the current user.
4. New room opens in editable state (Planning stage) — user can now modify it like any owned room (Feature 2 flow resumes).

**Alternate/edge flows**
- User clones the same itinerary twice → two independent trip rooms created, no cross-linking/shared state between them.
- User attempts to friend/follow themselves → blocked.
- Pending friend request is withdrawn/cancelled by sender before acceptance → request no longer appears for recipient.
- User publishes their own trip as a recap/cloneable post → verify it correctly appears in others' feeds and (per spec) feeds into Feature 3's recommendation signal.
- Non-friend browses another user's public feed content → verify visibility rules match intended privacy design (public feed vs. friends-only, per final design decision).

---

## 9. Cross-Feature End-to-End Scenarios

These stitch multiple features into realistic full-trip journeys — the highest-value test paths since they exercise feature boundaries and shared data (`trip_room`, `trip_room_members`, etc.).

**Scenario A — Full trip lifecycle**
1. New user signs up (Feature 0) → creates a trip room (Feature 2, Planning).
2. Plans route + checks safety for destination (Feature 1).
3. Invites friends → they join room (Feature 2).
4. Room moves to Active stage.
5. Group logs expenses via receipt scan and manual entry, splits costs (Feature 2b).
6. A disruption triggers a reroute → decision card raised → group votes anonymously (Feature 1 + 2).
7. Member shares live location; another member triggers SOS during the trip (Feature 2 + 4).
8. Group uploads photos throughout (Feature 6).
9. Members complete language lessons along the way (Feature 5).
10. Trip ends → room archived → settle-up finalized (Feature 2b).
11. Badges awarded on profile (Feature 7).
12. User publishes trip as a recap/cloneable post (Feature 8) → appears in another user's home suggestions (Feature 3).

**Scenario B — Clone-and-restart path**
1. Returning user browses community feed (Feature 8) → clones an itinerary they like.
2. New trip room created in Planning stage, pre-filled with cloned itinerary items.
3. User invites members, edits the cloned itinerary (add/remove stops), regenerates route (Feature 1).
4. Continues as a normal trip room from that point (rejoins Scenario A flow).

**Scenario C — Solo-to-group transition**
1. User creates a room alone, plans the route solo.
2. Adds no members initially — verify solo use of route planning, budget entry (as sole payer), and album upload works without a group.
3. Later invites members mid-Planning — verify existing solo-created data (itinerary, any pre-logged expenses) becomes visible/consistent to new joiners.

**Scenario D — Permission & stage-boundary stress test**
1. Verify each feature's availability against room stage (Planning/Active/Archived) — e.g. SOS only in Active, Album in Active/Archived, budget editable in Planning but expenses logged mostly in Active.
2. Verify a member who leaves/is removed loses room-specific access (chat, location, live route) while historical records (expenses they were part of, comments) remain intact for others.

---

## 10. Test-Focus Checklist (Quick Reference)

- [ ] Auth gates every protected route (no feature reachable while logged out)
- [ ] Session persists across app restarts; logout clears it fully
- [ ] Room stage (Planning/Active/Archived) correctly gates feature availability
- [ ] Anonymous votes never leak identity, even in low-participation edge cases
- [ ] All 4 expense split methods validate correctly (sums must reconcile)
- [ ] OCR failure path falls back to manual entry cleanly
- [ ] Debt-simplification produces minimum transfers, updates on edit/delete
- [ ] Location sharing is strictly opt-in, toggle works both directions in realtime
- [ ] SOS reaches all members with location + correct local emergency number
- [ ] Reroute doesn't race with in-flight route requests
- [ ] Landmarks without pre-generated 3D models degrade gracefully
- [ ] Album grouping degrades gracefully without EXIF data
- [ ] Badges award in realtime on qualifying actions, no restart needed
- [ ] Clone action creates a fully independent, editable new trip room
- [ ] Realtime sync (chat, votes, location, decision cards) has no dropped/duplicated events under concurrent use
