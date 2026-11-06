// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=2691-48
// source=packages/limia-design-system/src/components/icon.tsx
// component=Icon
import figma from 'figma'

export default {
  example: figma.tsx`<Icon name="search" />`,
  imports: ['import { Icon } from "@limia/design-system"'],
  id: 'icon-search',
  metadata: { nestable: true, props: { name: 'search' } },
}
