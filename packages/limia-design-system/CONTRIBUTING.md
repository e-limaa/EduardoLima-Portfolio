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

## 4. Changing a component in Figma

Figma, code and Code Connect must keep describing the same component. A Figma-only change never reaches production: the React component is what ships. CI checks tokens, contrast and builds, but it does **not** detect drift between Figma and code — follow the checklist for your kind of change.

| Change in Figma | What to do |
| :--- | :--- |
| **Visual, using existing variables** (e.g. `border/default` → `border/strong`, `spacing/3` → `spacing/4`) | Apply the same change to the component in `src/components/`. Republish the Figma library. Code Connect: nothing. |
| **Needs a new token** | Add it to `packages/limia-tokens/tokens/*.json` first, mirror it as a Figma variable (same name, `.` → `_`, WEB code syntax `var(--…)`), run `npm run build:tokens` and `npm run check`, then follow the row above. |
| **Component properties** (new variant value, renamed property, new `Show X` boolean or text property) | Add/adjust the matching React prop. Update `figma/<Name>.figma.ts`: every variant value must be mapped in `getEnum`, and renamed properties break the template until fixed. Republish the library, then run `npx --package=@figma/code-connect@latest figma connect publish`. |
| **Renamed layers used by templates** (`Icon`, `Icon Start`, `Glyph`, `Trigger`, `Action`, …) | Update the matching `findInstance('…')` in the template and republish Code Connect. |
| **Component deleted and recreated** | Its node id changes: update the `// url=…node-id=` header of the template and republish Code Connect. Prefer editing the existing component over recreating it. |

After any of the above:
-   Update the component's documentation sheet in Figma and its `.pt-br.mdx` / `.mdx` page in `apps/design-system-docs`.
-   Record the change under `## [Unreleased]` in `CHANGELOG.md`, and update `COMPONENT_STATUS.md` if the status changed.

## 5. Versioning

We use **Semantic Versioning**.
-   **Breaking Change?** Bump MAJOR.
-   **New Feature?** Bump MINOR.
-   **Fix?** Bump PATCH.
-   Record every change under `## [Unreleased]` in `CHANGELOG.md` (this package and `packages/limia-tokens`) and move it to a version heading when you release.

