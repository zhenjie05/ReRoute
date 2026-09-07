# ReRoute — Refined Page/Screen Structure (v2)

*Aligned to `ReRoute_Requirements_Refined.md` (v2) and the validated `ReRoute_Workflow_Refined.md`.*
Legend: **[NEW]** added by v2 · **[CHG]** restructured/moved · **[REMOVED]** dropped, not in v2 scope · **[OPEN]** needs team confirmation.

---

## Global Widgets
- Top Bar: Avatar/Profile icon, Notification icon. **[OPEN]** The old manual "Theme icon" — confirm whether it's app light/dark mode (kept) or is superseded by the new automatic season-driven Trip Room theming (FR-2-3), in which case it shouldn't be a user-facing toggle at all.
- Notification Center (bell icon) — system alerts: safety/weather warnings, decision cards, **mascot-delivered notifications [NEW]**, SOS alerts, friend requests.
- **SOS Floating Overlay [NEW, CHG from Trip-Room-only]** — persistent floating button visible across **all 3 tabs** whenever the user has a live trip (FR-4-1). Not scoped to being inside a Trip Room screen.
  - SOS Confirm step (prevent accidental tap)
  - Quick-Dial screen: local emergency number (mocked) + confirmation group was alerted
- Nav Bar: **Home, Trip, Profile** **[CHG — Community tab removed, 4→3 tabs]**

---

