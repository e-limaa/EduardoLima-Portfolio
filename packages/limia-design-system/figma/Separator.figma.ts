// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-4518
// source=packages/limia-design-system/src/components/ui/separator.tsx
// component=Separator
import figma from 'figma'
const instance = figma.selectedInstance

const orientation = instance.getEnum('Orientation', {
  'Horizontal': 'horizontal',
  'Vertical': 'vertical',
})

export default {
  example: figma.tsx`<Separator${orientation === 'horizontal' ? '' : figma.tsx` orientation="${orientation}"`} />`,
  imports: ['import { Separator } from "@limia/design-system"'],
  id: 'separator',
  metadata: { nestable: true },
}
