Before coding, read and follow these project documents:

- `AGENTS.md`
- `ReRoute_Requirements_Refined_v2_2.md`
- `ReRoute_Page_Refined_v2_2.md`
- `ReRoute_Workflow_Refined_v2_2.md`
- `Design (2) - Copy.md`
- `docs/UI_REQUIREMENTS.md` if present
- `frontend/docs/SCREEN_SPEC.md` if present

For product scope and behavior, use the following priority:

1. `ReRoute_Requirements_Refined_v2_2.md`
2. `ReRoute_Page_Refined_v2_2.md`
3. `ReRoute_Workflow_Refined_v2_2.md`
4. the attached Language reference screenshots
5. `Design (2) - Copy.md` for visual styling only where it does not conflict with the refined v2.2 documents

Do not silently resolve conflicts by inventing product behavior. If the repository or documents leave something undefined, implement only what is safely supported and report the gap in the completion summary.

---

# Task

Implement the **Trip Room → Language** frontend experience.

The Language experience contains two internal sub-tabs:

1. **AI Translator**
2. **Lessons**

The implementation must match the attached screenshots closely while remaining aligned with Feature 5 in the refined requirements:

- destination-language mini-lessons
- quiz-style learning
- progress tracking
- Profile/Badge integration
- real-time, API-backed translation
- Active-trip quick access to the Translator

Language is part of the existing Trip Room experience. Do not rebuild the Trip Room shell or any Global Widget.

---

# Reference screenshots

Use the attached screenshots as the primary visual reference for this task:

- `ReRoute Trip Room - Language AI Translator.png`
- `ReRoute Trip Room - Language Lessons.png`
- `ReRoute Language Lesson - Active.png`
- `ReRoute Trip Room - Language complete lesson.png`
- `ReRoute Trip Room - Language Complete Session.png`

If the actual filenames in the repository differ slightly in capitalization or wording, use the existing screenshot files rather than creating duplicate assets.

Match the screenshots for:

- page spacing
- card hierarchy
- Trip Room Language-tab placement
- `AI Translator / Lessons` segmented control
- translation card structure
- orange/seasonal CTA treatment
- lesson-list cards
- progress presentation
- phrase card
- quiz-answer layout
- completion-card layout
- bottom spacing above the existing navigation

Do not treat screenshot-only details as new backend requirements unless they are also supported by the project documents.

---

# Confirmed product scope from v2.2

The Language implementation must support:

- a dedicated Language experience scoped to the current/upcoming trip destination
- 3–5 real demo lessons
- travel-scenario lesson content
- quiz-style interactions
- real progress tracking
- lesson completion feeding Profile/Badges
- a real-time translator using an API-backed translation service
- text input/output
- source/target language selection
- Translator access from the Language page
- Translator quick access while a trip is Active
- a translator loading state
- graceful validation/error handling
- a target translator response time of approximately `< 2s` for normal phrase-length requests

Offline/cached common phrases are a stretch goal and are not required for demo completion.

---

# Existing application context

Assume these already exist and must be reused:

- Auth
- core theme
- shared components
- Supabase/data layer
- existing navigation
- existing Trip Room shell
- existing Trip Room stage handling
- season-themed trip header card
- room name / destination / date display
- traveler avatars
- live badge
- in-room main tab row
- Room Settings
- Top Bar
- Notification Center
- SOS Floating Overlay
- 3-tab bottom navigation: **Home / Trip / Profile**

Language implements only the content belonging to the Language experience.

Do not create another:

- Trip Room header
- room main-tab row
- stage indicator
- Top Bar
- bottom navigation
- notification widget
- SOS overlay
- Trip Room shell

---

# Important navigation/design mismatch

`Design (2) - Copy.md` contains stale information architecture in parts of the document.

In particular:

- Unit 5 still describes an older 4-destination bottom navigation
- Unit 13 contains older page-map / Community / Friends structure
- some older Global Widget wording also predates the refined v2.2 IA

For navigation and screen structure, the current source of truth is:

- `ReRoute_Requirements_Refined_v2_2.md`
- `ReRoute_Page_Refined_v2_2.md`
- `ReRoute_Workflow_Refined_v2_2.md`

The current bottom navigation is:

- Home
- Trip
- Profile

