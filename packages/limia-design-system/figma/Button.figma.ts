// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3194-183
// source=packages/limia-design-system/src/components/button.tsx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Secondary': 'secondary',
  'Outline': 'outline',
  'Ghost': 'ghost',
  'Destructive': 'destructive',
  'Link': 'link',
})
const size = instance.getEnum('Size', {
  'Small': 'sm',
  'Default': 'default',
  'Large': 'lg',
  'XL': 'xl',
})
const disabled = instance.getEnum('State', {
  'Default': false,
  'Hover': false,
  'Focus': false,
  'Disabled': true,
})
const hasIcon = instance.getBoolean('Icon Start')
const icon = hasIcon ? instance.findInstance('Icon Start') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<Button${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}${size === 'default' ? '' : figma.tsx` size="${size}"`}${disabled ? ' disabled' : ''}>${iconCode ? figma.tsx`${iconCode} ` : ''}${label}</Button>`,
  imports: ['import { Button } from "@limia/design-system"'],
  id: 'button',
  metadata: { nestable: true },
}
