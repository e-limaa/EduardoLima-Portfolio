// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-4313
// source=packages/limia-design-system/src/components/ui/avatar.tsx
// component=Avatar
import figma from 'figma'
const instance = figma.selectedInstance

const initials = instance.getString('Initials')
const hasImage = instance.getEnum('Type', {
  'Image': true,
  'Fallback': false,
})

export default {
  example: figma.tsx`<Avatar>
  ${hasImage ? figma.tsx`<AvatarImage src="/avatar.png" alt="${initials}" />` : ''}
  <AvatarFallback>${initials}</AvatarFallback>
</Avatar>`,
  imports: ['import { Avatar, AvatarImage, AvatarFallback } from "@limia/design-system"'],
  id: 'avatar',
  metadata: { nestable: true },
}
