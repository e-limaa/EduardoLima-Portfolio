// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-2962
// source=packages/limia-design-system/src/components/ui/toggle-group.tsx
// component=ToggleGroup
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Variant', {
  'Default': 'default',
  'Outline': 'outline',
})

const items = instance.findConnectedInstances((node) => node.codeConnectId() === 'toggle-group-item')
let itemsCode
const pressedValues = []
for (const item of items) {
  const { example, metadata } = item.executeTemplate()
  if (metadata && metadata.props && metadata.props.pressed === 'true') {
    pressedValues.push(metadata.props.value)
  }
  itemsCode = itemsCode
    ? figma.tsx`${itemsCode}
  ${example}`
    : example
}

// Valores de texto (não resultados de template), então podem ser montados como string
let selection = ' type="single"'
if (pressedValues.length === 1) {
  selection = ` type="single" defaultValue="${pressedValues[0]}"`
} else if (pressedValues.length > 1) {
  selection = ` type="multiple" defaultValue={[${pressedValues.map((v) => `"${v}"`).join(', ')}]}`
}

export default {
  example: figma.tsx`<ToggleGroup${selection}${variant === 'default' ? '' : figma.tsx` variant="${variant}"`}>
  ${itemsCode}
</ToggleGroup>`,
  imports: ['import { ToggleGroup } from "@limia/design-system"'],
  id: 'toggle-group',
  metadata: { nestable: true },
}
