Read docs/ReRoute_Requirements_Refined_v2_2.md and docs/ReRoute_Page_Refined_v2_1.md, then create frontend/docs/UI_REQUIREMENTS.md

Context:
- Frontend is React Native (Expo) — a mobile app, not a web app.
- Backend is Supabase (Postgres + PostGIS, Auth, Realtime, Storage).
- Figma is used for detailed screen design.
- UI_REQUIREMENTS.md should describe what each screen must do, not exact visual layout.
- DESIGN.md will handle styling/tokens.
- SCREEN_SPEC.md will handle exact Figma layout.

Reconciliation note (apply before writing):
ReRoute_Page_Refined_v2_1.md was written against an earlier requirements version and is now stale in a few places relative to Requirements v2.2. When drafting UI_REQUIREMENTS.md, follow v2.2 wherever the two disagree:
- Drop the "Friends" section entirely (Friends list, Add Friend, friend requests) — the friendship feature is fully removed in v2.2, not just the Friends Chatbox the Page doc flagged as open. Remove "friend requests" from the Notification Center's alert types too.
- Discover Feed is public-only, not "from friends and the public."
- Add: Modular Suggestion items for Accommodation and Transportation must expose an outbound booking/ticket link (FR-1-4a, `itinerary_items.booking_url`) — link-out only, no in-app booking.
- Add: Home's Recent News / Incident banner must be scoped to destinations from the user's own trip rooms only (FR-NAV-6) — not a global feed of all destinations.
- Carry over the Page doc's still-open items (Top Bar theme icon purpose; whether AI Chatbox and the Trip Setup Preferences/Modular flow are one merged entry point or two) into UI_REQUIREMENTS.md as open items rather than guessing an answer.

Required screens:

1. Global Widgets (persistent across the app, not standalone screens — still needs full behavior specified)
   - Top Bar: avatar/profile icon, notification icon
   - Notification Center: safety/weather alerts, decision cards, mascot-delivered notifications, SOS alerts
   - SOS Floating Overlay: persistent across all 3 tabs while a trip is live; includes an SOS Confirm step and a Quick-Dial screen (with an explicit state for location-services-denied)
   - Bottom Nav Bar: Home, Trip, Profile (exactly 3 tabs)

2. Auth
   - Login / Register
   - Onboarding (first-time only): display name + avatar
   - Forgot Password / Reset Password (email/password accounts only)

3. Home
   - AI Chatbox: free-text trip description → review/confirm popup → saved as a new Trip Room
   - Discover: Feed (recap + cloneable-itinerary posts, public only), Post Detail (star only — no like/comment), Clone action
   - AI-Suggested Itineraries feed ("travelers similar to you...")
   - Recent News / Incident banner (scoped to the user's own trip destinations) + Safety Alert Detail (shared with the in-room `safety_risk` decision card link-out)

4. Trip
   - Room List / Create Room / Join Room (by invite link or code)
   - Trip Setup: Preferences Form (Companions/Style/Pace) + Modular Suggestions (Transportation/Accommodation/Attractions, accept/reject per item, booking/ticket link on Accommodation & Transportation items)
   - Trip Room Page (tabs within a selected room):
     a. Room Settings — public toggle, manual Archive, Edit Preferences shortcut, manual "Start Trip" action
     b. Chat Room — messages incl. mascot messages, in-feed Decision Card (vote UI, anonymous indicator, tally), Propose Vote action (manual disruption/conflict cards)
     c. Itinerary — Day List (editable title + notes per day), Day Detail (+Transportation / +Attractions / +Stay, drag-reorder)
     d. Maps — route + ETAs, Reroute action, live-location layer toggle, Landmark Detail (photos, drop-off point; 3D tab shown only when available, otherwise fully hidden)
     e. Budget — Dashboard (planned vs actual, per-person balance), Add Expense (with split-method inline validation), Scan Receipt/OCR flow, Settle Up
     f. Album — photo grid auto-grouped by day/location, upload also available from within a Day Detail view
   - Languages — Select Language, lesson list, Lesson/Quiz, progress tracker, Translator (also reachable as a quick-access shortcut during an active trip)

5. Profile
   - Profile Overview (user info, edit avatar/name)
   - Trip History + Badges + Starred Trips — one paginated screen with three sections, not three separate screens (per NFR-7-1)
   - Settings
   - Logout

6. App Mascot — not a destination screen. Document it as a presentation layer only (distinct sender in Chat Room, push → Notification Center). Confirm in UI_REQUIREMENTS.md that no dedicated Mascot screen is expected.

For each screen (or tightly-coupled screen group, e.g. the Budget sub-screens), include:
- Purpose
- Required UI sections
- Required fields (reference the relevant table/fields from Requirements v2.2 §2 where applicable)
- User actions
- Empty/loading/error states if needed
- Acceptance criteria (reference the relevant FR/NFR IDs from Requirements v2.2 where possible)

Keep it practical and not overengineered — this is a hackathon build, not a production system.
