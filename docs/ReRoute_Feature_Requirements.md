# ReRoute — Feature Requirements Document

*CodeNection 2026 — Lifestyle Track: Planning an Escape*

Purpose: this document is the shared source of truth for Feature 0 (Auth) and Features 1–8. Whoever builds a feature — manually or with an AI coding tool — should reference this doc directly (or paste the relevant section into the tool) so all parts stay consistent in naming, data structure, and scope.

Legend used throughout: **Real** = build fully working for the demo. **Mocked** = simulated for the demo (see note for how). **TBD** = not yet decided, team must confirm before building.

---

## 1. Tech Stack

- Frontend: React Native (Expo)
- Backend: Supabase — Postgres database with the PostGIS extension enabled (for geospatial queries: live location, routes, nearby landmarks)
- Auth: Supabase Auth
- Realtime: Supabase Realtime (used for chat, voting, live location, decision cards)
- Storage: Supabase Storage (photos, album, pre-generated 3D model assets)
- Maps: Google Maps API (Directions, Places)
- AI text tasks (itinerary summarization, safety check summarization, recommendation logic): provider TBD by team — Claude or OpenAI API both work; keep this consistent across features, do not mix providers per feature.
- OCR / receipt extraction: provider TBD by team — e.g. a multimodal AI API (Claude/GPT vision) reading the receipt image directly, or a dedicated OCR service (Google Cloud Vision) feeding text into the AI provider for structuring. Pick one approach and keep it consistent.

---

## 2. Shared Data Model (high-level)

Not a full schema, but the core entities every feature references. Keep field names exactly as listed so features integrate without remapping.

- `users` — id, email, auth_provider (email / google), name, avatar, home_country, badges[]
- `trip_rooms` — id, name, destination, stage (planning / active / archived), created_by
- `trip_room_members` — room_id, user_id, role, location_sharing_opt_in (boolean)
- `itinerary_items` — id, room_id, name, lat, lng, scheduled_time, tags[], compromise_reason (text, nullable)
- `decision_cards` — id, room_id, trigger_type (disruption / conflict), options[], status (pending/resolved), anonymous (boolean)
- `votes` — id, decision_card_id, user_id (hidden from other users if anonymous), chosen_option
- `comments` — id, itinerary_item_id, user_id, text, created_at
- `messages` — id, room_id, sender_id (nullable if system message), text, type (user / system_decision_card), created_at
- `budget_categories` — id, room_id, category_name, planned_amount (nullable, set during trip planning)
- `expenses` — id, room_id, category_id (nullable), description, total_amount, currency, paid_by[] (one or more user_ids + amount each, supports multiple payers), receipt_url (nullable), created_by, created_at
- `expense_splits` — id, expense_id, user_id, split_type (equal / percentage / shares / exact), share_value, amount_owed
- `receipt_scans` — id, expense_id, image_url, ocr_status (processing / completed / failed), extracted_data (merchant, line_items[], subtotal, tax, total) — extracted_data is AI-generated and editable by the user before confirming
- `settlements` — id, room_id, from_user_id, to_user_id, amount, method (recorded manually — no real payment processing), settled_at
- `album_photos` — id, room_id, uploaded_by, url, taken_at, lat, lng
- `landmarks` — id, name, lat, lng, model_asset_url (nullable — only set for the pre-generated demo set), info_text, fun_facts[]
- `safety_alerts` — id, destination, risk_level, summary, source_url, fetched_at
- `community_posts` — id, user_id, type (recap / cloneable_itinerary), content, linked_room_id (nullable)
- `friendships` — user_id, friend_id, status
- `language_lessons` — id, destination, lesson_content, quiz_questions[]
- `badges` — id, user_id, badge_type, earned_at

---

## 3. Feature Specs

### Feature 0 — Authentication & Onboarding

Foundational feature: every other feature requires a logged-in user, so this must be built first.

**User stories**
- As a new user, I want to sign up with my email/password or my Google account, so I can start using the app quickly.
- As a returning user, I want to log in and stay logged in, so I don't have to re-authenticate every time I open the app.
- As a user, I want to log out and reset my password if needed.

