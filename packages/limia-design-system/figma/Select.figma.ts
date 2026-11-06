// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-1118
// source=packages/limia-design-system/src/components/ui/select.tsx
// component=Select
import figma from 'figma'
const instance = figma.selectedInstance

const value = instance.getString('Value')
const size = instance.getEnum('Size', {
  'Default': 'default',
  'Small': 'sm',
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Placeholder': 'placeholder',
  'Focus': 'focus',
  'Invalid': 'invalid',
  'Disabled': 'disabled',
})

// No estado Placeholder o texto exibido é uma camada "Value" sem vínculo com a propriedade
let placeholder = value
if (state === 'placeholder') {
  const placeholderText = instance.findText('Value')
  if (placeholderText && placeholderText.type === 'TEXT') {
    placeholder = placeholderText.textContent
  }
}

const isPlaceholder = state === 'placeholder'
const disabled = state === 'disabled'
const invalid = state === 'invalid'

export default {
  example: figma.tsx`<Select${isPlaceholder ? '' : figma.tsx` defaultValue="${value}"`}${disabled ? ' disabled' : ''}>
  <SelectTrigger${size === 'default' ? '' : figma.tsx` size="${size}"`}${invalid ? ' aria-invalid' : ''}>
    <SelectValue${isPlaceholder ? figma.tsx` placeholder="${placeholder}"` : ''} />
  </SelectTrigger>
</Select>`,
  imports: ['import { Select, SelectTrigger, SelectValue } from "@limia/design-system"'],
  id: 'select',
  metadata: { nestable: true },
}
