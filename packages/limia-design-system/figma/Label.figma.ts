// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-536
// source=packages/limia-design-system/src/components/ui/label.tsx
// component=Label
import figma from 'figma'
const instance = figma.selectedInstance

// State (Default/Disabled) is styled via peer-disabled / group data-disabled; Label has no disabled prop.
const label = instance.getString('Label')

export default {
  example: figma.tsx`<Label>${label}</Label>`,
  imports: ['import { Label } from "@limia/design-system"'],
  id: 'label',
  metadata: { nestable: true },
}
