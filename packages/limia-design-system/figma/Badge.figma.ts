// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3179-29
// source=packages/limia-design-system/src/components/ui/badge.tsx
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Secondary': 'secondary',
  'Destructive': 'destructive',
  'Outline': 'outline',
})
const hasIcon = instance.getBoolean('Icon Start')
const icon = hasIcon ? instance.findInstance('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<Badge${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}>${iconCode ? figma.tsx`${iconCode} ` : ''}${label}</Badge>`,
  imports: ['import { Badge } from "@limia/design-system"'],
  id: 'badge',
  metadata: { nestable: true },
}
