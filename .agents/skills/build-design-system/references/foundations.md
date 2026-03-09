# Foundations Reference

Use this file when defining the structural rules of a design system.

## Principles

- Treat the design system as a product with explicit users, backlog, ownership, and service levels.
- Optimize for consistency, accessibility, composability, and maintainability before visual novelty.
- Express brand through controlled tokens and patterns, not through ad hoc component overrides.

## Token Taxonomy

Use a layered model:

1. Reference tokens: raw values such as palette, font families, base spacing, raw shadows.
2. Semantic tokens: purpose-driven aliases such as surface, text, border, focus, danger, success.
3. Component tokens: optional component-scoped mappings for stable needs that should not leak into global semantics.

Keep the same pattern across categories:

- Color
- Typography
- Spacing
- Radius
- Border width
- Elevation
- Opacity
- Motion
- Breakpoints
- Z-index

## Naming Rules

- Prefer role-based names: `color-text-primary`, `space-stack-md`, `radius-control-sm`.
- Avoid implementation names such as `gray-700`, `card-shadow-2`, or `marketing-red`.
- Keep names parallel across themes and platforms.
- Encode state and emphasis explicitly when needed: `color-border-danger`, `color-bg-accent-hover`.

## Color System

- Separate brand colors from semantic application colors.
- Define minimum contrast requirements for text, icons, focus rings, and non-text boundaries.
- Model interactive states explicitly: default, hover, pressed, focus, selected, disabled.
- Reserve status colors for clear semantic meaning. Do not overload success, warning, or danger for decoration.

## Typography

- Use a bounded type scale and document intended usage for each size.
- Define font family, size, line height, weight, tracking, and paragraph rhythm as tokens or named styles.
- Separate display, heading, body, label, and code usage.
- Protect readability before expressiveness, especially for long-form content and small-screen layouts.

## Spacing and Layout

- Use a limited spacing scale with predictable steps.
- Distinguish inset, stack, inline, and layout spacing in naming or documentation.
- Standardize container widths, grid behavior, and responsive gutters.
- Prefer spatial rules that can be applied consistently across components and templates.

## Shape, Borders, and Elevation

- Keep radius, border width, and shadow scales intentionally small.
- Match elevation semantics to component hierarchy, not to individual designer preference.
- Use borders and shadows as complementary tools; do not rely on depth when contrast is insufficient.

## Motion

- Define duration, easing, and distance tokens.
- Use motion to clarify state change, hierarchy, and continuity.
- Reduce motion for large surfaces, repeated lists, and accessibility-sensitive contexts.
- Support reduced-motion preferences by default.

## Theming

- Drive light, dark, and brand themes through token remapping.
- Keep semantic intent stable across themes.
- Avoid per-component theme exceptions unless required by platform limitations.
- Document which tokens are safe for product teams to extend and which are system-owned.

## Component Modeling

For every component, define:

- Purpose
- Anatomy and slots
- States
- Variants
- Interaction behavior
- Content guidance
- Accessibility notes
- Responsive rules
- Anti-patterns

Start with high-leverage primitives:

- Button
- Link
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Dialog
- Tooltip
- Tabs
- Badge
- Card
- Table

## Quality Baselines

- Keyboard navigation must work without hidden traps.
- Focus indication must be visible in all supported themes.
- Screen reader names, descriptions, and state changes must be explicit.
- Empty, loading, error, and disabled states must be designed, not deferred.
- Responsive behavior must be specified, not left to consuming teams.
