---
name: build-design-system
description: Create, implement, document, govern, and evolve design systems across web products. Use when Codex needs to work on the design system in this repository, especially `@limia/design-system`, Tailwind CSS v4 tokens, semantic theming, component APIs, MDX documentation, accessibility checks, lifecycle governance, or adoption work across the app.
---

# Build Design System

Treat the design system in this repository as a product with a real package, real token pipeline, real docs, and release-quality rules. Work from the source-of-truth files instead of patching generated outputs or app-level copies.

## Repository Map

- Use `packages/limia-tokens/tokens/primitives.json` and `packages/limia-tokens/tokens/semantic.json` as the source of truth for primitives and semantic tokens.
- Treat `packages/limia-design-system/styles/tokens.css` and `packages/limia-design-system/src/tokens/index.ts` as generated artifacts from `packages/limia-design-system/scripts/build-tokens.js`.
- Use `packages/limia-design-system/styles/globals.css` for Tailwind v4 theme wiring, legacy shadcn variable mappings, typography utilities, and base layers.
- Implement package components in `packages/limia-design-system/src/components/**` and export public APIs from `packages/limia-design-system/src/index.ts`.
- Treat `@limia/design-system` and `@limia/tokens` as the only public package surfaces. Do not rely on source-path aliases from consuming apps.
- Keep docs aligned in `src/app/docs/**`, especially `src/app/docs/registry.ts` and the `.mdx` / `.pt-br.mdx` pairs.
- Keep the package governance files current: `packages/limia-design-system/COMPONENT_STATUS.md` and `packages/limia-design-system/CONTRIBUTING.md`.
- Use `src/pages/DesignSystem.tsx` and `src/pages/styleguide/**` as app-facing validation surfaces for the system.
- Read `references/project-map.md` before changing tokens, components, docs, or release rules in this repository.

## Workflow

### 1. Classify the request

- Decide whether the task is about foundations, package components, app adoption, documentation, governance, or migration.
- Keep the scope explicit: token change, new component, component hardening, docs update, lifecycle status change, or styleguide parity fix.

### 2. Change the right source of truth

- Change primitives or semantics in `packages/limia-tokens/tokens/*.json`, not in generated CSS.
- Change package components in `packages/limia-design-system/src/components/**`, not only in app consumers.
- Change package exports in `packages/limia-design-system/src/index.ts` when a new public API is added.
- Change documentation in `src/app/docs/**` and keep the registry in sync.

### 3. Preserve the stack conventions

- Use Tailwind CSS v4 patterns from `packages/limia-design-system/styles/globals.css`.
- Prefer semantic utility classes such as `bg-primary`, `text-muted-foreground`, and `border-border`.
- Use `cn()` for class composition.
- Use `cva` and Radix composition for reusable primitives when the existing package follows that pattern.
- Use the `t()` helper from `packages/limia-design-system/src/lib/token.ts` for inline token consumption when utility classes are insufficient.
- Do not hardcode arbitrary Tailwind values when a token or semantic utility should exist instead.

### 4. Update the package lifecycle

- Update `packages/limia-design-system/COMPONENT_STATUS.md` when adding or materially changing a component.
- Respect lifecycle meaning: draft, beta, stable, deprecated.
- Keep component API decisions small and explicit. Do not add variants only to satisfy one screen.

### 5. Keep docs and localization complete

- Update both the English and Portuguese MDX files when changing public behavior or adding design system pages.
- Keep `src/app/docs/registry.ts` aligned with new docs pages and statuses.
- Reflect design system changes in app-facing demos or styleguide views when needed.

### 6. Verify with repository commands

- Run `npm run build:tokens --prefix packages/limia-design-system` after token changes.
- Run `npm run test:a11y --prefix packages/limia-design-system` after color or contrast changes.
- Run `npm run build` at the repository root when changes affect public package behavior, docs, or app integration.
- Fix parity issues if the root build reports missing localization pairs.

## Decision Rules

- Prefer editing `packages/limia-design-system` over editing app-local UI copies.
- Prefer semantic tokens over primitive references in component code.
- Prefer generated outputs to be rebuilt, never hand-edited.
- Prefer public package exports that are intentional and documented.
- Prefer MDX documentation and component status updates as part of the same change.
- Prefer accessibility checks and contrast validation as release gates, not optional cleanup.

## References

- Read `references/project-map.md` for the exact file map, commands, and repository-specific rules.
- Read `references/foundations.md` when changing token taxonomy, naming, theming, spacing, typography, or component modeling.
- Read `references/governance.md` when changing contribution rules, lifecycle states, versioning, deprecation, or adoption policy.


