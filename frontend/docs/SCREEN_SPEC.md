# SCREEN_SPEC.md

## 1. Purpose

This document provides the definitive, pixel-accurate screen layout and component specification for the **ReRoute** React Native (Expo) mobile application. It translates the visual source of truth from Figma exported screenshots into structured component trees, exact visible copy, control hierarchies, state variants, and reusable component mappings.

Frontend engineers and AI coding agents (Codex / Antigravity) must follow this specification to implement the UI faithfully without inventing layouts or drifting from established design tokens.

---

## 2. Source Files & Reference Hierarchy

### Reference Priority
1. **Figma Exported Screenshots (`frontend/Screenshots/`)**: Source of truth for exact visual layout, component order, vertical rhythm, corner rounding, and visual hierarchy.
2. **Design Tokens (`docs/Prompts/DESIGN.md`)**: Source of truth for exact color ramps, typography scale, spacing units, and radius tokens.
3. **UI Requirements (`frontend/docs/UI_REQUIREMENTS.md`)**: Source of truth for functional workflows, data model bindings, state machines, and acceptance criteria.
4. **Agent & Architecture Rules (`docs/Prompts/AGENTS.md`)**: Source of truth for React Native / Expo implementation rules, scope boundaries, and non-negotiable architectural constraints.

### Conflict Resolution Baseline (AGENTS.md §82–92)
- **3 Bottom Tabs Only:** Navigation strictly contains `Home`, `Trip`, and `Profile`. (Discover is an in-page view under Home; Community/Friends standalone tabs are dropped).
- **Star-Only Public Interactions:** Public Discover posts support starring/saving only. Any legacy "heart/like" or "comment" UI shown in raw Figma frames is overridden to **Star / Save** (`FR-8-4`).
- **No Friend Requests / Follow Mechanism:** Friendship management is dropped from v2.2.
- **External Booking Link-Outs:** Transportation and stay suggestions open external booking URLs (`booking_url`) rather than internal checkout flows.

---

## 3. Global Layout Patterns

### 3.1 Mobile Container Constraints
- **Container Width:** Constrained to `max-w-md` (448px maximum width on tablets/web), horizontally centered (`mx-auto`).
- **Full Viewport Stretch:** Minimum screen height stretches to full device height (`min-h-screen`).
- **Safe Area Insets:**
  - Top: `SafeAreaView` top padding + sticky `HeaderTopAppBar` (48px – 56px height).
  - Bottom: `pb-24` (96px) to ensure scrollable content never collides with the fixed floating `BottomNavBar`.

### 3.2 Dynamic Seasonal Theming (Unit 3)
The entire application dynamically shifts accent tints based on the active trip's weather and season:
- **Spring:** Accent `#FEB1C6` (`spring-500`), Soft background `#FFECEE` (`spring-50`), Header pill `#FFD4DE` (`spring-200`).
- **Summer:** Accent `#697E50` (`summer-300`), Soft background `#C3CA92` (`summer-50`), Header pill `#A4B17B` (`summer-100`).
- **Autumn:** Accent `#FB8C00` (`autumn-300`), Soft background `#FBF9F7` (`autumn-50`), Header pill `#FFA951` (`autumn-200`).
- **Winter:** Accent `#C9DEEF` (`winter-300`), Soft background `#F7FBFE` (`winter-50`), Header pill `#E6F1FA` (`winter-200`).

### 3.3 Card & Surface Hierarchy
- **Base Canvas:** `bg-background` (`#f3f7fa`).
- **Primary Cards:** `bg-surface-container-lowest` (`#ffffff`) with `rounded-3xl` (24px) or `rounded-[1.75rem]` (28px), `shadow-soft`.
- **Nested Sub-Cards & Tiles:** `bg-surface-container-low` (`#edf1f5`) or `bg-surface-container` (`#e3e9ed`) with `rounded-2xl` (16px) or `rounded-xl` (12px).
- **Modal Sheets:** Pop-up tabs slide from bottom with top center drag-handle capsule (`w-12 h-1.5 bg-outline-variant/40 rounded-full`), backdrop blur scrim (`rgba(10, 15, 17, 0.4)`).

---

## 4. Shared Components

| Component Name | Description | Key Props / State | Used In |
|---|---|---|---|
| `HeaderTopAppBar` | Fixed glassmorphism top bar with Avatar, ReRoute Wordmark, and Corgi Mascot bell with unread dot | `avatarUrl`, `hasUnreadNotifications`, `onAvatarPress`, `onMascotPress` | All Authenticated Screens |
| `BottomNavBar` | Floating pill glassmorphism bottom bar with 3 tabs (Home, Trip, Profile) | `activeTab`, `hasActiveLiveTrip`, `onTabChange` | Global Shell |
| `PersistentSOSButton` | Fixed squircle red alert button with bell and "SOS" text | `isTripLive`, `onPress` | Global Authenticated View (when live trip active) |
| `SeasonalTripCard` | Themed header card (pink/spring, orange/autumn, etc.) showing Trip Name, Status Badge, Dates, Travelers Stack | `title`, `destination`, `dateRange`, `status`, `memberAvatars`, `themeColor` | Trip Room Sub-screens |
| `SubTabPillStrip` | Horizontal scrollable/flex segmented pill selector | `tabs: string[]`, `activeTab: string`, `onChange: (tab) => void` | Trip Room (`Discussion`, `Itinerary`, `Budget`, `Album`, `Language`) |
| `PrimaryActionButton` | Full-width or inline rounded-xl orange gradient/solid CTA button | `title`, `icon`, `onPress`, `disabled`, `loading` | Global |
| `DecisionPollCard` | In-feed voting card with animated tally bars and anonymous badge | `question`, `options`, `userVote`, `totalVotes`, `isResolved`, `onVote` | Discussion, Notifications |
| `SegmentedFilterControl`| 3-state capsule toggle (e.g. Planning \| Live \| Archived) | `options`, `selected`, `onSelect` | Trips Hub, Discover, Language |
| `LoadingMascotSplash` | Corgi mascot illustration on pastel sky-blue canvas | `subtext`, `progress` | App Launch, AI Generation Loading |

---

## 5. Screen Specs

---

### 5.1 Global App Shell & Persistent Overlays

#### Purpose
Provide top-level identity, navigation, and persistent emergency safety overlays across all application tabs.

#### Source Reference
- `frontend/Screenshots/global widgets/Header - TopAppBar.png`
- `frontend/Screenshots/global widgets/BottomNavBar.png`
- `frontend/Screenshots/global widgets/SOS_Icon.png`
- `frontend/Screenshots/ReRoute Loading.png`

#### Layout Hierarchy
1. **Header - TopAppBar (`HeaderTopAppBar`)** (Sticky Top)
   - Left: Profile Avatar (`h-8 w-8 rounded-full` border).
   - Center: "ReRoute" typography (`text-xl font-bold text-primary` `#8b4b00`).
   - Right: Circular Corgi Mascot Badge (`h-9 w-9 rounded-full bg-orange-50`) with orange/red unread notification indicator dot (`h-2.5 w-2.5 rounded-full bg-error`).
2. **Main Scrollable Content Area** (`flex-1 pb-24`)
3. **Global SOS Floating Action Button (`PersistentSOSButton`)** (Fixed `bottom-24 right-5 z-40`, visible when `is_live_for_user = true`)
   - Squircle / circular button (`h-14 w-14 rounded-2xl bg-[#d32f2f]` red).
   - Ringing bell icon + "SOS" bold text in white.
4. **Bottom Navigation Bar (`BottomNavBar`)** (Fixed Bottom `inset-x-0 bottom-4 px-6 z-30`)
   - Centered floating glassmorphic pill (`rounded-full bg-white/95 backdrop-blur-xl shadow-lg py-2 px-3`).
   - 3 Tab Items:
     - **Home**: Home icon + "Home" label. Active: filled orange pill background (`bg-primary-fixed text-white`).
     - **Trip**: Group icon + "Trip" label (shows orange live indicator badge if user is in an active trip).
     - **Profile**: Person icon + "Profile" label.

#### Fields and Controls
- Avatar button: triggers navigation to `Profile`.
- Corgi mascot button: triggers `NotificationCenterModal`.
- Tab buttons: switch between active navigation routes.
- SOS FAB: opens `SOSConfirmationModal`.

#### States
- **TopAppBar Default:** Clean white/glass surface (`#ffffff/90`).
- **TopAppBar Alert:** Dot visible on mascot ear when unread alerts exist.
- **BottomNavBar Inactive Tab:** Slate muted gray icon + label (`#575c5f`).
- **BottomNavBar Active Tab:** Solid vibrant orange capsule (`#ff8f06`) with white icon + text.
- **SOS Overlay Hidden:** When no active live trip exists.

---

### 5.2 Screen 01: Login & Sign Up Screen

#### Purpose
Authenticate users via Supabase Auth with Email/Password or Google OAuth.

#### Source Reference
- `frontend/Screenshots/Login/ReRoute Login & Sign Up.png`

#### Layout Hierarchy
- **Centered Auth Modal Card** (`bg-white rounded-3xl p-6 shadow-md max-w-sm mx-auto my-auto`)
  - **App Brand Title:** "ReRoute" (`text-2xl font-bold text-center text-[#8b4b00] mb-6`).
  - **Auth Mode Segmented Pill:** Dual toggle container (`bg-surface-container-low rounded-xl p-1 flex-row mb-6`).
    - Tab 1: "Log In" (Active: `bg-[#ff8f06] text-white font-bold rounded-lg py-2`).
    - Tab 2: "Sign Up" (Inactive: `text-on-surface-variant py-2`).
  - **Email Field Group:**
    - Label: "Email" (`text-xs font-bold text-on-surface mb-1`).
    - Input: Text input with placeholder `hello@reroute.com` (`rounded-xl border border-outline-variant px-4 py-3`).
  - **Password Field Group:**
    - Label: "Password" (`text-xs font-bold text-on-surface mb-1`).
    - Input: Secure text input (`rounded-xl border border-error bg-error-container/10 px-4 py-3 text-on-surface`).
    - Error Alert Banner: Red pill badge with exclamation mark icon: "Invalid password" (`bg-[#f95630] text-white text-[11px] font-semibold px-2 py-1 rounded-md mt-1 self-start`).
  - **Forgot Password Link:** "Forgot password?" (`text-xs text-[#8b4b00] font-semibold text-right mt-2`).
  - **Social Divider:** "OR CONTINUE WITH" with horizontal hairline divider lines.
  - **Google OAuth Button:** Full-width light-green rounded button (`bg-[#cfebbe] rounded-xl py-3 flex-row items-center justify-center gap-2`).
    - Google colorful 'G' logo + text: "Continue with Google" (`text-on-secondary-container font-semibold`).
  - **Primary Submit Button:** "Log In" (or "Sign Up") (`bg-[#7a4100] text-white rounded-xl py-3.5 text-center font-bold text-base mt-6`).

#### Visible Text / Labels
`ReRoute`, `Log In`, `Sign Up`, `Email`, `hello@reroute.com`, `Password`, `wrongpassword`, `Invalid password`, `Forgot password?`, `OR CONTINUE WITH`, `Continue with Google`, `Log In`.

#### States
- **Normal Input:** White background with `#a9aeb1` border.
- **Error State:** Soft red background fill (`#ffefec`), red border, and inline error pill badge.
- **Loading State:** Disabled inputs, spinner on primary CTA button.

---

### 5.3 Screen 02: Onboarding & Travel Preferences Setup

#### Purpose
Collect user profile information, avatar selection, favorite countries, and default travel companions, style, and pace immediately post-registration.

#### Source Reference
- `frontend/Screenshots/Login/ReRoute Preferences.png`

#### Layout Hierarchy
- **Header Section:**
  - Title: "Let's get started" (`text-2xl font-bold text-[#462300]`).
  - Subtitle: "Customize your ReRoute experience." (`text-xs text-on-surface-variant mb-4`).
