# Contributing to @limia/design-system

Thank you for helping evolve our Design System! Follow these guidelines to ensure quality and consistency.

## 1. Development Workflow

1.  **Install:** `npm install`
2.  **Tokens:** `npm run build:tokens` (Generates CSS and TS types)
3.  **Develop:** Edit files in `src/components`.
4.  **Verify:**
    -   `npm run build` (Ensures Type safety)
    -   `npm run test:tokens` (Ensures token references and typography maps are consistent)
    -   `npm run test:a11y` (Ensures Contrast safety)
    -   `npm run check` runs i18n parity, token tests and contrast together. The `Design System CI` workflow runs the same checks on every PR that touches `packages/` or the docs app.

## 2. Governance Rules 🛡️

### 🚫 Forbidden
-   Arbitrary Tailwind values: `bg-[#123456]`, `p-[17px]`.
-   Direct primitive usage: `color.blue.500` (Use `action.primary` instead).
-   Ignoring accessibility warnings.

### ✅ Required
-   Use `t()` helper for inline styles / animations.
-   Use semantic utility classes (`bg-primary`, `text-muted-foreground`).
-   Update `COMPONENT_STATUS.md` if you add/change a component.
-   Use `text-danger-text` for error and destructive **text**; `destructive` is a background token and fails contrast as text in dark mode.

## 3. Tokens, Figma and Code Connect

-   **Source of truth:** `packages/limia-tokens/tokens/*.json`. `tokens.css` and `src/index.ts` are generated — never edit them by hand. CI fails if they are out of date with the JSON.
-   **Figma mirror:** the `Primitives` (modes Desktop/Mobile) and `Semantics` (modes Light/Dark) variable collections in the Limia Figma file mirror the JSON. Figma variable names use `/` and replace `.` with `_` (e.g. `spacing.0.5` → `spacing/0_5`); each variable's WEB code syntax is the generated CSS variable (`var(--spacing-0-5)`). When you change a token, update the variable in Figma in the same PR.
-   **Styles:** Figma effect styles `shadow/*` and text styles `typography/*` mirror `shadow.*`, `typography.scale`, `lineHeight` and `letterSpacing`.
-   **Code Connect:** templates live in `figma/*.figma.ts` (config: `figma.config.json`). When a component's props change, update its template. Publish with `npx figma connect publish` (requires the Figma library to be published and a Figma access token).

## 4. Versioning

We use **Semantic Versioning**.
-   **Breaking Change?** Bump MAJOR.
-   **New Feature?** Bump MINOR.
-   **Fix?** Bump PATCH.
-   Record every change under `## [Unreleased]` in `CHANGELOG.md` (this package and `packages/limia-tokens`) and move it to a version heading when you release.

