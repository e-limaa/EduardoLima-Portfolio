// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-1535
// source=packages/limia-design-system/src/components/icon.tsx
// component=Icon
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  '16': 16,
  '20': 20,
  '24': 24,
})
const glyph = instance.getInstanceSwap('Icon')
let glyphName
let glyphCode
if (glyph && glyph.type === 'INSTANCE') {
  const result = glyph.executeTemplate()
  glyphName = result.metadata?.props?.name
  glyphCode = result.example
}

export default {
  example: glyphName
    ? figma.tsx`<Icon name="${glyphName}" size={${size}} />`
    : figma.tsx`${glyphCode}`,
  imports: ['import { Icon } from "@limia/design-system"'],
  id: 'icon',
  metadata: { nestable: true },
}