- **Section Card 1: Profile Setup (`bg-white rounded-3xl p-5 shadow-soft mb-4`)**
  - Section Header: Person icon + "Profile Setup" (`font-bold text-sm text-on-surface`).
  - Label: "DISPLAY NAME" (`text-[10px] font-bold text-outline-variant`).
  - Input: Placeholder `e.g. Wanderer99` (`rounded-xl bg-surface-container-low px-4 py-3`).
  - Label: "PICK AN AVATAR" (`text-[10px] font-bold text-outline-variant mt-3 mb-2`).
  - 6-Grid Circular Avatar Selectors:
    - 5 preset 3D traveler avatars with circular orange selection rings.
    - 1 custom upload button with image upload icon (`bg-surface-container rounded-full`).
- **Section Card 2: Travel Interests (`bg-white rounded-3xl p-5 shadow-soft mb-4`)**
  - Section Header: Compass icon + "Travel Interests" (`font-bold text-sm text-on-surface`).
  - Search Input: Search icon + `Search destinations...` (`bg-surface-container-low rounded-xl px-3 py-2.5 text-xs`).
  - Subtitle: "SELECT FAVORITE COUNTRIES" (`text-[10px] font-bold text-outline-variant mt-3 mb-2`).
  - Wrap Chip Group:
    - 🇯🇵 Japan (Selected: `bg-[#ff8f06] text-white font-bold rounded-full px-3 py-1.5 flex-row items-center gap-1` with checkmark icon).
    - 🇮🇹 Italy (`bg-surface-container-low text-on-surface rounded-full px-3 py-1.5`).
    - 🇫🇷 France, 🇲🇽 Mexico, 🇦🇺 Australia, 🇨🇦 Canada.
- **Section Card 3: Default Preferences (`bg-white rounded-3xl p-5 shadow-soft mb-6`)**
  - Section Header: Heart icon + "Default Preferences" (`font-bold text-sm text-on-surface`).
  - Group 1: "TRAVEL COMPANIONS"
    - Chips: `Solo`, `Family`, `Couple` (Selected: orange border `border-[#ff8f06] text-[#ff8f06] font-bold`), `Friends`.
  - Group 2: "TRAVEL STYLE"
    - Chips: `Cultural` (Selected), `Classic`, `Nature`, `Cityscape`.
  - Group 3: "TRAVEL PACE"
    - Chips: `Ambitious`, `Moderate` (Selected), `Relaxed`.
- **Primary CTA Button:** "Continue →" (`bg-[#ff8f06] text-white rounded-2xl py-4 text-center font-bold text-base`).

---

### 5.4 Screen 03: Home Dashboard

#### Purpose
Primary landing feed featuring conversational AI trip builder, quick origin/destination picker, collapsible preferences, trending cloneable itineraries, personalized safety/news alerts, and discover preview.

#### Source Reference
- `frontend/Screenshots/Home/ReRoute Home Dashboard.png`

#### Layout Hierarchy
1. **HeaderTopAppBar** (Fixed Top)
2. **Welcome Header Area (`px-5 pt-3 pb-2`)**
   - Headline: "Hey Sarah 👋" (`text-2xl font-bold text-on-surface`).
   - Subtitle: "Where to next?" (`text-xs text-on-surface-variant`).
3. **AI Trip Planning Master Card (`bg-white rounded-3xl p-5 shadow-soft mb-5 mx-4`)**
   - Header Row: "See History" link on top right (`text-xs text-primary font-semibold`).
   - Origin Field: Compass target icon + "Starting from" label + "Kuala Lumpur" bold text + Clear '✕' icon button.
   - Dual Selection Grid (`flex-row gap-3 mt-3`):
     - Left Box: "HEADING TO" (`text-[10px] text-outline-variant font-bold`), Pin icon + "Tokyo, Japan" (`text-xs font-bold text-on-surface`).
     - Right Box: "DATE/DURATION" (`text-[10px] text-outline-variant font-bold`), Calendar icon + "Oct 1 - Oct 5 (5D)" (`text-xs font-bold text-on-surface`).
   - Collapsible Preferences Header: Heart icon + "PREFERENCES" (`text-xs font-bold text-on-surface`) + Collapse chevron '▲'.
   - Expanded Preferences Content:
     - "Travel companions": `Solo`, `Family`, `Couple` (Selected with checkmark), `Friends`.
     - "Travel style": `Cultural` (Selected with checkmark), `Classic`, `Nature`, `Cityscape`.
     - "Travel pace": `Ambitious`, `Moderate` (Selected with checkmark), `Relaxed`.
   - Conversational AI Input Box:
     - Placeholder: `Ask AI: I want a Japan itinerary focused on firework` (`bg-surface-container-low rounded-2xl px-4 py-3 text-xs text-on-surface-variant mt-4`).
   - Primary CTA Button: "Plan a Trip with AI" (`bg-[#ff8f06] text-white rounded-2xl py-3.5 text-center font-bold text-sm mt-3`).
4. **Trending AI Itineraries Section (`mb-5 px-4`)**
   - Section Title: "Trending AI Itineraries" (`text-base font-bold text-on-surface`).
   - Section Subtitle: "from 1.2k anonymized trips" (`text-xs text-on-surface-variant mb-3`).
   - Horizontal Scrollable Carousel:
     - **Card 1 (Kyoto Sakura Trail):** `w-64 bg-white rounded-2xl overflow-hidden shadow-soft mr-3`
       - Hero Image with Top-Left Badge: "★ 98% Match" (`bg-pink-100 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full`).
       - Content: Title "Kyoto Sakura Trail" (`font-bold text-sm text-on-surface`), Subtext: "Fushimi Inari • Arashiyama Bamboo Grove • Kiyomizu-dera" (`text-[11px] text-on-surface-variant line-clamp-1`).
       - Card Footer: Clone counter "📋 243 cloned" (`text-[10px] text-outline`), Orange "Clone" pill button (`bg-[#ff8f06] text-white px-3 py-1 rounded-xl text-xs font-bold`).
     - **Card 2 (Amalfi Coast):** Image, "★ 92% Match" badge, "Amalfi Coast ...", "Positano • Amalfi to...", "📋 189 cloned".
5. **Recent News & Safety Alerts Card (`bg-white rounded-3xl p-4 shadow-soft mb-5 mx-4`)**
   - Section Title: "Recent News" (`text-base font-bold text-on-surface mb-3`).
   - **Alert Item 1:**
     - Left: Red pill badge "High" (`bg-[#b02500] text-white text-[10px] font-bold px-2 py-0.5 rounded`).
     - Center: Headline "Major train strike expected in Paris next weekend affecting all TGV lines." (`text-xs font-medium text-on-surface`).
     - Bottom row: Source link "SNCF Source" (`text-[10px] text-[#8b4b00] underline`) + Timestamp "2h ago" (`text-[10px] text-outline`).
   - Divider line (`border-t border-surface-container my-2.5`).
   - **Alert Item 2:**
     - Left: Green pill badge "Low" (`bg-[#cfebbe] text-[#2e4525] text-[10px] font-bold px-2 py-0.5 rounded`).
     - Center: Headline "Cherry blossom forecast updated: peak bloom in Tokyo starting April 2nd." (`text-xs font-medium text-on-surface`).
     - Bottom row: Source link "JMA Source" (`text-[10px] text-[#8b4b00] underline`) + Timestamp "5h ago" (`text-[10px] text-outline`).
6. **Discover Preview Section (`px-4 mb-6`)**
   - Section Header Row: Title "Discover" (`text-base font-bold text-on-surface`), Action "More >" orange pill button (`bg-[#ff8f06] text-white text-xs font-bold px-3 py-1 rounded-full`).
   - Horizontal 2-Card Row:
     - Card 1: Avatar + "Alex • 4h ago", text: "Chasing waterfalls in Bali! 🌴", badge: "📍 Ubud".
     - Card 2: Avatar + "Mia • 1d ago", text: "Found the best pasta in Rome.", badge: "📍 Rome".
7. **BottomNavBar** (Fixed Bottom)

---

### 5.5 Screen 04: AI Trip Plan Review & Confirmation (Pop-up Tab)

#### Purpose
Interactive modal overlay presenting AI-parsed itinerary modules, timing optimization tags, and preference weights for user verification before persisting into a collaborative Trip Room.

#### Source Reference
- `frontend/Screenshots/Home/ReRoute Home - Review trip.png`

#### Layout Hierarchy
- **Pop-up Tab Container Sheet (`bg-white rounded-t-[2rem] p-5 shadow-2xl max-h-[90%]`)**
  - **Sheet Drag Capsule (`w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-3`)**
  - **Header Row:**
    - Sparkle Icon (`p-2 bg-orange-100 rounded-full text-[#ff8f06]`).
    - Title Block: "Review Trip Plan" (`text-base font-bold text-on-surface`), Subtitle: "AI tailored for your group" (`text-xs text-on-surface-variant`).
    - Close Icon '✕' button (`p-1.5 bg-surface-container rounded-full text-on-surface-variant`).
  - **Preferences Summary Card (`bg-[#fef8f4] border border-orange-100 rounded-2xl p-3.5 mb-4`)**
    - Top Row: "PREFERENCES SUMMARY" (`text-[10px] font-bold text-outline`), "Matched 98%" green pill badge (`bg-[#cfebbe] text-[#2e4525] text-[10px] font-bold px-2 py-0.5 rounded-full`).
    - Dual Details Grid:
      - "HEADING TO" → 📍 Tokyo, Japan (`text-xs font-bold`).
      - "DATES / DURATION" → 📅 Oct 1 - Oct 5 (5D) (`text-xs font-bold`).
    - Subtext: "Active AI logic weights:".
    - Pill Weights: `👥 Couple`, `🏛️ Cultural`, `⚖️ Moderate Pace`, `✏️ Edit`.
  - **Itinerary Ideas Header:**
    - "Itinerary Ideas" (`font-bold text-sm text-on-surface`), "Day 1 Curated Stepper" (`text-xs text-on-surface-variant`), "3 Modules" pill badge (`bg-orange-100 text-[#ff8f06] text-[10px] font-bold px-2 py-0.5 rounded-full`).
  - **Day Selector Stepper Strip (`flex-row gap-2 my-3`):**
    - `Oct 1 •` (Active: `bg-[#1e293b] text-white font-bold px-3 py-1.5 rounded-full text-xs flex-row items-center gap-1` with orange dot).
    - `Oct 2`, `Oct 3`, `Oct 4`, `Oct 5` (Inactive: `bg-white border border-surface-container text-on-surface-variant px-3 py-1.5 rounded-full text-xs`).
  - **Timeline Stops Stepper with Connecting Vertical Line:**
    - **Stop 1 (Transportation):**
      - Orange Dot Indicator (`h-4 w-4 bg-[#ff8f06] rounded-full`).
      - Card: "✈️ HOW TO GET THERE", Badge "✨ Optimized for Time" (`bg-orange-100 text-[#ff8f06] text-[10px] font-semibold px-2 py-0.5 rounded`).
      - Time & Route: "09:10 - 10:10", Badge "Direct • 7h 00m".
      - Route Path: "Kuala Lumpur (KUL) ✈️ Haneda (HND)".
      - Details: "✓ Japan Airlines JL724", Cost: "$340 / person" (`font-bold text-xs`).
    - **Stop 2 (Attractions & Sights):**
      - Orange Dot Indicator.
      - Card: "✨ WHAT TO SEE & DO", Badge "✨ Optimized for Budget".
      - Thumbnail Image with Rating overlay "4.8 ★".
      - Place Title: "Senso-ji Temple", Badge "Free entry" (`bg-green-100 text-[#2e4525] text-[10px] font-bold px-2 py-0.5 rounded`).
      - Description: "Historic Buddhist temple & Nakamise shopping street in Asakusa." (`text-xs text-on-surface-variant`).
      - Meta Chips: "🕒 2 - 3 hours", "☀️ Best at 14:00".
    - **Stop 3 (Stay / Accommodation):**
      - Gray Dot Indicator (`h-4 w-4 bg-outline-variant rounded-full`).
      - Dashed Border Placeholder Card (`border-2 border-dashed border-orange-200 rounded-2xl p-4 text-center`):
        - Icon + Label: "🏨 WHERE TO STAY" (`text-[10px] font-bold text-outline`).
        - Text: "No hotel locked in for Day 1 yet. Choose nearby Asakusa or Shinjuku." (`text-xs text-on-surface-variant my-1.5`).
        - Action: "+ + Add Stay" (`border border-orange-200 rounded-xl py-1.5 px-4 text-[#ff8f06] text-xs font-bold self-center`).
  - **Sticky Bottom Action Container (`pt-3 border-t border-surface-container`):**
    - Primary Button: "Create Trip Room" (`bg-[#ff8f06] text-white rounded-2xl py-3.5 text-center font-bold text-sm w-full`).
    - Footer Subtext: "🛡️ Collaborative sync enabled • Save as private draft" (`text-[10px] text-outline text-center mt-2`).

