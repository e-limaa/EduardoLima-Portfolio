// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-2446
// source=packages/limia-design-system/src/components/ui/table.tsx
// component=TableRow
import figma from 'figma'
const instance = figma.selectedInstance

// Type define em qual seção (TableHeader/TableBody/TableFooter) o template Table coloca a linha
const type = instance.getEnum('Type', {
  'Header': 'header',
  'Body': 'body',
  'Footer': 'footer',
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'hover',
  'Selected': 'selected',
})
const selected = state === 'selected'

const cells = instance.findConnectedInstances((node) => node.codeConnectId() === 'table-cell')
let cellsCode
for (const cell of cells) {
  const cellExample = cell.executeTemplate().example
  cellsCode = cellsCode
    ? figma.tsx`${cellsCode}
  ${cellExample}`
    : cellExample
}

export default {
  example: figma.tsx`<TableRow${selected ? ' data-state="selected"' : ''}>
  ${cellsCode}
</TableRow>`,
  // TableHead/TableCell come from nested Table/Cell templates; listed here so they reach the parent Table snippet.
  imports: ['import { TableRow, TableHead, TableCell } from "@limia/design-system"'],
  id: 'table-row',
  metadata: { nestable: true, props: { type } },
}
