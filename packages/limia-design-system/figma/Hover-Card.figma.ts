// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-1279
// source=packages/limia-design-system/src/components/ui/hover-card.tsx
// component=HoverCard
import figma from 'figma'
const instance = figma.selectedInstance

const trigger = instance.getString('Trigger')
const title = instance.getString('Title')
const description = instance.getString('Description')
const showAvatar = instance.getBoolean('Show Avatar')
const align = instance.getEnum('Align', {
  'Start': 'start',
  'Center': 'center',
  'End': 'end',
})

const fallbackText = showAvatar ? instance.findText('Fallback') : null
const fallback = fallbackText && fallbackText.type !== 'ERROR' ? fallbackText.textContent : ''

export default {
  example: figma.tsx`<HoverCard>
  <HoverCardTrigger>${trigger}</HoverCardTrigger>
  <HoverCardContent${align === 'center' ? '' : figma.tsx` align="${align}"`}>
    <div className="flex gap-4">
      ${showAvatar ? figma.tsx`<Avatar>
        <AvatarFallback>${fallback}</AvatarFallback>
      </Avatar>` : ''}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">${title}</h4>
        <p className="text-sm">${description}</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,
  imports: ['import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, AvatarFallback } from "@limia/design-system"'],
  id: 'hover-card',
  metadata: { nestable: false },
}
