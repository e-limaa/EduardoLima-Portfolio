
import { Palette, Type, Layers, Box, LayoutGrid, Radius, ShieldCheck } from 'lucide-react';

export const navigation = [
    {
        title: 'Getting Started',
        items: [
            { title: 'Overview', href: '/design-system', icon: LayoutGrid },
            { title: 'Installation', href: '/design-system/installation', icon: Box },
        ],
    },
    {
        title: 'Foundation',
        items: [
            { title: 'Colors', href: '/design-system/foundation/colors', icon: Palette },
            { title: 'Typography', href: '/design-system/foundation/typography', icon: Type },
            { title: 'Spacing', href: '/design-system/foundation/spacing', icon: Layers },
            { title: 'Radius', href: '/design-system/foundation/radius', icon: Radius },
            { title: 'Shadows & Elevation', href: '/design-system/foundation/shadows', icon: Layers },
            { title: 'Accessibility', href: '/design-system/foundation/accessibility', icon: ShieldCheck },
        ],
    },
    {
        title: 'Components',
        items: [
            { title: 'Buttons', href: '/design-system/components/buttons', icon: Box },
            { title: 'Inputs', href: '/design-system/components/inputs', icon: Box },
            { title: 'Cards', href: '/design-system/components/cards', icon: Box },
            { title: 'Badges', href: '/design-system/components/badges', icon: Box },
        ],
    },
    {
        title: 'Governance',
        items: [
            { title: 'Versioning', href: '/design-system/governance/versioning', icon: ShieldCheck },
            { title: 'Lifecycle', href: '/design-system/governance/lifecycle', icon: ShieldCheck },
            { title: 'Contributing', href: '/design-system/governance/contributing', icon: ShieldCheck },
        ],
    },
];
