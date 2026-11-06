// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-2873
// source=packages/limia-design-system/src/components/ui/tabs.tsx
// component=TabsTrigger
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const hasIcon = instance.getBoolean('Icon Start')
// Active/Inactive vêm do value do <Tabs> pai; Focus é estado visual
const state = instance.getEnum('State', {
  'Active': 'active',
  'Inactive': 'inactive',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

const icon = hasIcon ? instance.findInstance('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.tsx`<TabsTrigger value="${label}"${disabled ? ' disabled' : ''}>${iconCode ? figma.tsx`${iconCode} ` : ''}${label}</TabsTrigger>`,
  imports: ['import { TabsTrigger } from "@limia/design-system"'],
  id: 'tabs-trigger',
  metadata: { nestable: true, props: { value: label } },
}
