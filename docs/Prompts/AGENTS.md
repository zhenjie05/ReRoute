# Agent Instructions

## Project

ReRoute — a mobile trip-planning & group-travel app. This is a **React Native (Expo)** app, not a web app.

Build against `docs/ReRoute_Requirements_Refined_v2_2.md` (source of truth for FR/NFR, data model, and build scope). If a task conflicts with that doc, stop and flag it — don't silently reinterpret.

## Tech Stack

- React Native (Expo)
- TypeScript
- Backend: Supabase (Postgres + PostGIS, Auth, Realtime, Storage)
- Maps: Google Maps API (Directions, Places)
- Weather API (Trip Room theming, safety/weather analysis) — provider TBD, mock behind an interface until confirmed
- Translation API (real-time translator) — provider TBD, mock behind an interface until confirmed
- AI text tasks (itinerary generation, AI Chatbox, mascot messages, safety summarization) — provider TBD, mock behind an interface until confirmed
- Styling: React Native StyleSheet / a theme-token system (see Folder Rules) — no Tailwind/CSS variables, this is not a web app

## Main Rules

- Use reusable components; do not duplicate UI across screens.
- Keep screens clean and not too large — extract sections into components.
- Do not place all UI directly inside one screen file.
- Use mock data first for anything whose provider/API is still **TBD** in the requirements doc (weather, translation, AI text, OCR, news/safety-risk source) — mock it behind a typed interface so the real integration is a drop-in swap later.
- Do not add new packages unless necessary; if a screen needs a capability Expo doesn't provide out of the box, check for an existing Expo SDK module first.
- Do not modify backend (Supabase schema/policies/functions) or unrelated files without an explicit task for it.
- Respect feature **Build Scope** labels in the requirements doc: `Real` = build fully working, `Mocked` = simulate, `Out of scope` / `Removed` = do not build. Do not silently upgrade a Mocked item to Real or resurrect a Removed one (e.g. friendships/follow, member-kick) without being asked.

## Folder Rules

- Shared reusable components go in `src/shared/components`.
- App theme (colors incl. weather-driven theme palette, typography, spacing tokens) goes in `src/core/theme`.
- Feature-specific screens and components go in `src/features/<feature>/presentation`.
- Feature mock data goes in `src/features/<feature>/data`.
- Common models go in `src/models` — align field names/types with the data model in `docs/ReRoute_Requirements_Refined_v2_2.md` §2 (e.g. `trip_rooms`, `trip_room_members`, `itinerary_items`, `decision_cards`, `safety_alerts`) so mock data and future Supabase types line up.
- Feature slugs should match the requirements doc's feature names, e.g.: `auth`, `route-planning` (Feature 1), `trip-room` (Feature 2), `recommendations` (Feature 3), `sos` (Feature 4), `language` (Feature 5), `album` (Feature 6), `profile` (Feature 7), `discover` (Feature 8), `mascot` (Feature 9).

## UI Rules

- Follow `docs/DESIGN.md` for tokens and style rules.
- Follow `docs/UI_REQUIREMENTS.md` and `docs/SCREEN_SPEC.md` for exact per-screen layout.
- Navigation is exactly 3 bottom tabs: **Home, Trip, Profile** (FR-NAV-1) — do not add a 4th tab (Community/Discover lives inside Home; there is no standalone Discover tab).
- Use responsive layouts that work across common phone screen sizes (small phones through large phones/tablets).
- Avoid horizontal overflow; use `SafeAreaView`, `FlexBox` layouts, and scrollable containers (`ScrollView`/`FlatList`) where content can exceed the viewport.
- Avoid fixed pixel widths/heights unless necessary (e.g. fixed-size icons/avatars); prefer flex-based sizing and `Dimensions`/`useWindowDimensions` only when truly needed.
- Respect feature-level UI constraints from the requirements doc, e.g.:
  - Global SOS button renders as a persistent overlay across all 3 tabs while a trip is live (FR-4-1, NFR-4-1).
  - Trip Room theme color transitions smoothly (≤500ms), no flicker (NFR-2-2).
  - 3D landmark tab is hidden entirely (not shown disabled) for landmarks outside the pre-generated set (FR-1-7).
  - Shared/public trip interactions expose **star only** — do not build like/comment UI (FR-NAV-4, FR-8-4).

## React Native / Expo Rules

- Prefer functional components with hooks; no class components.
- Keep business logic out of component render functions — extract to hooks (`src/features/<feature>/presentation/hooks`) or a data layer.
- Use `const` and memoization (`useMemo`/`useCallback`, `React.memo`) where it meaningfully avoids re-renders (lists, map markers, chat feeds) — don't over-memoize trivial components.
- Use Supabase Realtime subscriptions (chat, voting, live location, decision cards, mascot messages) via a shared hook/client, not ad hoc per-screen socket handling.
- Any screen reading/writing `trip_room_members.is_live_for_user` must treat "one live trip per user" as server-enforced (NFR-2-1) — client code should handle the server rejecting a second live trip gracefully, not assume it can't happen.
- Long-running or scheduled behavior (auto-archive on trip date expiry) is a backend/Supabase concern (cron/scheduled function) — do not fake this with client-side timers.

## Explicitly Out of Scope — Do Not Build

Per the requirements doc, these must not be implemented even if a design/screenshot seems to imply them:
- Friend requests, friendships, or a "follow" mechanic (fully removed in v2.2 — no `friendships` table exists).
- Comments or likes on shared/public trips (starring only).
- Owner-initiated member removal ("kick") from a Trip Room.
- In-app booking/payment for suggested hotels/transport — suggestions link out via `booking_url` only (FR-1-4a).
- Auto-transition of a Trip Room from Planning → Active on `start_date` — this is an explicit owner "Start Trip" action (FR-2-2a).
- A global/all-destinations news feed — Recent News is filtered to the user's own trip destinations only (FR-NAV-6).

## Before Finishing

Run:

- `expo lint` (or `eslint .` if no Expo lint script is configured)
- `tsc --noEmit`
- A relevant Expo build/bundle check if the change affects app config (`app.json`/`app.config.ts`) or native dependencies

Fix errors before reporting completion.

## Figma Screenshot Reference Rule

The screenshots in `docs/screenshots/` are exported from Figma and are used as visual/layout references only.

When implementing UI:

- Do not attempt to extract or reuse any underlying code from the screenshots.
- Translate the visual layout into React Native/Expo components by interpreting the screenshot.
- Preserve the same screen hierarchy and component order as seen in the screenshot.
- Preserve visible labels, section names, and navigation structure.
- Where a screenshot conflicts with `docs/ReRoute_Requirements_Refined_v2_2.md` (e.g. shows a 4th tab, a like/comment button, or a friends list), **the requirements doc wins** — flag the conflict rather than silently building the screenshot's version.
- Use `docs/DESIGN.md` for design tokens and style rules.
- Use `docs/SCREEN_SPEC.md` for exact page layout.
