// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-281
// source=packages/limia-design-system/src/components/ui/popover.tsx
// component=Popover
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const align = instance.getEnum('Align', {
  'Start': 'start',
  'Center': 'center',
  'End': 'end',
})
const trigger = instance.findInstance('Trigger')
let triggerCode
if (trigger && trigger.type === 'INSTANCE') {
  triggerCode = trigger.executeTemplate().example
}

export default {
  example: figma.tsx`<Popover>
  <PopoverTrigger asChild>
    ${triggerCode}
  </PopoverTrigger>
  <PopoverContent${align === 'center' ? '' : figma.tsx` align="${align}"`}>
    <div className="grid gap-2">
      <h4 className="font-medium leading-none">${title}</h4>
      <p className="text-sm text-muted-foreground">${description}</p>
    </div>
  </PopoverContent>
</Popover>`,
  imports: ['import { Popover, PopoverTrigger, PopoverContent } from "@limia/design-system"'],
  id: 'popover',
  metadata: { nestable: false },
}
