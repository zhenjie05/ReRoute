---
name: ReRoute
colors:
  surface: '#f3f7fa'
  surface-dim: '#ced6da'
  surface-bright: '#f3f7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf1f5'
  surface-container: '#e3e9ed'
  surface-container-high: '#dde3e7'
  surface-container-highest: '#d7dee2'
  on-surface: '#2a2f32'
  on-surface-variant: '#575c5f'
  inverse-surface: '#0a0f11'
  inverse-on-surface: '#999ea0'
  outline: '#73777a'
  outline-variant: '#a9aeb1'
  surface-tint: '#8b4b00'
  primary: '#8b4b00'
  primary-dim: '#7a4100'
  on-primary: '#fff0e6'
  primary-container: '#ff8f06'
  on-primary-container: '#462300'
  inverse-primary: '#ff8f06'
  secondary: '#4a623f'
  secondary-dim: '#3e5634'
  on-secondary: '#dffbcd'
  secondary-container: '#cfebbe'
  on-secondary-container: '#405836'
  tertiary: '#85495c'
  tertiary-dim: '#773e50'
  on-tertiary: '#ffeff1'
  tertiary-container: '#feb1c6'
  on-tertiary-container: '#652e40'
  error: '#b02500'
  error-dim: '#b92902'
  on-error: '#ffefec'
  error-container: '#f95630'
  on-error-container: '#520c00'
  primary-fixed: '#ff8f06'
  primary-fixed-dim: '#ec8300'
  on-primary-fixed: '#1e0c00'
  on-primary-fixed-variant: '#532b00'
  secondary-fixed: '#cfebbe'
  secondary-fixed-dim: '#c1ddb1'
  on-secondary-fixed: '#2e4525'
  on-secondary-fixed-variant: '#4a623f'
  tertiary-fixed: '#feb1c6'
  tertiary-fixed-dim: '#efa4b8'
  on-tertiary-fixed: '#4d1b2c'
  on-tertiary-fixed-variant: '#703749'
  background: '#f3f7fa'
  on-background: '#2a2f32'
  surface-variant: '#d7dee2'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  utility-tiny:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 28px
  safe-bottom: 96px
---

# ReRoute App Design Standards

This document establishes the exact UI/UX design patterns, pixel-perfect spacing, and exact color values applied across the ReRoute application to ensure strict screen design consistency.

## Design System Modules

The design system is organized into 14 units, covering layout, typography, color, global components, and cross-cutting UI patterns.

### Unit 1: Global Layout Constraints
*   **Container:** Mobile-first layout restricted to `max-w-md` (448px maximum width), centered horizontally (`mx-auto`).
*   **Viewport:** Minimum height stretches to the full screen (`min-h-screen`).
*   **Safe Areas:** A consistent bottom padding (`pb-24` or 96px) is applied to the main layout to prevent content from overlapping with the fixed bottom navigation bar.

### Unit 2: Typography & Hierarchy
*   **Primary Font:** `CameraPlainVariable`.
*   **Font Fallbacks:** `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`.
*   **Heading 1 (h1):** `text-2xl` (24px) or `text-xl` (20px) with `font-bold`.
*   **Heading 2 (h2):** `text-base` (16px) or `text-sm` (14px) with `font-bold`.
*   **Body Text:** Scales down heavily to `text-xs` (12px) and `text-[11px]`. Smallest utility text uses `text-[10px]`.

