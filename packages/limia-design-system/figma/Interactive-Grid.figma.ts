// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-2108
// source=packages/limia-design-system/src/components/interactive-grid.tsx
// component=InteractiveGrid
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Subtle': 'subtle',
})

export default {
  example: figma.tsx`<InteractiveGrid${variant === 'default' ? '' : figma.tsx` variant="${variant}"`} />`,
  imports: ['import { InteractiveGrid } from "@limia/design-system"'],
  id: 'interactive-grid',
  metadata: { nestable: true },
}