---

### 5.6 Screen 05: Start an Escape (Quick Create Trip Sheet)

#### Purpose
Direct bottom sheet to create a new collaborative trip room from scratch with season targeting and member slots.

#### Source Reference
- `frontend/Screenshots/Home/ReRoute Home -.png`
- `frontend/Screenshots/Trip/Main/ReRoute Trip Rooms - Create Room.png`

#### Layout Hierarchy
- **Bottom Sheet Modal Card (`bg-white rounded-t-3xl p-5 max-h-[90%]`)**
  - **Sheet Drag Bar + Close '✕' Icon Header.**
  - **Title Block:** Compass icon + "Start an Escape" (`text-lg font-bold text-on-surface`), Subtitle: "Create a collaborative trip room or join your travel crew." (`text-xs text-on-surface-variant`).
  - **Trip Room Name Input:**
    - Label: "Trip Room Name *" (`text-xs font-bold text-on-surface`).
    - Input: Placeholder `e.g., Kyoto Spring Blossoms` with sparkle icon.
  - **Destination Selector:**
    - Label Row: "Destination" (`text-xs font-bold text-on-surface`), Right: "Seasonal Engine" (`text-[10px] text-[#ff8f06] font-semibold`).
    - Input: Pin icon + `Kyoto, Japan` (or `Japan`).
    - Subtext: "⚡ Powers local AI routes, language cues & seasonal maps." (`text-[10px] text-on-surface-variant`).
  - **Target Season & Timing Selector:**
    - 3 Segmented Tile Cards:
      - `🌸 Spring '26 (Mar-May)` (Selected: `bg-[#cfebbe] border-2 border-secondary-dim rounded-2xl p-3 items-center`).
      - `☀️ Summer '26 (Jun-Aug)` (`bg-white border border-surface-container rounded-2xl p-3 items-center`).
      - `📅 Pick Dates (Custom)` (`dashed border border-outline-variant rounded-2xl p-3 items-center`).
  - **Initial Stage Banner:**
    - Icon + "Initial Stage" / "Starts automatically in Planning" + Badge: `PLANNING` (`bg-surface-container-high text-xs font-bold px-2 py-0.5 rounded`).
  - **Travel Crew Slots:**
    - Label Row: "Travel Crew", "1 of 8 slots" (`text-xs text-outline`).
    - Avatar Row: `JD (You)` avatar, Dashed circular '+' invite button + "Invite to sync planning" text.
  - **Room Feature Perks Note Card:**
    - Lightbulb icon + "Room Feature Perks" / "You'll be able to invite friends with deep links, split budgets, and vote on decision cards once created." (`text-[11px] text-on-surface-variant bg-surface-container-low rounded-xl p-3`).
  - **Submit Button:** "Create Trip Room →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center w-full`).

---

### 5.7 Screen 06: Discover Feed Screen

#### Purpose
Public community hub for exploring shared itineraries, searching by destination, and filtering public recaps with star-only engagement.

#### Source Reference
- `frontend/Screenshots/Home/Discover/ReRoute Home Dashboard - Discover.png`

#### Layout Hierarchy
1. **Top Header Bar (`HeaderTopAppBar`)**
   - Back arrow '←', Title "Discover" (`text-lg font-bold text-on-surface`), Share icon, Corgi mascot with notification dot.
2. **Feed Stream (`px-4 pt-3 pb-24`)**
   - **Post Card 1 (Photo Story / Recap):**
     - Hero Photo (`h-64 w-full rounded-2xl mb-3 object-cover`).
     - Author Row: Avatar + "Sarah J." (`font-bold text-sm text-on-surface`), "2h ago" (`text-xs text-outline`), Right: Star Icon '☆' (`h-6 w-6 text-on-surface`).
     - Caption: "Best weekend getaway ever. The blooming cherry blossoms were unreal, and we found the cutest hidden tea house. Definitely a must-visit spots added to our permanent list! 🌸🍵" (`text-xs text-on-surface leading-relaxed mt-2`).
   - **Post Card 2 (Cloneable Itinerary Card):**
     - Cover Image (Tokyo Skyline) with overlay:
       - Top-Left Badge: "12 Clones" (`bg-green-100 text-[#2e4525] text-xs font-bold px-2.5 py-1 rounded-full`).
       - Bottom-Left Title: "Tokyo Tech & Temples" (`text-lg font-bold text-white shadow-sm`).
       - Bottom-Right Button: Orange "📋 Clone" pill button (`bg-[#ff8f06] text-white font-bold text-xs px-4 py-2 rounded-xl`).
     - Sub-Content: "KEY STOPS" (`text-[10px] font-bold text-outline mt-3`).
     - Stop 1: 📍 Senso-ji Temple - Morning walk before the crowds.
     - Stop 2: 📍 Akihabara Electric Town - Gadget shopping and arcade fun.
   - **Post Card 3 (Location Recap):**
     - Hero Photo with Top-Left Tag: "📍 Paris, France" (`bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full`).
     - Author Row: Avatar + "Alex M." (`font-bold text-sm`), "5h ago", Star Icon '☆'.
     - Caption: "Finally made it to the Louvre. Pro tip: book the evening slot..."
3. **Floating Create Post Action Button (`+` FAB)** (Fixed `bottom-24 right-5 bg-[#ff8f06] h-14 w-14 rounded-2xl items-center justify-center text-white text-2xl font-bold shadow-lg`).
4. **BottomNavBar** (Fixed Bottom)

---

### 5.8 Screen 07: Select Trip to Post (Share Picker)

#### Purpose
Modal / Sub-screen enabling users to select one of their archived or completed trips to publish to the public Discover feed.

#### Source Reference
- `frontend/Screenshots/Home/Discover/ReRoute Home Dashboard- Select Post.png`

#### Layout Hierarchy
1. **Header Row:** Back button '←', "• Itinerary Detail" (`font-bold text-sm text-on-surface`), Share icon, Corgi mascot with notification dot.
2. **Page Header Text (`px-5 pt-2 mb-4`):**
   - Headline: "Select your trip to post" (`text-xl font-bold text-on-surface`).
   - Subtitle: "Choose an itinerary to share with your community" (`text-xs text-on-surface-variant`).
3. **Trip Selection List (`px-4 space-y-4`):**
   - **Selectable Card 1 (Tokyo & Kyoto Explorer):**
     - Cover Image with Top-Left Highlight Tag: "Spring Highlight" (`bg-[#bf360c] text-white text-[10px] font-bold px-2 py-0.5 rounded`), Top-Right Tag: "🔒 ARCHIVED" (`bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded`).
     - Content Area (`p-4 bg-white rounded-b-2xl shadow-soft`):
       - Title: "Tokyo & Kyoto Explorer" (`text-base font-bold text-on-surface`).
       - Meta Row: 📅 Oct 12 - Oct 24, 2024 • 13 Days (`text-xs text-outline`).
       - Bottom Row: Member avatar stack (`+2`), Right: "👥 5 Travelers" (`text-xs text-on-surface-variant font-medium`).
   - **Selectable Card 2 (Amalfi Coast Getaway):**
     - Tag: "Coastal Sun", "🔒 ARCHIVED", "Amalfi Coast Getaway", "📅 Jun 01 - Jun 10, 2024 • 10 Days", "👥 2 Travelers".
   - **Selectable Card 3 (Patagonia Trekking):**
     - Tag: "Wilderness Trail", "🔒 ARCHIVED", "Patagonia Trekking", "📅 Jan 15 - Feb 02, 2025 • 18 Days", "👥 1 Traveler".

---

### 5.9 Screen 08: Discover Itinerary Detail & Clone View

#### Purpose
Comprehensive full-screen preview of a shared community itinerary with route architecture, interactive waypoints, day-by-day stops, budget anatomy, and one-tap clone CTA.

#### Source Reference
- `frontend/Screenshots/Home/Discover/ReRoute Home Dashboard- Itinerary Detail.png`

#### Layout Hierarchy
1. **Header Row:** Back button '←', "• Itinerary Detail", Share icon, Mascot.
2. **Hero Image Banner (`h-64 w-full relative rounded-b-3xl overflow-hidden`):**
   - Top-Left Tag: "🍂 Spring Edition" (`bg-white/90 text-xs font-bold px-3 py-1 rounded-full`).
   - Top-Right Tag: "📅 7 Days • 6 Nights" (`bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full`).
   - Bottom Overlay:
     - Badge: "🛡️ CURATED COMMUNITY ROUTE" (`text-[10px] font-bold text-[#ffa951] uppercase`).
     - Headline: "Kyoto & Osaka Spring Discovery" (`text-2xl font-bold text-white`).
     - Subtitle: "Ancient alleyways, dawn shrines & Osaka street..." (`text-xs text-white/90`).
3. **Creator Author Card (`bg-white rounded-2xl p-4 mx-4 -mt-4 shadow-soft flex-row items-center justify-between`):**
   - Left: Avatar + Author "Elena Rostova" (`font-bold text-sm text-on-surface`), Badge: "LVL 4" (`bg-green-100 text-[#2e4525] text-[10px] font-bold px-1.5 py-0.5 rounded`).
   - Subtext: "Shared 3 days ago • 14 trips completed" (`text-[11px] text-outline`).
   - Right: "Follow" button (Note: per AGENTS.md §65, follow is disabled/informational).
4. **Key Stats Metric 4-Grid (`grid grid-cols-4 gap-2 mx-4 my-4`):**
   - Metric 1: 📋 "1,420" / Clones.
   - Metric 2: ⭐ "4.9" / 84 reviews.
   - Metric 3: 🚶 "Moderate" / Pace.
   - Metric 4: 💵 "$1,250" / Est. / person.
5. **Tags Row:** `🏛️ Cultural`, `🍜 Gastronomy`, `🚶 Walkable`, `🚆 JR Pass Friendly`.
6. **Field Notes Card (`bg-[#fef9f5] border border-orange-100 rounded-2xl p-4 mx-4 mb-4`):**
   - Title: "📝 Elena's Field Notes" (`font-bold text-sm text-on-surface mb-2`).
   - Quote: *"Built this specifically for 3-5 friends seeking iconic dawn temples without the tour bus chaos..."*
   - Highlight Box: ☀️ "Prime Window: Late March - Mid April" / "Peak bloom matches perfectly with night illuminations in Maruyama Park."
7. **Route Architecture Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Header: "🗺️ Route Architecture" (`font-bold text-sm text-on-surface`), Right: "4 Hubs" (`text-xs font-bold text-[#ff8f06]`).
   - Route Chain: `Tokyo →` `Hakone →` `Kyoto (4N) →` `Osaka`.
   - Embedded Interactive Map Snippet:
     - Pins for Start (Tokyo Sta.), Basecamp (Gion), End (Dotonbori).
     - Pill Action: "🔍 Inspect Waypoints".
