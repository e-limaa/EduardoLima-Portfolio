import React from 'react';

export type DocStatus = 'draft' | 'beta' | 'stable' | 'deprecated';
export type DocSection = 'Getting Started' | 'Foundations' | 'Components' | 'Patterns' | 'Governance';

export interface DocPage {
    title: string; // Now a translation key
    href: string;
    section: DocSection;
    status: DocStatus;
    description: string; // Now a translation key
    component: React.LazyExoticComponent<any>;
    componentPt?: React.LazyExoticComponent<any>;
    label?: string;
}

// Registry: Single Source of Truth
export const docsRegistry: DocPage[] = [
    // Getting Started
    {
        title: 'docs.installation.title',
        href: '/design-system/installation',
        section: 'Getting Started',
        status: 'stable',
        description: 'docs.installation.description',
        component: React.lazy(() => import('./getting-started/installation.mdx')),
        componentPt: React.lazy(() => import('./getting-started/installation.pt-br.mdx')),
    },

    // Foundations
    {
        title: 'docs.colors.title',
        href: '/design-system/foundation/colors',
        section: 'Foundations',
        status: 'stable',
        description: 'docs.colors.description',
        component: React.lazy(() => import('./foundations/colors.mdx')),
        componentPt: React.lazy(() => import('./foundations/colors.pt-br.mdx')),
    },
    {
        title: 'docs.typography.title',
        href: '/design-system/foundation/typography',
        section: 'Foundations',
        status: 'stable',
        description: 'docs.typography.description',
        component: React.lazy(() => import('./foundations/typography.mdx')),
        componentPt: React.lazy(() => import('./foundations/typography.pt-br.mdx')),
    },
    {
        title: 'docs.spacing.title',
        href: '/design-system/foundation/spacing',
        section: 'Foundations',
        status: 'stable',
        description: 'docs.spacing.description',
        component: React.lazy(() => import('./foundations/spacing.mdx')),
        componentPt: React.lazy(() => import('./foundations/spacing.pt-br.mdx')),
    },
    {
        title: 'docs.radius.title',
        href: '/design-system/foundation/radius',
        section: 'Foundations',
        status: 'stable',
        description: 'docs.radius.description',
        component: React.lazy(() => import('./foundations/radius.mdx')),
        componentPt: React.lazy(() => import('./foundations/radius.pt-br.mdx')),
    },
    {
        title: 'docs.accessibility.title',
        href: '/design-system/foundation/accessibility',
        section: 'Foundations',
        status: 'stable',
        description: 'docs.accessibility.description',
        component: React.lazy(() => import('./foundations/accessibility.mdx')),
        componentPt: React.lazy(() => import('./foundations/accessibility.pt-br.mdx')),
    },
    {
        title: 'docs.shadows.title',
        href: '/design-system/foundation/shadows',
        section: 'Foundations',
        status: 'beta',
        description: 'docs.shadows.description',
        component: React.lazy(() => import('./foundations/shadow.mdx')),
        componentPt: React.lazy(() => import('./foundations/shadow.pt-br.mdx')),
    },

    // Components
    {
        title: 'docs.button.title',
        href: '/design-system/components/buttons',
        section: 'Components',
        status: 'stable',
        description: 'docs.button.description',
        component: React.lazy(() => import('./components/button.mdx')),
        componentPt: React.lazy(() => import('./components/button.pt-br.mdx')),
    },
    {
        title: 'docs.input.title',
        href: '/design-system/components/inputs',
        section: 'Components',
        status: 'stable',
        description: 'docs.input.description',
        component: React.lazy(() => import('./components/input.mdx')),
        componentPt: React.lazy(() => import('./components/input.pt-br.mdx')),
    },
    {
        title: 'docs.card.title',
        href: '/design-system/components/cards',
        section: 'Components',
        status: 'stable',
        description: 'docs.card.description',
        component: React.lazy(() => import('./components/card.mdx')),
        componentPt: React.lazy(() => import('./components/card.pt-br.mdx')),
    },
    {
        title: 'docs.section-header.title',
        href: '/design-system/components/section-header',
        section: 'Components',
        status: 'draft',
        description: 'docs.section-header.description',
        component: React.lazy(() => import('./components/section-header.mdx')),
        componentPt: React.lazy(() => import('./components/section-header.pt-br.mdx')),
    },
    {
        title: 'docs.project-card.title',
        href: '/design-system/components/project-card',
        section: 'Components',
        status: 'stable',
        description: 'docs.project-card.description',
        component: React.lazy(() => import('./components/project-card.mdx')),
        componentPt: React.lazy(() => import('./components/project-card.pt-br.mdx')),
    },
    {
        title: 'docs.section.title',
        href: '/design-system/components/section',
        section: 'Components',
        status: 'draft',
        description: 'docs.section.description',
        component: React.lazy(() => import('./components/section.mdx')),
        componentPt: React.lazy(() => import('./components/section.pt-br.mdx')),
    },

    {
        title: 'docs.badge.title',
        href: '/design-system/components/badges',
        section: 'Components',
        status: 'stable',
        description: 'docs.badge.description',
        component: React.lazy(() => import('./components/badge.mdx')),
        componentPt: React.lazy(() => import('./components/badge.pt-br.mdx')),
    },

    // Patterns (New)
    {
        title: 'docs.forms.title',
        href: '/design-system/patterns/forms',
        section: 'Patterns',
        status: 'draft',
        description: 'docs.forms.description',
        component: React.lazy(() => import('./patterns/forms.mdx')),
        componentPt: React.lazy(() => import('./patterns/forms.pt-br.mdx')),
    },
    {
        title: 'docs.feedback.title',
        href: '/design-system/patterns/feedback',
        section: 'Patterns',
        status: 'draft',
        description: 'docs.feedback.description',
        component: React.lazy(() => import('./patterns/feedback.mdx')),
        componentPt: React.lazy(() => import('./patterns/feedback.pt-br.mdx')),
    },

    // Governance
    {
        title: 'docs.versioning.title',
        href: '/design-system/governance/versioning',
        section: 'Governance',
        status: 'stable',
        description: 'docs.versioning.description',
        component: React.lazy(() => import('./governance/versioning.mdx')),
        componentPt: React.lazy(() => import('./governance/versioning.pt-br.mdx')),
    },
    {
        title: 'docs.lifecycle.title',
        href: '/design-system/governance/lifecycle',
        section: 'Governance',
        status: 'stable',
        description: 'docs.lifecycle.description',
        component: React.lazy(() => import('./governance/lifecycle.mdx')),
        componentPt: React.lazy(() => import('./governance/lifecycle.pt-br.mdx')),
    },
    {
        title: 'docs.contributing.title',
        href: '/design-system/governance/contributing',
        section: 'Governance',
        status: 'stable',
        description: 'docs.contributing.description',
        component: React.lazy(() => import('./governance/contributing.mdx')),
        componentPt: React.lazy(() => import('./governance/contributing.pt-br.mdx')),
    },
    {
        title: 'docs.localization.title',
        href: '/design-system/governance/localization',
        section: 'Governance',
        status: 'stable',
        description: 'docs.localization.description',
        component: React.lazy(() => import('./governance/localization.mdx')),
        componentPt: React.lazy(() => import('./governance/localization.pt-br.mdx')),
    },
];
