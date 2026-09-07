# ReRoute — Environment & Framework Setup

Source of truth: `docs/ReRoute_Requirements_Refined_v2_2.md` §1 (Tech Stack) and §2 (Data Model). If anything below conflicts with that doc, the doc wins.

**Current phase scope:** Frontend-first. The only backend piece being implemented right now is **Auth** (Supabase Auth: users table, email/password + Google OAuth). Every other domain (trip rooms, itinerary, budget, chat, decision cards, discover, mascot, safety alerts, etc.) is **frontend-only with mock data** for this phase — no tables, RLS, or Edge Functions for those domains yet. Real backend work for them is deferred to a later phase; this doc marks each piece **[Phase 1]** or **[Later]** accordingly.

## Tech Stack Recap (from Requirements v2.2 §1)

- **Frontend:** React Native (Expo)
- **Backend:** Supabase — Postgres + PostGIS
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Realtime:** Supabase Realtime (chat, voting, live location, decision cards, mascot messages)
- **Storage:** Supabase Storage (album photos, receipt images, 3D/photo landmark assets)
- **Maps:** Google Maps API (Directions, Places)
- **Weather API:** provider TBD — drives Trip Room theming + proactive safety analysis
- **Translation API:** provider TBD — real-time translator
- **AI text provider:** TBD — itinerary generation, AI Chatbox, mascot copy, safety summarization (must be the **same** provider across all of these, per Requirements §1)
- **OCR:** TBD — receipt scanning

There is **no separate custom backend server** (no NestJS/Express API layer) — Supabase is the backend. The only "server-side code" is Supabase **Edge Functions**, used specifically where a secret API key can't live on the client (weather, translation, AI, OCR) or where logic must run on a schedule (auto-archive).

---

## Setup Prompt

