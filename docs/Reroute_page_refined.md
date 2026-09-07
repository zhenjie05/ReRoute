# ReRoute — Refined Page/Screen Structure

## Global Widgets
- Top Bar: Avatar/Profile icon, Theme icon, Notification icon
- Notification Center (opens from bell icon) — system alerts: safety warnings, decision cards, SOS alerts, friend requests
- Nav Bar: Home, Trip, Community, Profile

## Auth
- Login / Register
- Onboarding (post-signup, first-time only): set display name + avatar → creates `users` record
- Preferences: favourite country / home_country
- Forgot Password / Reset Password flow (email/password accounts only)

## Home
- AI Chatbox → user describes desired trip → AI generates itinerary → **Popup Tab** to review/confirm → Save to Trip Rooms
- AI Analysis (recommended itineraries feed) → tap **Clone** → auto-creates a new Trip Room (Planning stage)
- Recent News / Incident banner (safety check for upcoming/active trip destinations)
- Safety Alert Detail (tap a news/incident item → full summary + source link)

## Trip
### Rooms
- Room List: select existing trip / **+ Add New Trip** (manual creation, or via AI Chatbox/Clone)
- Create/Join Room screen: name + destination (create), or enter invite link/code (join)
- Room stage indicator (Planning / Active / Archived) — gates which tabs below are available

### Trip Room Page (tabs within a selected room)
- **Chat Room** — group messages + inline system messages (decision cards, reroute alerts, SOS alerts)
  - Decision Card component (in-feed): vote UI, anonymous toggle indicator, aggregate tally
- **Maps** — route with ETAs, stop markers, transport options per leg, **Reroute** action
  - Landmark Detail screen (tap pin → 3D model viewer + info panel/facts)
  - Live location moved here as a map layer (toggle: share my location) rather than a separate item
- Itinerary Item Detail — per-stop comment thread (separate from main Chat Room)
- **Budget** (expand into sub-screens — was a single item):
  - Budget Dashboard: planned vs actual, per-person balance, settle-up list
  - Add Expense form: description, amount, currency, payer(s), category, split method (Equal / Percentage / Shares / Exact)
  - Scan Receipt flow: camera/upload → OCR processing state → editable extracted data → confirm
  - Settle Up screen: record a payment between two members
- **Album** — photo grid, auto-grouped by day/location, upload action
- **Emergency (SOS)** — SOS button
  - SOS Confirm step (prevent accidental tap)
  - Quick-Dial screen: local emergency number (mocked call action) + confirmation that group was alerted

### Languages
- Select Language (per current/upcoming trip destination)
- Language Page: lesson list → individual Lesson/Quiz screen (multiple choice / matching) → progress tracker

## Community
### Community
- Feed: friends'/public posts — recap posts and cloneable-itinerary posts
- Post Detail screen (full recap, or itinerary preview before cloning)
- Clone action → creates new editable Trip Room (same as Home's AI Analysis clone)
- In-app disclosure note: anonymized data feeds recommendations (transparency, per spec)

### Friends
- Friends list / Add Friend (search, send/accept requests)
- Friends Chatbox *(note: not in original data model — see Refinement Notes)*

## Profile
- Profile Overview: user info, edit avatar/name
- Trip History list (past `trip_rooms`, destinations, dates)
- Badges display (countries visited, trips completed, lessons finished)
- Settings
- Logout

---

## Refinement Notes (Gaps Found vs. Original `Reroute_page.md`)

1. **Auth**: original had no Onboarding or Password Reset screens, both are explicit "Real" requirements in Feature 0 — added.
2. **Feature 1 (Route/3D/Safety)**: "Maps" alone can't carry landmark 3D viewer, per-leg transport comparison, or reroute — added Landmark Detail as its own screen; safety check needed a detail view, not just a home-page banner, since it's a live per-trip signal, not only global news.
3. **Feature 2 (Trip Room)**: Anonymous voting/decision cards had no screen — they're system-message-driven per spec, so modeled as an in-feed component rather than a separate page. Itinerary comment threads are distinct from room chat per data model (`comments` vs `messages`) — added as its own screen.
4. **Feature 2b (Budget)**: single "Budget" item was too flat for 4 split methods + OCR receipt scanning + settle-up, which are each substantial flows — expanded into Dashboard / Add Expense / Scan Receipt / Settle Up.
5. **Feature 4 (SOS)**: original jumped straight to "Emergency calls" — added a confirm step (avoid accidental alerts) and a quick-dial result screen matching the mocked-call spec.
6. **Feature 5 (Language)**: "Language feature" was a placeholder — broken out into lesson list → lesson/quiz screen → progress, since quizzes are the core interaction, not just content display.
7. **Feature 7 (Profile/Badges)**: original Profile only listed generic "Profile feature" — Trip History and Badges are explicit spec requirements, added as dedicated sections.
8. **Community/Friends**: structure matches spec well. Flagged **Friends Chatbox** as a scope addition not present in the shared data model (no `friend_messages` entity) — confirm with team whether this is in scope or should be dropped/deferred.
9. **AI Chatbox vs. AI Analysis (Home)**: both map to real spec features (Feature 3 recommendations = AI Analysis; free-form generation = an unspec'd but reasonable extension of Feature 1/3 combined) — flagged so the team explicitly confirms the free-form "describe your trip" generator is in scope for the hackathon, since it isn't named in the requirements doc.
10. **Notifications**: top bar had a notification icon but no destination screen — added Notification Center so alerts (safety, decision cards, SOS, friend requests) are actually reachable.

All 9 features (0–8) now map to at least one concrete screen; no requirement is currently screen-less.
