import React from "react";

import type { DocPage } from "./types";

export const docsRegistry: DocPage[] = [
  {
    title: "docs.installation.title",
    href: "/design-system/installation",
    section: "Getting Started",
    status: "stable",
    description: "docs.installation.description",
    component: React.lazy(() => import("./content/getting-started/installation.mdx")),
    componentPt: React.lazy(
      () => import("./content/getting-started/installation.pt-br.mdx"),
    ),
  },
  {
    title: "docs.colors.title",
    href: "/design-system/foundation/colors",
    section: "Foundations",
    status: "stable",
    description: "docs.colors.description",
    component: React.lazy(() => import("./content/foundations/colors.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/colors.pt-br.mdx"),
    ),
  },
  {
    title: "docs.typography.title",
    href: "/design-system/foundation/typography",
    section: "Foundations",
    status: "stable",
    description: "docs.typography.description",
    component: React.lazy(() => import("./content/foundations/typography.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/typography.pt-br.mdx"),
    ),
  },
  {
    title: "docs.spacing.title",
    href: "/design-system/foundation/spacing",
    section: "Foundations",
    status: "stable",
    description: "docs.spacing.description",
    component: React.lazy(() => import("./content/foundations/spacing.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/spacing.pt-br.mdx"),
    ),
  },
  {
    title: "docs.radius.title",
    href: "/design-system/foundation/radius",
    section: "Foundations",
    status: "stable",
    description: "docs.radius.description",
    component: React.lazy(() => import("./content/foundations/radius.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/radius.pt-br.mdx"),
    ),
  },
  {
    title: "docs.accessibility.title",
    href: "/design-system/foundation/accessibility",
    section: "Foundations",
    status: "stable",
    description: "docs.accessibility.description",
    component: React.lazy(
      () => import("./content/foundations/accessibility.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/foundations/accessibility.pt-br.mdx"),
    ),
  },
  {
    title: "docs.shadows.title",
    href: "/design-system/foundation/shadows",
    section: "Foundations",
    status: "beta",
    description: "docs.shadows.description",
    component: React.lazy(() => import("./content/foundations/shadow.mdx")),
    componentPt: React.lazy(
      () => import("./content/foundations/shadow.pt-br.mdx"),
    ),
  },
  {
    title: "docs.button.title",
    href: "/design-system/components/buttons",
    section: "Components",
    status: "stable",
    description: "docs.button.description",
    component: React.lazy(() => import("./content/components/button.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/button.pt-br.mdx"),
    ),
  },
  {
    title: "docs.input.title",
    href: "/design-system/components/inputs",
    section: "Components",
    status: "stable",
    description: "docs.input.description",
    component: React.lazy(() => import("./content/components/input.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/input.pt-br.mdx"),
    ),
  },
  {
    title: "docs.card.title",
    href: "/design-system/components/cards",
    section: "Components",
    status: "stable",
    description: "docs.card.description",
    component: React.lazy(() => import("./content/components/card.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/card.pt-br.mdx"),
    ),
  },
  {
    title: "docs.section-header.title",
    href: "/design-system/components/section-header",
    section: "Components",
    status: "draft",
    description: "docs.section-header.description",
    component: React.lazy(
      () => import("./content/components/section-header.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/section-header.pt-br.mdx"),
    ),
  },
  {
    title: "docs.project-card.title",
    href: "/design-system/components/project-card",
    section: "Components",
    status: "stable",
    description: "docs.project-card.description",
    component: React.lazy(
      () => import("./content/components/project-card.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/project-card.pt-br.mdx"),
    ),
  },
  {
    title: "docs.section.title",
    href: "/design-system/components/section",
    section: "Components",
    status: "draft",
    description: "docs.section.description",
    component: React.lazy(() => import("./content/components/section.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/section.pt-br.mdx"),
    ),
  },
  {
    title: "docs.badge.title",
    href: "/design-system/components/badges",
    section: "Components",
    status: "stable",
    description: "docs.badge.description",
    component: React.lazy(() => import("./content/components/badge.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/badge.pt-br.mdx"),
    ),
  },
  {
    title: "docs.avatar.title",
    href: "/design-system/components/avatar",
    section: "Components",
    status: "beta",
    description: "docs.avatar.description",
    component: React.lazy(() => import("./content/components/avatar.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/avatar.pt-br.mdx"),
    ),
  },
  {
    title: "docs.accordion.title",
    href: "/design-system/components/accordion",
    section: "Components",
    status: "beta",
    description: "docs.accordion.description",
    component: React.lazy(() => import("./content/components/accordion.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/accordion.pt-br.mdx"),
    ),
  },
  {
    title: "docs.alert-dialog.title",
    href: "/design-system/components/alert-dialog",
    section: "Components",
    status: "beta",
    description: "docs.alert-dialog.description",
    component: React.lazy(
      () => import("./content/components/alert-dialog.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/alert-dialog.pt-br.mdx"),
    ),
  },
  {
    title: "docs.alert.title",
    href: "/design-system/components/alert",
    section: "Components",
    status: "beta",
    description: "docs.alert.description",
    component: React.lazy(() => import("./content/components/alert.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/alert.pt-br.mdx"),
    ),
  },
  {
    title: "docs.checkbox.title",
    href: "/design-system/components/checkbox",
    section: "Components",
    status: "beta",
    description: "docs.checkbox.description",
    component: React.lazy(() => import("./content/components/checkbox.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/checkbox.pt-br.mdx"),
    ),
  },
  {
    title: "docs.dropdown-menu.title",
    href: "/design-system/components/dropdown-menu",
    section: "Components",
    status: "beta",
    description: "docs.dropdown-menu.description",
    component: React.lazy(
      () => import("./content/components/dropdown-menu.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/dropdown-menu.pt-br.mdx"),
    ),
  },
  {
    title: "docs.popover.title",
    href: "/design-system/components/popover",
    section: "Components",
    status: "beta",
    description: "docs.popover.description",
    component: React.lazy(() => import("./content/components/popover.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/popover.pt-br.mdx"),
    ),
  },
  {
    title: "docs.hover-card.title",
    href: "/design-system/components/hover-card",
    section: "Components",
    status: "beta",
    description: "docs.hover-card.description",
    component: React.lazy(
      () => import("./content/components/hover-card.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/hover-card.pt-br.mdx"),
    ),
  },
  {
    title: "docs.progress.title",
    href: "/design-system/components/progress",
    section: "Components",
    status: "beta",
    description: "docs.progress.description",
    component: React.lazy(() => import("./content/components/progress.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/progress.pt-br.mdx"),
    ),
  },
  {
    title: "docs.radio-group.title",
    href: "/design-system/components/radio-group",
    section: "Components",
    status: "beta",
    description: "docs.radio-group.description",
    component: React.lazy(
      () => import("./content/components/radio-group.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/radio-group.pt-br.mdx"),
    ),
  },
  {
    title: "docs.select.title",
    href: "/design-system/components/select",
    section: "Components",
    status: "beta",
    description: "docs.select.description",
    component: React.lazy(() => import("./content/components/select.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/select.pt-br.mdx"),
    ),
  },
  {
    title: "docs.separator.title",
    href: "/design-system/components/separator",
    section: "Components",
    status: "beta",
    description: "docs.separator.description",
    component: React.lazy(() => import("./content/components/separator.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/separator.pt-br.mdx"),
    ),
  },
  {
    title: "docs.sheet.title",
    href: "/design-system/components/sheet",
    section: "Components",
    status: "beta",
    description: "docs.sheet.description",
    component: React.lazy(() => import("./content/components/sheet.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/sheet.pt-br.mdx"),
    ),
  },
  {
    title: "docs.skeleton.title",
    href: "/design-system/components/skeleton",
    section: "Components",
    status: "beta",
    description: "docs.skeleton.description",
    component: React.lazy(() => import("./content/components/skeleton.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/skeleton.pt-br.mdx"),
    ),
  },
  {
    title: "docs.switch.title",
    href: "/design-system/components/switch",
    section: "Components",
    status: "beta",
    description: "docs.switch.description",
    component: React.lazy(() => import("./content/components/switch.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/switch.pt-br.mdx"),
    ),
  },
  {
    title: "docs.table.title",
    href: "/design-system/components/table",
    section: "Components",
    status: "beta",
    description: "docs.table.description",
    component: React.lazy(() => import("./content/components/table.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/table.pt-br.mdx"),
    ),
  },
  {
    title: "docs.tabs.title",
    href: "/design-system/components/tabs",
    section: "Components",
    status: "beta",
    description: "docs.tabs.description",
    component: React.lazy(() => import("./content/components/tabs.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/tabs.pt-br.mdx"),
    ),
  },
  {
    title: "docs.toggle.title",
    href: "/design-system/components/toggle",
    section: "Components",
    status: "beta",
    description: "docs.toggle.description",
    component: React.lazy(() => import("./content/components/toggle.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/toggle.pt-br.mdx"),
    ),
  },
  {
    title: "docs.toggle-group.title",
    href: "/design-system/components/toggle-group",
    section: "Components",
    status: "beta",
    description: "docs.toggle-group.description",
    component: React.lazy(
      () => import("./content/components/toggle-group.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/components/toggle-group.pt-br.mdx"),
    ),
  },
  {
    title: "docs.tooltip.title",
    href: "/design-system/components/tooltip",
    section: "Components",
    status: "beta",
    description: "docs.tooltip.description",
    component: React.lazy(() => import("./content/components/tooltip.mdx")),
    componentPt: React.lazy(
      () => import("./content/components/tooltip.pt-br.mdx"),
    ),
  },
  {
    title: "docs.forms.title",
    href: "/design-system/patterns/forms",
    section: "Patterns",
    status: "draft",
    description: "docs.forms.description",
    component: React.lazy(() => import("./content/patterns/forms.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/forms.pt-br.mdx"),
    ),
  },
  {
    title: "docs.feedback.title",
    href: "/design-system/patterns/feedback",
    section: "Patterns",
    status: "draft",
    description: "docs.feedback.description",
    component: React.lazy(() => import("./content/patterns/feedback.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/feedback.pt-br.mdx"),
    ),
  },
  {
    title: "docs.toast.title",
    href: "/design-system/patterns/toast",
    section: "Patterns",
    status: "beta",
    description: "docs.toast.description",
    component: React.lazy(() => import("./content/patterns/toast.mdx")),
    componentPt: React.lazy(
      () => import("./content/patterns/toast.pt-br.mdx"),
    ),
  },
  {
    title: "docs.versioning.title",
    href: "/design-system/governance/versioning",
    section: "Governance",
    status: "stable",
    description: "docs.versioning.description",
    component: React.lazy(
      () => import("./content/governance/versioning.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/versioning.pt-br.mdx"),
    ),
  },
  {
    title: "docs.lifecycle.title",
    href: "/design-system/governance/lifecycle",
    section: "Governance",
    status: "stable",
    description: "docs.lifecycle.description",
    component: React.lazy(
      () => import("./content/governance/lifecycle.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/lifecycle.pt-br.mdx"),
    ),
  },
  {
    title: "docs.contributing.title",
    href: "/design-system/governance/contributing",
    section: "Governance",
    status: "stable",
    description: "docs.contributing.description",
    component: React.lazy(
      () => import("./content/governance/contributing.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/contributing.pt-br.mdx"),
    ),
  },
  {
    title: "docs.localization.title",
    href: "/design-system/governance/localization",
    section: "Governance",
    status: "stable",
    description: "docs.localization.description",
    component: React.lazy(
      () => import("./content/governance/localization.mdx"),
    ),
    componentPt: React.lazy(
      () => import("./content/governance/localization.pt-br.mdx"),
    ),
  },
];
