# Project Map

Use this file when working on the design system in `EduardoLima-Portfolio`.

## Stack

- App shell: Vite + React + React Router
- Styling: Tailwind CSS v4 through `@tailwindcss/vite`
- Design system package: `@limia/design-system`
- Component primitives: Radix UI + `class-variance-authority`
- Utilities: `clsx`, `tailwind-merge`, `cn()`
- Docs: MDX pages under `src/app/docs`

## Source of Truth

Edit these files directly:

- `packages/limia-tokens/tokens/primitives.json`
- `packages/limia-tokens/tokens/semantic.json`
- `packages/limia-design-system/src/components/**`
- `packages/limia-design-system/src/index.ts`
- `src/app/docs/**`
- `packages/limia-design-system/COMPONENT_STATUS.md`
- `packages/limia-design-system/CONTRIBUTING.md` when workflow rules themselves change

Do not hand-edit these generated outputs:

- `packages/limia-design-system/styles/tokens.css`
- `packages/limia-design-system/src/tokens/index.ts`

Regenerate them with:

```bash
npm run build:tokens --prefix packages/limia-design-system
```

## Token Pipeline

The token flow in this repository is:

1. Define primitives in `packages/limia-tokens/tokens/primitives.json`.
2. Define semantic aliases in `packages/limia-tokens/tokens/semantic.json`.
3. Generate CSS variables and TypeScript token map with `packages/limia-design-system/scripts/build-tokens.js`.
4. Consume generated variables through `packages/limia-design-system/styles/globals.css`.
5. Consume tokens in components through semantic Tailwind classes or the `t()` helper.

Use the semantic model already present in `semantic.json`:

- `background.*`
- `text.*`
- `border.*`
- `action.*`
- `chart.*`
- `sidebar.*`

Keep both `light` and `dark` branches aligned when adding or renaming semantic tokens.

## Component Conventions

- Build public components in `packages/limia-design-system/src/components/**`.
- Export public components from `packages/limia-design-system/src/index.ts`.
- Favor the existing composition model:
  - `cva` for variants
  - Radix Slot or primitives when composition is needed
  - `cn()` for class merging
  - `t()` only for token values that cannot be expressed cleanly through utilities
- Mirror package semantics in app consumers instead of re-inventing styles locally.

Current public exports include:

- Button
- Badge
- Input
- Textarea
- Label
- Card
- Text reveal
- Section header
- Interactive grid
- Project card
- Section
- Dialog
- Form
- Token helpers

## Documentation and Localization

The design system docs are app-native and bilingual.

- Registry: `src/app/docs/registry.ts`
- English docs: `src/app/docs/**/*.mdx`
- Portuguese docs: `src/app/docs/**/*.pt-br.mdx`

When changing public behavior:

- Update the matching MDX page.
- Update the `*.pt-br.mdx` pair.
- Keep the page status in sync with the change.
- Add the page to `src/app/docs/registry.ts` if it is new.

The root build runs `check-parity`, so missing localization pairs will surface there.

## Validation Surfaces

Use these surfaces to sanity-check changes:

- `src/pages/DesignSystem.tsx`
- `src/pages/styleguide/**`
- `src/app/docs/**`

Use these commands to verify repository health:

```bash
npm run build:tokens --prefix packages/limia-design-system
npm run test:a11y --prefix packages/limia-design-system
npm run build
```

## Governance Rules Already Present

From `packages/limia-design-system/CONTRIBUTING.md`:

- Do not use arbitrary Tailwind values such as `bg-[#123456]` or `p-[17px]`.
- Do not consume primitive palette values directly inside component APIs when semantic tokens should exist.
- Do use semantic utility classes such as `bg-primary` and `text-muted-foreground`.
- Do use `t()` for inline styles or animation values that need token access.
- Do update `COMPONENT_STATUS.md` when component scope changes.

## Practical Routing

Choose the smallest correct change path:

- Token problem: edit JSON tokens, rebuild outputs, rerun contrast checks.
- Component API problem: edit package component, export if public, update docs, update status.
- Documentation problem: update MDX pair and registry.
- App inconsistency problem: prefer consuming `@limia/design-system` rather than duplicating styles in app code.

