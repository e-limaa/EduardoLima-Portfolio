// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-1887
// source=packages/limia-design-system/src/components/ui/accordion.tsx
// component=Accordion
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const content = instance.getString('Content')
const open = instance.getEnum('Open', {
  'False': false,
  'True': true,
})
const disabled = instance.getEnum('State', {
  'Default': false,
  'Hover': false,
  'Focus': false,
  'Disabled': true,
})

export default {
  example: figma.tsx`<Accordion type="single" collapsible${open ? ' defaultValue="item-1"' : ''}>
  <AccordionItem value="item-1"${disabled ? ' disabled' : ''}>
    <AccordionTrigger>${title}</AccordionTrigger>
    <AccordionContent>${content}</AccordionContent>
  </AccordionItem>
</Accordion>`,
  imports: ['import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@limia/design-system"'],
  id: 'accordion',
  metadata: { nestable: false },
}
