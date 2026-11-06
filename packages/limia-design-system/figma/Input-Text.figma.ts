// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=2638-15
// source=packages/limia-design-system/src/components/input.tsx
// component=Input
import figma from 'figma'
const instance = figma.selectedInstance

const placeholder = instance.getString('Text')
// Hover/Focus are visual states only (no prop)
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'default',
  'Focus': 'default',
  'Invalid': 'invalid',
  'Disabled': 'disabled',
})

export default {
  example: figma.tsx`<Input placeholder="${placeholder}"${state === 'invalid' ? ' aria-invalid' : ''}${state === 'disabled' ? ' disabled' : ''} />`,
  imports: ['import { Input } from "@limia/design-system"'],
  id: 'input-text',
  metadata: { nestable: true },
}