Use this as the task prompt for scaffolding the project (adapt paths if `/frontend` and `/backend` aren't literal repo folders in your setup — e.g. a single-repo Expo project with a `supabase/` folder at the root is equally valid).

```
Scaffold ReRoute's environment per docs/ReRoute_Requirements_Refined_v2_2.md and AGENTS.md.
Phase 1 scope: frontend-first, mock data everywhere except Auth.

1. Frontend (/frontend) — [Phase 1, full scope]:
   - Initialize an Expo project with TypeScript + Expo Router.
   - Install: @supabase/supabase-js (for Auth only, for now), expo-location,
     expo-notifications, expo-image-picker, expo-constants, react-native-maps
     (or the Expo-compatible Google Maps equivalent), and any date/i18n
     utilities needed for Feature 5.
   - Do NOT install Tailwind, NativeWind, or any CSS-module tooling — styling is
     RN StyleSheet + theme tokens per AGENTS.md.
   - Wire src/lib/supabase/client.ts using EXPO_PUBLIC_SUPABASE_URL and
     EXPO_PUBLIC_SUPABASE_ANON_KEY — used ONLY for Auth calls in this phase.
   - Every non-auth feature (route-planning, trip-room, budget, discover,
     recommendations, album, language, mascot, sos) reads/writes through a
     mock data layer in src/features/<feature>/data — in-memory or local
     JSON fixtures, shaped exactly like the tables in Requirements v2.2 §2,
     so swapping in real Supabase calls later is a drop-in replacement, not
     a rewrite. Do not call Supabase for anything other than Auth yet.
   - Set up the folder structure below exactly; do not invent a different layout.

2. Backend (/backend) — [Phase 1: Auth only]:
   - Initialize a Supabase project via the Supabase CLI (`supabase init`).
   - Write ONLY the Auth-related migration (users table + any Auth-adjacent
     config) and its RLS policy.
   - Configure Auth providers: email/password + Google OAuth.
   - Do NOT create migrations, RLS policies, or Edge Functions for any other
     domain yet (trip rooms, itinerary, budget, chat, decision cards, album,
     landmarks, safety alerts, discover, badges, language) — those are
     [Later], listed below for reference only. Building them now would be
     backend work ahead of the agreed phase scope.
   - Add a minimal seed.sql with 1–2 demo users if useful for local Auth testing.

3. Environment variables (Phase 1):
   - Client-safe (frontend .env / app.config.ts): EXPO_PUBLIC_SUPABASE_URL,
     EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
     (restrict this key by bundle ID/package name and API surface in the
     Google Cloud console — it is still public-facing).
   - Server-only (backend/.env — not needed yet in this phase, listed for
     later): SUPABASE_SERVICE_ROLE_KEY, WEATHER_API_KEY, TRANSLATION_API_KEY,
     AI_API_KEY, OCR_API_KEY.

4. Verify:
   - Frontend: `expo start`, `tsc --noEmit`, `expo lint`.
   - Backend: `supabase start`, `supabase db reset` (applies the Auth
     migration + seed), confirm login/register/OAuth work end-to-end against
     the real Supabase Auth instance while every other screen still runs on
     mock data.
```

---

## /frontend Structure

```
frontend/
├─ app/                              # Expo Router — file-based navigation
│  ├─ (auth)/
│  │  ├─ login.tsx
│  │  ├─ register.tsx
│  │  └─ forgot-password.tsx
│  ├─ (tabs)/
│  │  ├─ _layout.tsx                 # bottom tab bar: Home, Trip, Profile
│  │  ├─ home/
│  │  │  ├─ index.tsx
│  │  │  ├─ discover/[postId].tsx
│  │  │  └─ safety-alert/[alertId].tsx
│  │  ├─ trip/
│  │  │  ├─ index.tsx                # Room List — bypassed if a live trip exists (FR-2-4)
│  │  │  ├─ create.tsx
│  │  │  ├─ join.tsx
│  │  │  ├─ setup/[roomId].tsx       # Preferences Form + Modular Suggestions
│  │  │  └─ room/[roomId]/
│  │  │     ├─ _layout.tsx           # room-level tab bar
│  │  │     ├─ chat.tsx
│  │  │     ├─ itinerary/index.tsx
│  │  │     ├─ itinerary/[dayId].tsx
│  │  │     ├─ maps.tsx
│  │  │     ├─ landmark/[landmarkId].tsx
│  │  │     ├─ budget/index.tsx
│  │  │     ├─ budget/add-expense.tsx
│  │  │     ├─ budget/scan-receipt.tsx
│  │  │     ├─ budget/settle-up.tsx
│  │  │     ├─ album.tsx
│  │  │     ├─ languages/index.tsx
│  │  │     ├─ languages/lesson/[lessonId].tsx
│  │  │     └─ settings.tsx          # Room Settings
│  │  └─ profile/
│  │     ├─ index.tsx                # overview + trip history + badges + starred trips
│  │     └─ settings.tsx
│  └─ _layout.tsx                    # root layout, auth gate, global SOS overlay mount point
├─ src/
│  ├─ core/
│  │  └─ theme/                      # colors (incl. weather-driven palette), typography, spacing
│  ├─ shared/
│  │  └─ components/                 # Button, Card, EmptyState, LoadingState, ErrorState, Avatar...
│  ├─ features/
│  │  ├─ auth/{presentation,data}
│  │  ├─ route-planning/{presentation,data}   # Feature 1: chatbox, preferences, suggestions,
│  │  │                                        # map/reroute, landmarks, safety+news
│  │  ├─ trip-room/{presentation,data}        # Feature 2: room, chat, decision cards, budget
│  │  ├─ recommendations/{presentation,data}  # Feature 3
│  │  ├─ sos/{presentation,data}              # Feature 4
│  │  ├─ language/{presentation,data}         # Feature 5: lessons + translator
│  │  ├─ album/{presentation,data}            # Feature 6
│  │  ├─ profile/{presentation,data}          # Feature 7
│  │  ├─ discover/{presentation,data}         # Feature 8
│  │  └─ mascot/{presentation,data}           # Feature 9
│  ├─ models/                        # shared TS types mirroring the Supabase schema
│  │                                  # (used now by mock data too, so the shape is
│  │                                  # identical when real tables replace it later)
│  ├─ lib/
│  │  ├─ supabase/
│  │  │  ├─ client.ts                # supabase-js client (anon key only) — Auth calls only, Phase 1
│  │  │  └─ types.ts                 # `supabase gen types typescript` output (Auth tables only, Phase 1)
│  │  └─ hooks/                      # cross-feature hooks: useRealtimeChannel, useLiveTrip...
│  │                                  # (Phase 1: these can no-op or read mock data;
│  │                                  # real Realtime wiring is [Later])
│  └─ config/
│     └─ env.ts                      # typed wrapper over expo-constants / app.config values
├─ assets/                           # images, fonts, mascot art
├─ app.config.ts
├─ babel.config.js
├─ metro.config.js
├─ tsconfig.json
├─ package.json
└─ .env.example
```

## /backend Structure

**Phase 1 — build now:**

```
backend/
└─ supabase/
   ├─ config.toml
   ├─ migrations/
   │  └─ 0001_users_auth.sql        # users table + Auth-adjacent config/RLS only
   ├─ seed.sql                       # 1–2 demo users, optional
   └─ tests/                         # Auth policy tests only, if any
```

**[Later] — deferred, not built in this phase.** Do not create these files yet; listed here only so the eventual migration order/table set is already agreed and Phase 2 isn't a redesign:

```
   ├─ migrations/
   │  ├─ 0002_trip_rooms.sql              # incl. start_date/end_date for auto-archive
   │  ├─ 0003_trip_room_members.sql       # incl. is_live_for_user + partial unique index
   │  ├─ 0004_trip_preferences.sql
   │  ├─ 0005_itinerary_days_items.sql    # incl. booking_url, sort_order
   │  ├─ 0006_decision_cards_votes.sql
   │  ├─ 0007_messages.sql
   │  ├─ 0008_budget.sql                  # categories, expenses, splits, receipts, settlements
   │  ├─ 0009_album_photos.sql
   │  ├─ 0010_landmarks_safety_alerts.sql
   │  ├─ 0011_community_posts_starred.sql
   │  ├─ 0012_badges_language.sql
   │  └─ 0013_rls_policies.sql            # (for all of the above)
   └─ functions/                          # Edge Functions (Deno)
      ├─ ai-generate-itinerary/
      ├─ ai-chatbox/
      ├─ mascot-message/
      ├─ weather-theme/
      ├─ safety-check/
      ├─ recent-news/
      ├─ translate/
      ├─ ocr-receipt/
      └─ auto-archive/
```

When Phase 2 starts, the mock data shapes in `src/models` (frontend) should already match this table set closely enough that swapping mock calls for real Supabase queries is mechanical, not a redesign.

---

## Open Items to Confirm Before Full Scaffold

- Weather / translation / AI / OCR provider choices — moot for Phase 1 (deferred), but worth deciding before Phase 2 starts so mock data shapes anticipate real response formats.
- Whether `/frontend` and `/backend` are two folders in one repo or two repos (affects CI config only, not the structures above).
- Google Maps API key restriction settings (bundle ID for iOS, package name + SHA-1 for Android) — set up per platform before first Maps-dependent screen is tested on device (map screen itself can still run on mock route data in Phase 1).
- When to trigger Phase 2 (real backend for non-auth domains) — e.g. once core screens are UI-complete against mock data, or on a fixed sprint boundary.
