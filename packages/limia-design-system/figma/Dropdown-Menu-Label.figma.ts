// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-681
// source=packages/limia-design-system/src/components/ui/dropdown-menu.tsx
// component=DropdownMenuLabel
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')

export default {
  example: figma.tsx`<DropdownMenuLabel>${label}</DropdownMenuLabel>`,
  imports: ['import { DropdownMenuLabel } from "@limia/design-system"'],
  id: 'dropdown-menu-label',
  metadata: { nestable: true },
}