**Functional requirements**
- Sign-up and login supported via two methods: (1) email + password, (2) Google sign-in (OAuth), both through Supabase Auth.
- On first sign-up, user is taken through a short onboarding flow to set their display name and avatar, creating their `users` record.
- Session persistence: once logged in, user stays logged in across app restarts until they explicitly log out (Supabase session/token handling).
- Logout available from the profile page (Feature 7).
- Password reset flow available for email/password accounts.
- Auth state gates access to the rest of the app — all trip room, community, and profile features require a logged-in user.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Email/password signup + login | Real — via Supabase Auth |
| Google sign-in | Real — via Supabase Auth OAuth |
| Email verification step | Skipped for the demo — accounts usable immediately after signup without confirming email |
| Session persistence | Real |
| Password reset | Real |
| Onboarding (name + avatar) | Real |

---

### Feature 1 — AI Route Planning, 3D Landmarks & Safety Check

**User stories**
- As a traveler, I want to input the places I want to visit and get the best route with ETAs, so I don't have to plan logistics manually.
- As a traveler, I want transport options compared for me (train vs bus, timing), so I can pick the most convenient one.
- As a traveler, I want to reroute instantly if plans change, so I don't have to replan from scratch.
- As a traveler, I want to tap a landmark on the map and see a 3D preview plus interesting facts, so I feel more excited and informed about where I'm going.
- As a traveler, I want to be warned if my destination has current safety risks, so I can make informed decisions.

**Functional requirements**
- User inputs one or more destination points; system calls Google Directions API to compute the optimal route and per-leg ETA.
- Route is rendered on an embedded Google Map with all stops marked in order.
- For each leg, system displays available transport modes with next departure times (e.g. next train, next bus) where API data supports it.
- "Reroute" action re-runs route generation with updated constraints (e.g. a stop removed/added, current time) and updates the map + ETA live.
- Tapping a landmark pin opens a detail view: 3D model viewer (pinch to zoom, drag to rotate) + info panel (history, notable facts, e.g. film locations).
- Safety check: system periodically queries a news/search API for the destination and flags relevant risk items (conflict, disaster, unrest, severe weather) with a summary and source link, shown as a non-intrusive banner/notification.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Route generation + ETA + map | Real — use live Google Directions API |
| Transport suggestions | Real if API/timetable data available for demo route; otherwise clearly labeled sample data (TBD) |
| Reroute | Real — re-run the same route logic |
| 3D landmark models | Mocked — small pre-generated set of 3D models for a few chosen demo landmarks only, not all locations |
| Landmark info panel | Real — can be written/pulled content per demo landmark |
| Safety check | Real — live API search against current events for the demo destination |

Open item: team needs to choose which 2–4 landmarks get pre-generated 3D models, and confirm the demo destination(s) so route, safety check, and 3D content are all scoped to the same place(s).

---

### Feature 2 — Travel Group / Trip Room

**User stories**
- As a group member, I want to vote anonymously on decisions, so I'm not pressured by louder members.
- As a group member, I want to comment on specific attractions, so I can share thoughts without cluttering the main chat.
- As a group member, I want a chatbox for general discussion.
- As a group member, I want to opt in to sharing my live location, so my group can find me if needed, without being forced to share it.
- As a group member, I want to log an expense and split it with the group (equally, by percentage, by shares, or by exact amount), so everyone knows who owes what.
- As a group member, I want to scan a receipt with my camera and have the app read the amount (and ideally line items) automatically, so I don't have to type it all in manually.
- As a group member, I want the app to tell me the simplest way to settle up with the group, so we don't end up with confusing chains of who-owes-who.

**Functional requirements — Room, mediation, chat, location**
- Room created with a unique invite link/code; members join via that link.
- Room has 3 stages: Planning, Active, Archived — UI and available actions differ per stage.
- Decision cards (see Feature 1 reroute / disruption and general group disagreements) support an anonymous voting mode: individual votes are hidden from other members, only the aggregate tally is shown.
- Each `itinerary_item` supports a comment thread visible to all room members.
- Room-wide chatbox supports normal user messages plus inline system messages (e.g. decision cards) in the same feed.
- Each member has a `location_sharing_opt_in` toggle, off by default; when on, their live location appears on a shared in-room map; can be turned off anytime.

