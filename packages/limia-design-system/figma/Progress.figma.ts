// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-3958
// source=packages/limia-design-system/src/components/ui/progress.tsx
// component=Progress
import figma from 'figma'
const instance = figma.selectedInstance

const value = instance.getEnum('Value', {
  '0': 0,
  '25': 25,
  '50': 50,
  '75': 75,
  '100': 100,
})

export default {
  example: figma.tsx`<Progress value={${value}} />`,
  imports: ['import { Progress } from "@limia/design-system"'],
  id: 'progress',
  metadata: { nestable: true },
}
