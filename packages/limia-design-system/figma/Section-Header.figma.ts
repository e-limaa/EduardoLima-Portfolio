// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-1261
// source=packages/limia-design-system/src/components/section-header.tsx
// component=SectionHeader
import figma from 'figma'
const instance = figma.selectedInstance

// Breakpoint (Desktop/Mobile) is responsive layout only, no prop.
const title = instance.getString('Title')
const description = instance.getString('Description')
const meta = instance.getString('Meta')
const showDescription = instance.getBoolean('Show Description')
const showMeta = instance.getBoolean('Show Meta')
const showAction = instance.getBoolean('Show Action')
const align = instance.getEnum('Align', {
  'Left': 'left',
  'Center': 'center',
})

// SectionHeader renders meta as "{index} — {label}"
let index
let label = meta
const separator = ' — '
if (meta && meta.indexOf(separator) !== -1) {
  index = meta.slice(0, meta.indexOf(separator))
  label = meta.slice(meta.indexOf(separator) + separator.length)
}

let actionCode
if (showAction) {
  const action = instance.findInstance('Action')
  if (action && action.type === 'INSTANCE') {
    actionCode = action.executeTemplate().example
  }
}

const props = figma.tsx`title="${title}"${showDescription ? figma.tsx` description="${description}"` : ''}${showMeta && index ? figma.tsx` index="${index}"` : ''}${showMeta && label ? figma.tsx` label="${label}"` : ''}${align === 'left' ? '' : figma.tsx` align="${align}"`}`

export default {
  example: actionCode
    ? figma.tsx`<SectionHeader ${props}>
  ${actionCode}
</SectionHeader>`
    : figma.tsx`<SectionHeader ${props} />`,
  imports: ['import { SectionHeader } from "@limia/design-system"'],
  id: 'section-header',
  metadata: { nestable: false },
}
