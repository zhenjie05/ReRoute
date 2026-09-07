# ReRoute — PM Validation Review & Suggestions

*Reviewed documents: `ReRoute_Requirements_Refined.md` (v2), `ReRoute_Workflow_Refined.md` (v2), `ReRoute_Page_Refined_v2.md` (v2)*
*Reviewer role: Project Manager, hackathon delivery lens (CodeNection 2026 — Lifestyle Track)*
*Method: Requirements validated first for internal clarity/completeness → Workflow checked against Requirements for full behavioral coverage → Pages checked against both for 1:1 screen mapping.*

---

## 0. Executive Summary

The three documents are unusually well cross-referenced for a hackathon spec — the workflow doc even self-audits against the data model, and the page doc carries forward open items instead of silently resolving them. That said, three passes surfaced **1 direct content conflict**, **4 missing/undefined screens or actions**, **3 data-model gaps**, and **several unresolved "who decides" gaps** that will stall UI design or cause demo-day bugs if not locked before wireframing starts.

Given hackathon time pressure, the recommendation is: **resolve the "Blocker" items below in a 15-minute team sync before any screen is built**, treat "High" items as due before backend schema freeze, and accept "Medium/Low" items as known risk to be handled inline during build.

| Severity | Count |
|---|---|
| 🔴 Blocker (breaks a flow or contradicts another doc) | 3 |
| 🟠 High (undefined behavior a builder will have to guess) | 6 |
| 🟡 Medium (gap in coverage, not flow-breaking) | 7 |
| 🟢 Low (documentation polish) | 3 |

---

## 1. Requirements Document Review

### 1.1 Strengths
- FR/NFR separation is consistently applied and each feature has a Build Scope line — this is exactly the granularity a hackathon team needs to avoid over-building.
- Section 15 (Open Items) already captures most provider/TBD risk (weather API, translation API, AI provider, OCR approach) in one place.
- The `[NEW]`/`[CHG]` legend makes the diff from v1 auditable — good for a mid-competition pivot.

### 1.2 🔴 Blocker — Home's "AI Chatbox" has no backing requirement
The Page doc (`ReRoute_Page_Refined_v2.md`, Home section) describes an **AI Chatbox** on Home that free-form generates a trip and feeds "into the same generation pipeline as the new Preferences Form + Modular Suggestions." **No FR in Feature 1 (or anywhere else) defines this chatbox** — not its input contract, not which AI provider handles it, not whether it's in scope for the demo build.
- **Impact:** A screen exists with no requirement, no NFR (response time?), and no Build Scope line (Real/Mocked?). This is the single largest scope-definition gap in the set, and the Page doc itself flags the ambiguity as its Open Item #3 — but that's a UX-merge question, not a "does this feature exist" question. The existence question needs to be answered in the Requirements doc first.
- **Recommendation:** Add FR-1-0 (or similar) explicitly defining the AI Chatbox as either (a) a thin front-end to the same Preferences+Modular pipeline (recommended — reuses one backend path, lowest hackathon risk), or (b) a separate free-text-to-itinerary path. Give it a Build Scope line either way.

### 1.3 🔴 Blocker — FR-1-9 contradicts the Page doc's Home banner
FR-1-9 states the system should **auto-trigger a `decision_card` "rather than only showing a passive banner"** when a location is flagged risky — i.e., the passive banner is explicitly being *replaced/upgraded*. But the Page doc still lists a standalone **"Recent News / Incident banner"** on Home as a persisted UI element, separate from the decision-card flow.
- **Impact:** Ambiguous whether the banner is (a) a legacy element that should be removed per FR-1-9, or (b) a lower-severity, non-actionable notice tier that coexists with the decision-card tier for higher-severity risks. Both are defensible designs, but the docs currently disagree on which one is intended.
- **Recommendation:** Add one line to FR-1-8/1-9 clarifying tiering: e.g. "Banner = informational/low-severity; `decision_card` = actionable/high-severity, auto-triggered." This one sentence resolves the conflict and gives the banner a reason to still exist.

