// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-3338
// source=packages/limia-design-system/src/components/ui/switch.tsx
// component=Switch
import figma from 'figma'
const instance = figma.selectedInstance

const checked = instance.getEnum('Checked', {
  'False': false,
  'True': true,
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<Switch${checked ? ' defaultChecked' : ''}${disabled ? ' disabled' : ''} />`,
  imports: ['import { Switch } from "@limia/design-system"'],
  id: 'switch',
  metadata: { nestable: true },
}
