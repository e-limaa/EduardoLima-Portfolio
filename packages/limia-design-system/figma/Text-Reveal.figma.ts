// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-5328
// source=packages/limia-design-system/src/components/text-reveal.tsx
// component=TextReveal
import figma from 'figma'
const instance = figma.selectedInstance

// State (Initial/Revealing/Revealed) são quadros da animação, não props
const text = instance.getString('Text')

export default {
  example: figma.tsx`<TextReveal>${text}</TextReveal>`,
  imports: ['import { TextReveal } from "@limia/design-system"'],
  id: 'text-reveal',
  metadata: { nestable: true },
}
