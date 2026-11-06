// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-3264
// source=packages/limia-design-system/src/components/theme-switch.tsx
// component=Moon
import figma from 'figma'

// Local Theme Switch glyph: theme-switch.tsx renders lucide-react <Moon />, not a Material Symbols <Icon />.
export default {
  example: figma.tsx`<Moon className="size-4" />`,
  imports: ['import { Moon } from "lucide-react"'],
  id: 'icon-moon',
  metadata: { nestable: true },
}
