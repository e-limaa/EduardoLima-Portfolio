// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-4718
// source=packages/limia-design-system/src/components/ui/tooltip.tsx
// component=Tooltip
import figma from 'figma'
const instance = figma.selectedInstance

const content = instance.getString('Content')
const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Brand': 'brand',
})
const side = instance.getEnum('Side', {
  'Top': 'top',
  'Bottom': 'bottom',
  'Left': 'left',
  'Right': 'right',
})

export default {
  example: figma.tsx`<Tooltip>
  <TooltipTrigger asChild>{/* elemento de gatilho */}</TooltipTrigger>
  <TooltipContent${side === 'top' ? '' : figma.tsx` side="${side}"`}${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}>${content}</TooltipContent>
</Tooltip>`,
  imports: ['import { Tooltip, TooltipTrigger, TooltipContent } from "@limia/design-system"'],
  id: 'tooltip',
  metadata: { nestable: false },
}