## Auth
*(Unchanged.)*
- Login / Register
- Onboarding (first-time only): display name + avatar → `users` record
- Preferences: favourite country / `home_country` *(this is the user-level Auth field — distinct from the new per-trip `trip_preferences` under Trip → Rooms below; don't conflate the two)*
- Forgot Password / Reset Password (email/password accounts only)

---

## Home
- AI Chatbox → user describes desired trip → feeds into the same generation pipeline as the new **Preferences Form + Modular Suggestions** (Trip section) rather than a separate one-shot popup **[CHG]** — Popup Tab to review/confirm → Save to Trip Rooms.
- **Discover module [NEW, merged from Community]** — browsable trip reviews from friends and the public, search filters (destination, style, pace, budget):
  - Discover Feed: recap posts + cloneable-itinerary posts
  - Post Detail screen (full recap, or itinerary preview before cloning) — **interaction limited to Star only; no like/comment UI anywhere [CHG]**
  - Clone action → new editable Trip Room (Planning)
  - In-app disclosure note: anonymized data (incl. starred/cloned signals) feeds recommendations
- AI-Suggested Itineraries feed ("travelers similar to you...") → tap suggestion → optionally Clone
- Recent News / Incident banner (safety check for upcoming/active trip destinations)
- Safety Alert Detail (tap a news item, **or tap a `safety_risk` Decision Card from any Trip Room chat [NEW link]** → same screen, full summary + source + weather snapshot)

---

## Trip
### Rooms
- Room List: select existing trip / **+ Add New Trip**
- Create/Join Room screen: name + destination (create), or invite link/code (join)
- Room stage indicator (Planning / Active / Archived) — gates tabs below
- **[CHG]** If the user has a live trip (`trip_room_members.is_live_for_user = true`), the Trip tab bypasses this list entirely and opens that room directly

### Trip Setup (new, precedes itinerary generation) **[NEW]**
- **Preferences Form**: Travel Companions (Solo/Family/Couple/Friends/Elderly), Travel Style (Cultural/Classic/Nature/Cityscape/Historical), Travel Pace (Ambitious/Moderate/Relaxed) — saved per room, editable later
- **Modular Suggestions**: three reviewable modules — Transportation / Accommodation / Attractions — accept/reject per item, optimized against time/budget + saved preferences

### Trip Room Page (tabs within a selected room)
- **Chat Room** — group messages + system messages + **mascot messages (sender_type = mascot), visually distinguished [NEW]**
  - Decision Card component (in-feed): vote UI, anonymous toggle indicator, aggregate tally; **`safety_risk`-type cards link out to Safety Alert Detail (see Home) for traceability [NEW]**
- **Itinerary** **[NEW screen group, replaces flat item list]**
  - Day List: `itinerary_days`, each with editable title + notes
  - Itinerary Day Detail: three add-actions — **"+ Transportation"**, **"+ Attractions"**, **"+ Stay"**; items within a day are drag-reorderable
- **Maps** — route with ETAs, stop markers, transport options per leg, **Reroute** action; live location as a toggleable map layer
  - **Landmark Detail screen [CHG — photos/info primary]**: real photographs, history/fun facts, **exact drop-off point**, shown by default; **3D model viewer moved to a secondary tab**, present only for the 2–4 pre-generated landmarks
- ~~Itinerary Item Detail — per-stop comment thread~~ **[REMOVED]** — comments on itinerary items are deprecated per the data model; no `comments` entity exists. All discussion happens in Chat Room.
- **Budget** (unchanged structure):
  - Budget Dashboard: planned vs actual, per-person balance, settle-up list
  - Add Expense form: description, amount, currency, payer(s), category, split method
  - Scan Receipt flow: camera/upload → OCR state → editable extracted data → confirm
  - Settle Up screen: record a payment between two members
- **Album** — photo grid, auto-grouped by day/location (EXIF-based); **upload also available from within a Day Detail view, tagging the photo with that `itinerary_day_id` directly [NEW]**
- ~~Emergency (SOS)~~ **[MOVED to Global Widgets]** — no longer a Trip Room-scoped tab; see SOS Floating Overlay above.

### Languages
- Select Language (per current/upcoming trip destination)
- Language Page: lesson list → Lesson/Quiz screen → progress tracker
- **Translator [NEW]**: text input/output, real-time; reachable both from the Language Page and as a quick-access shortcut during an Active trip (e.g. from the Chat Room toolbar) for on-the-go use

---

## ~~Community~~ **[REMOVED as standalone tab]**
Folded entirely into **Home → Discover** (feed, filters, post detail, clone) and **Home → Friends** below. No independent nav destination remains — this closes the FR-NAV-2 requirement and removes the deep-link target that must now redirect to Home.

### Friends **[CHG — relocated under Home]**
- Friends list / Add Friend (search, send/accept requests)
- ~~Friends Chatbox~~ **[REMOVED, pending confirmation]** — no `friend_messages` entity in the data model and not named in v2 requirements; drop unless the team explicitly reinstates it as a new scope item.

---

## Profile
- Profile Overview: user info, edit avatar/name
- Trip History list (past `trip_rooms`, destinations, dates)
- Badges display (countries visited, trips completed, lessons finished)
- **Starred Trips section [NEW]** — all posts the user has starred via Discover, resolved through `linked_room_id`
- Settings
- Logout

*(Per NFR-7-1, Trip History + Badges + Starred Trips should load as one paginated query set, not three separate screens/round-trips — same screen, three sections.)*

---

## App Mascot **[NEW — no dedicated full screen]**
The mascot is a presentation layer, not a destination: it appears as a distinct sender in Chat Room, and its alerts surface via push notification → Notification Center. Full personality/animation is mocked/simplified per Build Scope — confirm no separate "Mascot" screen is expected before UI design proceeds.

---

## Coverage Check

All of Features 0–9 (including the new Feature 9 Mascot and the Global Nav restructure) now map to at least one concrete screen or explicitly-justified non-screen (Mascot). No v2 requirement is screen-less, and no v1-only screen (Community tab, per-item comments, Trip-Room-scoped SOS, 3D-first landmark view) survives unflagged.

## Open Items Carried to UI Design
1. Top Bar "Theme icon" purpose (app light/dark vs. superseded by auto season theming).
2. Friends Chatbox — confirm drop or reinstate as scoped work.
3. Whether the Home "AI Chatbox" free-form generator and the Trip section's Preferences Form + Modular Suggestions are one merged flow or two entry points into the same backend — needs one UX decision before wireframes.
