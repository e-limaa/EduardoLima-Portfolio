// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-5671
// source=packages/limia-design-system/src/components/ui/textarea.tsx
// component=Textarea
import figma from 'figma'
const instance = figma.selectedInstance

const text = instance.getString('Text')
const state = instance.getEnum('State', {
  'Default': 'default',
  'Focus': 'focus',
  'Invalid': 'invalid',
  'Disabled': 'disabled',
})
const invalid = state === 'invalid'
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<Textarea placeholder="${text}"${invalid ? ' aria-invalid' : ''}${disabled ? ' disabled' : ''} />`,
  imports: ['import { Textarea } from "@limia/design-system"'],
  id: 'textarea',
  metadata: { nestable: true },
}
