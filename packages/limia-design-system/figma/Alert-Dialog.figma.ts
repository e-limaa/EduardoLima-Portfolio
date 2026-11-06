// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-968
// source=packages/limia-design-system/src/components/ui/alert-dialog.tsx
// component=AlertDialog
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')

const cancel = instance.findInstance('Cancel')
let cancelCode
if (cancel && cancel.type === 'INSTANCE') {
  cancelCode = cancel.executeTemplate().example
}
const action = instance.findInstance('Action')
let actionCode
if (action && action.type === 'INSTANCE') {
  actionCode = action.executeTemplate().example
}

export default {
  example: figma.tsx`<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>${title}</AlertDialogTitle>
      <AlertDialogDescription>${description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      ${cancelCode ? figma.tsx`<AlertDialogCancel asChild>${cancelCode}</AlertDialogCancel>` : ''}
      ${actionCode ? figma.tsx`<AlertDialogAction asChild>${actionCode}</AlertDialogAction>` : ''}
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
  imports: ['import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@limia/design-system"'],
  id: 'alert-dialog',
  metadata: { nestable: false },
}
