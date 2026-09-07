You are helping clean up a frontend codebase before pushing to Git.

Project context:
- This is ReRoute, a **React Native (Expo)** mobile app — not a Next.js/web app.
- Source lives at the repo root under `src/` (see `AGENTS.md` folder rules: `src/shared/components`, `src/core/theme`, `src/features/<feature>/presentation`, `src/features/<feature>/data`, `src/models`), plus an `app/` directory if the project uses Expo Router for file-based navigation.
- Stack: Expo, React Native, TypeScript, Supabase client, Realtime subscriptions, Google Maps SDK, and mocked interfaces for weather/translation/AI providers that are still TBD (per `AGENTS.md`) — no Tailwind, no CSS modules, no Next.js API routes.
- Use Fallow as the code cleanup/review tool.
- Do not rewrite the whole app architecture.
- Do not change UI behavior unless there is a clear bug.
- Do not delete files blindly.

Task:
Use Fallow to identify cleanup opportunities such as unused code, dead files, circular dependencies, duplicate code, dependency issues, and complexity hotspots.

Steps:
1. Run the normal project checks first:
   - `pnpm lint` (or `expo lint` / `eslint .` — whichever is actually configured)
   - `pnpm test`, if tests exist (Jest/React Native Testing Library)
   - `pnpm tsc` or `tsc --noEmit` for a full type check
   - Skip a production `build`/`eas build` here — that's a packaging step, not a useful cleanup-verification gate; typecheck + lint + test is the equivalent for this pass.

2. Run Fallow on the app source:
   - `npx fallow ./src`

   Also check these if present:
   - `npx fallow ./app` (Expo Router routes, if used)
   - `npx fallow ./src/shared/components`
   - `npx fallow ./src/features`
   - `npx fallow ./src/core`
   - `npx fallow ./src/models`

3. Review the Fallow report carefully.

4. Prioritize fixing:
   - unused imports
   - unused variables
   - unused components
   - unused utility functions
   - duplicate components or helper functions
   - circular imports
   - unused dependencies
   - overly complex components
   - leftover experimental files
   - inconsistent feature-folder imports (e.g. a `discover` component reaching into `route-planning/presentation` internals instead of a shared/public export)

5. Be careful with React Native/Expo conventions.
   Do not remove a file only because it looks unused if it may be used by:
   - Expo Router file-based routes (`_layout.tsx`, `index.tsx`, `[param].tsx`, `+not-found.tsx`), if the project uses Expo Router
   - `app.json` / `app.config.ts` and other Expo config files
   - `babel.config.js`, `metro.config.js`
   - platform-specific files (`*.ios.tsx`, `*.android.tsx`, `*.native.tsx`)
   - native module linking / config plugins
   - dynamic imports
   - Storybook, if configured
   - tests
   - generated files (e.g. Supabase generated types)
   - image/font/asset files referenced only via string paths
   - environment-based code (`expo-constants`, `.env` via `app.config.ts`)
   - mock data modules under `src/features/<feature>/data` that back a feature whose real provider is still TBD (weather, translation, AI text, OCR) — these are intentionally the only implementation for now, not dead code (see `AGENTS.md`'s mock-first rule)

6. Do not remove or break:
   - existing Expo Router routes / navigation
   - shared UI components (`src/shared/components`)
   - the Supabase client and API/query functions used by screens or hooks
   - form validation logic
   - authentication/session logic (Supabase Auth)
   - Realtime subscription hooks (chat, voting, live location, decision cards, mascot messages)
   - navigation/tab-bar logic (the 3-tab Home/Trip/Profile structure)
   - environment variable usage
   - reusable hooks
   - feature folder boundaries (`src/features/<feature>/presentation` vs `data`)
   - loading/error/empty states
   - responsive layout logic (flex-based sizing, `SafeAreaView`, scroll containers)
   - accessibility props (`accessibilityLabel`, `accessibilityRole`, etc.)

7. For React Native/Expo cleanup:
   - Keep components small and readable.
   - Move repeated logic into hooks or utility functions only when it clearly reduces duplication.
   - Remove unused props only after checking parent components/screens.
   - Avoid unnecessary state if derived values can be computed directly.
   - Avoid unnecessary `useEffect` when normal render logic or a derived value is enough.
   - Don't over-memoize trivial components; keep `useMemo`/`useCallback`/`React.memo` where they meaningfully help (lists, map markers, chat feeds) per `AGENTS.md`.

8. Make the smallest possible cleanup changes.
   Do not redesign modules, rename public APIs, or change folder structure unless required to fix an actual issue.

9. After cleanup, run again:
   - `pnpm lint`
   - `pnpm test`, if tests exist
   - `tsc --noEmit`
   - `npx fallow ./src`

10. Show me:
    - files changed
    - what was removed
    - what was refactored
    - what Fallow warnings remain
    - which warnings were intentionally ignored and why
    - any risky areas I should manually review before pushing

Important:
Do not auto-delete code without explaining why. If unsure whether something is safe to remove — especially a mock data module for a still-TBD provider — leave it and add a note instead.