**Functional requirements — Budget & expense splitting (Splitwise-style)**
- Members can optionally set a `planned_amount` per `budget_categories` entry during the Planning stage, for later comparison against actual spend.
- Any member can log an expense: description, amount, currency, who paid (supports a single payer or multiple payers on one expense), and category.
- Each expense must specify a split method: **Equal** (divided evenly among selected members), **Percentage** (each member assigned a %), **Shares** (each member assigned a relative weight, e.g. 2 shares vs 1 share), or **Exact amount** (manually enter what each person owes).
- Expenses can be added by scanning a receipt: user takes/uploads a photo, the app sends it to an AI/OCR service, which returns merchant name, line items, subtotal, tax, and total as editable `extracted_data` — user reviews and confirms/corrects before the expense is saved.
- The app maintains running balances per member per room, and applies a debt-simplification algorithm so the group sees the minimum number of payments needed to settle all balances (e.g. instead of A owes B, B owes C, C owes A, it collapses to the fewest direct transfers).
- "Settle up" lets a member record a payment (cash, bank transfer, etc.) between two members, updating balances — no real payment processing required, this is a record-keeping action only.
- Budget dashboard shows: planned vs actual per category, total spent, per-person contribution vs. share owed, and the simplified settle-up list.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Room creation/join | Real |
| Anonymous voting | Real |
| Comments on itinerary items | Real |
| Chatbox | Real |
| Live location sharing | Real for members in the demo (opt-in toggle functional) |
| Manual expense entry + all 4 split methods | Real |
| Receipt OCR/AI scanning | Real — send photo to AI/OCR API, return editable extracted data |
| Debt simplification algorithm | Real — standard graph-based min-cash-flow simplification |
| Settle up (record payment) | Real — record-keeping only, no real payment/bank integration |
| Budget dashboard (planned vs actual) | Real |

---

### Feature 3 — AI-Suggested Itineraries (Recommendation Engine)

**User stories**
- As a user opening the home page, I want to see itinerary suggestions based on what similar travelers liked, so I get inspiration without starting from scratch.

**Functional requirements**
- System aggregates anonymized behavior/preference data across all users (e.g. destinations chosen, itinerary items kept vs removed, tags liked) — no personally identifying info attached to the aggregate model.
- Home page surfaces a ranked list of suggested itineraries generated from patterns in that aggregate data (collaborative-filtering style: "travelers similar to you also did...").
- Suggestions link into Feature 8 (Community): a suggested itinerary can be a `cloneable_itinerary` sourced from `community_posts`.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Real aggregate ML/recommendation model | Mocked — use a small seeded/sample dataset instead of real cross-user data (not enough real users during a hackathon); logic can be a simplified rule-based match instead of true ML |
| Home page suggestion UI | Real UI, fed by the seeded data above |

Design note: define "similar traveler" using at least destination + interest tags + budget range as matching criteria. Also plan a short in-app disclosure that anonymized data feeds this feature, for transparency.

---

### Feature 4 — Emergency Call (SOS)

**User stories**
- As a traveler in an emergency, I want one tap to alert my whole group with my location, so they know immediately something is wrong.
- As a traveler in an emergency, I want quick access to the correct local emergency number for the country I'm in, so I don't have to look it up.

**Functional requirements**
- SOS button visible within an active trip room.
- On tap: (1) sends an alert message + current location to all `trip_room_members` via a system message + push notification, and (2) shows a quick-dial button pre-filled with the correct local emergency number, auto-detected from the user's current GPS location/country.
- Local emergency number lookup should cover at minimum the demo destination country; broader country coverage is a stretch goal.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Group alert (system message + location) | Real |
| Quick-dial to local emergency number | Mocked/UI-only — button shows the correct number and flow, but does not actually place a call for the demo |

---

### Feature 5 — Destination Language Learning

**User stories**
- As a traveler, I want short interactive lessons in the local language for my destination, so I can communicate basic needs while traveling.