### 1.4 🔴 Blocker — Planning → Active stage transition trigger is undefined
FR-2-2 defines three stages and says "UI/actions differ per stage." FR-2-5 defines how Archived is reached (manual or auto-expiry cron). **Nothing defines how a room moves from Planning to Active.** The Workflow doc's single-live-trip flow assumes a room is *already* Active before a member can go live ("User starts/enters an Active trip → `is_live_for_user = true`"), but no flow describes who flips `stage` from planning to active, or when (owner action? `start_date` reached automatically? first member "starts trip" button?).
- **Impact:** This blocks the Room List / Trip Room Page screens (no "Start Trip" affordance exists anywhere in the Page doc) and blocks QA test design for Scenario D (stage-boundary tests) — you can't test a boundary you can't trigger.
- **Recommendation:** Add FR-2-2a: "Room transitions Planning → Active [via owner-initiated 'Start Trip' action | automatically on `start_date`]." Recommend the manual owner action for the demo — it's deterministic and easy to trigger live during judging, versus waiting on a date/cron.

### 1.5 🟠 High — "Follow" mechanic has no data model support
FR-8-2 and the Workflow's Discover section both describe users being able to "follow other users" in addition to friend requests. The Shared Data Model only has `friendships` (pending/accepted/blocked) — a **symmetric, request-based** relationship. There is no `follows` table or asymmetric-relationship field.
- **Impact:** Either the requirement is aspirational and should be cut for the demo, or a data model addition is needed. As written, a builder can't implement "follow" against the given schema.
- **Recommendation:** For hackathon scope, drop "follow" and keep only friend request/accept (simplest, matches existing schema) — update FR-8-2 to remove the follow reference. If follow is a must-have for the pitch, add a one-line model note (`friendships.status` extended with a `following` value, or a lightweight `follows` table) before build.

### 1.6 🟠 High — Proactive vs. periodic safety check is self-contradictory
FR-1-8 explicitly upgrades the safety check to be **continuous**, framed against "not just periodic polling." NFR-1-2 then defines the mechanism as a check **interval ≤ 30 min** — which is, by definition, periodic polling. This isn't a blocking conflict (a 30-min poll is a perfectly reasonable "continuous enough" implementation for a demo), but the language actively contradicts itself and will confuse whoever builds it.
- **Recommendation:** Reword FR-1-8 to "near-real-time (polling-based) cross-reference, replacing the old passive/manual check" rather than claiming true continuity. Keep NFR-1-2's 30-min interval as-is — it's the right scope for a hackathon.

### 1.7 🟠 High — Preferences form skip/abandon behavior is unspecified
FR-1-3 requires the Preferences form before generation but does not state whether it's a hard gate or has defaults. The Workflow doc correctly flags this as an edge case ("verify generation either blocks... or falls back to sensible defaults — confirm intended behavior") but a flagged-in-workflow ambiguity is still an **unresolved requirement**, not a resolved one.
- **Recommendation:** Decide now — recommend **soft gate with defaults** (e.g., Couple/Moderate/Cultural as default) so a rushed demo user is never stuck on a form. Add this as FR-1-3a.

### 1.8 🟠 High — Mixed-currency handling has no FR/NFR
FR-2-9 (Budget) lists split methods and OCR but says nothing about multi-currency expenses within one room, even though the Workflow doc has a dedicated edge case for it ("dashboard flags/handles rather than silently summing"). For a travel app, mixed currency is not an edge case — it's close to a main flow.
- **Recommendation:** Add an FR: "Budget Dashboard displays per-currency subtotals and flags cross-currency totals rather than summing raw amounts" (fixed-rate conversion is out of scope for a demo — flagging is enough).

### 1.9 🟠 High — Mascot's Budget dependency missing from the dependency table
FR-9-1 lists "budget alerts" as one of the mascot's notification types, but Section 14's Cross-Feature Dependency table only lists Feature 9 as depending on "Realtime (F2 chat) + AI provider (F1 safety/weather logic)" — Budget (part of Feature 2) isn't listed as a trigger source.
- **Recommendation:** Add a row/edge to the dependency table: "Feature 9 (Mascot) ← Budget subsystem (F2) for budget-alert triggers." Small fix, prevents a builder from missing the wiring.

