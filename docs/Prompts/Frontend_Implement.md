Read:
- AGENTS.md
- docs/DESIGN.md
- docs/UI_REQUIREMENTS.md
- frontend/docs/SCREEN_SPEC.md

Implement the **Trip Room → Budget** tab: the Budget Dashboard, Add Expense Form, Receipt Scan (OCR) review flows, and the Settle Up list.

Crucial Context for this implementation:
1. **Reference Screenshots:** The reference screenshots are located in the `frontend/Screenshots/Trip/Budget/` folder. Please review them carefully:
   - `ReRoute Trip Room - Budget Tab.png` (Main dashboard)
   - `ReRoute Add Expense Modal.png` (Add Expense sheet)
   - `ReRoute OCR - Data Review & Edit.png` (OCR extracted data review)
   - `ReRoute OCR - Confirmation & Split Setup.png` (OCR success and split configuration)
   Match the spacing, typography, colors, and card radii shown in these images exactly.

Use:
- `frontend/docs/SCREEN_SPEC.md` for exact layout and component order.
- `DESIGN.md` for styling/tokens (card radii, seasonal accent usage, utility text sizes).
- `UI_REQUIREMENTS.md` and `ReRoute_Workflow_Refined_v2_2.md` for acceptance criteria per sub-section below.
- `AGENTS.md` for coding rules, folder structure, and out-of-scope items.

Context:
- Assume Auth, the core theme (`src/core/theme`), shared components (`src/shared/components`), and the Global Widgets (Top Bar, Notification Center, 3-tab Bottom Nav) already exist — reuse them, do not redesign them.
- **Assume the Trip Room shell is already implemented**: the season-themed trip header card, the in-room tab row (Discussion / Itinerary / Maps / Budget / Album / Language), and the room stage indicator. Budget only implements the content *inside* the Budget tab.
- **Data model** (from the shared schema): `budget_categories` (id, room_id, category_name, planned_amount), `expenses` (id, room_id, category_id, description, total_amount, currency, paid_by[], receipt_url, created_by, created_at), `expense_splits` (id, expense_id, user_id, split_type, share_value, amount_owed), `receipt_scans` (id, expense_id, image_url, ocr_status, extracted_data), and `settlements` (id, room_id, from_user_id, to_user_id, amount, method, settled_at). Mock these shapes; no backend wiring yet.
- **Folder placement** — Budget is core Trip Room functionality: place the dashboard, expense forms, and OCR review components under `src/features/trip-room/presentation/budget`.
- **Mixed Currency Edge Case** — When a room's expenses use more than one `currency`, the Budget Dashboard must show per-currency subtotals and visually flag the mix. Do not silently sum raw amounts of different currencies into one total.

Requirements:
- **Budget Dashboard** (matches `ReRoute Trip Room - Budget Tab.png`): 
  - Render total spent vs. planned progress bar.
  - Render the current user's contribution, share, and owed summary block.
  - Render individual Category progress bars (Accommodation, Food, Transport) comparing actual vs planned.
  - Render Recent Expenses list and the Settle Up section.
- **Add Expense Modal** (matches `ReRoute Add Expense Modal.png`): 
  - Form fields for amount, currency dropdown, description, category dropdown, and multi-payer selection avatars.
  - **Split Methods**: Implement a segmented control for Equal (default), Percentage, Shares, and Exact amount. Include mocked inline validation (e.g., Percentage must sum to 100%, exact amounts must sum to total).
- **Receipt Scan / OCR Flow** (matches `ReRoute OCR - Data Review & Edit.png` and `ReRoute OCR - Confirmation & Split Setup.png`):
  - Mock the upload/scan action to simulate an `ocr_status` processing delay.
  - Build the **"Ocr Processing Review"** screen showing extracted items with delete icons, add missing item affordance, and a financial summary.
  - Build the **"Split Item Assignment"** screen showing the OCR success banner and the split configuration applied to the extracted total.
- **Settle Up**: Build the UI to allow recording a payment between two members, which updates the simplified debt balances.
- Wire navigation only where needed between the Budget Dashboard and the Add Expense / OCR sheets.
- Run `expo lint` and `tsc --noEmit`; fix errors before reporting completion.

Before finishing, summarize:
1. Files changed.
2. Components created/reused, and which feature folder each lives in.
3. Assumptions made regarding the mocked expense/OCR data shapes and client-side split calculation logic.
4. Confirmation that no duplicate Trip Room header, tab row, or Global Widget was created.