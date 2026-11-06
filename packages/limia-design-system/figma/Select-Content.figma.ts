// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-1144
// source=packages/limia-design-system/src/components/ui/select.tsx
// component=SelectContent
import figma from 'figma'
const instance = figma.selectedInstance

const groupLabel = instance.getString('Group Label')
const showGroupLabel = instance.getBoolean('Show Group Label')

const items = instance.findConnectedInstances((node) => node.codeConnectId() === 'select-item')
let itemsCode
for (const item of items) {
  const itemExample = item.executeTemplate().example
  itemsCode = itemsCode
    ? figma.tsx`${itemsCode}
    ${itemExample}`
    : itemExample
}

export default {
  example: figma.tsx`<SelectContent>
  <SelectGroup>
    ${showGroupLabel ? figma.tsx`<SelectLabel>${groupLabel}</SelectLabel>
    ` : ''}${itemsCode}
  </SelectGroup>
</SelectContent>`,
  imports: ['import { SelectContent, SelectGroup, SelectLabel } from "@limia/design-system"'],
  id: 'select-content',
  metadata: { nestable: true },
}