Use `Design (2) - Copy.md` for visual tokens and reusable styling patterns, especially layout, spacing, seasonal accents, cards, buttons, pills, shadows, and typography, but do not reintroduce old navigation destinations.

---

# Folder placement

Language is Trip Room functionality.

Prefer placement under:

```text
src/features/trip-room/presentation
```

Follow the repository's existing naming and folder conventions rather than forcing a new structure.

A reasonable structure, only if compatible with the existing project, is:

```text
src/features/trip-room/presentation/
  components/
    language/
      LanguageSubTabs.*
      DestinationLanguageSelector.*
      AiTranslatorPanel.*
      TranslatorLanguageSelector.*
      TranslatorResultCard.*
      LessonStreakCard.*
      LessonCategoryCard.*
      LessonProgress.*
      LessonPhraseCard.*
      LessonQuizOptions.*
      LessonCompletionCard.*
  screens/
    TripRoomLanguage.*
    LanguageLesson.*
```

Do not create a separate top-level `language` feature if the existing architecture treats this as part of `trip-room`.

The Translator must have a **single reusable implementation** shared by:

1. Trip Room → Language → AI Translator
2. the Active-trip Translator quick-access entry point

Do not fork or duplicate Translator UI/business logic.

---

# Data and service rules

## Existing shared schema

The refined shared data model defines:

```text
language_lessons
- id
- destination
- lesson_content
- quiz_questions[]
```

and:

```text
badges
- id
- user_id
- badge_type
- earned_at
```

Use the existing repository schema/types/migrations as the source of truth.

Do not create a conflicting frontend-only persistence schema.

---

## Lesson progress persistence

Feature 5 requires **real progress tracking**, and completed lessons feed Profile/Badges.

Before implementing persistence:

1. inspect the existing Supabase schema/migrations/services for a user lesson-progress entity or equivalent
2. reuse it if it exists
3. reuse the existing badge-award path if it exists

If no persistent lesson-progress contract exists in the repository:

- do not silently invent a database table as part of this frontend task
- implement the frontend state/UI cleanly
- create/consume a clearly isolated progress repository/service interface if that matches current architecture
- explicitly report the missing persistence contract as a blocker/gap
- do not claim persistent progress + badge integration is complete until it is backed by the real project data layer

Temporary in-screen state may be used during an active quiz, but final progress tracking must not be treated as mock-only.

---

## Translation service

The real-time Translator is **API-backed** in the v2.2 build scope.

Before implementing it:

1. inspect the existing service/data layer for a translation service or backend endpoint
2. reuse the existing abstraction if present
3. do not place secret provider credentials directly in React Native source code
4. do not hard-code a specific provider if the project still treats the provider as TBD

If the translation endpoint/provider is not yet configured:

- implement the frontend integration contract cleanly
- keep the real API path as the intended completion path
- report the missing provider/endpoint as an integration blocker
- do not replace the final implementation with a fake translator and report it as complete

Seeded fallback content may be used only for development/preview where clearly marked.

---

# Frontend view models

Frontend presentation types may normalize backend content for rendering without changing the persistent schema.

Example:

```ts
type LanguageLessonViewModel = {
  id: string;
  destination: string;
  title: string;
  subtitle: string;
  icon?: string;
  scenario: 'ordering_food' | 'directions' | 'check_in' | 'emergencies' | 'greetings';
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  lessonContent: LessonPhraseViewModel[];
  quizQuestions: LessonQuizQuestionViewModel[];
};
```

```ts
type LessonPhraseViewModel = {
  id: string;
  nativeText: string;
  romanization?: string;
  meaning?: string;
  audioUri?: string;
};
```

```ts
type LessonQuizQuestionViewModel = {
  id: string;
  prompt: string;
  choices: string[];
  correctChoiceIndex: number;
  type: 'multiple_choice' | 'matching';
};
```

```ts
type TranslatorRequest = {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
};
```

```ts
type TranslatorResult = {
  translatedText: string;
  romanization?: string;
};
```

These are presentation/service shapes only. Reuse repository types if equivalents already exist.

---

# 1. Trip Room → Language container

Implement the Language content inside the existing Trip Room page.

Requirements:

- reuse the current trip header
- reuse the existing room-tab row
- keep `Language` selected in the room tabs
- reuse the existing stage/shell behavior
- do not render a second header or second bottom nav
- keep content within the existing mobile layout and safe-area rules

Inside the Language content, render a two-option segmented control:

