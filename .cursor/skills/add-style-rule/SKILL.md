---
name: add-style-rule
description: Add or update CSS/SCSS styling guide rules for the boats-web project. Use when the user wants to add a new styling convention, CSS rule, SCSS pattern, design token guideline, accessibility fix, color contrast rule, or update existing style rules. Also use after Lighthouse audits to capture CSS-related fixes as rules.
---

# Add Style Rule

Add new styling conventions to the project's cursor rules. Rules are persisted in `.cursor/rules/css-styling.mdc` so all agents and sessions follow them.

## Instructions

1. **Read the current rules file** at `.cursor/rules/css-styling.mdc`
2. **Determine where the new rule belongs** by matching to an existing section:

| Section | What goes here |
|---------|---------------|
| Absolute Rules | Hard constraints (never do X, always do Y) |
| Design Tokens | Token usage, variables, Style Dictionary |
| CSS Modules | Module conventions, imports, clsx |
| BEM Methodology | Class naming, nesting, modifiers |
| Responsive | Media queries, container queries, mobile-first |
| Layout Patterns | Grid, flexbox, sizing patterns |
| Color & Opacity | `color-mix()`, transparency, darkening/lightening |
| Accessibility (WCAG) | Contrast ratios, color usage, focus states |
| Units | rem, px, em, token vars |
| Cross-Browser (Safari) | Safari-specific workarounds |
| File Structure | Import order, file conventions |

3. **If no section fits**, create a new `## Section` before `## File Structure`
4. **Write the rule** following these formatting conventions:
   - Use `- ` bullet points for each rule
   - Bold the key constraint: `- **Never use X** — do Y instead`
   - Include a code example if the rule involves syntax:

```scss
// ❌ BAD
background: rgba(var(--color-black), 0.6);

// ✅ GOOD
background: color-mix(in srgb, var(--color-black) 60%, transparent);
```

5. **Append** the rule to the appropriate section using StrReplace — never rewrite the entire file
6. **Confirm** the addition to the user with a brief summary

## Key Gotchas to Remember

- **`rgba()` with CSS variables**: Our tokens are full `hsl(...)` values. `rgba(var(--color-*), 0.6)` fails silently. Always use `color-mix()` for opacity/transparency.
- **Color contrast**: WCAG AA requires 4.5:1 for normal text, 3:1 for large text. When using `color-mix()` to darken buttons, verify the ratio passes.
- **Form labels**: `<label>` must be associated with `<input>` via `htmlFor`/`id` — sibling labels without association fail Lighthouse a11y.

## Rules for Writing Rules

- Keep each rule to 1-2 lines max
- Be specific — "never use X" is better than "avoid X when possible"
- Include the WHY if it's not obvious
- If the rule has exceptions, state them inline
- Don't duplicate existing rules — check first
