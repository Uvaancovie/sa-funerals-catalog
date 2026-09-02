<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# SAFS UI/UX & Design System Guidelines

## 1. Color Palette & CSS Variables
- Primary Navy: `#151A40` (CSS: `var(--safs-primary)`)
- Accent Gold: `#C5A059` (CSS: `var(--safs-accent)`)
- Text Main: `#2C3E50` (CSS: `var(--safs-text-main)`)
- Text Muted: `#7F8C8D` (CSS: `var(--safs-text-muted)`)
- Backgrounds: `#FFFFFF` (CSS: `var(--safs-bg-light)`)
- Font: `'Poppins', sans-serif`

## 2. Mandatory Component Classes
- Glass & Panels: `.glass-bg`, `.glass-panel`, `.glass-card`, `.glass-card-inner`
- Metric & Data: `.stat-card`, `.stat-card-value`, `.stat-card-label`, `.data-card`, `.data-card-header`, `.data-card-body`
- Buttons: `.btn-primary` (Navy with Gold hover), `.btn-ghost`, `.btn-outline`
- Tabs & Badges: `.tab-pill`, `.tab-pill--active`, `.status-badge--*`, `.action-badge--*`
- Forms & Tables: `.form-input`, `.form-select`, `.data-table`
- Utilities: `.hover-lift`, `.ambient-glow`, `.skeleton`, `.empty-state`

## 3. Angular Standards
- Always use Angular Standalone Components (`standalone: true`).
- Always use modern control flow (`@if`, `@for`, `@switch`).
- Never use hardcoded inline colors when the design system tokens are available.