- **AI Translator**
- **Lessons**

Switching sub-tabs must stay within the same Trip Room context.

The selected Language sub-tab should remain stable while the Language screen remains mounted.

---

# 2. Language sub-tabs

Match the screenshot treatment closely.

Requirements:

- two segments only
- visible active state
- translator/lightning icon for AI Translator
- lesson/book-style icon for Lessons
- use the existing icon package
- reuse theme tokens
- no separate top-level navigation route is required merely to switch between the two sub-tabs

Recommended behavior:

```text
Trip Room
└── Language
    ├── AI Translator
    └── Lessons
```

---

# AI TRANSLATOR

# 3. AI Translator screen

Implement the Translator card shown in:

`ReRoute Trip Room - Language AI Translator.png`

The visible hierarchy should contain:

1. `AI Live Translator` title
2. source-language selector
3. swap-language control
4. target-language selector
5. text input
6. character count
7. optional detected/context label if supported by the existing UI/data
8. translation result card
9. copy action
10. optional speaker action
11. optional romanization
12. primary `Translate Now` CTA

Use the screenshot's English → Japanese content as the default/demo presentation.

Example:

```text
English (US)
        ⇄
Japanese (日本語)

Where is the nearest subway entrance?
```

The implementation must not be hard-coded so that the component can only represent Japanese.

---

# 4. Source / target language selection

The Translator must support source and target language selection.

Requirements:

- show current source language
- show current target language
- provide a swap control
- swapping preserves the user's entered text
- selecting a language updates the request parameters
- avoid allowing identical source and target languages if the existing product pattern already prevents it
- reuse an existing picker / bottom sheet / modal pattern if one exists

Do not create a large new language-selection subsystem if the project already has a shared selection component.

---

# 5. Translator input

Support:

- text typing
- paste
- multiline input
- empty-input validation
- very-long-input handling
- visible character count
- clear loading state
- clear retryable error state

The screenshot uses a `200` character counter. Use `200` as the frontend demo limit unless an existing project constant defines another limit.

For input longer than the accepted limit:

- prevent additional input or gracefully truncate according to the project's existing text-input pattern
- do not crash
- keep the counter accurate

The Translate button must be disabled for empty/whitespace-only input.

---

# 6. Translate Now behavior

`Translate Now` must perform a real translation request through the project's translation service/API integration.

Required state flow:

```text
idle
→ translating
→ success
```

or:

```text
idle
→ translating
→ error
→ retry
```

Requirements:

- show loading immediately after submission
- do not freeze the screen
- avoid duplicate requests from rapid repeated taps
- ignore or cancel stale responses when a newer request has replaced them
- target `< 2s` for typical phrase-length input, consistent with NFR-5-1
- if the response exceeds the target, keep a visible loading state
- failed requests must show a clear retry state

Do not present an old translation as if it belongs to the newest input.

---

# 7. Translation result card

Match the screenshot's result-card hierarchy.

Include:

- result label
- translated native-language text
- copy button
- optional speaker button
- optional romanization block

The **copy action must work**, because the workflow explicitly expects the user to copy/use translated text.

When copying succeeds:

- use the project's existing toast/feedback pattern if available
- avoid creating a new notification system

Romanization is screenshot-driven but not guaranteed by the Feature 5 requirements.

Therefore:

- display romanization only when the translation/service result supplies it, or when the existing repository has a supported transliteration helper
- do not add a second external transliteration API solely for this task unless already part of the project

---

# 8. Microphone and speaker affordances

The screenshots include microphone/speaker-style controls.

These are secondary to the confirmed Feature 5 scope.

Rules:

- if speech-to-text or text-to-speech infrastructure already exists, reuse it
- do not add new speech permissions, SDKs, or provider integrations solely for this task without an existing project requirement
- if unavailable, keep these controls visually consistent with the screenshot but do not misrepresent them as fully implemented
- report their status in the completion summary

Do not let optional speech features block the required text Translator.

---

# 9. Active-trip Translator quick access

The Translator must also be reachable during an **Active** trip.

Requirements:

- reuse the same Translator screen/component
- do not build a second Translator
- wire the Active-trip quick-access affordance to the same Translator implementation
- preserve the current room context and destination language
- do not duplicate the Trip Room shell

Preferred routing concept:

