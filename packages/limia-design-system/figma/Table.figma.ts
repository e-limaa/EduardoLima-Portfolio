// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-2450
// source=packages/limia-design-system/src/components/ui/table.tsx
// component=Table
import figma from 'figma'
const instance = figma.selectedInstance

const caption = instance.getString('Caption')
const showCaption = instance.getBoolean('Show Caption')
const showFooter = instance.getBoolean('Show Footer')

const rows = instance.findConnectedInstances((node) => node.codeConnectId() === 'table-row')
let headerRows
let bodyRows
let footerRows
for (const row of rows) {
  const { example, metadata } = row.executeTemplate()
  const rowType = metadata && metadata.props ? metadata.props.type : 'body'
  if (rowType === 'header') {
    headerRows = headerRows
      ? figma.tsx`${headerRows}
    ${example}`
      : example
  } else if (rowType === 'footer') {
    if (showFooter) {
      footerRows = footerRows
        ? figma.tsx`${footerRows}
    ${example}`
        : example
    }
  } else {
    bodyRows = bodyRows
      ? figma.tsx`${bodyRows}
    ${example}`
      : example
  }
}

export default {
  example: figma.tsx`<Table>${showCaption ? figma.tsx`
  <TableCaption>${caption}</TableCaption>` : ''}${headerRows ? figma.tsx`
  <TableHeader>
    ${headerRows}
  </TableHeader>` : ''}
  <TableBody>
    ${bodyRows}
  </TableBody>${footerRows ? figma.tsx`
  <TableFooter>
    ${footerRows}
  </TableFooter>` : ''}
</Table>`,
  imports: [
    'import { Table, TableCaption, TableHeader, TableBody, TableFooter } from "@limia/design-system"',
  ],
  id: 'table',
  metadata: { nestable: false },
}
