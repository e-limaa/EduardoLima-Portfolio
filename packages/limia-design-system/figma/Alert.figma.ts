// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-25
// source=packages/limia-design-system/src/components/ui/alert.tsx
// component=Alert
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Destructive': 'destructive',
})
const showIcon = instance.getBoolean('Show Icon')
const icon = showIcon ? instance.findInstance('Glyph') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<Alert${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}>
  ${iconCode ? iconCode : ''}
  <AlertTitle>${title}</AlertTitle>
  <AlertDescription>${description}</AlertDescription>
</Alert>`,
  imports: ['import { Alert, AlertTitle, AlertDescription } from "@limia/design-system"'],
  id: 'alert',
  metadata: { nestable: false },
}
