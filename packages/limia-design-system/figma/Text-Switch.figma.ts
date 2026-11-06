// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-2069
// source=packages/limia-design-system/src/components/text-switch.tsx
// component=TextSwitch
import figma from 'figma'
const instance = figma.selectedInstance

const uncheckedLabel = instance.getString('Unchecked Label')
const checkedLabel = instance.getString('Checked Label')
const checked = instance.getEnum('Checked', {
  'False': false,
  'True': true,
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'hover',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<TextSwitch
  checkedLabel="${checkedLabel}"
  uncheckedLabel="${uncheckedLabel}"${checked ? `
  checked` : ''}${disabled ? `
  disabled` : ''}
/>`,
  imports: ['import { TextSwitch } from "@limia/design-system"'],
  id: 'text-switch',
  metadata: { nestable: true },
}
