// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-1625
// source=packages/limia-design-system/src/components/ui/dialog.tsx
// component=Dialog
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const showFooter = instance.getBoolean('Show Footer')

const cancel = showFooter ? instance.findInstance('Cancel') : null
let cancelCode
if (cancel && cancel.type === 'INSTANCE') {
  cancelCode = cancel.executeTemplate().example
}
const action = showFooter ? instance.findInstance('Action') : null
let actionCode
if (action && action.type === 'INSTANCE') {
  actionCode = action.executeTemplate().example
}

export default {
  example: figma.tsx`<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${title}</DialogTitle>
      <DialogDescription>${description}</DialogDescription>
    </DialogHeader>
    ${showFooter ? figma.tsx`<DialogFooter>
      ${cancelCode ? figma.tsx`<DialogClose asChild>${cancelCode}</DialogClose>` : ''}
      ${actionCode ? actionCode : ''}
    </DialogFooter>` : ''}
  </DialogContent>
</Dialog>`,
  imports: ['import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@limia/design-system"'],
  id: 'dialog',
  metadata: { nestable: false },
}
