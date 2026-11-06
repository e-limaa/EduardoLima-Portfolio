// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3184-49
// source=packages/limia-design-system/src/components/true-focus.tsx
// component=TrueFocus
import figma from 'figma'
const instance = figma.selectedInstance

// Step (1/2/3/Static) são quadros da animação, não props
const item1 = instance.getString('Item 1')
const item2 = instance.getString('Item 2')
const item3 = instance.getString('Item 3')

export default {
  example: figma.tsx`<TrueFocus
  items={[
    { content: "${item1}" },
    { content: "${item2}" },
    { content: "${item3}" },
  ]}
/>`,
  imports: ['import { TrueFocus } from "@limia/design-system"'],
  id: 'true-focus',
  metadata: { nestable: true },
}
