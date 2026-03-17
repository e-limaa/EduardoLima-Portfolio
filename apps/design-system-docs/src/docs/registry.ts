import React from "react";

import type {
  DocA11yStatus,
  DocChapter,
  DocKind,
  DocPage,
  DocResources,
  DocSection,
  DocStatus,
} from "./types";

const chapterPresets: Record<DocKind, DocChapter[]> = {
  "getting-started": [
    { id: "overview", label: "docs.chapter.overview", required: true },
    { id: "setup", label: "docs.chapter.setup", required: true },
    { id: "usage", label: "docs.chapter.usage", required: true },
    { id: "next-steps", label: "docs.chapter.next-steps", required: true },
  ],
  foundation: [
    { id: "overview", label: "docs.chapter.overview", required: true },
    { id: "principles", label: "docs.chapter.principles", required: true },
    { id: "tokens", label: "docs.chapter.tokens", required: true },
    { id: "implementation", label: "docs.chapter.implementation", required: true },
    { id: "accessibility", label: "docs.chapter.accessibility", required: false },
    { id: "related", label: "docs.chapter.related", required: false },
  ],
  component: [
    { id: "overview", label: "docs.chapter.overview", required: true },
    { id: "usage", label: "docs.chapter.usage", required: true },
    { id: "style", label: "docs.chapter.style", required: true },
    { id: "code", label: "docs.chapter.code", required: true },
    { id: "accessibility", label: "docs.chapter.accessibility", required: true },
  ],
  pattern: [
    { id: "overview", label: "docs.chapter.overview", required: true },
    { id: "when-to-use", label: "docs.chapter.when-to-use", required: true },
    { id: "composition", label: "docs.chapter.composition", required: true },
    { id: "code", label: "docs.chapter.code", required: true },
    { id: "accessibility", label: "docs.chapter.accessibility", required: true },
  ],
  governance: [
    { id: "overview", label: "docs.chapter.overview", required: true },
    { id: "policy", label: "docs.chapter.policy", required: true },
    { id: "workflow", label: "docs.chapter.workflow", required: true },
    { id: "references", label: "docs.chapter.references", required: true },
  ],
};

function cloneChapters(kind: DocKind) {
  return chapterPresets[kind].map((chapter) => ({ ...chapter }));
}

function defaultA11yStatus(kind: DocKind, status: DocStatus): DocA11yStatus {
  if (kind === "component") {
    return status === "stable" ? "reviewed" : "partial";
  }

  if (kind === "foundation") return "reviewed";
  if (kind === "pattern") return "partial";
  if (kind === "governance") return "partial";
  return "not-reviewed";
}

function componentResources(
  exportName: string,
  source: string,
): DocResources {
  return {
    package: "@limia/design-system",
    import: `import { ${exportName} } from "@limia/design-system"`,
    source,
  };
}

function tokenResources(source: string): DocResources {
  return {
    package: "@limia/tokens",
    source,
  };
}

function docsResources(source: string): DocResources {
  return {
    package: "@limia/design-system-docs",
    source,
  };
}

type DefineDocInput = Omit<
  DocPage,
  "chapters" | "a11yStatus"
> & {
  chapters?: DocChapter[];
  a11yStatus?: DocA11yStatus;
};

function defineDoc({
  chapters,
  a11yStatus,
  ...doc
}: DefineDocInput): DocPage {
  return {
    ...doc,
    chapters: chapters ?? cloneChapters(doc.kind),
    a11yStatus: a11yStatus ?? defaultA11yStatus(doc.kind, doc.status),
  };
}

