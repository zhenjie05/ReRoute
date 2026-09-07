Read:
- docs/prompts/AGENTS.md
- docs/prompts/DESIGN.md
- docs/prompts/UI_REQUIREMENTS.md
- Figma screenshots or exported frames in @frontend/Screenshots

Create or update frontend/docs/SCREEN_SPEC.md for the ADP project.

Context:
- This project uses Figma as the source of detailed UI design.
- There are no Stitch HTML files.
- Use the Figma screenshots/exported frames as the main visual reference.
- Do not implement code yet.

Reference priority:
1. Figma screenshots/exported frames are the source of truth for exact layout, component order, spacing, and visual hierarchy.
2. prompts/DESIGN.md is the source of truth for design tokens, colors, typography, spacing, and component styling.
3. prompts/UI_REQUIREMENTS.md is the source of truth for required screens, fields, behavior, and acceptance criteria.
4. AGENTS.md is the source of truth for coding rules and project structure.

Task:
Create prompts/SCREEN_SPEC.md that documents each screen clearly enough for Codex to implement the UI without redesigning it.

For each screen, include:
- Screen name
- Screen purpose
- Route or page location
- Layout hierarchy from top to bottom
- Component order
- Visible text and labels
- Input fields
- Buttons and actions
- Cards, tables, lists, or panels
- Empty/loading/error states if shown or required
- Responsive behavior
- Reusable component suggestions
- Important visual details from Figma
- Any unclear details or assumptions

Do not:
- Do not invent a different layout.
- Do not replace the Figma design with a generic dashboard.
- Do not implement code yet.
- Do not over-describe things already covered in DESIGN.md.
- Do not repeat the whole UI_REQUIREMENTS.md.
- Do not create backend requirements.

Output structure:

# SCREEN_SPEC.md

## 1. Purpose

## 2. Source Files

## 3. Global Layout Patterns

## 4. Shared Components

## 5. Screen Specs

### 5.1 [Screen Name]

For each screen:

#### Purpose
#### Source Reference
#### Layout Hierarchy
#### Component Order
#### Visible Text / Labels
#### Fields and Controls
#### Actions
#### States
#### Responsive Notes
#### Reusable Components
#### Implementation Notes
#### Unclear Details

## 6. Reusable Component Map

## 7. Notes / Assumptions