**Functional requirements**
- Dedicated page per trip room showing mini-lessons scoped to the destination language.
- Lessons are interactive, quiz-style (multiple choice / matching), similar to a lightweight Duolingo, not just a static phrasebook.
- Content scoped to travel-relevant scenarios: ordering food, asking directions, checking in, emergency phrases.
- Progress tracking (lessons completed) feeds into Feature 7 badges.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Lesson content | Real but limited — prepare a small set of lessons (e.g. 3–5) for the demo destination language only |
| Quiz interaction + progress tracking | Real |

---

### Feature 6 — Group Album

**User stories**
- As a group member, I want all our trip photos in one shared place, automatically organized, so we don't lose them across everyone's phones.

**Functional requirements**
- Any room member can upload photos to the room album.
- Photos auto-organized by day/location using timestamp and geotag metadata.
- Album accessible during Active and Archived stages.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Photo upload + storage | Real — Supabase Storage |
| Auto-organization by day/location | Real if EXIF metadata available on uploaded photos; otherwise sort by upload time as fallback |

---

### Feature 7 — User Profile with Trip History Badges

**User stories**
- As a user, I want to see my past trips and earned badges on my profile, so I have a record of my travel history and feel motivated to keep exploring.

**Functional requirements**
- Profile page lists all `trip_rooms` the user has participated in, with basic stats (destinations, dates).
- Badges awarded for milestones: countries visited, trips completed, language lessons finished (linking to Feature 5).

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Trip history list | Real |
| Badges | Real — small fixed set of badge types for the demo |

---

### Feature 8 — Community (Social Layer)

**User stories**
- As a user, I want to add friends and follow other travelers, so I can see where they've been and get inspired.
- As a user, I want to browse a feed of trip recaps and full itineraries, and clone an itinerary I like into my own trip room.

**Functional requirements**
- Users can send/accept friend requests and follow other users.
- Community feed shows two post types: photo/recap posts, and `cloneable_itinerary` posts.
- Clicking "clone" on an itinerary post copies its `itinerary_items` into a new `trip_room` owned by the current user, which they can then edit.
- Cloned/published itineraries feed into Feature 3's recommendation data as an additional signal.

**Build scope for hackathon**

| Component | Build scope |
|---|---|
| Friends/follow | Real |
| Feed (recap + cloneable itinerary posts) | Real |
| Clone itinerary into new room | Real |

---

## 4. Cross-Feature Dependencies

| Feature | Depends on |
|---|---|
| All features | Feature 0 (Auth) — a logged-in user is required everywhere; build this first |
| Feature 2 (Trip Room) | Core container — Features 1, 4, 5, 6 all live inside a trip_room and need it to exist first |
| Feature 3 (Recommendations) | Needs seeded/sample usage data; optionally enriched by Feature 8 cloned itineraries |
| Feature 4 (SOS) | Needs trip_room_members and location data from Feature 2 |
| Feature 7 (Badges) | Needs trip history from Feature 2 and lesson completion from Feature 5 |
| Feature 8 (Community) | Clone action creates a new Feature 2 trip_room; feeds Feature 3 |

---

## 5. Open Items — Team Must Confirm Before Building

- Exact demo destination(s) — needed to scope Feature 1 (route + 3D landmarks + safety check) and Feature 5 (language) consistently.
- Which 2–4 landmarks get pre-generated 3D models.
- AI provider for text tasks (Claude API vs OpenAI API) — pick one and use it consistently across features.
- News/search API choice for the safety check feature.
- Whether transport timetable data is available/mockable for the chosen demo destination.
- OCR/receipt-scanning approach: multimodal AI vision API vs. dedicated OCR service + separate AI parsing step — affects cost and latency, team should test both quickly if time allows.
- Default split method shown first in the expense form (recommend Equal as the default, since it's the most common case, with the other three as alternate tabs/options).

---

## 6. Next Step

Once these open items are confirmed, we move to a separate **UI Requirements Document** — defining the style guide (colors, typography, component style) and screen-by-screen designs — so all features share one visual language regardless of who builds which part.
