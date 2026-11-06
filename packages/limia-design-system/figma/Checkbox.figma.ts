// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-2575
// source=packages/limia-design-system/src/components/ui/checkbox.tsx
// component=Checkbox
import figma from 'figma'
const instance = figma.selectedInstance

const checked = instance.getEnum('Checked', {
  'False': false,
  'True': true,
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Focus': 'default',
  'Invalid': 'invalid',
  'Disabled': 'disabled',
})

export default {
  example: figma.tsx`<Checkbox${checked ? ' defaultChecked' : ''}${state === 'invalid' ? ' aria-invalid' : ''}${state === 'disabled' ? ' disabled' : ''} />`,
  imports: ['import { Checkbox } from "@limia/design-system"'],
  id: 'checkbox',
  metadata: { nestable: true },
}