```text
Trip Room → Language → AI Translator
                     ↑
Active Trip Shortcut ┘
```

If an Active-trip quick-access location already exists in `SCREEN_SPEC`, `UI_REQUIREMENTS`, or current code, use it.

If the repository does not yet define where the shortcut lives, wire the route/interface without inventing a new global navigation destination and report the placement assumption.

---

# LESSONS

# 10. Destination language selection

The Page Structure requires **Select Language** for the current/upcoming trip destination.

The Lessons screen should display the current destination language, matching the screenshot style.

Example:

```text
Destination Language
Japanese
```

Requirements:

- resolve the default language from the current room/destination using the existing project data/mapping if available
- allow the user to open the existing/new lightweight selector from this Language experience
- changing the selected destination language refreshes the lesson list and Translator target where appropriate
- do not silently invent a global user-language preference if the product scope only defines this per trip/destination

For the hackathon demo, Japanese may remain the prepared content language if that matches the chosen demo destination.

---

# 11. Lessons overview

Implement the Lessons overview shown in:

`ReRoute Trip Room - Language Lessons.png`

Screen hierarchy:

1. Language sub-tabs
2. streak card
3. destination-language label/value
4. lesson-category list

The screenshot's streak card may be used for presentation.

Important:

- streak is screenshot-driven and is not defined as a persistent entity in the refined shared data model
- do not create a new backend streak schema in this frontend task
- use existing user/progress data if a streak concept already exists
- otherwise treat the displayed streak as demo/UI data and report that assumption

---

# 12. Demo lesson set

Feature 5 requires **3–5 real lessons**.

Use 5 demo lesson categories to match the screenshot density while covering the required travel scenarios.

Recommended set:

1. **Ordering Food**
2. **Greetings**
3. **Getting Around**
4. **Check-in**
5. **Emergencies**

This preserves the screenshot structure while ensuring the required scenarios are represented:

- ordering food
- directions / getting around
- check-in
- emergencies

`Greetings` may remain as the fifth demo lesson.

Do not use `Shopping` as the only replacement for `Check-in`, because check-in is explicitly part of the Feature 5 scenario scope.

---

# 13. Lesson category cards

Each lesson card should support:

- icon
- title
- short subtitle
- status
- progress indicator
- tap/open behavior

Supported UI states:

- not started
- in progress
- completed

Match the screenshot treatment for:

- completed check icon
- in-progress percentage/progress ring
- inactive/not-started state
- rounded white cards
- seasonal/orange active treatment

Do not visually mark a lesson as locked unless the project actually defines sequencing/locking.

If lesson sequencing is not defined, use `not started` rather than inventing a hard lock.

---

# 14. No-content / Coming Soon state

If the selected destination/language has no prepared `language_lessons` content:

- show an explicit empty state
- use wording such as `Lessons coming soon`
- keep the Translator accessible
- do not show a broken/empty list
- do not substitute unrelated destination lessons

This must cover the workflow edge case for a destination with no prepared lesson content.

---

# ACTIVE LESSON

# 15. Lesson/Quiz screen

Implement the active lesson view shown in:

`ReRoute Language Lesson - Active.png`

Reuse existing app navigation and Trip Room context.

Do not render a duplicate app shell.

The lesson experience should contain:

1. progress summary
2. progress bar
3. phrase card
4. native phrase
5. optional romanization
6. optional audio action
7. quiz prompt
8. answer choices
9. previous / next controls
10. current phrase/question indicator

---

# 16. Lesson progress UI

The screenshot example shows:

```text
16 of 25 phrases mastered today
64%
```

The displayed values must derive from lesson/session progress rather than being hard-coded.

Track at minimum:

- current question/phrase index
- total question/phrase count
- answered count
- correct count
- completion status

Use the repository's persistent progress source when available.

---

# 17. Phrase card

Render:

- native-language phrase
- romanization when available
- speaker/audio affordance when supported

Screenshot example:

```text
ありがとうございます
Arigatō gozaimasu
```

Do not assume all languages require romanization.

The layout must handle longer phrases without clipping.

---

# 18. Quiz interactions

Feature 5 explicitly requires quiz-style learning using:

- multiple choice
- matching

For the demo:

- implement the question types supported by the prepared 3–5 lessons
- at minimum, multiple-choice must work because it is shown in the screenshots
- if matching questions are present in `quiz_questions[]`, render them using a consistent reusable interaction rather than flattening them incorrectly