### Unit 3: Exact Color Palette & Theming
*   **Seasonal Accents (Exact Hex):** Each season carries a full tonal ramp (lightest → darkest) instead of a single accent value. Tokens are ordered `season-50` (lightest, background/soft-fill use) through `season-500`/`season-600` (darkest, emphasis/text use).

    *   **Spring:**
        | Token | Hex |
        |---|---|
        | `spring-50` | `#FFECEE` |
        | `spring-100` | `#FFE0E6` |
        | `spring-200` | `#FFD4DE` |
        | `spring-300` | `#FFC9D6` |
        | `spring-400` | `#FEBDCE` |
        | `spring-500` | `#FEB1C6` |

    *   **Summer:**
        | Token | Hex |
        |---|---|
        | `summer-50` | `#C3CA92` |
        | `summer-100` | `#A4B17B` |
        | `summer-200` | `#859864` |
        | `summer-300` | `#697E50` |
        | `summer-400` | `#354C2B` |
        | `summer-500` | `#20331B` |

    *   **Autumn:**
        | Token | Hex |
        |---|---|
        | `autumn-50` | `#FBF9F7` |
        | `autumn-100` | `#FDC591` |
        | `autumn-200` | `#FFA951` |
        | `autumn-300` | `#FB8C00` |
        | `autumn-400` | `#F57C00` |
        | `autumn-500` | `#BF360C` |

    *   **Winter:**
        | Token | Hex |
        |---|---|
        | `winter-50` | `#F7FBFE` |
        | `winter-100` | `#F0F7FD` |
        | `winter-200` | `#E6F1FA` |
        | `winter-300` | `#C9DEEF` |
        | `winter-400` | `#AFCBE3` |

    > Note: Winter is a 5-step ramp (no `-500`); Spring, Summer, and Autumn each carry 6 steps (`-50` through `-500`).

*   **Accent Usage:**
    *   `bg-season-soft` maps to the `-50`/`-100` step of the active season (lightest, used for soft fills, active nav states, and badge backgrounds).
    *   `bg-season` maps to the `-300`/`-400` step (mid-tone, used for primary seasonal accents, borders, and highlights).
    *   The darkest step in each ramp (`-500`, or `-400` for Winter) is reserved for high-emphasis text/icon accents on light surfaces.
*   **Backgrounds:** `bg-background` for the main canvas, `bg-card` for content surfaces, and `bg-season` for thematic highlights.
*   **Text Colors:** `text-primary-foreground` for primary contrast, `text-muted-foreground` for secondary/tertiary information.

### Unit 4: Top Navigation Header
*   **Positioning:** Fixed at the top (`sticky top-0 z-30`).
*   **Effects:** Glassmorphism overlay (`bg-background/80` combined with `backdrop-blur-xl`).
*   **Spacing:** Exact padding of `px-4 py-3` (16px horizontal, 12px vertical).
*   **Widget Set (exact, left → right):** Profile icon, Theme icon (cycles the four seasonal accents from Unit 3), Notification icon (carries an active-alert indicator dot when unread items exist). This widget set is global and persists on every authenticated screen (Home, TripRoom, Map, Profile, Community, Friends, Languages).

### Unit 5: Bottom Navigation Bar
*   **Positioning:** Fixed at the bottom (`fixed inset-x-0 bottom-0 z-30`).
*   **Container Styling:** Pill-shaped glassmorphism (`rounded-[1.5rem]`, `bg-card/95`, `backdrop-blur-xl`).
*   **Spacing:** Exact internal padding of `px-2 py-2` (8px all around).
*   **States:** Active items transition to `text-primary` with a `bg-season-soft` fill.
*   **Exact Destinations (4, fixed order):** Home, TripRoom, Map, Profile. This is the complete and only set of primary destinations — **Community** (and its **Friends** sub-page) is intentionally excluded from the bottom bar and is reached from within Home/Profile flows rather than as a persistent tab (see Unit 13).

### Unit 6: Primary Content Cards
*   **Corner Radii:** Pronounced, soft corners using `rounded-3xl` (24px) or `rounded-[1.75rem]` (28px).
*   **Spacing:** Generous internal padding, typically `p-4` (16px) or `p-5` (20px).
*   **Depth:** Soft elevation using `shadow-soft` or `shadow-season`.

### Unit 7: Action & Secondary Buttons
*   **Primary Buttons:** Prominent actions use `rounded-xl` (12px), `bg-season` or `bg-primary`, and hover states of `hover:opacity-90`.
*   **Secondary/Icon Buttons:** Circular or slightly rounded (`rounded-xl` or `rounded-full`), usually placed inside `bg-card` backgrounds.

