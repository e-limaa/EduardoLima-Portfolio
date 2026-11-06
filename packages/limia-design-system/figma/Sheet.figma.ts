// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-83
// source=packages/limia-design-system/src/components/ui/sheet.tsx
// component=Sheet
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const showBody = instance.getBoolean('Show Body')
const showFooter = instance.getBoolean('Show Footer')
const side = instance.getEnum('Side', {
  'Right': 'right',
  'Left': 'left',
  'Top': 'top',
  'Bottom': 'bottom',
})

let labelText
let inputCode
if (showBody) {
  const label = instance.findText('Label')
  if (label && label.type === 'TEXT') {
    labelText = label.textContent
  }
  const input = instance.findInstance('Input')
  if (input && input.type === 'INSTANCE') {
    inputCode = input.executeTemplate().example
  }
}

let actionCode
if (showFooter) {
  const action = instance.findInstance('Action')
  if (action && action.type === 'INSTANCE') {
    actionCode = action.executeTemplate().example
  }
}

export default {
  example: figma.tsx`<Sheet>
  <SheetContent${side === 'right' ? '' : figma.tsx` side="${side}"`}>
    <SheetHeader>
      <SheetTitle>${title}</SheetTitle>
      <SheetDescription>${description}</SheetDescription>
    </SheetHeader>${showBody ? figma.tsx`
    <div className="grid gap-2 px-4">
      ${labelText ? figma.tsx`<Label>${labelText}</Label>
      ` : ''}${inputCode}
    </div>` : ''}${showFooter ? figma.tsx`
    <SheetFooter>
      ${actionCode}
    </SheetFooter>` : ''}
  </SheetContent>
</Sheet>`,
  imports: [
    'import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, Label } from "@limia/design-system"',
  ],
  id: 'sheet',
  metadata: { nestable: false },
}