Multiple-choice behavior:

- one active answer at a time
- visible selection
- evaluate against the correct answer
- update progress/accuracy
- allow movement to the next question
- use existing success/error design tokens if available

All-wrong behavior:

- the lesson must not dead-end
- user must still be able to complete or retry according to the chosen lesson flow

---

# 19. Previous / next controls

Render controls matching the screenshot:

- previous
- current phrase/question number
- next

Requirements:

- previous disabled at the first item
- next advances correctly
- index display updates
- progress updates
- do not allow index underflow/overflow
- restoring an in-progress lesson should return to the saved point if persistence exists

---

# 20. Exit mid-lesson behavior

The workflow requires a consistent behavior if the user exits during a quiz.

Preferred behavior for this build:

- persist progress at the last completed question using the existing progress data layer
- when reopened, restore the in-progress lesson

If the repository currently defines a different behavior, follow it.

If no persistence contract exists:

- do not silently claim resume is implemented
- report the limitation clearly

---

# 21. Retaking a completed lesson

Retaking a completed lesson must not incorrectly double-count badge progress.

Requirements:

- allow retake unless existing product behavior says otherwise
- keep the lesson's completed status
- do not award the same completion milestone repeatedly
- update any new score/accuracy only according to the existing persistence rules

If badge-award idempotency is handled in the backend, reuse that logic rather than duplicating it in presentation code.

---

# COMPLETION STATES

# 22. Lesson Complete screen

Implement the completion screen shown in:

`ReRoute Trip Room - Language complete lesson.png`

Include:

- trophy icon
- `Lesson Complete!`
- mastered/completed summary
- time spent
- accuracy
- primary `Continue to Next Lesson` CTA
- secondary `Back to Trip Rooms` action

Screenshot example values include:

```text
25 phrases
12m
92%
```

Actual values should derive from the session/progress state when possible.

On completion:

1. mark the lesson complete through the real progress path
2. persist completion
3. trigger/refresh badge eligibility through the existing Profile/Badge flow
4. do not require an app restart for the new badge/progress state to become visible

---

# 23. Complete Session screen

Implement the separate screenshot state shown in:

`ReRoute Trip Room - Language Complete Session.png`

Include:

- completion/trophy card
- time spent
- accuracy
- congratulatory message
- `Back to Trip Rooms` CTA

The screenshots imply two end states:

1. a completed lesson with another lesson available
2. a completed overall lesson session/set

The refined requirements do not explicitly define the exact trigger separating these two presentation states.

For the demo, it is acceptable to treat the second state as the completion of the final available lesson in the prepared lesson set, but:

- keep this trigger isolated and easy to change
- report it as a screenshot-driven assumption
- do not create new backend semantics solely for this distinction

---

# 24. Profile / Badge integration

Feature 5 progress feeds Feature 7 badges.

When a qualifying lesson completion occurs:

- use the existing badge-award/data path
- ensure the qualifying `lessons finished` badge can appear without restarting the app
- ensure retakes do not repeatedly award/count the same completion
- refresh/invalidate the relevant Profile/Badge query/store according to the project's data architecture

Do not build a new Profile screen or a duplicate Badge component here.

Wire/update the existing flow only.

---

# TRIP ROOM STAGE BEHAVIOR

# 25. Planning / Active / Archived behavior

The refined documents confirm that Trip Rooms have Planning, Active, and Archived stages, but they do not define a separate Language-specific Archived locking design.

Therefore:

- reuse the existing Trip Room stage gating
- do not invent a new Language-specific archived banner
- do not invent new read-only lesson rules unless they already exist elsewhere in the repository/spec
- keep Active-trip Translator quick access available only where the existing Active-trip behavior supports it
- follow existing shell behavior for Archived rooms

If Language behavior differs by stage in existing `SCREEN_SPEC`, `UI_REQUIREMENTS`, or code, follow that implementation and report it.

---

# VISUAL IMPLEMENTATION

# 26. Design system usage

Use the existing ReRoute theme/tokens.

Relevant styling patterns from `Design (2) - Copy.md` include:

- mobile-first max-width layout
- safe-bottom spacing
- seasonal accent ramp
- background/card surfaces
- large soft card radii
- seasonal primary buttons
- pill-shaped badges
- tight 8–12px internal gaps
- larger 16–28px section spacing
- soft elevation/shadow

