# Governance Reference

Use this file when maintaining a design system after the first release.

## Ownership Model

- Assign a clear owner for tokens, components, documentation, and releases.
- Define which changes require design review, engineering review, accessibility review, or product sign-off.
- Treat contribution latency as a product metric. Slow review loops create forks in consuming products.

## Contribution Workflow

- Require a problem statement before accepting a new component or variant.
- Require evidence of reuse potential, accessibility impact, and migration impact.
- Reject additions that only solve one screen or one campaign unless they are explicitly scoped as temporary.
- Prefer extending primitives and patterns before creating new top-level components.

## Quality Gates

Require these checks before release:

- Visual regression coverage for critical states and themes
- Interaction tests for keyboard and pointer flows
- Accessibility validation for semantics, focus, labeling, and state announcements
- Token regression checks when foundations change
- Documentation updates for any public API change

## Versioning and Releases

- Version the design system like a product dependency, not like an internal scratchpad.
- Separate additive changes from breaking changes.
- Publish release notes with migration guidance, behavior changes, and deprecated APIs.
- Batch low-signal changes when possible so consuming teams do not chase noise.

## Deprecation

- Mark deprecations early and document the replacement path.
- Keep deprecation windows long enough for product teams to migrate safely.
- Avoid silent breakage or undocumented removals.
- Track deprecated API usage until adoption falls below the removal threshold.

## Documentation Model

Document each public component with:

- Purpose
- Anatomy
- Variants and states
- Accessibility notes
- Content guidelines
- Do and do not examples
- Migration notes when replacing older patterns

Document system-wide rules for:

- Token usage
- Layout
- Theming
- Motion
- Content patterns
- Contribution standards

## Adoption Strategy

- Roll out through the highest-frequency components first.
- Provide migration recipes, codemods, or side-by-side examples when replacing legacy UI.
- Measure adoption by coverage, drift reduction, duplicate component removal, and issue volume.
- Review consuming product exceptions regularly; every accepted exception should either become a system rule or expire.

## Maintenance Cadence

Run a recurring stewardship loop:

1. Review incoming requests and production drift.
2. Audit usage analytics, defects, and accessibility regressions.
3. Prioritize foundation changes separately from component backlog work.
4. Publish release notes and migration guidance.
5. Prune deprecated patterns and stale documentation.

## Anti-Patterns

- Treating the design system as a one-time delivery.
- Adding variants to avoid product conversations.
- Allowing undocumented product-specific overrides to spread.
- Shipping visual components without interaction or accessibility completeness.
- Measuring success by component count instead of consistency and adoption.