8. **Daily Breakdown Accordion (`px-4 mb-4`):**
   - Header Row: "📅 Daily Breakdown" (`font-bold text-base text-on-surface`), Action: "Expand All" (`text-xs text-[#ff8f06] font-semibold`).
   - **Day 01 (Expanded):** "Arrive & Gion Lantern Twilight" (3 stops • 4.2 km walk • 1 group dinner).
     - Stop 1: 🟤 `14:30 • CHECK-IN Gion Machiya Stay` - Settle bags at traditional cedar townhouse...
     - Stop 2: 🟢 `17:45 • GOLDEN HOUR Shirakawa Canal Walk` - Willow-lined paved streets with cherry trees... Tags: `#Willow Path`, `#Photo Spot #1`.
     - Stop 3: 🟣 `20:00 • DINNER Chao Chao Gyoza Feast` - Lively communal beer & pan-fried gyoza tables...
     - Transit Note: 🚆 Transit: Keihan Main Line (Shijo Sta.) • ¥230.
   - **Day 02 (Collapsed):** "Arashiyama Bamboo & Golden Pavilion" (4 stops • Dawn launch • Sagano train).
   - **Day 03 (Collapsed):** "Fushimi Inari Gates & Uji Green Tea" (Mountain summit hike • Matcha ceremony).
9. **Group Budget Anatomy Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Header: "⏱️ Group Budget Anatomy", Badge "Best for 2-5 Crew" (`bg-green-100 text-[#2e4525] text-[10px] font-bold px-2 py-0.5 rounded`).
   - Segmented Proportion Bar: Brown (42%), Orange (28%), Green (18%), Purple (12%).
   - Legend Grid:
     - 🟤 Stay & Ryokan: **42%**
     - 🟠 Food & Drinks: **28%**
     - 🟢 Transit & JR: **18%**
     - 🟣 Entries / Tours: **12%**
   - Callout Box: 👥 "Splitting Machiya ryokan rentals in Kyoto between 4 travelers saves an average of 35% per person compared to separate hotel rooms."
10. **Sticky Bottom Action Bar (`p-3 bg-white/95 backdrop-blur-md border-t flex-row items-center gap-3`):**
    - Bookmark / Save button ('🔖' `p-3.5 bg-surface-container rounded-2xl`).
    - Primary CTA Button: "📋 Clone Itinerary" (`bg-[#ff8f06] text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex-1 text-center`) with subtitle "Customizable in Trip Room →".
    - Share Icon button (`p-3.5 bg-surface-container rounded-2xl`).

---

### 5.10 Screen 09: Create Itinerary Post Preview / Review

#### Purpose
Pre-publish review sheet allowing authors to add custom field notes and tags before making their trip public.

#### Source Reference
- `frontend/Screenshots/Home/Discover/ReRoute Home Dashboard- Create Post Details.png`

#### Layout Hierarchy
- **Top Header:** Back arrow '←', "• Itinerary Detail", Share icon, Mascot.
- **Hero Image & Title Banner:** Same as Screen 08.
- **Tag Selector Row:** `Cultural`, `Gastronomy`, `Walkable`, `JR Pass Friendly`, `+ Add` button.
- **"Your Notes" Input Box (`bg-white rounded-2xl p-4 mx-4 shadow-soft mb-4`):**
  - Header: "✏️ Your Notes" (`font-bold text-sm text-on-surface`).
  - Multiline Text Input: Placeholder `Enter Your Note here to let others know your feeling about this trip!` (`bg-surface-container-low rounded-xl p-3 text-xs`).
- **Section Title:** "Review your trip before post!" (`text-base font-bold text-on-surface px-4 mb-3`).
- **Embedded Route Architecture & Daily Breakdown & Budget Anatomy Preview Cards.**
- **Bottom CTA:** "Post →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center w-full mx-4 mb-4`).

---

### 5.11 Screen 10: Notification Center Pop-up Dialog

#### Purpose
Contextual quick-sheet surfacing active unread notifications, voting requests, mascot suggestions, and a natural language AI inquiry bar.

#### Source Reference
- `frontend/Screenshots/Notification/Notification Pop-up Box.png`

#### Layout Hierarchy
- **Floating Overlay Sheet (`bg-white rounded-3xl p-5 max-w-sm mx-auto shadow-2xl`)**
  - **Header Row:**
    - Corgi mascot avatar icon.
    - Title: "Notifications" (`text-lg font-bold text-on-surface`).
    - Badge: "3 Unread" (`bg-[#ff8f06] text-white text-[10px] font-bold px-2 py-0.5 rounded-full`).
    - Action: "Mark all read" (`text-xs text-[#ff8f06] font-semibold`).
  - **Notification Item List (`space-y-3 my-3`):**
    - **Item 1 (Kitsune Navigator):**
      - Left: Orange paw icon (`bg-orange-100 rounded-xl p-2.5`).
      - Center: Title "Kitsune Navigator" (`font-bold text-xs text-[#ff8f06]`), Text: "Rain predicted in Kyoto this afternoon. Consider rescheduling Fushimi Inari trek." (`text-[11px] text-on-surface-variant`).
      - Right: "10m ago", Unread orange dot.
    - **Item 2 (TripRoom Vote):**
      - Left: Green ballot icon (`bg-green-100 rounded-xl p-2.5`).
      - Center: Title "TripRoom Vote", Text: "Kyoto Ramen vs Kaiseki Dinner tonight. 3 of 4 team members voted!"
      - Right: "25m ago", Unread orange dot.
    - **Item 3 (Shared Expense):**
      - Left: Pink receipt icon (`bg-pink-100 rounded-xl p-2.5`).
      - Center: Title "Shared Expense", Text: "Haruka Express JPY 4,200 logged by Sarah."
      - Right: "1h ago", Unread orange dot.
  - **Archive Link Button:** "🕒 View notification archive & preferences →" (`bg-surface-container-low rounded-xl py-2.5 px-3 text-xs text-on-surface font-semibold flex-row justify-between items-center`).
  - **Quick AI Inquire Box (`bg-surface-container-low rounded-2xl p-3 mt-3`):**
    - Header: "✨ Quick AI Inquire" (`font-bold text-[11px] text-on-surface`), "Powered by ReRoute Core" (`text-[9px] text-outline`).
    - Input Row: Placeholder `Ask AI assistant about alerts...` + Orange send button.
    - Quick Action Chips: `📍 Plan indoor route`, `✈️ Flight status`, `🍽️ Nearby dining`.

---

### 5.12 Screen 11: Notifications & Alerts Full View Screen

#### Purpose
Comprehensive notification management center with filter tabs, grouped chronological feeds, and actionable decision card links.

