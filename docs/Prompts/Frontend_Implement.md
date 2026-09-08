Read:
- AGENTS.md
- docs/DESIGN.md
- docs/UI_REQUIREMENTS.md
- frontend/docs/SCREEN_SPEC.md

Implement the **Trip Room → Discussion (Chat Room)** tab: the message feed (user / system / mascot messages), the Decision Card component (voting + anonymous tally), the Propose Vote action, and the Archived read-only state.

Reference screenshots attached: `TripRoom_Discussion_Live.png` (Planning/Active state) and `TripRoom_Discussion_Archived.png` (Archived state) — match spacing, bubble alignment, and the archived-state banner/disabled-input treatment shown there.

Use:
- `frontend/docs/SCREEN_SPEC.md` for exact layout and component order.
- `DESIGN.md` for styling/tokens (card radii, seasonal accent usage, badge/pill shapes, notification color states).
- `UI_REQUIREMENTS.md` for acceptance criteria per sub-section below.
- `AGENTS.md` for coding rules, folder structure, and the "Explicitly Out of Scope" list.

Context:
- Assume Auth, the core theme (`src/core/theme`), shared components (`src/shared/components`), and the Global Widgets (Top Bar, Notification Center, SOS Floating Overlay, 3-tab Bottom Nav) already exist — reuse them, do not redesign them.
- **Assume the Trip Room shell is already implemented**: the season-themed trip header card (name, dates, live badge, traveler avatars), the in-room tab row (Discussion / Itinerary / Maps / Budget / Album / Language), the Planning/Active/Archived stage indicator that gates the tabs, and Room Settings. Discussion only implements the content *inside* the Discussion tab — do not rebuild the header, tab row, or a second stage indicator.
- **Data model** (from `decision_cards` / `messages` in the shared schema): `messages` — id, room_id, sender_id (nullable), sender_type (`user` / `system` / `mascot`), text, type, created_at. `decision_cards` — id, room_id, trigger_type (`disruption` / `conflict` / `safety_risk`), safety_alert_id (nullable FK), options[], status, anonymous (bool), created_at, resolved_at. `votes` — id, decision_card_id, user_id (hidden if anonymous), chosen_option. Mock these shapes; no backend wiring yet.
- **Folder placement** — Discussion is core Trip Room functionality, not a separate feature: place the message feed, message bubble variants, Decision Card component, and Propose Vote compose sheet under `src/features/trip-room/presentation`. The Decision Card component must be reusable, since it's also the render target for auto-triggered `safety_risk` cards coming from the safety subsystem (`src/features/route-planning/presentation`) — build it once in `trip-room/presentation/components` and have both call sites use it; do not fork a second card component for the safety-triggered case.
- **Mascot messages** need a visually distinct treatment from user/system messages (per FR-2-7/FR-9-2) — check `DESIGN.md` for an existing mascot/notification token before inventing a new color; if none exists, use a consistent tertiary/secondary accent + small mascot icon and flag this as an assumption.
- **Archived stage locking**: when the room's `stage = archived`, the composer and Propose Vote icon are replaced with the disabled placeholder state ("Messages are no longer available for this trip"), an archived banner appears above the Decision Card ("This trip room is archived. You can view past discussions and polls, but new interactions are disabled."), and any open Decision Card's vote button becomes a disabled "Vote End" state — but existing messages/tallies remain fully visible (read-only history, not hidden).
- **Known mismatch, do not silently resolve** — `Design (2).md` Unit 13 (page map / bottom nav) describes an older 4-tab IA with a separate Community/Friends section; `ReRoute_Page_Refined_v2_2.md` (3-tab Home/Trip/Profile, friendship fully removed) is the current source of truth for navigation and screen structure. Use Design(2).md strictly for Units 1–12 and 14 (tokens, spacing, card/button/badge shapes, modal pattern) — do not follow its Unit 13 IA.
- **Known mismatch, flag rather than build** — the reference screenshots show a "Thread · Day 4 – Fushimi Inari sunrise · 2 replies" chip inside one chat bubble. There is no parent-message/reply field in the `messages` schema, and per-itinerary-item comment threads are explicitly removed in scope (all discussion is main-feed-only). Render this as a static, non-interactive reference chip that deep-links to the relevant Itinerary Day (no tap-to-expand replies, no reply composer) and flag in your summary that real threading isn't in the current data model — don't build a nested-reply backend for this task.

Requirements:
- **Message feed**: renders `user`, `system`, and `mascot` messages in one chronological feed, visually distinguished per sender_type (avatar + name for user; centered pill/notice style for system, e.g. "ReRoute Notice: Itinerary updated by Sarah"; mascot icon + distinct bubble tint for mascot). Own messages right-aligned with the user's own accent color; other members' messages left-aligned with avatar + name.
- **Mascot optimistic placeholder (NFR-9-1)**: while a mocked mascot message is "generating," show an optimistic/placeholder bubble in the feed rather than blocking the composer or the rest of the feed.
- **Decision Card component** (in-feed):
  - Title, per-option horizontal tally bars with live percentages, anonymous-toggle indicator, aggregate vote count.
  - Voting: tapping an option casts/updates the current user's vote; if `anonymous = true`, never reveal any individual member's choice — only the aggregate bars and total.
  - `safety_risk`-type cards are tappable and navigate to the existing shared Safety Alert Detail screen (wire navigation only, do not rebuild that screen) resolved via `safety_alert_id`.
  - Card in `resolved` status renders in a locked/read-only tally state (no vote button).
- **Propose Vote action**: toolbar icon beside the message composer opens a compose sheet — trigger type is a choice of `disruption` or `conflict` only (`safety_risk` is auto-triggered elsewhere, never user-selectable here), add/remove option rows (minimum 2 options), anonymous toggle, submit posts a new open Decision Card into the feed.
- **Archived state**: implement exactly as described in Context above — banner, disabled composer/Propose-Vote affordance, disabled "Vote End" card state, full read-only history preserved.
- **Composer**: text input + attach affordance + send button in the live/Planning/Active state; fully replaced by the disabled placeholder text in Archived state (see reference screenshot).
- Do not build: a per-itinerary-item comment thread screen (removed from scope), member "kick"/removal affordances, or any friend-scoped filtering of who can see the feed (friendship feature fully removed — Discussion is simply all current room members).
- Wire navigation only where needed: `safety_risk` Decision Card → Safety Alert Detail; Thread reference chip → read-only deep link to the relevant Itinerary Day (no reply UI).
- Run `expo lint` (or `eslint .` if no Expo lint script exists) and `tsc --noEmit`; fix errors before reporting completion.

Before finishing, summarize:
1. Files changed.
2. Components created/reused, and which feature folder each lives in (confirm the Decision Card is a single shared implementation used by both manual and safety_risk cards).
3. Assumptions made (mocked message/decision-card data shapes, mascot visual treatment if not already defined in DESIGN.md, and the static-chip treatment of the Thread reference).
4. Confirmation that no duplicate Trip Room header, tab row, stage indicator, or Global Widget was created, and that the Archived-state locking matches the reference screenshot (banner, disabled composer, disabled vote, preserved history).
5. Explicit note flagging the Design(2).md Unit 13 IA mismatch and the Thread/reply data-model mismatch, so the team can confirm both before wireframe/UI review.
