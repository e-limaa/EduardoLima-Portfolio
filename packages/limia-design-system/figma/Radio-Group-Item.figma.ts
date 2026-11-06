// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-1567
// source=packages/limia-design-system/src/components/ui/radio-group.tsx
// component=RadioGroupItem
import figma from 'figma'
const instance = figma.selectedInstance

// Checked is controlled by the parent RadioGroup value (RadioGroupItem has no checked prop); Focus is visual only.
const state = instance.getEnum('State', {
  'Default': 'default',
  'Focus': 'default',
  'Invalid': 'invalid',
  'Disabled': 'disabled',
})

export default {
  example: figma.tsx`<RadioGroupItem value="option"${state === 'invalid' ? ' aria-invalid' : ''}${state === 'disabled' ? ' disabled' : ''} />`,
  imports: ['import { RadioGroupItem } from "@limia/design-system"'],
  id: 'radio-group-item',
  metadata: { nestable: true },
}