Do not hard-code a second visual system.

Use existing theme values whenever available in:

```text
src/core/theme
src/shared/components
```

---

# 27. Seasonal styling

The Trip Room already has destination/season-driven theming.

Language components should inherit the active Trip Room theme.

Use seasonal/theme tokens for:

- active segmented tab
- primary CTA
- lesson progress accent
- active lesson card accent
- completion emphasis where appropriate

Do not hard-code the Tokyo/Japanese screenshot's orange into every destination if the app theme already provides the current seasonal accent.

---

# 28. Responsive/mobile behavior

The screenshots are mobile references.

Ensure:

- no horizontal overflow
- long Japanese/translated text wraps
- lesson titles do not clip
- answer buttons grow vertically for longer text
- language names can wrap/truncate cleanly
- result text remains selectable/copyable where supported
- content remains accessible above the fixed bottom navigation
- safe-area spacing follows the existing app pattern
- keyboard opening does not permanently hide the Translate CTA/input

---

# ERROR / LOADING / EDGE STATES

# 29. Translator states

Implement and verify:

- empty input
- whitespace-only input
- maximum-length input
- over-limit input
- normal loading
- slow response
- successful response
- network failure
- API/service error
- retry
- repeated/rapid Translate taps
- source/target swap
- stale-response prevention

If offline cache is not implemented:

- show a clear offline/retry state
- do not claim offline translation support

Offline cached phrases remain stretch/TBD.

---

# 30. Lesson states

Implement and verify:

- lesson list loaded
- no lesson content
- not-started lesson
- in-progress lesson
- completed lesson
- exit mid-quiz
- resume mid-quiz when persistence supports it
- all answers wrong
- retake completed lesson
- final lesson completion
- completion/badge refresh

---

# 31. Loading states

Do not block the entire Trip Room while only one Language operation is loading.

Examples:

- Translator request → show loading inside Translator area/button/result state
- Lessons loading → show local skeleton/loading state
- progress save → keep completion UI responsive and show error/retry if save fails according to existing project pattern

Avoid full-screen spinners unless the existing navigation/data layer already uses them.

---

# Navigation to wire

Wire/reuse only what is required:

```text
Trip Room
└── Language
    ├── AI Translator
    └── Lessons
         ├── Lesson List
         ├── Lesson / Quiz
         ├── Lesson Complete
         └── Complete Session
```

Additional required access:

```text
Active Trip Quick Access
└── same AI Translator implementation
```

And existing integration:

```text
Lesson Completion
└── existing Profile / Badges data flow
```

Do not add:

- a new bottom-nav Language destination
- a new Map bottom-nav destination
- Community/Friends navigation
- duplicate Trip Room routes
- duplicate Profile/Badge screens

---

# Explicitly out of scope

Do not build as part of this frontend task:

- a new translation provider selected arbitrarily when the provider is still TBD
- secret API keys embedded in frontend source
- a second Translator implementation
- a new backend lesson-progress schema without repository/product confirmation
- a new backend streak schema
- full speech-to-text infrastructure unless already present
- full text-to-speech infrastructure unless already present
- offline translator phrase cache unless the team explicitly chooses the stretch goal
- downloadable language packs
- social/friend lesson leaderboard
- new friendship/community features
- a new Trip Room shell
- a new bottom navigation
- a new Top Bar
- a new stage indicator
- a new SOS widget
- unrelated Discussion / Itinerary / Maps / Budget / Album implementation

---

# Implementation order

Use this order to reduce accidental duplication:

1. inspect existing Trip Room Language-related code/routes
2. inspect existing shared theme/components
3. inspect translation service/API abstraction
4. inspect `language_lessons` data/service
5. inspect lesson-progress persistence
6. inspect badge-award integration
7. build/reuse the Language container + segmented control
8. implement API-backed Translator
9. implement Lessons overview
10. implement active Lesson/Quiz
11. implement lesson completion/progress persistence
12. wire Profile/Badge refresh
13. wire Active-trip Translator shortcut
14. run validation/tests
15. report any unsupported/missing backend contracts explicitly

Do not start by creating new parallel infrastructure before inspecting the repository.

---

# Validation commands

Before reporting completion, run the project's existing validation commands.

At minimum:

```bash
expo lint
```

or, if there is no Expo lint script:

