// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-2944
// source=packages/limia-design-system/src/components/ui/toggle-group.tsx
// component=ToggleGroupItem
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
// Variant é herdado do contexto do <ToggleGroup>; Position é resolvido por CSS (first:/last:)
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'hover',
  'On': 'on',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<ToggleGroupItem value="${label}"${disabled ? ' disabled' : ''}>${label}</ToggleGroupItem>`,
  imports: ['import { ToggleGroupItem } from "@limia/design-system"'],
  id: 'toggle-group-item',
  metadata: { nestable: true, props: { value: label, pressed: state === 'on' ? 'true' : 'false' } },
}