### Unit 8: Badges & Tags
*   **Shape:** Strictly pill-shaped (`rounded-full`).
*   **Typography:** Very small, prominent text (`text-[10px]` or `text-xs`) with `font-medium`.
*   **Backgrounds:** Situational fills like `bg-card/25`, `bg-season-soft`, or `bg-muted`.

### Unit 9: Spacing & Vertical Rhythm
*   **Flex Gaps:** Sibling elements are spaced using tight gaps, primarily `gap-2` (8px) and `gap-3` (12px).
*   **Section Margins:** Vertical spacing between major sections utilizes `space-y-7` (28px) or `space-y-4` (16px) to maintain a breathable rhythm.

### Unit 10: Interactive Widgets & FABs
*   **Floating Action Buttons (e.g., SOS):** Highly visible, fixed positioning (e.g., `fixed right-5 bottom-24 z-30`).
*   **Shape & Color:** Squircle shaping (`h-16 w-16 rounded-2xl`) using high contrast colors (`bg-destructive text-destructive-foreground`).

### Unit 11: System Documentation Diagrams
*   **Sequence Diagrams:** When documenting flows that involve these UI modules, all sequence diagrams must use text-based `participant` representations. The use of boundary icons is strictly prohibited to keep documentation clean and easily maintainable.

### Unit 12: Notifications & Toasts
*   **Success State:** Background `hsl(143, 85%, 96%)` with `hsl(140, 100%, 27%)` text.
*   **Error State:** Background `hsl(359, 100%, 97%)` with `hsl(360, 100%, 45%)` text.
*   **Warning/Info:** Consistent HSL-based scaling matching the same lightness/saturation ratios as success and error states.

### Unit 13: Application Information Architecture & Page Map
*   **Global Widgets (present on every authenticated screen):** Top Bar (Unit 4) and Bottom Nav Bar (Unit 5).
*   **Auth Page** *(pre-authentication, no global widgets)*
    *   Login / Register.
    *   Preferences step: favourite country selection.
*   **Home Page**
    *   AI Chatbox: user describes a desired trip → AI generates a trip → the generated trip is displayed for review in a **pop-up tab** (modal overlay, see Unit 14) → user confirms → trip is saved into Trip Rooms.
    *   AI Analysis: a "Clone" action that auto-clones a suggested itinerary directly into Trip Rooms without the confirmation modal.
    *   Recent News / Incident feed: surfaces items relevant to the user's upcoming trips.
*   **Trip** *(2 pages)*
    *   **Rooms** — select an existing trip plan or add a new trip; once a trip is selected/opened, this same page surfaces Chat Room, Budget, Album, and Maps/Emergency calls/live location for that trip.
    *   **Languages** — select a destination language; this same page surfaces the language-learning feature/content for the selected language.
*   **Community** *(2 pages, reached from Home/Profile — not a bottom-nav destination, per Unit 5)*
    *   **Community page** — friends' and public trip posts, plus general community feed features.
    *   **Friends page** — friends management and a dedicated chatbox.
*   **Profile Page**
    *   Profile feature (identity, stats, badges — see `Screen_Spec.md` for the full breakdown).
    *   Logout.
    *   Settings.

### Unit 14: Modal / Pop-Up Confirmation Pattern
*   **Trigger:** Any AI-generated output that requires explicit user review before it is persisted (currently: AI Chatbox trip generation on the Home page).
*   **Presentation:** Renders as a pop-up tab — a full-width overlay/sheet layered above the current screen, not a full page navigation. Should inherit Unit 6 card styling (`rounded-3xl`/`rounded-[1.75rem]`, `shadow-soft`/`shadow-season`) and sit on a scrim so the underlying Home screen remains contextually visible.
*   **Actions:** Primary confirm action uses Unit 7 primary button styling (`rounded-xl`, `bg-season`/`bg-primary`) and commits the item to Trip Rooms; a secondary dismiss/edit action uses Unit 7 secondary/icon button styling.
*   **Exception:** The AI Analysis "Clone" action on Home bypasses this modal and auto-clones straight into Trip Rooms — this pattern is reserved for the primary AI Chatbox generation flow only.