Read:
- AGENTS.md
- docs/DESIGN.md
- docs/UI_REQUIREMENTS.md
- frontend/docs/SCREEN_SPEC.md

Implement the **Home** screen: AI Chatbox, Discover (feed + post detail + clone), AI-Suggested Itineraries feed, and the Recent News / Incident banner + Safety Alert Detail.

Use:
- frontend/docs/SCREEN_SPEC.md for exact layout and component order.
- DESIGN.md for styling/tokens.
- UI_REQUIREMENTS.md for required features and acceptance criteria for each of the four Home sub-sections.
- AGENTS.md for coding rules, folder structure, and the "Explicitly Out of Scope" list.

Context:
- Assume Auth, the core theme (`src/core/theme`), and shared components (`src/shared/components`) already exist — reuse them, do not redesign them.
- **Assume the Global Widgets are already implemented** (Top Bar, Notification Center, SOS Floating Overlay, Bottom Nav Bar — see the completed Global Widgets task). Home does **not** build its own header, tab bar, or SOS button:
  - Home renders inside the existing `app/(tabs)/home/index.tsx` route, which already gets the shared `TabBar` for free from `app/(tabs)/_layout.tsx` — do not add a second nav bar.
  - Use the existing `TopBar` shared component for Home's header (avatar + notification icon) rather than building a new one.
  - The `SOSFloatingOverlay` is mounted globally at the root layout and needs no wiring from Home.
  - Home's **Recent News / Incident banner** is a separate in-feed widget, not the Notification Center — but both surface `safety_alerts` data. Reuse the same mocked safety-alert data source already built for Notification Center's alert type in `src/features/route-planning/presentation` (or its `data` layer) rather than standing up a second, parallel mock source — just apply the FR-NAV-6 destination-scoping filter for the in-feed banner's query.
- Home is a **composition** screen, not a single feature's screen: its four sub-sections belong to different features per AGENTS.md's folder rules, so place components accordingly rather than dumping everything into one `home` folder:
  - AI Chatbox → `src/features/route-planning/presentation` (feeds the same generation pipeline as the Trip Setup Preferences Form + Modular Suggestions, FR-1-0 — do not build a second/separate generation path).
  - Discover Feed, Post Detail, Clone action → `src/features/discover/presentation` (public feed only — no "from friends," the friendship feature is fully removed; interaction is **star only**, no like/comment UI, per AGENTS.md's out-of-scope list).
  - AI-Suggested Itineraries feed → `src/features/recommendations/presentation`.
  - Recent News / Incident banner + Safety Alert Detail → `src/features/route-planning/presentation` (safety subsystem) — mock data must be scoped to the current user's own trip destinations only (FR-NAV-6); do not mock a global/all-destinations feed.
  - The Home screen container itself (e.g. `src/features/home/presentation` or the tab route file) composes these, but should stay thin — layout/composition only, not business logic.
- Do not connect backend APIs yet; use mock data per AGENTS.md's mock-first rule for anything whose provider is TBD (AI text, news/safety source).

Requirements:
- Implement only the Home screen and its four sub-sections listed above — do not re-implement the Global Widgets (Top Bar, Notification Center, SOS Overlay, Tab Bar); import and use them as-is.
- Place each sub-section's components in its owning feature folder (see Context), not a single flat `home` folder.
- Reuse shared components where possible (cards, avatars, empty/loading/error states, etc.).
- Create new components only when useful.
- Wire navigation only where needed: Discover post → Post Detail; "Clone" → new editable Trip Room (Planning stage); suggested itinerary tap → optional Clone; news item or an in-chat `safety_risk` decision card → shared Safety Alert Detail screen.
- Run `expo lint` (or `eslint .` if no Expo lint script exists) and `tsc --noEmit`; fix errors before reporting completion.

Before finishing, summarize:
1. Files changed
2. Components created/reused, and which feature folder each lives in
3. Any assumptions made (e.g. shape of mocked AI/news data, since those providers are still TBD)
4. Confirmation that no duplicate Top Bar / Tab Bar / SOS Overlay / Notification Center was created, and that Recent News reused the existing safety-alert mock data source