```bash
eslint .
```

Then run:

```bash
tsc --noEmit
```

Also run any existing relevant tests for Trip Room, Language, navigation, or data services.

Fix implementation-related lint and TypeScript errors before reporting completion.

Do not hide pre-existing unrelated errors; distinguish them clearly from errors introduced by this task.

---

# Manual acceptance checklist

Verify all of the following:

## Language shell
- [ ] Existing Trip Room header reused
- [ ] Existing room tab row reused
- [ ] Existing bottom navigation reused
- [ ] Language screen does not duplicate global widgets
- [ ] AI Translator / Lessons switch correctly

## Translator
- [ ] Source language selector works
- [ ] Target language selector works
- [ ] Swap works
- [ ] Typed text is preserved on swap
- [ ] Empty input is blocked
- [ ] Long input is handled safely
- [ ] Translate triggers the real translation integration path
- [ ] Loading state is visible
- [ ] Slow responses do not freeze UI
- [ ] Errors provide retry
- [ ] Stale responses are not shown as current results
- [ ] Result text renders correctly
- [ ] Copy works
- [ ] Romanization is conditional/supported
- [ ] Optional speaker/microphone status is correctly reported
- [ ] Active-trip shortcut reaches the same Translator implementation

## Lessons
- [ ] Destination language is displayed/selectable
- [ ] 3–5 demo lessons exist
- [ ] Required scenarios are covered
- [ ] Ordering Food exists
- [ ] Directions/Getting Around exists
- [ ] Check-in exists
- [ ] Emergencies exists
- [ ] No-content destination shows Coming Soon
- [ ] Lesson cards show correct progress/status
- [ ] Active lesson opens
- [ ] Multiple-choice interaction works
- [ ] Matching works when matching questions exist in data
- [ ] Progress bar derives from session data
- [ ] Previous/next controls work
- [ ] All-wrong quiz does not dead-end
- [ ] Exit/resume behavior is consistent
- [ ] Retake does not double-count badge progress
- [ ] Lesson Complete screen works
- [ ] Continue to Next Lesson works
- [ ] Complete Session screen works
- [ ] Back to Trip Rooms works

## Persistence / Badge
- [ ] Progress uses the real existing data path
- [ ] Lesson completion is persisted
- [ ] Badge eligibility refreshes through the existing Profile flow
- [ ] Badge can appear without app restart
- [ ] Retakes do not duplicate award/count

## Quality
- [ ] No horizontal overflow
- [ ] Safe-area spacing is correct
- [ ] No duplicate Translator implementation
- [ ] No duplicate Trip Room shell
- [ ] No stale 4-tab navigation introduced
- [ ] Lint passes for implementation-related code
- [ ] TypeScript check passes for implementation-related code

---

# Before finishing, report

Provide a concise implementation summary containing:

1. **Files changed**
2. **Components created/reused**
3. **Routes/navigation wired**
4. **Translation integration**
   - service/endpoint used
   - loading/error handling
   - confirmation that the final path is API-backed
5. **Lesson implementation**
   - lesson source
   - 3–5 demo lessons
   - scenario coverage
   - quiz interaction types
6. **Progress persistence**
   - exact existing store/repository/table/service used
7. **Badge integration**
   - exact existing badge flow used
   - confirmation retakes are idempotent
8. **Active-trip Translator shortcut**
   - where it is wired
   - confirmation it reuses the same Translator
9. **Assumptions / unresolved gaps**
   - translation provider if still TBD
   - missing progress contract if applicable
   - streak persistence status
   - speech/microphone status
   - final-session trigger assumption
   - any stage-specific Language behavior not defined by the specs
10. **Navigation mismatch confirmation**
    - no stale Unit 5 / Unit 13 navigation was implemented
    - current Home / Trip / Profile navigation was preserved
11. **Validation results**
    - lint
    - `tsc --noEmit`
    - relevant tests
12. **Confirmation that no duplicate Global Widget or Trip Room shell was created**

---

# Completion rule

Do not report this task as fully complete if any of the following required v2.2 items are still only mocked:

- real-time translation
- lesson quiz behavior
- lesson progress tracking
- lesson completion persistence
- required Profile/Badge integration

If a required backend/service contract is missing, complete the frontend work that is safely possible, clearly identify the blocker, and report the feature as partially integrated rather than silently substituting a mock.
