# Contributing to @antigravity/ds

Thank you for helping evolve our Design System! Follow these guidelines to ensure quality and consistency.

## 1. Development Workflow

1.  **Install:** `npm install`
2.  **Tokens:** `npm run build:tokens` (Generates CSS and TS types)
3.  **Develop:** Edit files in `src/components`.
4.  **Verify:**
    -   `npm run build` (Ensures Type safety)
    -   `npm run test:a11y` (Ensures Contrast safety)

## 2. Governance Rules 🛡️

### 🚫 Forbidden
-   Arbitrary Tailwind values: `bg-[#123456]`, `p-[17px]`.
-   Direct primitive usage: `color.blue.500` (Use `action.primary` instead).
-   Ignoring accessibility warnings.

### ✅ Required
-   Use `t()` helper for inline styles / animations.
-   Use semantic utility classes (`bg-primary`, `text-muted-foreground`).
-   Update `COMPONENT_STATUS.md` if you add/change a component.

## 3. Versioning

We use **Semantic Versioning**.
-   **Breaking Change?** Bump MAJOR.
-   **New Feature?** Bump MINOR.
-   **Fix?** Bump PATCH.
