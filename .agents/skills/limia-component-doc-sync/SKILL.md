---
name: limia-component-doc-sync
description: Enforce documentation sync for the Limia design system. Use when adding a new component to `@limia/design-system`, exposing a new public component API, renaming or moving a documented component, or changing public props/variants/behavior that must also be reflected in the Docs do Limia. This skill requires the Limia docs to stay updated in English and Portuguese before the work is considered complete.
---

# Limia Component Doc Sync

Treat new or changed Limia components as incomplete until the package docs are updated.

## Trigger Cases

- A new component is added under `packages/limia-design-system/src/components/**`.
- A new component is exported from `packages/limia-design-system/src/index.ts`.
- A public prop, variant, slot, state, accessibility behavior, or usage contract changes for an existing Limia component.
- A documented component page needs to be renamed, moved, deprecated, or replaced.

## Required Outcome

For a new component in `@limia/design-system`, always deliver all of the following in the same task unless the user explicitly says not to:

- Package implementation in `packages/limia-design-system/src/components/**`.
- Public export in `packages/limia-design-system/src/index.ts` when the component is public.
- English docs page in `apps/design-system-docs/src/docs/content/components/<component>.mdx`.
- Portuguese docs page in `apps/design-system-docs/src/docs/content/components/<component>.pt-br.mdx`.
- Docs registry entry in `apps/design-system-docs/src/docs/registry.ts`.

For a change to an existing public component, update the existing English and Portuguese docs pages and keep `apps/design-system-docs/src/docs/registry.ts` aligned if titles, descriptions, resources, routes, status, or related links changed.

## Rules

- Do not treat Docs do Limia as optional follow-up work.
- Do not ship a new public component with only package code and no docs.
- Do not update only one locale. English and Portuguese docs must stay in parity.
- Do not document from app-local copies. Document the public package API from `@limia/design-system`.
- If a component is intentionally private or experimental, state that explicitly and avoid adding a public docs page unless the task requires one.

## Docs Checklist

When documenting a new or changed component, verify:

- The docs page explains what the component is for.
- Usage guidance matches the real API and variants.
- Style guidance reflects the current semantic token usage.
- Code examples import from `@limia/design-system`.
- Accessibility notes match the component's actual behavior.
- `resources.source` in `apps/design-system-docs/src/docs/registry.ts` points to the correct package source or doc source.
- The `.mdx` and `.pt-br.mdx` pages cover the same behavior.

## Verification

After package or docs changes, prefer these checks:

- `npm run build --workspace @limia/design-system`
- `npm run build --workspace @limia/design-system-docs`
- `npm run check-parity`

If the change affects the broader workspace, run:

- `npm run build`

## Completion Bar

The task is not done if any of these are still missing:

- The public component exists but is undocumented.
- Only one docs locale was updated.
- `apps/design-system-docs/src/docs/registry.ts` is stale.
- The docs describe props, variants, or behavior that no longer match the code.
