// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-2490
// source=packages/limia-design-system/src/components/ui/toggle.tsx
// component=Toggle
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const hasIcon = instance.getBoolean('Icon Start')
const showLabel = instance.getBoolean('Show Label')
const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Outline': 'outline',
})
const size = instance.getEnum('Size', {
  'Small': 'sm',
  'Default': 'default',
  'Large': 'lg',
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'hover',
  'On': 'on',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const pressed = state === 'on'
const disabled = state === 'disabled'

const icon = hasIcon ? instance.findInstance('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<Toggle${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}${size === 'default' ? '' : figma.tsx` size="${size}"`}${showLabel ? '' : figma.tsx` aria-label="${label}"`}${pressed ? ' defaultPressed' : ''}${disabled ? ' disabled' : ''}>${iconCode ? figma.tsx`${iconCode}${showLabel ? ' ' : ''}` : ''}${showLabel ? label : ''}</Toggle>`,
  imports: ['import { Toggle } from "@limia/design-system"'],
  id: 'toggle',
  metadata: { nestable: true },
}
