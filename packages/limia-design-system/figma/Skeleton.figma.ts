// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-4147
// source=packages/limia-design-system/src/components/ui/skeleton.tsx
// component=Skeleton
import figma from 'figma'
const instance = figma.selectedInstance

// Skeleton não tem variantes no código: a forma é definida via className
const className = instance.getEnum('Shape', {
  'Line': 'h-4 w-full',
  'Block': 'h-24 w-full',
  'Circle': 'size-10 rounded-full',
})

export default {
  example: figma.tsx`<Skeleton className="${className}" />`,
  imports: ['import { Skeleton } from "@limia/design-system"'],
  id: 'skeleton',
  metadata: { nestable: true },
}
