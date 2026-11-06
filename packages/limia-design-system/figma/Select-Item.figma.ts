// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-1140
// source=packages/limia-design-system/src/components/ui/select.tsx
// component=SelectItem
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const state = instance.getEnum('State', {
  'Default': 'default',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<SelectItem value="${label}"${disabled ? ' disabled' : ''}>${label}</SelectItem>`,
  imports: ['import { SelectItem } from "@limia/design-system"'],
  id: 'select-item',
  metadata: { nestable: true, props: { value: label } },
}