export const docsRegistry: DocPage[] = [
  defineDoc({
    title: "docs.installation.title",
    href: "/design-system/installation",
    section: "Getting Started",
    kind: "getting-started",
    status: "stable",
    description: "docs.installation.description",
    resources: {
      package: "@limia/design-system, @limia/tokens",
      import: 'import "@limia/design-system/styles.css"; import "@limia/tokens/css";',
      source: "apps/design-system-docs/src/docs/content/getting-started/installation.mdx",
    },
    related: ["/design-system/getting-started/usage-basics"],
    component: React.lazy(() => import("./content/getting-started/installation.mdx")),
    componentPt: React.lazy(
      () => import("./content/getting-started/installation.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.usage-basics.title",
    href: "/design-system/getting-started/usage-basics",
    section: "Getting Started",
    kind: "getting-started",
    status: "stable",
    description: "docs.usage-basics.description",
    resources: {
      package: "@limia/design-system",
      source: "apps/design-system-docs/src/docs/content/getting-started/usage-basics.mdx",
    },
    related: ["/design-system/installation"],
    component: React.lazy(
      () => import("./content/getting-started/usage-basics.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/getting-started/usage-basics.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.colors.title",
    href: "/design-system/foundation/colors",
    section: "Foundations",
    kind: "foundation",
    status: "stable",
    description: "docs.colors.description",
    resources: tokenResources("packages/limia-tokens/tokens/primitives.json, packages/limia-tokens/tokens/semantic.json"),
    related: [
      "/design-system/foundation/accessibility",
      "/design-system/foundation/typography",
    ],
    component: React.lazy(() => import("./content/foundations/colors.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/colors.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.typography.title",
    href: "/design-system/foundation/typography",
    section: "Foundations",
    kind: "foundation",
    status: "stable",
    description: "docs.typography.description",
    resources: docsResources("packages/limia-design-system/styles/globals.css"),
    related: ["/design-system/foundation/spacing"],
    component: React.lazy(() => import("./content/foundations/typography.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/typography.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.spacing.title",
    href: "/design-system/foundation/spacing",
    section: "Foundations",
    kind: "foundation",
    status: "stable",
    description: "docs.spacing.description",
    resources: tokenResources("packages/limia-tokens/tokens/primitives.json"),
    related: [
      "/design-system/foundation/typography",
      "/design-system/patterns/forms",
    ],
    component: React.lazy(() => import("./content/foundations/spacing.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/spacing.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.radius.title",
    href: "/design-system/foundation/radius",
    section: "Foundations",
    kind: "foundation",
    status: "stable",
    description: "docs.radius.description",
    resources: tokenResources("packages/limia-tokens/tokens/primitives.json"),
    component: React.lazy(() => import("./content/foundations/radius.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/radius.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.accessibility.title",
    href: "/design-system/foundation/accessibility",
    section: "Foundations",
    kind: "foundation",
    status: "stable",
    description: "docs.accessibility.description",
    resources: docsResources("packages/limia-design-system/CONTRIBUTING.md"),
    related: [
      "/design-system/foundation/colors",
      "/design-system/governance/lifecycle",
    ],
    component: React.lazy(
      () => import("./content/foundations/accessibility.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/foundations/accessibility.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.shadows.title",
    href: "/design-system/foundation/shadows",
    section: "Foundations",
    kind: "foundation",
    status: "beta",
    description: "docs.shadows.description",
    resources: tokenResources("packages/limia-tokens/tokens/semantic.json"),
    component: React.lazy(() => import("./content/foundations/shadow.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/shadow.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.button.title",
    href: "/design-system/components/buttons",
    section: "Components",
    kind: "component",
    status: "stable",
    description: "docs.button.description",
    resources: componentResources(
      "Button",
      "packages/limia-design-system/src/components/ui/button.tsx",
    ),
    related: [
      "/design-system/components/inputs",
      "/design-system/patterns/forms",
    ],
    component: React.lazy(() => import("./content/components/button.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/button.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.input.title",
    href: "/design-system/components/inputs",
    section: "Components",
    kind: "component",
    status: "stable",
    description: "docs.input.description",
    resources: componentResources(
      "Input",
      "packages/limia-design-system/src/components/ui/input.tsx",
    ),
    related: [
      "/design-system/patterns/forms",
      "/design-system/components/buttons",
    ],
    component: React.lazy(() => import("./content/components/input.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/input.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.textarea.title",
    href: "/design-system/components/textarea",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.textarea.description",
    resources: componentResources(
      "Textarea",
      "packages/limia-design-system/src/components/ui/textarea.tsx",
    ),
    related: [
      "/design-system/components/inputs",
      "/design-system/patterns/forms",
    ],
    component: React.lazy(() => import("./content/components/textarea.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/textarea.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.label.title",
    href: "/design-system/components/label",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.label.description",
    resources: componentResources(
      "Label",
      "packages/limia-design-system/src/components/ui/label.tsx",
    ),
    related: [
      "/design-system/components/inputs",
      "/design-system/patterns/forms",
    ],
    component: React.lazy(() => import("./content/components/label.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/label.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.card.title",
    href: "/design-system/components/cards",
    section: "Components",
    kind: "component",
    status: "stable",
    description: "docs.card.description",
    resources: componentResources(
      "Card",
      "packages/limia-design-system/src/components/ui/card.tsx",
    ),
    component: React.lazy(() => import("./content/components/card.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/card.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.section-header.title",
    href: "/design-system/components/section-header",
    section: "Components",
    kind: "component",
    status: "draft",
    description: "docs.section-header.description",
    resources: componentResources(
      "SectionHeader",
      "packages/limia-design-system/src/components/section-header.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/section-header.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/section-header.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.project-card.title",
    href: "/design-system/components/project-card",
    section: "Components",
    kind: "component",
    status: "stable",
    description: "docs.project-card.description",
    resources: componentResources(
      "ProjectCard",
      "packages/limia-design-system/src/components/project-card.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/project-card.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/project-card.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.section.title",
    href: "/design-system/components/section",
    section: "Components",
    kind: "component",
    status: "draft",
    description: "docs.section.description",
    resources: componentResources(
      "Section",
      "packages/limia-design-system/src/components/section.tsx",
    ),
    component: React.lazy(() => import("./content/components/section.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/section.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.text-reveal.title",
    href: "/design-system/components/text-reveal",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.text-reveal.description",
    resources: componentResources(
      "TextReveal",
      "packages/limia-design-system/src/components/text-reveal.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/text-reveal.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/text-reveal.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.true-focus.title",
    href: "/design-system/components/true-focus",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.true-focus.description",
    resources: componentResources(
      "TrueFocus",
      "packages/limia-design-system/src/components/true-focus.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/true-focus.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/true-focus.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.interactive-grid.title",
    href: "/design-system/components/interactive-grid",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.interactive-grid.description",
    resources: componentResources(
      "InteractiveGrid",
      "packages/limia-design-system/src/components/interactive-grid.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/interactive-grid.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/interactive-grid.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.liquid-ether.title",
    href: "/design-system/components/liquid-ether",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.liquid-ether.description",
    resources: componentResources(
      "LiquidEther",
      "packages/limia-design-system/src/components/liquid-ether.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/liquid-ether.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/liquid-ether.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.badge.title",
    href: "/design-system/components/badges",
    section: "Components",
    kind: "component",
    status: "stable",
    description: "docs.badge.description",
    resources: componentResources(
      "Badge",
      "packages/limia-design-system/src/components/ui/badge.tsx",
    ),
    component: React.lazy(() => import("./content/components/badge.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/badge.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.avatar.title",
    href: "/design-system/components/avatar",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.avatar.description",
    resources: componentResources(
      "Avatar",
      "packages/limia-design-system/src/components/ui/avatar.tsx",
    ),
    component: React.lazy(() => import("./content/components/avatar.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/avatar.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.accordion.title",
    href: "/design-system/components/accordion",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.accordion.description",
    resources: componentResources(
      "Accordion",
      "packages/limia-design-system/src/components/ui/accordion.tsx",
    ),
    component: React.lazy(() => import("./content/components/accordion.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/accordion.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.alert-dialog.title",
    href: "/design-system/components/alert-dialog",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.alert-dialog.description",
    resources: componentResources(
      "AlertDialog",
      "packages/limia-design-system/src/components/ui/alert-dialog.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/alert-dialog.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/alert-dialog.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.alert.title",
    href: "/design-system/components/alert",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.alert.description",
    resources: componentResources(
      "Alert",
      "packages/limia-design-system/src/components/ui/alert.tsx",
    ),
    related: ["/design-system/patterns/feedback"],
    component: React.lazy(() => import("./content/components/alert.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/alert.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.dialog.title",
    href: "/design-system/components/dialog",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.dialog.description",
    resources: componentResources(
      "Dialog, DialogContent, DialogTrigger",
      "packages/limia-design-system/src/components/ui/dialog.tsx",
    ),
    component: React.lazy(() => import("./content/components/dialog.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/dialog.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.checkbox.title",
    href: "/design-system/components/checkbox",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.checkbox.description",
    resources: componentResources(
      "Checkbox",
      "packages/limia-design-system/src/components/ui/checkbox.tsx",
    ),
    related: ["/design-system/patterns/forms"],
    component: React.lazy(() => import("./content/components/checkbox.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/checkbox.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.dropdown-menu.title",
    href: "/design-system/components/dropdown-menu",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.dropdown-menu.description",
    resources: componentResources(
      "DropdownMenu",
      "packages/limia-design-system/src/components/ui/dropdown-menu.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/dropdown-menu.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/dropdown-menu.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.form.title",
    href: "/design-system/components/form",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.form.description",
    resources: componentResources(
      "Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage",
      "packages/limia-design-system/src/components/ui/form.tsx",
    ),
    related: ["/design-system/patterns/forms"],
    component: React.lazy(() => import("./content/components/form.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/form.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.popover.title",
    href: "/design-system/components/popover",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.popover.description",
    resources: componentResources(
      "Popover",
      "packages/limia-design-system/src/components/ui/popover.tsx",
    ),
    component: React.lazy(() => import("./content/components/popover.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/popover.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.hover-card.title",
    href: "/design-system/components/hover-card",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.hover-card.description",
    resources: componentResources(
      "HoverCard",
      "packages/limia-design-system/src/components/ui/hover-card.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/hover-card.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/hover-card.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.progress.title",
    href: "/design-system/components/progress",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.progress.description",
    resources: componentResources(
      "Progress",
      "packages/limia-design-system/src/components/ui/progress.tsx",
    ),
    component: React.lazy(() => import("./content/components/progress.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/progress.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.radio-group.title",
    href: "/design-system/components/radio-group",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.radio-group.description",
    resources: componentResources(
      "RadioGroup",
      "packages/limia-design-system/src/components/ui/radio-group.tsx",
    ),
    related: ["/design-system/patterns/forms"],
    component: React.lazy(
      () => import("./content/components/radio-group.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/radio-group.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.select.title",
    href: "/design-system/components/select",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.select.description",
    resources: componentResources(
      "Select",
      "packages/limia-design-system/src/components/ui/select.tsx",
    ),
    related: ["/design-system/patterns/forms"],
    component: React.lazy(() => import("./content/components/select.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/select.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.separator.title",
    href: "/design-system/components/separator",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.separator.description",
    resources: componentResources(
      "Separator",
      "packages/limia-design-system/src/components/ui/separator.tsx",
    ),
    component: React.lazy(() => import("./content/components/separator.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/separator.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.sheet.title",
    href: "/design-system/components/sheet",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.sheet.description",
    resources: componentResources(
      "Sheet",
      "packages/limia-design-system/src/components/ui/sheet.tsx",
    ),
    component: React.lazy(() => import("./content/components/sheet.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/sheet.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.skeleton.title",
    href: "/design-system/components/skeleton",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.skeleton.description",
    resources: componentResources(
      "Skeleton",
      "packages/limia-design-system/src/components/ui/skeleton.tsx",
    ),
    component: React.lazy(() => import("./content/components/skeleton.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/skeleton.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.switch.title",
    href: "/design-system/components/switch",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.switch.description",
    resources: componentResources(
      "Switch",
      "packages/limia-design-system/src/components/ui/switch.tsx",
    ),
    component: React.lazy(() => import("./content/components/switch.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/switch.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.mode-switch.title",
    href: "/design-system/components/mode-switch",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.mode-switch.description",
    resources: componentResources(
      "ThemeSwitch, TextSwitch",
      "packages/limia-design-system/src/components/theme-switch.tsx, packages/limia-design-system/src/components/text-switch.tsx",
    ),
    related: [
      "/design-system/components/switch",
      "/design-system/components/toggle",
    ],
    component: React.lazy(() => import("./content/components/mode-switch.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/mode-switch.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.table.title",
    href: "/design-system/components/table",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.table.description",
    resources: componentResources(
      "Table",
      "packages/limia-design-system/src/components/ui/table.tsx",
    ),
    component: React.lazy(() => import("./content/components/table.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/table.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.tabs.title",
    href: "/design-system/components/tabs",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.tabs.description",
    resources: componentResources(
      "Tabs",
      "packages/limia-design-system/src/components/ui/tabs.tsx",
    ),
    component: React.lazy(() => import("./content/components/tabs.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/tabs.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.toggle.title",
    href: "/design-system/components/toggle",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.toggle.description",
    resources: componentResources(
      "Toggle",
      "packages/limia-design-system/src/components/ui/toggle.tsx",
    ),
    component: React.lazy(() => import("./content/components/toggle.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/toggle.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.toggle-group.title",
    href: "/design-system/components/toggle-group",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.toggle-group.description",
    resources: componentResources(
      "ToggleGroup",
      "packages/limia-design-system/src/components/ui/toggle-group.tsx",
    ),
    component: React.lazy(
      () => import("./content/components/toggle-group.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/toggle-group.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.tooltip.title",
    href: "/design-system/components/tooltip",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.tooltip.description",
    resources: componentResources(
      "Tooltip",
      "packages/limia-design-system/src/components/ui/tooltip.tsx",
    ),
    component: React.lazy(() => import("./content/components/tooltip.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/tooltip.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.sonner.title",
    href: "/design-system/components/sonner",
    section: "Components",
    kind: "component",
    status: "beta",
    description: "docs.sonner.description",
    resources: componentResources(
      "Toaster, toast",
      "packages/limia-design-system/src/components/ui/sonner.tsx",
    ),
    related: ["/design-system/patterns/toast", "/design-system/patterns/feedback"],
    component: React.lazy(() => import("./content/components/sonner.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/sonner.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.forms.title",
    href: "/design-system/patterns/forms",
    section: "Patterns",
    kind: "pattern",
    status: "draft",
    description: "docs.forms.description",
    resources: docsResources("apps/design-system-docs/src/docs/content/patterns/forms.mdx"),
    related: [
      "/design-system/components/inputs",
      "/design-system/components/select",
      "/design-system/components/checkbox",
    ],
    component: React.lazy(() => import("./content/patterns/forms.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/forms.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.feedback.title",
    href: "/design-system/patterns/feedback",
    section: "Patterns",
    kind: "pattern",
    status: "draft",
    description: "docs.feedback.description",
    resources: docsResources("apps/design-system-docs/src/docs/content/patterns/feedback.mdx"),
    related: [
      "/design-system/components/alert",
      "/design-system/patterns/toast",
    ],
    component: React.lazy(() => import("./content/patterns/feedback.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/feedback.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.toast.title",
    href: "/design-system/patterns/toast",
    section: "Patterns",
    kind: "pattern",
    status: "beta",
    description: "docs.toast.description",
    resources: componentResources(
      "Toaster",
      "packages/limia-design-system/src/components/ui/sonner.tsx",
    ),
    related: ["/design-system/patterns/feedback"],
    component: React.lazy(() => import("./content/patterns/toast.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/toast.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.versioning.title",
    href: "/design-system/governance/versioning",
    section: "Governance",
    kind: "governance",
    status: "stable",
    description: "docs.versioning.description",
    resources: docsResources("packages/limia-design-system/COMPONENT_STATUS.md"),
    related: ["/design-system/governance/lifecycle"],
    component: React.lazy(
      () => import("./content/governance/versioning.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/versioning.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.lifecycle.title",
    href: "/design-system/governance/lifecycle",
    section: "Governance",
    kind: "governance",
    status: "stable",
    description: "docs.lifecycle.description",
    resources: docsResources("packages/limia-design-system/COMPONENT_STATUS.md"),
    related: [
      "/design-system/governance/versioning",
      "/design-system/governance/contributing",
    ],
    component: React.lazy(
      () => import("./content/governance/lifecycle.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/lifecycle.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.contributing.title",
    href: "/design-system/governance/contributing",
    section: "Governance",
    kind: "governance",
    status: "stable",
    description: "docs.contributing.description",
    resources: docsResources("packages/limia-design-system/CONTRIBUTING.md"),
    related: ["/design-system/governance/lifecycle"],
    component: React.lazy(
      () => import("./content/governance/contributing.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/contributing.pt-br.mdx"),
    ),
  }),
  defineDoc({
    title: "docs.localization.title",
    href: "/design-system/governance/localization",
    section: "Governance",
    kind: "governance",
    status: "stable",
    description: "docs.localization.description",
    resources: docsResources("apps/design-system-docs/src/lib/i18n.ts"),
    component: React.lazy(
      () => import("./content/governance/localization.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/localization.pt-br.mdx"),
    ),
  }),
];
