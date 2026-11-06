// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-3261
// source=packages/limia-design-system/src/components/theme-switch.tsx
// component=Sun
import figma from 'figma'

// Local Theme Switch glyph: theme-switch.tsx renders lucide-react <Sun />, not a Material Symbols <Icon />.
export default {
  example: figma.tsx`<Sun className="size-4" />`,
  imports: ['import { Sun } from "lucide-react"'],
  id: 'icon-sun',
  metadata: { nestable: true },
}
