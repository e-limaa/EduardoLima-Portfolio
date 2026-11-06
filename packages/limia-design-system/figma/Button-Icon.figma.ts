// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3194-187
// source=packages/limia-design-system/src/components/button.tsx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Secondary': 'secondary',
  'Outline': 'outline',
  'Ghost': 'ghost',
  'Destructive': 'destructive',
})
const size = instance.getEnum('Size', {
  'XS': 'icon-xs',
  'Small': 'icon-sm',
  'Medium': 'icon-md',
  'Default': 'icon',
  'Large': 'icon-lg',
})
const disabled = instance.getEnum('State', {
  'Default': false,
  'Focus': false,
  'Disabled': true,
})
const showIcon = instance.getBoolean('Show Icon')
const icon = showIcon ? instance.findInstance('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<Button${variant === 'default' ? '' : figma.tsx` variant="${variant}"`} size="${size}" aria-label="Descreva a ação"${disabled ? ' disabled' : ''}>${iconCode ? iconCode : ''}</Button>`,
  imports: ['import { Button } from "@limia/design-system"'],
  id: 'button-icon',
  metadata: { nestable: true },
}
