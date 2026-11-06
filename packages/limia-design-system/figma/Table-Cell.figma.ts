// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-2407
// source=packages/limia-design-system/src/components/ui/table.tsx
// component=TableCell
import figma from 'figma'
const instance = figma.selectedInstance

const text = instance.getString('Text')
const type = instance.getEnum('Type', {
  'Head': 'head',
  'Body': 'body',
})
const align = instance.getEnum('Align', {
  'Left': 'left',
  'Right': 'right',
})

let example
if (type === 'head' && align === 'left') {
  example = figma.tsx`<TableHead>${text}</TableHead>`
} else if (type === 'head' && align === 'right') {
  example = figma.tsx`<TableHead className="text-right">${text}</TableHead>`
} else if (type === 'body' && align === 'left') {
  example = figma.tsx`<TableCell>${text}</TableCell>`
} else {
  example = figma.tsx`<TableCell className="text-right">${text}</TableCell>`
}

export default {
  example,
  imports: [
    type === 'head'
      ? 'import { TableHead } from "@limia/design-system"'
      : 'import { TableCell } from "@limia/design-system"',
  ],
  id: 'table-cell',
  metadata: { nestable: true },
}