### 1.10 🟡 Medium — Member removal/kick not covered
`trip_room_members.role` exists (implying owner vs. member distinction) but no FR describes an owner removing a member. Only voluntary "leave" is covered anywhere in the three docs.
- **Recommendation:** Either explicitly cut kick/remove from scope (state it), or add a one-line FR under Feature 2 if judges are likely to ask "what if someone needs to be removed."

### 1.11 🟢 Low — Numbering drift between Requirements and Workflow section labels
Requirements treats Budget as part of Feature 2 (FR-2-9) and SOS as Feature 4. The Workflow doc gives Budget its own top-level "Feature 4" section and SOS becomes its "Feature 6" section — a one-off numbering shift runs through the rest of the workflow doc. Not a content error (section *names* are correct and unambiguous), but it will slow down anyone cross-referencing "Feature 4" between the two docs.
- **Recommendation:** Either renumber the Workflow doc's headers to match Requirements' feature numbers, or drop numeric headers from the Workflow doc entirely and rely on names only.

---

## 2. Workflow Document Review

### 2.1 Strengths
- Coverage is genuinely thorough: every FR in Requirements has at least one corresponding main flow, and most have 5+ edge cases. This is above the bar typically seen in hackathon docs.
- The doc self-flags its own data-model ambiguity (the `linked_room_id` nullability note at the top) rather than silently assuming — good QA discipline, and a habit worth keeping.
- Scenario E (single-live-trip + auto-archive stress test) and Scenario F (Discover-to-badge loop) are exactly the kind of cross-cutting scenarios that catch integration bugs a per-feature test plan would miss.

### 2.2 🟡 Medium — Modular Suggestions: no "reject everything in a module" edge case
Section 2's edge cases cover the API-unavailable fallback but not the user path where they reject every item in, say, the Accommodation module. Does the itinerary day structure end up with an empty "Stay" for that day, does the system re-suggest, or is the module allowed to be empty? This is a plausible real demo action (a picky user) with no defined outcome.
- **Recommendation:** Add one edge case + one line to FR-1-4 clarifying that empty modules are valid and the day-level "+ Stay/Attraction/Transportation" manual-add actions are the fallback.

### 2.3 🟡 Medium — No explicit "duplicate join" or "room at capacity" case
Create & Join Room flow (Section 3) covers expired/invalid invite links but not a member joining a room they're already in (double-tap on invite link) or any room-size ceiling. Likely a non-issue for a demo but worth one line to avoid a duplicate-row bug in `trip_room_members`.

### 2.4 🟡 Medium — No test for manually creating a `decision_card` outside auto-trigger
`decision_cards.trigger_type` includes `disruption` and `conflict` in addition to `safety_risk`, and FR text implies these can be raised by group activity (e.g., "manual group conflict"), but the Workflow doc's Trip Room voting flow only describes cards being "triggered" without ever describing the **user-initiated** path (who taps what to start a conflict/disruption vote). Section 2's flow is airtight for the *auto*-triggered safety_risk case but silent on the manual case.
- **Recommendation:** Add a main flow: "Member taps '[Propose a vote]' in chat → selects trigger type (disruption/conflict) → sets options + anonymous flag → card posts to feed."

### 2.5 🟡 Medium — Auth: no OAuth-cancel or expired-reset-token cases
Google OAuth flow only has the happy path; email reset only covers the happy path plus weak-password. Minor since Auth is "unchanged," but worth a one-liner each since OAuth cancellation is a very common real-world tap during a live demo.