#### Source Reference
- `frontend/Screenshots/Notification/Notifications - Full View.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Top Sub-Header:** "← Back to Home", Right: "✓ Mark read" (`text-xs text-outline`), Filter icon.
3. **Title Banner (`bg-orange-50/80 rounded-2xl p-4 mx-4 mb-3 border border-orange-100`):**
   - Left: Bell badge with "5" count badge.
   - Text: "Notifications & Alerts" (`text-base font-bold text-on-surface`), Subtext: "Real-time pulses for your Japan trip" (`text-xs text-on-surface-variant`).
4. **Category Filter Strip (`flex-row gap-2 px-4 mb-4`):**
   - `All (5)` (Active: `bg-[#ff8f06] text-white font-bold text-xs px-3 py-1.5 rounded-full`).
   - `Safety & Weather (2)` (`bg-white border border-surface-container text-xs font-medium px-3 py-1.5 rounded-full`).
   - `Trip Room Votes (1)`.
5. **Feed Group 1: "• TODAY" (3 unread):**
   - **Card 1: Safety Alert • Urgent** (`border-l-4 border-l-[#b02500] bg-white rounded-2xl p-4 shadow-soft mb-3`):
     - Header: ⚠️ "Safety Alert • Urgent" (`text-[10px] font-bold text-[#b02500]`), "24m ago", Close '✕' button.
     - Headline: "Severe Weather Advisory: Heavy Rain" (`text-sm font-bold text-[#b02500] mt-1`).
     - Body: "Torrential precipitation approaching Arashiyama Bamboo Grove. Outdoor trails slippery and unsafe."
     - Mascot Callout Box (`bg-orange-50 rounded-xl p-3 my-2`):
       - 🦊 "Kitsune Mascot Proposal" / "Replaced trail with 2 sheltered cultural stops: Tenryu-ji Temple Pavilions and Saga-Toriimoto Tea House."
     - Action Row: Primary "Review Decision Card" (`bg-[#ff8f06] text-white text-xs font-bold py-2 px-4 rounded-xl flex-1 text-center`), Secondary "Dismiss" button.
   - **Card 2: Trip Room Vote** (`border-l-4 border-l-[#3e5634] bg-white rounded-2xl p-4 shadow-soft mb-3`):
     - Header: 🗳️ "Trip Room Vote", "1h ago", "⏱️ Closes in 2h" red pill.
     - Headline: "Decision Card: Day 3 Departure Time" (`text-sm font-bold text-on-surface`).
     - Body: "Co-travelers are picking between the early express train (07:45 AM) or leisurely bullet train (09:15 AM)."
     - Progress Bar: "3 of 4 votes recorded" (75% completed). Avatar stack `E K M` + "Waiting for you to break the tie".
     - CTA Button: "🗳️ Cast Your Vote Now" (`bg-[#3e5634] text-white text-xs font-bold py-2.5 rounded-xl text-center w-full mt-2`).
   - **Card 3: Mascot Suggestion** (`border-l-4 border-l-[#ff8f06] bg-white rounded-2xl p-4 shadow-soft mb-3`):
     - Header: ✨ "Mascot Suggestion", "3h ago", Orange unread dot.
     - Headline: "Dinner Reservation Gap" / "Kitsune Mascot noticed you have 2.5 hours free tonight near Gion. Want hand-picked Kaiseki or quick Soba spots?"
     - Actions: `🍲 Browse Gion Eats`, `⏱️ Keep Free`.
6. **Feed Group 2: "• YESTERDAY":**
   - **Card 4: Budget Alert (FR-9-3a):**
     - Header: 💳 "Budget Alert (FR-9-3a)", "1d ago".
     - Headline: "Mixed Currency Logged" / "JPY and USD expenses logged in the same trip ledger. Subtotals dynamically separated..."
     - Dual Subtotals: SUBTOTAL JPY: **¥42,850** | SUBTOTAL USD: **$168.00**.
     - Link: "View Trip Ledger >".
   - **Card 5: Community Star:**
     - 🌟 "Community Star", "1d ago" / "Itinerary Cloned! 3 travelers cloned your published 'Hidden Temples of Kyoto' guide this morning."
7. **Bottom Concierge Promo Card (`bg-[#edf7ee] rounded-2xl p-4 mx-4 mb-4`):**
   - Robot icon + "Have questions about these alerts?" / "Your ReRoute AI Concierge can re-book tickets, shift itinerary timings, and adjust currency targets instantly."
   - Action: "Start AI Chat →" (`bg-[#ff8f06] text-white text-xs font-bold py-2 px-4 rounded-xl self-end mt-2`).

---

### 5.13 Screen 12: AI Travel Assistant (Kitsu Concierge) Chat Page

#### Purpose
Dedicated conversational AI interface for smart route recovery, real-time query resolution, and interactive itinerary proposals.

#### Source Reference
- `frontend/Screenshots/Notification/AI Travel Assistant Chat Page.png`

#### Layout Hierarchy
1. **Top Header:** Back arrow '←', Mascot avatar with online status indicator dot, Title "Kitsu Concierge" (`text-base font-bold`), Badge: "AI", Subtitle: "• Online • Kyoto Autumn Trip", More options '⋮'.
2. **Alert Sync Bar:** 🌧️ "Weather alert in Kyoto • 3 unread trip changes", Action: "Sync" (`text-xs font-bold text-[#ff8f06]`).
3. **Chat Feed Stream (`px-4 space-y-4 pt-3 pb-24`):**
   - Timestamp Pill: "TODAY • 11:42 AM" (`bg-surface-container text-[10px] text-outline px-3 py-1 rounded-full self-center`).
   - **Incoming Assistant Message:**
     - Left: Sparkle / Fox icon.
     - Bubble (`bg-white rounded-2xl p-4 shadow-soft`): "Konnichiwa Alex! 🦊 I saw your alert regarding the afternoon rain forecast across Arashiyama. Would you like me to reroute Day 2 toward the covered Nishiki Arcade & Crafts Museum instead of the hillside hike?" (`text-xs text-on-surface`).
     - Timestamp: "11:43 AM".
   - **Outgoing User Message:**
     - Bubble (`bg-[#ff8f06] text-white rounded-2xl p-4 shadow-soft self-end`): "Yes please! What indoor food spots and cultural highlights do you recommend around Nishiki Market?" (`text-xs text-white`).
     - Timestamp: "11:44 AM" with double checkmark '✓✓'.
   - **Incoming AI Smart Proposal Card:**
     - Left Fox Icon.
     - Card Container (`bg-white rounded-2xl p-4 shadow-soft`):
       - Header: "✨ SMART RAIN REROUTE • KYOTO DAY 2" (`text-[10px] font-bold text-[#ff8f06]`).
       - Subtext: "I sculpted a dry cultural route under covered arcades, featuring warm matcha dango and traditional artisanal workshops."
       - Map Route Snippet with "Rain-safe" badge and "1.8 km Covered Walk".
       - Stop 1: Thumbnail + "Nishiki Market Arcade" (`12:30 PM`) / "Sensory food tasting • 5 stops under canopy" / Chips: `Warm dango`, `Dry & heated`.
       - Stop 2: Thumbnail + "Kyoto Crafts & Design Museum" (`2:45 PM`) / "Woodblock printing studio & gallery exhibition" / Chip: `Direct underground link`.
       - Action Button: "✓ Accept & Reroute Day 2" (`bg-[#ff8f06] text-white font-bold text-xs py-3 rounded-xl w-full text-center mt-3`).
       - Secondary Actions Row: `🗳️ Propose to Vote`, `⚙️ Customize`.
4. **Quick Suggestion Prompt Chips (`flex-row gap-2 px-4 mb-2`):** `💰 Budget impact?`, `🚇 Subway route to Nishiki`, `📣 Notify Kyoto group`.
5. **Message Composer (`p-3 bg-white border-t flex-row items-center gap-2`):**
   - '+' Attachment icon.
   - Text Input: `Type your message or ask for recommendations...`
   - Microphone icon.
   - Send Button (`bg-[#ff8f06] text-white p-2.5 rounded-xl`).

---

### 5.14 Screen 13: User Profile & History Dashboard

#### Purpose
Unified traveler identity, unlocked achievement badges, starred inspirations, past trip archive, and language streak progress.

#### Source Reference
- `frontend/Screenshots/Profile/ReRoute Profile.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Profile Hero Card (`bg-white rounded-3xl p-5 mx-4 mb-5 shadow-soft items-center`):**
   - Circular Profile Photo (`h-24 w-24 rounded-full border-4 border-white shadow-md mb-3`).
   - Display Name: "Elena R." (`text-xl font-bold text-on-surface`).
   - Subtitle: "Level 12 Traveller • 14 trips • 6 countries" (`text-xs text-on-surface-variant mb-3`).
   - 3-Pill Stat Row (`flex-row gap-2`):
     - `🔥 23d Streak` (`bg-orange-100 text-[#ff8f06] text-xs font-bold px-3 py-1 rounded-full`).
     - `📷 420 Photos` (`bg-orange-100 text-[#ff8f06] text-xs font-bold px-3 py-1 rounded-full`).
     - `👥 18 Friends` (Informational stat tag).
3. **Badges & Achievements Section (`px-4 mb-5`):**
   - Section Header: "Badges (8/20 unlocked)" (`text-base font-bold text-on-surface mb-3`).
   - 6-Grid Badge Icons:
     - 🌍 **Globetrotter** (Unlocked: bright orange circular icon with globe).
     - 🍴 **Foodie** (Unlocked: bright orange circular icon with fork/knife).
     - ⏰ **Early Bird** (Unlocked: bright orange circular icon with clock).
     - ⛰️ **Mountain Goat** (Locked: muted gray circular icon).
     - 🔤 **Language Pro** (Locked: muted gray circular icon).
     - 🎴 **Budget King** (Locked: muted gray circular icon).
4. **Starred Trips Section (`px-4 mb-5`):**
   - Section Header: "Starred Trips" (`text-base font-bold text-on-surface`), Right: "3 trips saved" (`text-xs text-outline`).
   - Horizontal 2-Card Row:
     - **Card 1:** Author avatar + "by Sarah J." / "Amalfi Coast Getaway" / "🕒 7 Days • Positano" / Orange "📋 Clone" button (`bg-[#ff8f06] text-white text-xs font-bold py-2 rounded-xl text-center w-full mt-2`).
     - **Card 2:** Author avatar + "by Yuki Tanaka" / "Kyoto Sakura Trail" / "🕒 5 Days • Temples & Tea" / Orange "📋 Clone" button.
5. **Past Trips Section (`px-4 mb-5 space-y-3`):**
   - Section Header: "Past Trips" (`text-base font-bold text-on-surface mb-2`).
   - **Trip Item 1:** "Kyoto, Japan" / "Apr 2024" / Badge: `Archived` (`bg-green-100 text-[#2e4525] text-xs font-semibold px-3 py-1 rounded-full`).
   - **Trip Item 2:** "Paris, France" / "Jan 2024" / Badge: `Archived`.
6. **Language Progress Card (`bg-[#fae8d2] border border-orange-200 rounded-2xl p-4 mx-4 mb-5`):**
   - Header: "Japanese Progress", Language icon '文A', Subtitle: "23-day streak 🔥".
   - Linear Progress Bar (`h-2 bg-surface-container rounded-full overflow-hidden my-2` with dark brown fill `w-[64%]`).
   - Footer Row: "64% Mastered", Action: "Continue learning →" (`text-xs text-[#8b4b00] font-bold`).
7. **Settings & Logout List (`px-4 mb-6 space-y-3`):**
   - Settings Row: Gear icon + "Settings" (`text-sm font-semibold text-on-surface`).
   - Logout Row: Exit icon + "Logout" (`text-sm font-semibold text-error`).
8. **BottomNavBar** (Fixed Bottom, Profile active).

---

### 5.15 Screen 14: Trip Rooms Hub (Empty State & Active Lists)

#### Purpose
Primary management hub for browsing trips across Planning, Live, and Archived lifecycle stages, launching room creation, or joining via room code.

#### Source Reference
- `frontend/Screenshots/Trip/Main/ReRoute Trip Rooms - Empty State.png`
- `frontend/Screenshots/Trip/Main/ReRoute Trip Rooms List (Planning).png`
- `frontend/Screenshots/Trip/Main/ReRoute Trip Rooms List (Live).png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Page Header Row (`px-5 pt-3 pb-2 flex-row justify-between items-center`):**
   - Title: "Trips" (`text-2xl font-bold text-on-surface`).
   - Primary Action: "+ Add Trip" button (`bg-[#ff8f06] text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex-row items-center gap-1`).
3. **Lifecycle Segmented Tabs (`bg-surface-container-low rounded-2xl p-1 mx-4 flex-row mb-5`):**
   - Tab 1: "Planning" (Active: `bg-white text-[#8b4b00] font-bold py-2.5 rounded-xl flex-1 text-center shadow-sm`).
   - Tab 2: "Live" (or "Active").
   - Tab 3: "Archived" (or "Past").
4. **State A: Empty State View (`items-center justify-center py-12 px-6`):**
   - Circular Illustrated Graphic: Travel map with compass and traveler pin ("Plan Your Spring Escape!").
   - Headline: "Plan your first trip" (`text-xl font-bold text-on-surface mt-4`).
   - Subtitle: "Gather your crew, build an itinerary, and start coordinating your next great spring adventure." (`text-xs text-on-surface-variant text-center my-2 max-w-xs`).
   - Action Button: "Get Started →" (`bg-[#ff8f06] text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-md mt-4`).
5. **State B: Planning Trip List View (`px-4 space-y-4`):**
   - **Card 1 (Tokyo & Kyoto Explorer):**
     - Header Row: Title "Tokyo & Kyoto Explorer" (`font-bold text-base text-on-surface`), Badge: `Planning` (`bg-[#ff8f06] text-white text-[10px] font-bold px-2.5 py-1 rounded-full`).
     - Subtext: 📅 "Oct 12 - Oct 24, 2024".
     - Footer Row: Member avatars stack (`+2`), Right: "5 Travelers" (`text-xs text-outline`).
   - **Card 2 (Patagonia Trekking):**
     - Header Row: Title "Patagonia Trekking", Badge: `Planning`.
     - Subtext: 📅 "Jan 15 - Feb 02, 2025", Footer: 1 avatar + "1 Traveler".
6. **State C: Live Trip List View (`px-4 space-y-4`):**
   - **Card 1 (Amalfi Coast Getaway):**
     - Header Row: Title "Amalfi Coast Getaway", Badge: `Live` (`bg-[#7a4100] text-white text-[10px] font-bold px-2.5 py-1 rounded-full`).
     - Subtext: 📅 "Jun 01 - Jun 10, 2024", Footer: Member avatars + "2 Travelers".
7. **BottomNavBar** (Fixed Bottom, Trip active).

---

### 5.16 Screen 15: Trip Room - Discussion / Chat Subsystem

#### Purpose
Real-time group collaboration feed integrating user chat messages, in-feed anonymous decision cards, thread replies, and system itinerary change alerts.

#### Source Reference
- `frontend/Screenshots/Trip/Discussion/ReRoute Trip Room - Discussion (Planning  Active).png`
- `frontend/Screenshots/Trip/Discussion/ReRoute Trip Room - Discussion (Archived).png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←' (`px-4 pt-1 pb-1`)**
3. **Seasonal Trip Header Card (`bg-[#ffd4de] rounded-3xl p-5 mx-4 mb-4 shadow-soft`):**
   - Top Row: "Tokyo Sakura Season" (`text-xl font-bold text-on-surface`), Badge: "• Live" (`bg-white/80 text-[#b02500] text-[10px] font-bold px-2.5 py-1 rounded-full`).
   - Subtitle: 📍 Tokyo, Japan • Apr 02 - Apr 10 (`text-xs text-on-surface-variant mt-1`).
   - Bottom Row: Member avatar stack (`+2`), Right: "5 Travelers" (`text-xs font-bold text-[#703749]`).
4. **Trip Sub-Tabs Strip (`flex-row gap-2 px-4 mb-4 overflow-x-auto`):**
   - `Discussion` (Active: `bg-pink-100 text-[#85495c] font-bold px-4 py-2 rounded-full text-xs`).
   - `Itinerary`, `Budget`, `Album`, `Language` (Inactive: `bg-surface-container-high text-on-surface-variant font-medium px-4 py-2 rounded-full text-xs`).
5. **Archived Notice Banner (Rendered when `stage = 'archived'`):**
   - ℹ️ "This trip room is archived. You can view past discussions and polls, but new interactions are disabled." (`bg-surface-container rounded-xl p-3 text-xs text-on-surface-variant mx-4 mb-3`).
6. **In-Feed Anonymous Decision Poll Card (`bg-white border border-surface-container rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Header: 📊 "Where for dinner on Day 3?" (`font-bold text-sm text-on-surface mb-3`).
   - Option Bar 1 (Ichiran Ramen):
     - Background Bar (`h-9 bg-surface-container-low rounded-xl overflow-hidden flex-row items-center px-3 justify-between` with orange fill `w-[40%] bg-orange-200`).
     - Text: "Ichiran Ramen", Tally: "40%".
   - Option Bar 2 (Local Izakaya):
     - Background Bar with orange fill `w-[60%] bg-orange-300`.
     - Text: "Local Izakaya", Tally: "60%".
   - Action Button: "Vote Anonymously" (`bg-[#ff8f06] text-white font-bold text-xs py-3 rounded-xl w-full text-center mt-3`).
   - *(In Archived state: disabled gray button "Vote End")*.
7. **System Notice Pill:**
   - ℹ️ "ReRoute Notice: Itinerary updated by Sarah" (`bg-surface-container text-[11px] text-on-surface-variant px-3 py-1 rounded-full self-center my-3`).
8. **Chat Message Stream:**
   - **Incoming Message (Alex):**
     - Left: Avatar (`h-7 w-7 rounded-full`).
     - Bubble (`bg-surface-container-low rounded-2xl p-3 max-w-[75%]`): "Has anyone checked if the JR Pass covers our trip to Kyoto?" (`text-xs text-on-surface`).
   - **Outgoing Message (Mia - You):**
     - Right: Avatar.
     - Bubble (`bg-[#ff8f06] text-white rounded-2xl p-3 max-w-[75%] self-end`): "Yes, I added it to the budget tab. We should book it today. Also, regarding tomorrow's sunrise plan..." (`text-xs text-white`).
     - **Attached Thread Card:**
       - "💬 Thread • Day 4 • Fushimi Inari sunrise" (`text-[10px] font-bold text-[#8b4b00]`).
       - Avatars + "2 replies" (`text-[10px] text-outline`).
9. **Composer Bar:**
   - Active: '+' Action icon, Input: `Type a message...`, Orange send button.
   - Archived: Disabled capsule "Message are no longer available for this trip."

---

### 5.17 Screen 16: Trip Room - Itinerary & Maps Subsystem

#### Purpose
Geospatial route navigation, daily stop timeline, live member GPS tracking, and safety reroute trigger.

#### Source Reference
- `frontend/Screenshots/Trip/Itinenary/ReRoute Trip Room - Map Tab (Active  Planning).png`
- `frontend/Screenshots/Trip/Itinenary/ReRoute Trip Room - Map Tab (Archived).png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip (Itinerary Active).**
4. **AI Safety Alert Banner (`bg-[#f95630] text-white rounded-2xl p-3.5 mx-4 mb-3 flex-row items-center justify-between`):**
   - Left: ⚠️ Warning triangle icon.
   - Text: "AI Safety Check" (`font-bold text-xs`), Subtext: "Heavy rain expected in Kyoto area this afternoon. Consider indoor alternatives." (`text-[11px] opacity-90`).
   - Right: Close '✕' icon.
5. **Interactive Map Viewport Card (`h-64 rounded-3xl overflow-hidden mx-4 mb-4 relative shadow-soft`):**
   - Full Google Maps render with route polyline and numbered landmark pins (e.g. Pin '1').
   - Live Member Pin: Circular avatar with green "• live" badge.
   - Map Controls: Layers toggle button (top right), Locate GPS button (top right).
6. **Suggested Routes Section (`px-4 mb-4`):**
   - Header Row: "Suggested Routes" (`text-base font-bold text-on-surface`), Action: "🔄 Reroute" orange pill button (`bg-orange-100 text-[#8b4b00] text-xs font-bold px-3 py-1.5 rounded-full`).
   - **Route Leg Card 1:**
     - Time & Leg: 🕒 "08:10 • Kyoto Station → Kinkaku-ji" (`text-xs font-bold text-on-surface mb-2`).
     - 3 Transit Mode Tiles:
       - 🚆 Train • 45m / $4 (`bg-surface-container-low rounded-xl p-2 items-center flex-1`).
       - 🚌 Bus • 1h / $2 (Selected: `border-2 border-[#7a4100] bg-orange-50 rounded-xl p-2 items-center flex-1` with "AI PICK" top badge).
       - 🚕 Taxi • 30m / $15 (`bg-surface-container-low rounded-xl p-2 items-center flex-1`).
     - **Exact Drop-off Point Card (`bg-surface-container-low rounded-xl p-3 mt-3 flex-row items-center gap-3`):**
       - Thumbnail Image of bus stop.
       - Text Block: "Exact Drop-off Point" (`font-bold text-xs text-[#b02500]`), "Kinkaku-ji Michi Bus Stop. 2-min walk to the main gate." (`text-[11px] text-on-surface-variant`), "✓ Street View Verified" (`text-[10px] text-[#2e4525] font-semibold`).
   - **Route Leg Card 2:** 🕒 "11:30 • Kinkaku-ji → Arashiyama" / "🚶 View walking route".

---

### 5.18 Screen 17: Trip Room - Edit Itinerary & 3D Landmark View

#### Purpose
Detailed stop inspector with day drafts, 3D landmark asset preview, historical background, and drop-off guidance.

#### Source Reference
- `frontend/Screenshots/Trip/Itinenary/ReRoute Trip Room - Edit Itinenary (Add route).png`
- `frontend/Screenshots/Trip/Itinenary/ReRoute Trip Room - Edit Itinenary (Real Map).png`
- `frontend/Screenshots/Trip/Itinenary/ReRoute Trip Room - Edit Itinenary (AI 3D Model).png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Search / Filter Bar:** `🔍 Search Japan cities...` with filter icon.
3. **Map / 3D Model Viewer Canvas (`h-60 bg-[#edf1f5] rounded-2xl mx-4 mb-4 relative overflow-hidden`):**
   - *State A (Real Map):* National route connection nodes (Tokyo → Kyoto → Osaka).
   - *State B (3D Model):* Interactive 3D render of Kinkaku-ji temple with pinch zoom '🔍' and rotate '🔄' touch controls.
4. **Day 1 Planning Draft Header:** "Day 1 Planning" (`font-bold text-base text-on-surface`), Badge: `Draft`, Tag: `Oct 19 • Kyoto Arrival`.
5. **Editable Timeline Stops:**
   - **Stop 1 (Kyoto Station Arrival):**
     - Orange node. Time: 09:30 AM. Place: "Kyoto Station (Arrival)". Edit '✏️' & Delete '🗑️' icons.
     - Hero Image. Badge: "✓ Voted (4/5 agreed)", "Locked in route".
   - **Stop 2 (Kinkaku-ji Golden Pavilion):**
     - Orange node. Time: 11:45 AM. Place: "Kinkaku-ji (Golden Pavilion)". Badge: `Pending`.
     - Hero Image. Action: "Suggest Vote" orange button.
   - **Stop 3 (Candidate Stop Proposal):**
     - Gray node. Dashed card: "02:30 PM • Arashiyama Bamboo Grove / Candidate stop proposal" + "+ Add Details".
6. **Landmark Detail Inspector Sheet (when Kinkaku-ji is tapped):**
   - Title: "Kinkaku-ji" / "(Golden Pavilion)" + Bookmark icon.
   - History Section: "History" / "Kinkaku-ji, officially named Rokuon-ji, is a Zen Buddhist temple in Kyoto..."
   - Notable Facts:
     - 💎 **PURE GOLD**: "The top two stories are completely covered in pure gold leaf..."
     - 🌊 **KYOKO-CHI POND**: "The pavilion overlooks Kyoko-chi (Mirror Pond)..."
   - Action Button: "+ Add to Itinerary" (`bg-[#ff8f06] text-white font-bold text-sm py-3.5 rounded-2xl w-full text-center mt-4`).
7. **Primary Footer CTA:** "✓ Complete Planning" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center mx-4 mb-4`).

---

### 5.19 Screen 18: Trip Room - Budget Dashboard & Expense Splitting

#### Purpose
Group financial tracking, category breakdown, individual debt balances, and expense logging entry.

#### Source Reference
- `frontend/Screenshots/Trip/Budget/ReRoute Trip Room - Budget Tab.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Seasonal Trip Header Card & Sub-Tabs Strip (Budget Active).**
3. **Total Budget Summary Card (`bg-white rounded-3xl p-5 mx-4 mb-4 shadow-soft`):**
   - Top Row: TOTAL SPENT: **$2,450** (`text-2xl font-bold text-on-surface`) | PLANNED: **$3,500** (`text-sm font-bold text-outline`).
   - Progress Bar: Solid brown fill (`w-[70%] bg-[#8b4b00] h-2.5 rounded-full`).
   - Balance Breakdown Sub-Card (`bg-[#f4f8f2] rounded-2xl p-4 mt-4`):
     - "Your Contribution:": **$600**
     - "Your Share:": **$490**
     - Divider line.
     - "You are owed" (`text-sm font-bold text-[#2e4525]`): **$110** (`text-base font-bold text-[#2e4525]`).
4. **Categories Section (`px-4 mb-4 space-y-2.5`):**
   - Section Title: "Categories" (`text-base font-bold text-on-surface mb-2`).
   - **Accommodation:** 🛏️ "Accommodation" | "$1,200 / $1,200" (Full brown bar).
   - **Food:** 🍴 "Food" | "$850 / $800" (Orange overspend warning bar).
   - **Transport:** 🚆 "Transport" | "$400 / $500" (Brown partial bar).
5. **Recent Expenses Section (`px-4 mb-4 space-y-2.5`):**
   - Section Title: "Recent Expenses" (`text-base font-bold text-on-surface mb-2`).
   - **Expense 1:** 🍴 "Sushi Dinner" / "Mia paid • Equal split" / Tag: `Food` / Amount: **$120** (`font-bold text-sm text-on-surface`).
   - **Expense 2:** 🚆 "JR Pass" / "Alex paid • Percentage" / Tag: `Transport` / Amount: **$350**.
6. **Settle Up Section (`px-4 mb-4`):**
   - Section Title: "Settle Up" (`text-base font-bold text-on-surface mb-2`).
   - Settlement Card: Avatar + "You owes Alex" / **$45** / Action: "Settle" button (`border border-outline px-3 py-1 rounded-full text-xs font-bold`).
7. **Primary Action Button:** "+ Add Expense" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center mx-4 mb-4 shadow-md`).

---

### 5.20 Screen 19: Add Expense Modal

#### Purpose
Modal form to log expenses manually with split method selection and receipt attachment.

#### Source Reference
- `frontend/Screenshots/Trip/Budget/ReRoute Add Expense Modal.png`

#### Layout Hierarchy
- **Bottom Sheet Modal Card (`bg-white rounded-t-3xl p-5 max-h-[90%]`)**
  - **Sheet Drag Capsule + Close '✕' Icon.**
  - Title: "Add Expense" (`text-lg font-bold text-on-surface mb-4`).
  - **Amount & Currency Row (`flex-row gap-3 mb-4`):**
    - Amount Input: `$ 0.00` (`border-2 border-orange-300 rounded-xl px-4 py-3 text-xl font-bold flex-1`).
    - Currency Dropdown: `USD ▼` (`border border-outline-variant rounded-xl px-3 py-3 items-center justify-center`).
  - **Description Input:**
    - Label: "DESCRIPTION" (`text-[10px] font-bold text-outline`).
    - Input: Placeholder `e.g., Team Dinner` (`border border-outline-variant rounded-xl px-4 py-3 text-xs`).
  - **Category Selector:**
    - Label: "CATEGORY"
    - Select Dropdown: 🍴 `Food & Drink ▼` (`border border-orange-300 rounded-xl px-4 py-3 text-xs font-semibold`).
  - **Paid By Selector:**
    - Label: "PAID BY"
    - Avatar selection chips: Avatar 1 (Selected with checkmark), Avatar 2, '+' Add payer.
  - **Split Method Segmented Control:**
    - Label Row: "SPLIT METHOD" (`text-[10px] font-bold text-outline`), Right: "ADJUST" (`text-[10px] font-bold text-[#ff8f06]`).
    - 4 Tabs:
      1. `Equal` (Active: `bg-[#7a4100] text-white font-bold rounded-lg py-2 flex-1 text-center`).
      2. `Percentage` (`text-on-surface-variant flex-1 text-center`).
      3. `Shares`.
      4. `Exact`.
  - **Receipt Attachment Box:**
    - Label: "RECEIPT"
    - Box 1: Dashed orange box with camera icon + "Scan" (`border-2 border-dashed border-orange-300 rounded-xl p-3 items-center`).
    - Box 2: Thumbnail with "Scanning..." overlay.
  - **Submit Button:** "Add Expense →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center w-full mt-4`).

---

### 5.21 Screen 20: Receipt OCR Scanner & Line-Item Review

#### Purpose
AI-powered receipt digitizer displaying scanned image, detected merchant, and editable line items before bill splitting.

#### Source Reference
- `frontend/Screenshots/Trip/Budget/ReRoute OCR - Data Review & Edit.png`

#### Layout Hierarchy
1. **Header Row:** Close '✕' button, Title "Ocr Processing Review" (`font-bold text-base text-on-surface`), User Avatar.
2. **Auto-Audit Status Banner (`bg-[#dffbcd] rounded-2xl p-3 mx-4 mb-4 flex-row items-center justify-between`):**
   - Left: Sparkle icon + "Auto-Audit Ready" (`font-bold text-xs text-[#2e4525]`), Subtext: "Verify against receipt slip".
   - Right: "✓ 98% Match" badge (`bg-[#3e5634] text-white text-[10px] font-bold px-2 py-0.5 rounded-full`).
3. **Source Receipt Photo Card (`bg-[#edf1f5] rounded-2xl p-3 mx-4 mb-4 relative`):**
   - Header: 🔲 "Source Receipt", Action: "🔍 Tap to Inspect".
   - Scanned Receipt Image with "Pinch to zoom & compare" overlay badge.
4. **Merchant & Category Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Label Row: "Merchant / Store", Right: "Kyoto, Japan".
   - Merchant Name: `Sakura Izakaya (居酒屋 錦小路 さくら) ✏️` (`bg-surface-container-low rounded-xl p-3 font-semibold text-xs text-on-surface`).
   - Category Pills: `🍴 Food, Drinks & Dining ✓` (Active orange), `🍸 Nightlife`.
5. **Extracted Items List Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft space-y-2`):**
   - Header: 🧾 "Extracted Items" (`font-bold text-sm text-on-surface`), "6 items" pill.
   - Item 1: `生ビール (Draft Beer) / Qty: 1` → `¥680` + Delete '🗑️'.
   - Item 2: `枝豆 (Edamame) / Qty: 2` → `¥450` + Delete '🗑️'.
   - Item 3: `鶏唐揚げ (Fried Chicken) / Qty: 1` → `¥780` + Delete '🗑️'.
   - Item 4: `焼き鳥盛合 (Yakitori Platter) / Qty: 1` → `¥1,200` + Delete '🗑️'.
   - Item 5: `ラーメン (Ramen) / Qty: 1` → `¥980` + Delete '🗑️'.
   - Item 6: `冷酒 (Chilled Sake) / Qty: 1` → `¥950` + Delete '🗑️'.
   - Action Button: "+ + Add Missing Line Item" (`bg-surface-container-low rounded-xl py-2.5 text-center text-xs font-bold text-on-surface`).
6. **Financial Summary Box (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Subtotal: `¥ 5,040`
   - Tax (10%): `¥ 504`
   - Total Box (`bg-[#7a4100] text-white rounded-xl p-3 flex-row justify-between items-center mt-2`):
     - Left: "TOTAL AMOUNT" / "Converted: ~RM144".
     - Right: **¥5,544** (`text-xl font-bold`).
7. **CTA Button:** "Confirm Extracted Data →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center mx-4 mb-4`).

---

### 5.22 Screen 21: Split Item Assignment & Confirmation

#### Purpose
Assign extracted items to specific group members with equal, percentage, shares, or exact split allocations.

#### Source Reference
- `frontend/Screenshots/Trip/Budget/ReRoute OCR - Confirmation & Split Setup.png`

#### Layout Hierarchy
1. **Header Row:** Close '✕', "Split Item Assignment", User Avatar.
2. **Mode Switcher:** `✓ OCR Success` (Active) vs `⚠️ Simulate Error Sheet`.
3. **Success Notice Banner:** 🟢 "Receipt Verified Successfully! ¥5,544 JPY recorded from Sakura Izakaya".
4. **Receipt Metadata Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Category Tag: `🍴 Dining & Izakaya`.
   - Title: "Sakura Izakaya", Date: "📅 Oct 26, 2024 • Kyoto, Japan", Receipt Thumbnail with zoom icon.
   - Total Amount: **¥5,544 JPY** | TAX INCLUDED (10%): **¥504 JPY**.
   - Payer Row: Avatar + "Alex Chen (You)" + "Change" button.
5. **Split Expense Card (`bg-white rounded-2xl p-4 mx-4 mb-4 shadow-soft`):**
   - Header Row: "Split Expense", Badge: "4 Active".
   - Subtext: "4 travelers in Kyoto Room".
   - Split Method Selector: `Equal` (Active white pill), `%`, `Shares`, `Exact`.
   - **Member Split Rows (`space-y-2 my-3`):**
     - Member 1: Avatar (AC) + "Alex Chen (You)" / "Payer • 1 share (25%)" → **¥1,386 JPY**.
     - Member 2: Avatar (SJ) + "Sarah Jenkins" / "1 share (25%)" → **¥1,386 JPY**.
     - Member 3: Avatar (KS) + "Kenji Sato" / "1 share (25%)" → **¥1,386 JPY**.
     - Member 4: Avatar (ER) + "Elena Rostova" / "1 share (25%)" → **¥1,386 JPY**.
   - Footer Row: "+ Add Traveler" (`text-xs font-bold text-[#8b4b00]`), Right: "🔒 Exact match (¥5,544)" (`text-[10px] text-outline`).
6. **Primary CTA:** "Save Expense & Split with Group →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center mx-4 mb-4`).

---

### 5.23 Screen 22: Trip Room - Shared Photo Album Subsystem

#### Purpose
Shared group gallery automatically organized chronologically by Day and location geotags.

#### Source Reference
- `frontend/Screenshots/Trip/Album/ReRoute Trip Room - Album Tab.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip (Album Active).**
4. **Gallery Header Row (`px-4 flex-row justify-between items-center mb-3`):**
   - Title: "Shared Photos" (`text-base font-bold text-on-surface`).
   - Action: "📷 Upload" orange pill button (`bg-[#ff8f06] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl`).
5. **Photo Section 1: "DAY 4 • KYOTO" (`px-4 mb-4`):**
   - Section Title: "DAY 4 • KYOTO" (`text-[10px] font-bold text-outline mb-2`).
   - 3-Column Image Grid:
     - Photo 1: Kiyomizu-dera cherry blossom temple.
     - Photo 2: Nishiki market street vendor.
     - Photo 3: Matcha soft-serve ice cream cone.
     - Photo 4: Friends walking in bamboo forest.
     - Tile 5: Gray placeholder card "••• +12 more" (`bg-surface-container rounded-xl items-center justify-center h-28`).
6. **Photo Section 2: "DAY 3 • TOKYO" (`px-4 mb-4`):**
   - Section Title: "DAY 3 • TOKYO" (`text-[10px] font-bold text-outline mb-2`).
   - 3-Column Image Grid:
     - Photo 1: Shinjuku neon rain alley.
     - Photo 2: Sushi platter feast.
     - Tile 3: Gray placeholder card "••• +12 more".
7. **BottomNavBar** (Fixed Bottom).

---

### 5.24 Screen 23: Album Photo Lightbox Full-Screen View

#### Purpose
Immersive full-screen photo view with uploader attribution, relative timestamp, and interactive swipe navigation.

#### Source Reference
- `frontend/Screenshots/Trip/Album/ReRoute Album Lightbox View.png`

#### Layout Hierarchy
- **Black Canvas (`bg-black min-h-screen relative flex-col justify-between p-4`)**
  - **Top Row:** Close '✕' icon (`bg-black/60 rounded-full p-2 text-white self-end`).
  - **Center Area:** High-resolution photo container with left '‹' and right '›' chevron navigation buttons.
  - **Bottom Info Bar (`flex-row justify-between items-end pb-6 px-2`):**
    - Left: Uploader Name "Sarah K." (`text-sm font-bold text-white`), Timestamp: "2 hours ago" (`text-xs text-white/70`).
    - Right: Heart '♡' and Share icons in white.

---

### 5.25 Screen 24: Trip Room - Language Lessons Hub

#### Purpose
Gamified micro-learning dashboard with category phrase modules, active day streak counter, and real-time translator toggle.

#### Source Reference
- `frontend/Screenshots/Trip/Language/ReRoute Trip Room - Language Lessons.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip (Language Active).**
4. **Language Mode Segmented Pill (`bg-surface-container-low rounded-2xl p-1 mx-4 flex-row mb-4`):**
   - `⚡ Ai Translator` (Inactive: `text-on-surface-variant py-2 flex-1 text-center font-semibold text-xs`).
   - `📖 Lessons` (Active: `bg-white text-on-surface font-bold py-2 flex-1 text-center rounded-xl shadow-sm text-xs`).
5. **Streak Milestone Card (`bg-[#ff8f06] rounded-3xl p-5 mx-4 mb-4 shadow-md flex-row justify-between items-center`):**
   - Left: "23-day streak 🔥" (`text-xl font-bold text-white`), Subtext: "Keep it up! You're ready for Tokyo." (`text-xs text-white/90`).
   - Right: Flame icon badge (`bg-white/20 rounded-full p-3`).
6. **Destination Language Header:**
   - Pill: "🌐 Destination Language" (`bg-surface-container text-[10px] font-bold text-outline px-3 py-1 rounded-full self-center mb-1`).
   - Title: "Japanese" (`text-xl font-bold text-on-surface text-center mb-4`).
7. **Lesson Module Cards List (`px-4 space-y-3 mb-6`):**
   - **Module 1 (Ordering Food):**
     - Icon: 🍴 (`bg-orange-100 p-3 rounded-full`).
     - Text: "Ordering Food" (`font-bold text-sm text-on-surface`), "Essential phrases for dining" (`text-xs text-on-surface-variant`).
     - Right: Completed checkmark icon '✓' (`bg-[#ff8f06] text-white rounded-full p-1`).
   - **Module 2 (Greetings):**
     - Icon: 🖐️ / "Greetings" / "Hello, thank you, goodbye" / Completed checkmark icon '✓'.
   - **Module 3 (Getting Around - In Progress):**
     - Icon: 🚆 (`bg-orange-500 text-white p-3 rounded-full`).
     - Text: "Getting Around" / "Navigating transit".
     - Right: Circular Progress Wheel (`75%`).
     - Container styling: Highlighted with orange border (`border border-orange-300 bg-[#fef8f4] rounded-2xl p-3.5`).
   - **Module 4 (Shopping):**
     - Icon: 🛍️ / "Shopping" / "Stores and payments" / Unchecked circle.
   - **Module 5 (Emergencies):**
     - Icon: 🧰 / "Emergencies" / "Critical help" / Unchecked circle.
8. **BottomNavBar** (Fixed Bottom).

---

### 5.26 Screen 25: Interactive Language Quiz / Lesson Active

#### Purpose
Interactive multiple-choice phrase mastery quiz with audio pronunciation and instant progress feedback.

#### Source Reference
- `frontend/Screenshots/Trip/Language/ReRoute Language Lesson - Active.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip (Language Active).**
4. **Lesson Mode Segmented Pill (`Ai Translator` vs `Lessons`).**
5. **Daily Progress Header Row (`px-4 my-2`):**
   - Text: "16 of 25 phrases mastered today" (`text-xs text-on-surface font-medium`), Right: "64%" (`text-xs font-bold text-[#8b4b00]`).
   - Linear Progress Bar (`h-2 bg-surface-container rounded-full overflow-hidden mt-1` with solid brown fill `w-[64%]`).
6. **Phrase Prompt Card (`bg-white rounded-3xl p-6 mx-4 my-4 shadow-soft items-center`):**
   - Source Japanese Text: "ありがとうございます" (`text-2xl font-bold text-on-surface text-center mb-2`).
   - Romanized Pronunciation Guide: "Arigatou gozaimasu" (`text-sm font-semibold text-outline mb-4`).
   - Audio Pronunciation Button: Circular speaker icon button (`h-12 w-12 rounded-full bg-[#cfebbe] items-center justify-center text-[#2e4525]`).
7. **Quiz Question Prompt:** "What does this mean?" (`text-sm font-bold text-on-surface text-center mb-4`).
8. **Multiple Choice Option Cards (`px-4 space-y-2.5 mb-6`):**
   - Option 1: "Excuse me" (`bg-white border border-surface-container rounded-2xl p-4 text-center text-xs font-semibold text-on-surface`).
   - Option 2: "Thank you very much" (`bg-white border border-surface-container rounded-2xl p-4 text-center text-xs font-semibold text-on-surface`).
   - Option 3: "Hello".
   - Option 4: "Goodbye".
9. **Question Navigation Bar (`px-6 flex-row justify-between items-center mb-6`):**
   - Left: Back chevron button '←' (`bg-surface-container-low rounded-full p-3`).
   - Center: "Phrase 16" (`text-xs font-bold text-outline`).
   - Right: Next chevron button '→' (`bg-[#ff8f06] text-white rounded-full p-3 shadow-sm`).

---

### 5.27 Screen 26: Language Lesson & Session Complete Screen

#### Purpose
Celebratory completion screen surfacing phrase count, time spent, quiz accuracy, and progression CTA.

#### Source Reference
- `frontend/Screenshots/Trip/Language/ReRoute Trip Room - Language complete lesson.png`
- `frontend/Screenshots/Trip/Language/ReRoute Trip Room - Language complete Session.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip.**
4. **Trophy Celebration Card (`bg-white rounded-3xl p-6 mx-4 my-6 shadow-soft items-center`):**
   - Trophy Badge Icon: Circular golden trophy icon (`h-20 w-20 bg-[#ff8f06] rounded-full items-center justify-center text-white mb-4`).
   - Headline: "Lesson Complete!" (`text-xl font-bold text-on-surface`).
   - Subtitle: "You've mastered 25 new phrases today." (`text-xs text-on-surface-variant my-2`).
   - Dual Metric Stats Grid (`flex-row gap-3 w-full mt-4`):
     - Box 1: "TIME SPENT" (`text-[10px] text-outline font-bold`), **12m** (`text-lg font-bold text-on-surface`).
     - Box 2: "ACCURACY" (`text-[10px] text-outline font-bold`), **92%** (`text-lg font-bold text-on-surface`).
5. **Session Milestone Banner (when completing entire session):**
   - "Congrats! You've mastered this session." (`text-2xl font-bold text-on-surface text-center my-4 px-6`).
6. **Action Buttons (`px-4 space-y-3 mt-6`):**
   - Primary Button: "Continue to Next Lesson →" (`bg-[#ff8f06] text-white rounded-2xl py-4 font-bold text-base text-center w-full shadow-md`).
   - Secondary Text Action: "Back to Trip Rooms" (`text-xs font-bold text-outline text-center py-2`).

---

### 5.28 Screen 27: AI Live Translator Screen

#### Purpose
Real-time bidirectional speech & text translator for transit, dining, and emergency queries on the go.

#### Source Reference
- `frontend/Screenshots/Trip/Language/ReRoute Trip Room - Language AI Translator.png`

#### Layout Hierarchy
1. **HeaderTopAppBar**
2. **Back Navigation Arrow '←'**
3. **Seasonal Trip Header Card & Sub-Tabs Strip.**
4. **Language Mode Segmented Pill (`Ai Translator` active vs `Lessons`).**
5. **AI Live Translator Card (`bg-white rounded-3xl p-5 mx-4 shadow-soft space-y-4`):**
   - Card Title: "AI Live Translator" (`text-base font-bold text-on-surface`).
   - **Language Swap Bar (`bg-surface-container-low rounded-2xl p-2 flex-row items-center justify-between`):**
     - Source Box: "English (US)" (`bg-white rounded-xl py-2 px-3 text-xs font-bold text-on-surface`).
     - Swap Icon: Orange double arrow '⇆' button (`bg-surface-container rounded-full p-2`).
     - Target Box: "Japanese (日本語)" (`bg-white rounded-xl py-2 px-3 text-xs font-bold text-on-surface`).
   - **Input Text Area (`bg-surface-container-low rounded-2xl p-4 relative`):**
     - Prompt Text: "Where is the nearest subway entrance?" (`text-xs font-medium text-on-surface`).
     - Microphone Voice Input Button (`p-2 bg-orange-100 rounded-full text-[#ff8f06] absolute top-3 right-3`).
     - Footer Row: "Detected: Travel & Transit" (`text-[10px] text-outline`), "33/200" character counter.
   - **Translated Output Box (`border border-orange-200 bg-[#fef8f4] rounded-2xl p-4`):**
     - Header Row: "★ AI JAPANESE TRANSLATION" (`text-[10px] font-bold text-[#ff8f06]`), Right: Speaker audio icon + Copy icon.
     - Translated Kanji / Hiragana Text: "一番近い地下鉄の入り口はどこですか？" (`text-lg font-bold text-on-surface my-2`).
     - Romaji Sub-box (`bg-white rounded-xl p-2.5 text-[11px] text-on-surface-variant font-mono`):
       - "ROMAJI: Ichiban chikai chikatetsu no iriguchi wa doko desu ka?"
   - **Primary Action:** "Translate Now" (`bg-[#ff8f06] text-white rounded-2xl py-3.5 font-bold text-sm text-center w-full shadow-md`).

---

### 5.29 Screen 28: Emergency SOS Confirmation & Dispatch Screen

#### Purpose
High-priority emergency broadcast coordinator sharing real-time GPS coordinates to all room members and pre-filling local emergency services.

#### Source Reference
- `frontend/Screenshots/Trip/SOS/ReRoute SOS.png`

#### Layout Hierarchy
1. **Header Row:** Back arrow '←', "TOKYO SAKURA EXPLORER" (`text-[10px] font-bold text-[#ff8f06] uppercase`), "Safety & Emergency" (`text-sm font-bold text-on-surface`), Badge: "• Live Alert" (`bg-orange-100 text-[#ff8f06] text-[10px] font-bold px-2 py-0.5 rounded-full`), Mascot.
2. **Sub-Header Row (`px-5 py-2 flex-row justify-between items-center text-xs text-outline`):**
   - Left: 🛡️ "Emergency Assistance Protocol".
   - Right: "GPS Accuracy: ±4m".
3. **SOS Master Action Card (`bg-white rounded-3xl p-5 mx-4 mb-4 shadow-soft`):**
   - Icon & Title Row: Red square icon with emergency asterisk + "SOS Confirmation" (`text-lg font-bold text-on-surface`), Subtitle: "High-priority broadcast to trip room squad" (`text-xs text-on-surface-variant`).
   - **Warning & GPS Dispatch Box (`bg-orange-50 border border-orange-200 rounded-2xl p-4 my-3`):**
     - Warning: ⚠️ "Triggering this confirmation immediately shares your real-time GPS coordinate and an alert banner with all 5 trip members."
     - GPS Location Row: 📍 "Shinjuku Station, East Gate", Right: "Live Pinned" (`text-xs font-bold text-[#b02500]`).
   - **Emergency Categorization Selector:**
     - Label Row: "SELECT REASON", Right: "Optional categorization".
     - 4 Reason Chips:
       - 🧰 `Medical` (`bg-orange-100 text-[#8b4b00] rounded-full px-4 py-2.5 text-xs font-bold`).
       - 🚗 `Accident ✓` (Selected: `bg-[#b02500] text-white rounded-full px-4 py-2.5 text-xs font-bold`).
       - 📍 `Lost`.
       - 🛡️ `Security`.
   - **Recipients Row:**
     - Label: "Squad Recipients", Right: Avatar circles stack `AL SK MK +2`.
   - **Critical CTA Button:**
     - "📞 Confirm & Dial Local Services (110)" (`bg-[#b02500] text-white font-bold text-sm py-4 rounded-2xl text-center w-full shadow-lg mt-3`).
   - **Cancel Link:** "Cancel request • False Alarm" (`text-xs font-semibold text-outline text-center mt-3`).
4. **Tourist Safety Hotline Card (`bg-white border border-surface-container rounded-2xl p-4 mx-4 shadow-soft flex-row items-center justify-between`):**
   - Left: 📇 "Tourist Safety Hotline" (`font-bold text-xs text-on-surface`), "English / JP translation available" (`text-[10px] text-outline`).
   - Right: Hotline Number Box `0570-000-911` (`border border-orange-200 text-[#ff8f06] font-bold text-xs px-3 py-1.5 rounded-xl`).

---

## 6. Reusable Component Map

```
src/
├── core/
│   └── theme/
│       ├── colors.ts            # Hex palettes for 4 seasons (Spring, Summer, Autumn, Winter)
│       ├── typography.ts        # Hanken Grotesk & CameraPlain scales
│       └── spacing.ts           # 4px, 8px, 12px, 16px, 20px, 24px, 28px, 96px
├── shared/
│   └── components/
│       ├── HeaderTopAppBar.tsx  # Persistent top navigation header
│       ├── BottomNavBar.tsx     # 3-tab bottom glassmorphic bar
│       ├── PersistentSOSButton.tsx # Red squircle SOS floating overlay
│       ├── SeasonalTripCard.tsx # Themed header card for trip rooms
│       ├── SubTabPillStrip.tsx  # Discussion | Itinerary | Budget | Album | Language
│       ├── DecisionPollCard.tsx # In-feed interactive voting poll card
│       ├── PrimaryActionButton.tsx # Standard orange CTA button with arrow
│       ├── SegmentedControl.tsx # Capsule filter toggle (Planning | Live | Past)
│       └── LoadingMascotSplash.tsx # Corgi splash & loading state
└── features/
    ├── auth/presentation/
    │   ├── LoginScreen.tsx      # Screen 01
    │   └── PreferencesScreen.tsx# Screen 02
    ├── home/presentation/
    │   ├── HomeScreen.tsx       # Screen 03
    │   └── components/
    │       ├── AIPlanReviewModal.tsx # Screen 04
    │       ├── TrendingCarousel.tsx
    │       └── RecentNewsBanner.tsx
    ├── discover/presentation/
    │   ├── DiscoverFeedScreen.tsx   # Screen 06
    │   ├── SelectTripPostScreen.tsx # Screen 07
    │   ├── ItineraryDetailScreen.tsx# Screen 08
    │   └── CreatePostScreen.tsx     # Screen 09
    ├── notification/presentation/
    │   ├── NotificationModal.tsx    # Screen 10
    │   ├── NotificationFullScreen.tsx # Screen 11
    │   └── AIAssistantChatScreen.tsx # Screen 12
    ├── profile/presentation/
    │   └── ProfileScreen.tsx        # Screen 13
    ├── trip-room/presentation/
    │   ├── TripRoomsHubScreen.tsx   # Screen 14
    │   ├── CreateTripModal.tsx      # Screen 05
    │   ├── DiscussionTab.tsx        # Screen 15
    │   ├── MapItineraryTab.tsx      # Screen 16, 17
    │   ├── BudgetTab.tsx            # Screen 18, 19, 20, 21
    │   ├── AlbumTab.tsx             # Screen 22, 23
    │   └── LanguageTab.tsx          # Screen 24, 25, 26, 27
    └── sos/presentation/
        └── SOSScreen.tsx            # Screen 28
```

---

## 7. Notes & Assumptions

1. **Reconciliations with System Requirements (AGENTS.md & UI_REQUIREMENTS.md):**
   - In raw Figma frames, occasional like/heart icons or "Follow" buttons are visible on Discover cards. In code implementation, these must strictly function as **Star / Save to Profile** (`FR-8-4`).
   - The Bottom Navigation Bar strictly contains 3 tabs: `Home`, `Trip`, and `Profile`. Discover is reached as an in-page section under Home.
2. **Dynamic Weather Theming:**
   - Trip room cards automatically inherit seasonal theme tokens (`spring`, `summer`, `autumn`, `winter`) based on destination weather metadata (`FR-2-3`). Smooth transition duration is capped at $\le 500\text{ms}$.
3. **Outbound Ticketing & Booking:**
   - Booking buttons on transportation and accommodation cards open external browser links (`itinerary_items.booking_url`) with no internal checkout or card handling.
4. **GPS Permissions & Fallback:**
   - On the SOS screen, if GPS permissions are denied, an explicit warning banner renders, and the emergency dialer remains fully functional with country-specific numbers.