### 2.6 🟡 Medium — No explicit test for concurrent Preferences edits mid-Planning
Section 2 covers "user changes preferences mid-trip after generation" (good) but not two members editing `trip_preferences` at the same time (last-write-wins is probably fine for a demo, but it's currently unstated, unlike the equivalent `sort_order` concurrency case which *is* explicitly tested).

### 2.7 🟡 Medium — Stage-boundary scenario (D) needs the Planning→Active trigger to be testable
This is a direct consequence of the Requirements gap in §1.4 above — Scenario D says "verify each feature's availability against room stage" but there's no defined action that moves a room into Active, so this scenario currently can't be executed as written. Flagging here so it's tracked at the workflow level too, not just the requirements level.

### 2.8 🟡 Medium — Budget: no test for editing `planned_amount` after Planning stage ends
FR-2-9 implies budget categories are set up in Planning, but nothing prevents (or explicitly allows) editing planned amounts once Active. Minor, but worth a one-line clarification + matching edge case.

### 2.9 🟢 Low — Push notification permission is only tested for Mascot, not SOS
Section 11 (Mascot) tests "push permission denied → in-app message still appears." SOS (Section 6) also relies on push per FR-4-2 but has no equivalent denied-permission edge case, despite SOS being the higher-stakes feature of the two.
- **Recommendation:** Mirror the mascot's permission-denied edge case into the SOS section.

---

## 3. Page/Screen Document Review

### 3.1 Strengths
- The **Coverage Check** and **Open Items Carried to UI Design** sections at the end are exactly the right closing structure — they force explicit sign-off before wireframes start rather than letting ambiguity leak into Figma.
- Global Widgets correctly reflects the SOS overlay's promotion to app-wide, and Nav correctly reflects the 3-tab restructure — both major v1→v2 changes are faithfully carried through.
- REMOVED items (Community tab, per-item comments, Trip-Room-scoped SOS, 3D-first landmark view) are explicitly struck through and justified rather than silently dropped — good traceability back to the Requirements doc's `[REMOVED]`-equivalent intent.

### 3.2 🟠 High — Missing screen: Trip Room Settings
No screen anywhere in the Page doc hosts the actions that Requirements/Workflow both assume exist:
- Toggling `trip_rooms.is_public` (needed for the Share & Star flow, Section 1 of Workflow)
- Manually archiving the room (FR-2-5)
- Editing `trip_preferences` after initial setup ("editable later," FR-1-3)
- (Per §1.4 above) starting the Planning→Active transition, if that ends up being a manual owner action

Currently these four actions have no home. They shouldn't each be a full screen, but they need at least one consolidated **Room Settings** screen/sheet under the Trip Room Page tabs.
- **Recommendation:** Add "Room Settings" as a screen (likely accessed from the Trip Room Page's top bar), listing: Public toggle, Archive action, Edit Preferences shortcut, and (if manual) Start Trip action.

### 3.3 🟠 High — Missing affordance: manual Decision Card creation
Per §2.4 above, `disruption`/`conflict` decision cards can apparently be raised by the group, not only auto-triggered by safety_risk — but the Page doc's Chat Room section only describes the **Decision Card component** as something that appears in-feed, with no "create a vote" entry point described anywhere (no button, no compose-flow).
- **Recommendation:** Add a "Propose Vote" action to the Chat Room screen description (e.g., a "+" or toolbar icon alongside the message composer), with a lightweight compose step (options + anonymous toggle).

### 3.4 🟠 High — Banner vs. decision-card conflict needs a screen-level resolution too
This is the UI side of the Requirements Blocker in §1.3. Once the Requirements doc clarifies the banner/decision-card tiering, the Home section here needs a one-line update to state which severity tier the banner covers (so it isn't read as a duplicate/legacy element during design).

### 3.5 🟡 Medium — No screen state for "no landmark 3D model" beyond a note
The Landmark Detail description says the 3D tab is "present only for the 2–4 pre-generated landmarks" but doesn't specify what a user sees when they tap the 3D tab (or whether the tab is hidden entirely) for a landmark outside that set — this exact ambiguity is called out as an edge case in the Workflow doc (§2, "3D tab hidden or shows a clear 'not available' state") but left as an either/or there too.
- **Recommendation:** Pick one for the demo (recommend: **hide the tab entirely** rather than show an empty state — simpler to build, cleaner to demo) and state it in both docs.

### 3.6 🟡 Medium — No screen for location-services-denied state in SOS Quick-Dial
FR-4-2/Workflow §6 both anticipate "location unavailable" as a flagged state during an SOS alert, but the Page doc's Quick-Dial screen description doesn't call out this state explicitly. Worth a one-line addition so the visual design accounts for it from the start rather than being patched in late.

### 3.7 🟡 Medium — Add Expense form has no described validation/error state
Given how many split-method validation edge cases exist in the Workflow doc (percentage ≠100%, exact-amount mismatch, negative shares), the Add Expense form description in the Page doc is purely a field list with no mention of inline validation feedback. Worth a one-line note so this isn't an afterthought in the visual design pass.

### 3.8 🟢 Low — Friends section is nested under a removed heading
Structurally, "### Friends" appears as a subsection under "## ~~Community~~ [REMOVED as standalone tab]" rather than nested directly under "## Home." Functionally the text is clear that Friends lives in Home now, but the document's own heading hierarchy could be misread (e.g., by a new team member skimming headers) as Friends still being part of a deprecated area.
- **Recommendation:** Move "### Friends" to be a subsection under "## Home" directly, and keep a one-line note under the Community heading pointing to it, rather than the reverse.

### 3.9 🟢 Low — "Theme icon" and "Mascot screen" open items are correctly deferred but should get owners/deadlines
Both are appropriately listed as Open Items rather than guessed at, which is the right call — but for hackathon velocity, recommend each Open Item in the Page doc gets a one-word owner + "resolve by" note (e.g., "Design lead, resolve before wireframe day 1") so they don't silently slip into build week unresolved.

---

## 4. Consolidated Action List (Priority Order)

| # | Item | Doc(s) affected | Severity | Suggested resolution |
|---|---|---|---|---|
| 1 | Define AI Chatbox as a feature (or fold into Preferences pipeline) | Requirements | 🔴 Blocker | Add FR-1-0 + Build Scope line |
| 2 | Resolve banner vs. decision-card conflict | Requirements + Page | 🔴 Blocker | Tier by severity: banner = informational, decision card = actionable |
| 3 | Define Planning→Active transition trigger | Requirements + Page + Workflow | 🔴 Blocker | Manual owner "Start Trip" action (recommended) |
| 4 | Add or cut "follow" mechanic vs. data model | Requirements | 🟠 High | Cut for demo scope (recommended) or extend `friendships` |
| 5 | Fix "continuous" vs. 30-min-poll contradiction | Requirements | 🟠 High | Reword FR-1-8 |
| 6 | Decide Preferences-form skip behavior | Requirements | 🟠 High | Soft gate with sensible defaults |
| 7 | Add mixed-currency handling requirement | Requirements | 🟠 High | New FR under Feature 2 Budget |
| 8 | Add Budget as a Mascot dependency | Requirements | 🟠 High | Update Section 14 table |
| 9 | Add Room Settings screen | Page | 🟠 High | Public toggle, Archive, Edit Preferences, Start Trip |
| 10 | Add manual "Propose Vote" affordance | Page + Workflow | 🟠 High | Chat Room toolbar action |
| 11 | Empty-module edge case for Modular Suggestions | Requirements + Workflow | 🟡 Medium | Clarify empty module is valid |
| 12 | Decide hidden-vs-empty-state for missing 3D model | Page + Workflow | 🟡 Medium | Hide tab (recommended) |
| 13 | Member removal/kick — cut or define | Requirements | 🟡 Medium | State explicitly out of scope if cutting |
| 14 | Add location-denied state to Quick-Dial screen | Page | 🟡 Medium | One-line addition |
| 15 | Add validation-state note to Add Expense form | Page | 🟡 Medium | One-line addition |
| 16 | Duplicate-join / room-capacity edge case | Workflow | 🟡 Medium | One-line addition |
| 17 | Concurrent preferences-edit case | Workflow | 🟡 Medium | One-line addition |
| 18 | Renumber or de-number Workflow doc's feature headers | Workflow | 🟢 Low | Align with Requirements numbering |
| 19 | Move Friends heading under Home | Page | 🟢 Low | Restructure heading |
| 20 | Add owner/deadline to Page doc's Open Items | Page | 🟢 Low | Process fix |

---

## 5. Overall Readiness Verdict

**Not yet ready for wireframe/build start** — but close. None of the Blockers require new engineering scope to resolve; all three are single-paragraph clarifications that a 15–20 minute team decision session can close out. The High-severity items are mostly "pick one of two reasonable options and write it down" rather than open-ended design problems, which is exactly the right risk profile for a hackathon at this stage.

Recommended next step: hold one short sync to close Blockers #1–3 and High items #4–8 (all Requirements-doc changes), then let UI design proceed in parallel with #9–10 (Page-doc screen additions) since those don't block each other. Medium/Low items can be resolved inline during build without stalling the team.
